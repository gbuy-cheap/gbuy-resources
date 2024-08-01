'use strict';
{
//chrome.runtime.sendMessage({from:"content"}); //first, tell the background page that this is the tab that wants to receive the messages.
var manifestData = chrome.runtime.getManifest();
const DOMAIN = 'https://sas.selleramp.com';
//const DOMAIN = 'https://saslocal.selleramp.com';

const urlParams = '?src=ext&ver=' + manifestData.version + 'e';
var baseURL = DOMAIN + '/sas/lookup' + urlParams;

var historyUrl = DOMAIN + '/sas/history' + urlParams;
var settingsUrl = DOMAIN + '/user/update' + urlParams;
var url = null;

var gFloatingHeight;
var gFloatingWidth;
var gDockedWidth;

var gFloatingLeft;
var gFloatingTop;
var gDockedState;

var gSasLoaded, gAmazonProductPage = false;
var gAsin;

var gDisplay;
var gUkn;
var gFn;

const DEFAULT_FLOATING_WIDTH = 264;;
const DEFAULT_FLOATING_HEIGHT = 300;
const DEFAULT_DOCKED_WIDTH = 350;

const FLOATING = 0;
const DOCKED_LEFT = 1;
const DOCKED_RIGHT = 2;
const AMAZON_EMBEDDED = 3;
const AMAZON_EMBEDDED_WIDE = 4;
//const MODAL_POPUP = 5;

const DEFAULT_DOCKED_STATE = DOCKED_RIGHT;
const DEFAULT_DOCKED_STATE_AMAZON = AMAZON_EMBEDDED;

var PANEL_POSITIONS = [
	{ id: FLOATING, desc: 'Floating', img: 'floating.png', amazon_only: false},
	{ id: DOCKED_LEFT, desc: 'Docked Left', img: 'docked-left.png', amazon_only: false},
	{ id: DOCKED_RIGHT, desc: 'Docked Right', img: 'docked-right.png', amazon_only: false},
	{ id: AMAZON_EMBEDDED_WIDE, desc: 'Embedded Center', img: 'embedded-center.png', amazon_only: true},
	{ id: AMAZON_EMBEDDED, desc: 'Embedded', img: 'embedded.png', amazon_only: true},
//	{ id: MODAL_POPUP, desc: 'Modal', img: 'modal.png', amazon_only: false},
];

function getURLCommon()
{
	return(`${baseURL}&ukn=${gUkn}&dn=${gFn}&dt=${encodeURIComponent(document.title)}&durl=${encodeURIComponent(document.URL)}`) ;
}

function setUrl(searchTerm = "", sasCostPrice = null, sasSalePrice = null, sasSourceUrl = null)
{
	url = getURLCommon();

	if ( typeof setUrl.lsSearchTerm == 'undefined' ) {
 		setUrl.lsSearchTerm = "";
    }
	
	if(searchTerm === false)
	{
		setUrl.lsSearchTerm = "";
	}
	else if(searchTerm != "") 
	{
		setUrl.lsSearchTerm = searchTerm;
	}

	if(setUrl.lsSearchTerm != '')
	{
		url = url + '&search_term=' + encodeURIComponent(setUrl.lsSearchTerm) + '&force_search_term';
	}
	url = url + (sasCostPrice != null ? "&sas_cost_price=" + sasCostPrice : "");
	url = url + (sasSalePrice != null ? "&sas_sale_price=" + sasSalePrice : "");

	if(sasSourceUrl != null)
	{
		url = url + "&source_url=" + encodeURIComponent(sasSourceUrl);
	}
	else
	{
		url = url + "&source_url=" + encodeURIComponent(document.URL);
		
	}
}

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) 
	{
		if(request.command == "show_sas_ext")
		{
			sendResponse({result: true, command_name: request.command});
			showSasExtensionMessage(request)

		}
		else if(request.command == "dosas")
		{
			sendResponse({farewell: "goodbye"});

			$('#sasFrame').removeClass('sasdklgc-display');
			var lSearchText = request.selectionText;
			const lSourceUrl = request.linkUrl ? request.linkUrl : request.source_url;
			
			if(request.smartSearch && !request.linkUrl)
			{
				lSearchText = false;
			}
			else
			{
				if(!lSearchText || 'undefined' == lSearchText)
				{
					lSearchText = ($(':focus').text());
				}
				if(!lSearchText || 'undefined' == lSearchText)
				{
					lSearchText = $(':focus').find("img").attr('alt');
				}
			}

			setUrl(lSearchText, null, null, lSourceUrl);
			$('#loadingMessage').addClass('sasdklgc-display');

			if(request.no_display_update == true)
			{
				if(gDisplay) showSASPanel();
			}
			else
			{
				showSASPanel();
			}

		}
		else if(request.command == "togglesas")
		{
			sendResponse({farewell: "goodbye"});
			toggleSASPanel();	
		}
		else if(request.command == "togglePopup")
		{	
			showPopup("test");
			sendResponse({farewell: "goodbye"});
		}
	}
);

function showSasExtensionMessage(aRequest)
{
	$('#sasFrame').removeClass('sasdklgc-display');
	$('#loadingMessage').addClass('sasdklgc-display');
	url = getURLCommon() + "&" + $.param(aRequest);
	showSASPanel(false);
}

function toggleSASPanel()
{
	if($('#SASContainer').is(":visible"))
	{
		hideSASPanel();
	} 
	else
	{
		showSASPanel();
	}
}

function showSASPanel(aSetUrl = true)
{
	if(aSetUrl)
	{
		setUrl();
	}
	gDisplay = true;
	$('#sasFrame').attr('src', url);
	$('#SASContainer').removeClass('sasdklgc-display-none');
	loadSASPanelPosition();
	$('#SASContainer').show();
	adjustBody();
	showSasShortcuts(true);
	chrome.storage.sync.set({'display' : gDisplay});
}

function hideSASPanel()
{
	$('#SASContainer').hide();
//	$(".sasextdklgc-sas-overlay").hide();
	gDisplay = false;
	chrome.storage.sync.set({'display' : gDisplay});
	adjustBody();
	showSasShortcuts(false);
}

function loadSASPanelPosition()
{
	$('body').removeClass('docked-right docked-left');
	$('#SASContainer').removeClass('docked docked-left docked-right floating embedded embedded_wide modal_popup');
//	$(".sasextdklgc-sas-overlay").hide();
	if(gDockedState != FLOATING)
	{
		$('#SASContainer').removeAttr("style");
		$('#SASContainer').draggable('disable');
		$('.first-row').removeClass('drag-handle');
	}
/*
	if(gDockedState == MODAL_POPUP)
	{
		$(".sasextdklgc-sas-overlay").show();
		$('#SASContainer').addClass('modal_popup');
		
	}
*/
	if(gDockedState == FLOATING)
	{
		$('#SASContainer').draggable('enable');
		$('.first-row').addClass('drag-handle');
		var lWindowHeight = $(window).height();
		var lWindowWidth = $(window).width();
		if((gFloatingLeft + gFloatingWidth) > lWindowWidth)
		{
			gFloatingLeft = Math.max(0, lWindowWidth - gFloatingWidth);
		}

		if((gFloatingTop + gFloatingHeight) > lWindowHeight)
		{
			gFloatingTop = Math.max(lWindowHeight - gFloatingHeight, 0);
		}
		$('#SASContainer').css({ 'top': gFloatingTop, 'left': gFloatingLeft, 'height' : gFloatingHeight, 'width' : gFloatingWidth });
		$('#SASContainer').addClass('floating');
	}
	else if(gDockedState == DOCKED_LEFT)
	{
		$('#SASContainer').addClass('docked docked-left');
		$('#SASContainer').css({ 'width' : gDockedWidth });
	}
	else if(gDockedState == DOCKED_RIGHT)
	{
		$('#SASContainer').addClass('docked docked-right');
		$('#SASContainer').css({ 'width' : gDockedWidth });
	}
	else if(gDockedState == AMAZON_EMBEDDED)
	{
		$('#SASContainer').addClass('embedded');
		$('#SASContainer').detach().prependTo("#rightCol");
	}
	else if(gDockedState == AMAZON_EMBEDDED_WIDE)
	{
//		$('#SASContainer').detach().insertAfter("#centerCol > div:nth-child(1)");
		const lFirstCenterElem = $("#centerCol").children().first();
		if (lFirstCenterElem.length) {
			$('#SASContainer').addClass('embedded_wide');
			lFirstCenterElem.after($('#SASContainer').detach());
		}
		else
		{
			// Should not happen but fallback to normal embedded if it does
			gDockedState = AMAZON_EMBEDDED;
			loadSASPanelPosition();
			return;
		}
	}
	adjustBody();
	highlitePosBtn();
}

function loadSAS()
{
//	console.log("loading sas ext");
	
	var extensionOrigin = 'chrome-extension://' + chrome.runtime.id;
	// Avoid recursive frame insertion...
	
	if(!location.ancestorOrigins.contains(extensionOrigin)) 
	{
		gSasLoaded = true;
		chrome.storage.local.get(['ukn'], function(items) {
			gUkn = items.ukn;
			if(undefined == gUkn || 'undefined' == gUkn || null == gUkn || false == gUkn)
			{
				gUkn = makeid(16);
				chrome.storage.local.set({'ukn': gUkn});
			}
			gFn = encodeURIComponent(navigator.platform +  " " + window.screen.width * window.devicePixelRatio + "x" + window.screen.height * window.devicePixelRatio);
		});

		var display = true;
		if(gAmazonProductPage && ("#rightCol").length > 0)
		{
			setUrl(gAsin);
		}
		else
		{
			gAmazonProductPage = false;
			display = false;
		}

		// If it's Amazon lets set the url with Amazon
/*		var document_url = document.URL;
		// var regex = RegExp("https://www.amazon.(co.uk|com|es|it|fr|de)/([\\w-]+/)?(dp|gp/product|gp/offer-listing)/(\\w+/)?(\\w{10})");
		var regex = RegExp("https*:\/\/(?:www\.)*(?:smile\.)*amazon\.(co\.uk|es|it|de|fr|com|ca)\/(.*\/)*(dp|gp\/product|gp\/offer-listing)\/(.*\/)*([A-Z0-9]{10})");
		var m = document_url.match(regex);
	

		if(m && m.length > 4) 
		{ 
			setUrl(m[5]);
			gAmazonProductPage = $("#rightCol").length > 0;
		}
		else
		{
			gAmazonProductPage = false;
			display = false;
		}
*/
		var sasContainer = document.createElement('div');
		sasContainer.setAttribute("id", "SASContainer");		
		sasContainer.setAttribute("class", "sasext sasextdklgc sasdklgc-display-none");
		$(sasContainer).appendTo("body");
//		$("body").append("<div class='sasextdklgc-sas-overlay'></div>");
		
		var innerHTML = `
			<div id="sas-panel-contents">
				<div class="first-row" > ` +
//				<div class="tl-btns">
//						<span ><a id="backButton" class="topButton"></a></span>
//					</div>
					`<div class="t-logo">
						<a href="https://selleramp.com" target="_blank"><img class="sas-logo-image" src="` + chrome.extension.getURL('images/sas-logo-mono2.png') + `" /></a> 
					</div>
					<div class="tr-btns">
						<span  style="float:right"><a id="closeSAS" class="topButton"></a></span>
					</div>
				</div>`;

		innerHTML  = innerHTML +
			'<div class="second-row"><div id="loadingMessage"><img class="loadingimg" src="' + chrome.extension.getURL('images/exticon.png') + '"" /></div><iframe name="sasFrame" id="sasFrame" allowtransparency="true"></iframe></div>' +
			'<div class="bottom-row">' +
			getPositionsToolbar(gAmazonProductPage) + 
			'</div></div>';

		$("#SASContainer").html(innerHTML);

		$("#SASContainer").resizable({
			minHeight: 150,  minWidth:264, handles: 'n, s,e,w',
			start: function(event, ui) {
				ui.element.append($("<div/>", {
					id: "iframe-barrier",
					css: {
						position: "absolute",
						top: 0,
						right: 0,
						bottom: 0,
						left: 0,
						"z-index": 10
				}
				}));
			},
			resize: function(event, ui) {
		
				if(gDockedState == DOCKED_LEFT || gDockedState == DOCKED_RIGHT)
				{
					gDockedWidth = ui.size.width;
					$(this).css("left", '');
					adjustBody();
				}

			},
			stop: function( event, ui ) 
			{
				$("#iframe-barrier", ui.element).remove();

				if(gDockedState == DOCKED_LEFT || gDockedState == DOCKED_RIGHT)
				{
					gDockedWidth = ui.size.width;
					chrome.storage.sync.set({'dockedWidth' : gDockedWidth});
				}
				else if(gDockedState == FLOATING) 
				{
					gFloatingHeight = ui.size.height;
					chrome.storage.sync.set({'floatingHeight' : gFloatingHeight});
					gFloatingWidth= ui.size.width;
					chrome.storage.sync.set({'floatingWidth' : gFloatingWidth});
				}
				adjustBody();
			}
		});
		
		chrome.storage.sync.get({
			'display' : true,
			'floatingWidth' : DEFAULT_FLOATING_WIDTH, 'floatingHeight' : DEFAULT_FLOATING_HEIGHT, 
			'dockedWidth' : DEFAULT_DOCKED_WIDTH, 'dockedState' : DEFAULT_DOCKED_STATE, 'dockedStateAmazon' : DEFAULT_DOCKED_STATE_AMAZON, 'floatingLeft' : 0, 'floatingTop' : 0}, function(result) 
		{
			gFloatingTop = result.floatingTop;
			gFloatingLeft = result.floatingLeft;
			// gDockedState = result.dockedState;
			gFloatingHeight = result.floatingHeight;
			gFloatingWidth = result.floatingWidth;
			gDockedWidth = result.dockedWidth;

//			console.log(`gAmazonProductPage ${gAmazonProductPage}`);
			if(gAmazonProductPage)
			{
				gDockedState = result.dockedStateAmazon;
			}
			else 
			{
				gDockedState = result.dockedState;
				if(gDockedState == AMAZON_EMBEDDED || gDockedState == AMAZON_EMBEDDED_WIDE)
				{
					gDockedState = DEFAULT_DOCKED_STATE;
				}
			}
			
			$("#SASContainer").draggable(      
				{ 
					handle: '.first-row',
					containment: 'window',
					stop: function(event, ui){
						if($('#SASContainer').position().top < 0)
						{
							$('#SASContainer').css({ 'top': '0' })
						}

						gFloatingLeft = $('#SASContainer').position().left;
						gFloatingTop = $('#SASContainer').position().top;
							
						chrome.storage.sync.set({'floatingLeft' : gFloatingLeft});
						chrome.storage.sync.set({'floatingTop' : gFloatingTop});						
						setDockedState(gDockedState);
						loadSASPanelPosition();

					},drag: function(event, ui){
						
					},
					start: function(event, ui){
						if(gDockedState == FLOATING)
						{
							setDockedState(gDockedState);
							loadSASPanelPosition();
						}
					}
			 });

			$("#sasFrame").on('load', function()	
			{
				$('#loadingMessage').css('display', 'none');
				$('#sasFrame').css('display', 'block');

			});

			display = display && result.display;

			var searchParams = (new URL(document.location)).searchParams;
			if(searchParams.has('sas_autoopen')) 
			{
				setUrl("");
				display = true;
			}

			//loadSASPanelPosition();
			if(display == true)
			{
				showSASPanel();	
			}
			showSasShortcuts(result.display);
		});

		$(window).resize(function(event) 
		{ 
			if($("#SASContainer").data('draggable')) 
			{
				$("#SASContainer").draggable("option", "containment", [0, 0, $(window).width() - $('#SASContainer').width(), $(window).height() /* - result.floatingHeight */ ]);
			}     
		});

	}

	$("#closeSAS").click(function() {
		hideSASPanel();
	});

	$("#backButton").click(function() {
		document.getElementById("sasFrame").contentWindow.history.back();
	});

	

	$("#position-buttons li").click(function() {
		gDockedState = $(this).data('position');
		setDockedState(gDockedState);
		loadSASPanelPosition();
	});

	/*
	const logoURL = chrome.runtime.getURL('images/sas-logo2-32.png');
	const sasImg = document.createElement('img');
	sasImg.src = logoURL;
	$('.sas-launch-ext-link').append(sasImg);
	$('.sas-launch-ext-link').click(function(event) {
		setUrl(this.dataset.asin, this.dataset.cost_price, this.dataset.sale_price, this.dataset.source_url);
		showSASPanel();
		event.preventDefault();
	});
*/
}//)

function highlitePosBtn()
{
	$("#position-buttons li").removeClass('selected-button ');
	$("#li-pos-" + gDockedState).addClass('selected-button');
	
}

function makeid(length) {
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
	  result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

function getPositionsToolbar(includeEmbedded)
{
	var result = '<nav class="sasdklgc-menu"><ul id="position-buttons" class="sasdklgc-toolbar-buttons">';
	for (var i = 0; i < PANEL_POSITIONS.length; i++) 
	{
		if(includeEmbedded || (PANEL_POSITIONS[i].id != AMAZON_EMBEDDED && PANEL_POSITIONS[i].id != AMAZON_EMBEDDED_WIDE))
		{
			result = result + '<li class="left" id="li-pos-' + PANEL_POSITIONS[i].id + '" data-position="' + PANEL_POSITIONS[i].id + '"><img src="' +
				chrome.extension.getURL('images/' + PANEL_POSITIONS[i].img) + '" title="' + PANEL_POSITIONS[i].desc  + '" />' +
				'</li>';
		}
	}
	result = result + '</ul><ul id="url-buttons" class="sasdklgc-toolbar-buttons">';

	result = result +  '<li id="home-btn" ><a href="' + baseURL + '" target="sasFrame" ><img src="' +
		chrome.extension.getURL('images/home.png"') + ' title="Home" /></li>';

	result = result + '<li  id="history-btn"><a href="' + historyUrl + '" target="sasFrame" ><img src="' +
		chrome.extension.getURL('images/history.png"') + ' title="History" /></a></li>';

	result = result +  '<li id="settings-btn" ><a href="' + settingsUrl + '" target="sasFrame" ><img src="' +
		chrome.extension.getURL('images/settings.png"') + ' title="Settings" /></li>';

	result += '<li  id="contact-btn"><a href="mailto:support@selleramp.com" target="_blank" ><img src="' +
		chrome.extension.getURL('images/envelope.png"') + ' title="Contact" /></a></li>';
	
	result = result + '</ul></nav>';
	return result;
}

function adjustBody()
{
	if(gDisplay)
	{
		if(gDockedState == DOCKED_LEFT)
		{
			$('body').css({ 'padding-left': gDockedWidth, 'padding-right': 0 })
			
		}
		else if(gDockedState == DOCKED_RIGHT)
		{
			$('body').css({ 'padding-left': 0, 'padding-right': gDockedWidth })
		}
		else
		{
			$('body').css({ 'padding-left': 0, 'padding-right': 0 })
		}
	}
	else
	{
		$('body').css({ 'padding-left': 0, 'padding-right': 0 })
	}
}

function showPopup(divId)
{
	if (!($('#' + divId).length))
	{
		var popupContainer = document.createElement('div');
		popupContainer.setAttribute("id", divId);		
		popupContainer.setAttribute("class", "sas-popup");

		var innerHTML = '<div class="sas-container-contents "><div class="first-row" > <a href="https://selleramp.com" target="_blank"><img class="sas-logo-image" src="' + 
			chrome.extension.getURL('images/sas-logo-mono.png') + '"" /></a> <span  style="float:right"><a id="closeBtn' + divId + '" data-close-div="' + divId +'" class="topButton" ></a></span></div>';

		innerHTML  = innerHTML +
			'<div class="second-row"><div id="loadingMessage2"><img class="loadingimg" src="' + chrome.extension.getURL('images/exticon.png') + '"" /></div><iframe name="sasFrame' + divId + '" id="sasFrame" allowtransparency="true"></iframe></div>' +
			'</div>';

		$(popupContainer).html(innerHTML);


		$(popupContainer).appendTo("body");

		$("#closeBtn" + divId).click(function() {
			$('#' + ($(this).data('close-div'))).hide();
		});
	}
	else
	{
		$('#' + divId).show();
	}
}

function showSasShortcuts(aVisible)
{
	if(aVisible)
	{
		$(".sas-launch-ext-link").show();
	}
	else
	{
		$(".sas-launch-ext-link").hide();
	}
}

function setDockedState(aVal)
{
	if(gAmazonProductPage)
	{
		chrome.storage.sync.set({'dockedStateAmazon': aVal });
	}
	else
	{
		chrome.storage.sync.set({'dockedState': aVal });
	}
}

var gStartTime = Date.now();

loadSasScript();

$(document).ready(function(){
//	console.log(`doc ready sas ext ${Date.now() - gStartTime}`);
	if(!gSasLoaded)
	{
		loadSAS();		
	}

	//match amazon
	var regex = RegExp("https*:\/\/(?:www\.)*(?:smile\.)*amazon\.(co\.uk|es|it|de|fr|com|ca).*");
	var m = document.URL.match(regex);
	if(m) 
	{
		initAmazParse();
	}
	
	const logoURL = chrome.runtime.getURL('images/sas-logo2-32.png');
	const sasImg = document.createElement('img');
	sasImg.src = logoURL;

	$('.sas-launch-ext-link').append(sasImg);
	$('.sas-launch-ext-link').click(function(event) {
		setUrl(this.dataset.asin, this.dataset.cost_price, this.dataset.sale_price, this.dataset.source_url);
		showSASPanel();
		event.preventDefault();
	});

	$(document.body).delegate("a.SaSExTaP5Dc32", "click", function(event) {
		const lObj = {origin: window.location.origin, ...$(this).data()};
//		gDockedState = MODAL_POPUP;
		showSasExtensionMessage(lObj);
		event.preventDefault();
	});
});

function loadSasScript() 
{
	var regex = RegExp("https*:\/\/(?:www\.)*(?:smile\.)*amazon\.(co\.uk|es|it|de|fr|com|ca)\/(.*\/)*(dp|gp\/product|gp\/offer-listing)\/(.*\/)*([A-Z0-9]{10})");
	var m = document.URL.match(regex);

	if(m && m.length > 4) 
	{ 
		gAsin = m[5];
		gAmazonProductPage = true;
		loadSAS();
	}
	else
	{
		gAmazonProductPage = false;
	}
}

// amz-parse
const TARGET_SELECTOR = '.s-main-slot';
const SAS_LAUNCH_CLASSNAME = 'sas-launch-ext-link';
const SAS_LAUNCH_SELECTOR = '.' + SAS_LAUNCH_CLASSNAME;

const selectors = [
	{
		CARD_SELECTOR: '[data-asin]:not([data-asin=""]).s-result-item',
		TITLE_SELECTOR: 'h2',
		PRICE_WHOLE_SELECTOR: '.a-price-whole',
		PRICE_DECIMAL_SELECTOR: '.a-price-decimal',
		PRICE_FRANCTION_SELECTOR: '.a-price-fraction',
	},
	{
		CARD_SELECTOR: '[data-asin]:not([data-asin=""]).s-inner-result-item',
		TITLE_SELECTOR: 'h2',
		PRICE_WHOLE_SELECTOR: '.a-price-whole',
		PRICE_DECIMAL_SELECTOR: '.a-price-decimal',
		PRICE_FRANCTION_SELECTOR: '.a-price-fraction',
	},
	// {
	// 	CARD_SELECTOR:
	// 		'[data-asin]:not([data-asin=""]):not(.s-result-item):not(.s-inner-result-item):not(.ewc-item)',
	// },
];

// Carousel selectors
const CAROUSEL_SELECTOR = '.a-carousel';
const carouselSelectors = {
	CARD_SELECTOR:
		'.a-carousel-card [data-p13n-asin-metadata]:not([data-p13n-asin-metadata=""])',
	TITLE_SELECTOR:
		'.sponsored-products-truncator-truncated,.p13n-sc-truncate-desktop-type2',
	PRICE_SELECTOR: '.a-color-price,.p13n-sc-price',
};

const zone = location.hostname.replace('www.amazon.', '');
//const logoURL = chrome.runtime.getURL('images/sas-logo2-32.png');
const observerOptions = {
	childList: true,
};

const decimal = {
	ca: '.',
	cn: '.',
	'com.au': '.',
	'com.br': ',',
	de: ',',
	fr: ',',
	in: '.',
	it: ',',
	'co.jp': '.',
	'com.mx': '.',
	nl: ',',
	sg: '.',
	es: ',',
	'com.tr': ',',
	ae: '.',
	'co.uk': '.',
	com: '.',
};

function generateElement(asin, price) {
	function numerize(stringNumber) {
		const str =
			decimal[zone] === '.'
				? stringNumber.replace(/[^0-9.]+/g, '')
				: stringNumber.replace(/[^0-9,]+/g, '').replace(',', '.');

		return str ? parseFloat(str.match(/(\d+(?:\.\d{0,2})?)/)[1]) : null;
	}

	const sasElement = document.createElement('a');
	// Change format of the link here:
	sasElement.href = '#';
	sasElement.className = SAS_LAUNCH_CLASSNAME;
	sasElement.dataset.asin = asin;
	sasElement.dataset.zone = zone;
	sasElement.dataset.sale_price = +numerize(price);
	return sasElement;
}

function process(e, objSelectors) {
	// Get the title's parent
	const parent = objSelectors.TITLE_SELECTOR
		? e.querySelector(objSelectors.TITLE_SELECTOR)
		: e;

	if (!parent) return;

	const asin = e.dataset.asin;

	let price = '';
	if (objSelectors.PRICE_WHOLE_SELECTOR) {
		const priceWhole = e.querySelector(objSelectors.PRICE_WHOLE_SELECTOR)
			? e.querySelector(objSelectors.PRICE_WHOLE_SELECTOR).childNodes[0].nodeValue
			: '';
		if (priceWhole) {
			const priceDecimal = e.querySelector(objSelectors.PRICE_DECIMAL_SELECTOR)
				? e.querySelector(objSelectors.PRICE_DECIMAL_SELECTOR).textContent
				: '';
			const priceFraction = e.querySelector(objSelectors.PRICE_FRANCTION_SELECTOR)
				? e.querySelector(objSelectors.PRICE_FRANCTION_SELECTOR).textContent
				: '';

			price = priceWhole;
			if (priceDecimal && priceFraction) price = price + priceDecimal + priceFraction;
		}
	}

	// Create a new element
	const sasElement = generateElement(asin, price);

	// Insert the new element before the title
	if (objSelectors.TITLE_SELECTOR) {
		parent.insertBefore(sasElement, parent.firstChild);
	} else {
		parent.parentElement.insertBefore(sasElement, parent);
	}
}



///////////////////////////////////////////////////////
// Carousel blocks
///////////////////////////////////////////////////////
function parseCarousels(rootElement = document) {
	rootElement.querySelectorAll(CAROUSEL_SELECTOR).forEach((node) => {
		const observer = new MutationObserver((mutationList) => {
			mutationList.forEach((mutation) => {
				// console.log(
				// 	'mutation.type: ',
				// 	mutation.type,
				// 	mutation.attributeName,
				// 	mutation.oldValue,
				// );
				if (!mutation.oldValue) return;

				mutation.target.querySelectorAll(carouselSelectors.CARD_SELECTOR).forEach((e) => {
					processCarousel(e);
				});
			});
		});

		observer.observe(node, {
			// childList: true,
			attributes: true,
			attributeOldValue: true,
			attributeFilter: ['aria-busy'],
			// subtree: false,
		});
	});

	function processCarousel(e) {
		// exit if already proceeded
		if (e.querySelector(SAS_LAUNCH_SELECTOR)) return;

		const parent = e.querySelector(carouselSelectors.TITLE_SELECTOR);
		if (!parent) return;

		const asin = e.dataset.asin
			? e.dataset.asin
			: JSON.parse(e.dataset.p13nAsinMetadata).asin;

		if (!asin) return;

		const price = e.querySelector(carouselSelectors.PRICE_SELECTOR)
			? e.querySelector(carouselSelectors.PRICE_SELECTOR).textContent.trim()
			: '';

		// Create a new element
		const sasElement = generateElement(asin, price);

		parent.style = 'display: inline;';

		// Insert the new element before the title
		parent.parentElement.insertBefore(sasElement, parent);
	}

	rootElement
		.querySelectorAll(carouselSelectors.CARD_SELECTOR)
		.forEach((e) => processCarousel(e));
}

function initAmazParse(){
	const targetNode = document.querySelector(TARGET_SELECTOR);
	if (targetNode) {
		const observer = new MutationObserver((mutationList) => {
			mutationList.forEach((mutation) => {
				if (!mutation.addedNodes.length) return;
	
				if (
					mutation.addedNodes[0].dataset.asin &&
					mutation.addedNodes[0].matches(selectors[0].CARD_SELECTOR)
				) {
					process(mutation.addedNodes[0], selectors[0]);
				} else {
					selectors.forEach((objSelectors) => {
						mutation.addedNodes[0]
							.querySelectorAll(objSelectors.CARD_SELECTOR)
							.forEach((e) => {
								process(e, objSelectors);
							});
					});
				}
			});
		});
	
		observer.observe(targetNode, observerOptions);
	}
	selectors.forEach((objSelectors) => {
		document
			.querySelectorAll(objSelectors.CARD_SELECTOR)
			.forEach((e) => process(e, objSelectors));
	});

	parseCarousels();

	//////////////////////////////////////////////////////////////////
	// rhf container - the container at the bottom
	//////////////////////////////////////////////////////////////////

	const RHF_CONTAINER_SELECTOR = '#rhf-container';
	const RHF_BORDER_SELECTOR = '.rhf-border';
	document.querySelectorAll(RHF_CONTAINER_SELECTOR).forEach((node) => {
		const observer = new MutationObserver((mutationList) => {
			mutationList.forEach((mutation) => {
				// console.log(
				// 	`mutation.type: ${mutation.type} mutation.attributeName ${mutation.attributeName} mutation.oldValue ${mutation.oldValue}`,
				// );
				mutation.addedNodes.forEach((e) => {
					if (e.nodeType === 1 && e.matches(RHF_BORDER_SELECTOR)) parseCarousels(e);
				});
			});
		});

		observer.observe(node, {
			childList: true,
		});
	});
}

}