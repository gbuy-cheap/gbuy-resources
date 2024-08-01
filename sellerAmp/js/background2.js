const STOCKCHECKEXT_SESSION_ID_HEADER = 'x-stockcheckext-session-id';
const COMMAND_SHOW_SAS_EXT = "show_sas_ext";
const COMMAND_COMMAND_EXISTS = "command_exists";
const COMMAND_EXTENSION_INSTALLED = "extension_installed";
const NEW_STOCK_METHOD = "new_stock_method";

const SUPPORTED_COMMANDS = [COMMAND_SHOW_SAS_EXT, COMMAND_COMMAND_EXISTS, COMMAND_EXTENSION_INSTALLED, NEW_STOCK_METHOD];

const SAS_REQUEST_LIST = [];
chrome.runtime.onMessageExternal.addListener(
//chrome.runtime.onMessage.addListener(
	(request, sender, sendResponse) => {
	
	if(request.command == COMMAND_COMMAND_EXISTS)
	{
		sendResponse({ result: SUPPORTED_COMMANDS.includes(request.command_name), command_name: request.command_name });
	}
	else if(request.command == COMMAND_SHOW_SAS_EXT)
	{
		chrome.tabs.sendMessage(sender.tab.id, request, function(response) {sendResponse(response)});
	}
	else if(request.type == COMMAND_EXTENSION_INSTALLED)
	{
		sendResponse({ result: true, command_name: request.command_name });
	}
	else
	{
		const fetchRequest = new Request(request.input, request.init);

		fetch(fetchRequest)
			.then(response => {
				// get all available headers
				const headers = [...response.headers].reduce((acc, header) => {
					return { ...acc, [header[0]]: header[1] };
				}, {});

				return response.text().then(data => ({
						headers: headers,
						status: response.status,
						data
				}));
			})
			.then(response2 => {
				try {
					const json = JSON.parse(response2.data);
					response2.json = json; 
					// Do your JSON handling here
				} catch(err) {
					//response.data = lText;
				}
				response2.html = response2.data;
				return(response2);
			})
			.then(res => sendResponse(res))
			.catch(error => sendResponse({ result: false, errors: error.message }));
		return true; // Will respond asynchronously.
	}
});

function removeHeader(headers, name) {
	let i = 0;
	while (i < headers.length) {
		if (headers[i].name.toLowerCase() == name) {
			//console.log('Removing "' + name + '" header.');
			//console.log('Value: "' + headers[i].value);
			headers.splice(i, 1);
		} else {
			i++;
		}
	}
}

function getCookieString(headers) {
	let i = 0;
	let lRes = "";
	while (i < headers.length) {
		if (headers[i].name.toLowerCase() == 'set-cookie') 
		{
			lRes = lRes + headers[i].value.substr(0, headers[i].value.indexOf(';') + 1); ;
		}
		i++;
	}
	return(lRes);
}

const GET_OFFERS_MASK = [
	'https://www.amazon.ae/gp/*/*stockcheckext=competitor-stock-levels*',
	'https://www.amazon.ca/gp/*/*stockcheckext=competitor-stock-levels*',
	'https://www.amazon.cn/gp/*/*stockcheckext=competitor-stock-levels*',
	'https://www.amazon.com/gp/*/*stockcheckext=competitor-stock-levels*',
	'https://www.amazon.co.uk/gp/*/*stockcheckext=competitor-stock-levels*',
	'https://www.amazon.es/gp/*/*stockcheckext=competitor-stock-levels*',
	// 'https://www.amazon.nl/gp/*/*stockcheckext=competitor-stock-levels*',
	'https://www.amazon.com.mx/gp/*/*stockcheckext=competitor-stock-levels*',
	'https://www.amazon.it/gp/*/*stockcheckext=competitor-stock-levels*',
	'https://www.amazon.in/gp/*/*stockcheckext=competitor-stock-levels*',
	'https://www.amazon.de/gp/*/*stockcheckext=competitor-stock-levels*',
	'https://www.amazon.fr/gp/*/*stockcheckext=competitor-stock-levels*',
	'https://www.amazon.sg/gp/*/*stockcheckext=competitor-stock-levels*',
	'https://www.amazon.com.br/gp/*/*stockcheckext=competitor-stock-levels*',
	'https://www.amazon.com.au/gp/*/*stockcheckext=competitor-stock-levels*',	
	// 'https://www.amazon.co.jp/gp/*/*stockcheckext=competitor-stock-levels*',
];
const ADD_TO_CART_MASK = [
	'https://www.amazon.com/gp/verify-action/templates/add-to-cart/ordering*?*stockcheckext=competitor-stock-levels*',
	'https://www.amazon.co.uk/gp/verify-action/templates/add-to-cart/ordering*?*stockcheckext=competitor-stock-levels*',
	'https://www.amazon.es/gp/verify-action/templates/add-to-cart/ordering*?*stockcheckext=competitor-stock-levels*',
	// 'https://www.amazon.nl/gp/verify-action/templates/add-to-cart/ordering*?*stockcheckext=competitor-stock-levels*',
	'https://www.amazon.com.mx/gp/verify-action/templates/add-to-cart/ordering*?*stockcheckext=competitor-stock-levels*',
	'https://www.amazon.it/gp/verify-action/templates/add-to-cart/ordering*?*stockcheckext=competitor-stock-levels*',
	'https://www.amazon.in/gp/verify-action/templates/add-to-cart/ordering*?*stockcheckext=competitor-stock-levels*',
	'https://www.amazon.de/gp/verify-action/templates/add-to-cart/ordering*?*stockcheckext=competitor-stock-levels*',
	'https://www.amazon.fr/gp/verify-action/templates/add-to-cart/ordering*?*stockcheckext=competitor-stock-levels*',
	'https://www.amazon.cn/gp/verify-action/templates/add-to-cart/ordering*?*stockcheckext=competitor-stock-levels*',
	'https://www.amazon.ca/gp/verify-action/templates/add-to-cart/ordering*?*stockcheckext=competitor-stock-levels*',
	'https://www.amazon.ae/gp/verify-action/templates/add-to-cart/ordering*?*stockcheckext=competitor-stock-levels*',
	'https://www.amazon.sg/gp/verify-action/templates/add-to-cart/ordering*?*stockcheckext=competitor-stock-levels*',
	'https://www.amazon.com.br/gp/verify-action/templates/add-to-cart/ordering*?*stockcheckext=competitor-stock-levels*',
	'https://www.amazon.com.au/gp/verify-action/templates/add-to-cart/ordering*?*stockcheckext=competitor-stock-levels*',
	// 'https://www.amazon.co.jp/gp/verify-action/templates/add-to-cart/ordering*?*stockcheckext=competitor-stock-levels*',
];

const ADDRESS_CHANGE_MASK = [
	'https://www.amazon.com/gp/delivery/ajax/address-change.html*stockcheckext=competitor-stock-levels*',
	'https://www.amazon.co.uk/gp/delivery/ajax/address-change.html*stockcheckext=competitor-stock-levels*',
	'https://www.amazon.es/gp/delivery/ajax/address-change.html*stockcheckext=competitor-stock-levels*',
	// 'https://www.amazon.nl/gp/delivery/ajax/address-change.html*stockcheckext=competitor-stock-levels*',
	'https://www.amazon.com.mx/gp/delivery/ajax/address-change.html*stockcheckext=competitor-stock-levels*',
	'https://www.amazon.it/gp/delivery/ajax/address-change.html*stockcheckext=competitor-stock-levels*',
	'https://www.amazon.in/gp/delivery/ajax/address-change.html*stockcheckext=competitor-stock-levels*',
	'https://www.amazon.de/gp/delivery/ajax/address-change.html*stockcheckext=competitor-stock-levels*',
	'https://www.amazon.fr/gp/delivery/ajax/address-change.html*stockcheckext=competitor-stock-levels*',
	'https://www.amazon.cn/gp/delivery/ajax/address-change.html*stockcheckext=competitor-stock-levels*',
	'https://www.amazon.ca/gp/delivery/ajax/address-change.html*stockcheckext=competitor-stock-levels*',
	'https://www.amazon.ae/gp/delivery/ajax/address-change.html*stockcheckext=competitor-stock-levels*',
	'https://www.amazon.sg/gp/delivery/ajax/address-change.html*stockcheckext=competitor-stock-levels*',
	'https://www.amazon.com.br/gp/delivery/ajax/address-change.html*stockcheckext=competitor-stock-levels*',
	'https://www.amazon.com.au/gp/delivery/ajax/address-change.html*stockcheckext=competitor-stock-levels*',
	// 'https://www.amazon.co.jp/gp/delivery/ajax/address-change.html*stockcheckext=competitor-stock-levels*',
];

const PROFIT_CALCULATOR_MASK = [
	//'https://sellercentral.amazon.com/revenuecalculator*',

	'https://www.amazon.com/hz/fba/profitabilitycalculator*',
	'https://www.amazon.co.uk/hz/fba/profitabilitycalculator*',
	'https://www.amazon.es/hz/fba/profitabilitycalculator*',
	// 'https://www.amazon.nl/gp/delivery/ajax/address-change.html*stockcheckext=competitor-stock-levels*',
	'https://www.amazon.com.mx/hz/fba/profitabilitycalculator*',
	'https://www.amazon.it/hz/fba/profitabilitycalculator*',
	'https://www.amazon.in/hz/fba/profitabilitycalculator*',
	'https://www.amazon.de/hz/fba/profitabilitycalculator*',
	'https://www.amazon.fr/hz/fba/profitabilitycalculator*',
	'https://www.amazon.cn/hz/fba/profitabilitycalculator*',
	'https://www.amazon.ca/hz/fba/profitabilitycalculator*',
	'https://www.amazon.ae/hz/fba/profitabilitycalculator*',
	'https://www.amazon.sg/hz/fba/profitabilitycalculator*',
	'https://www.amazon.com.br/hz/fba/profitabilitycalculator*',
	'https://www.amazon.com.au/hz/fba/profitabilitycalculator*',
	// 'https://www.amazon.co.jp/hz/fba/profitabilitycalculator*',
];

const REMOVE_COOKIES_MASK = ADD_TO_CART_MASK.concat(GET_OFFERS_MASK).concat(PROFIT_CALCULATOR_MASK);;

const AMAZON_URLS = [
	`https://www.amazon.com/`,
	`https://www.amazon.co.uk/`,
	`https://www.amazon.es/`,
	`https://www.amazon.nl/`,
	`https://www.amazon.com.mx/`,
	`https://www.amazon.it/`,
	`https://www.amazon.in/`,
	`https://www.amazon.de/`,
	`https://www.amazon.fr/`,
	`https://www.amazon.cn/`,
	`https://www.amazon.ca/`,
	`https://www.amazon.ae/`,
	`https://www.amazon.sg/`,
	`https://www.amazon.com.br/`,
	`https://www.amazon.com.au/`,
	// 'https://www.amazon.co.jp/hz/fba/profitabilitycalculator*',
];
const SET_SESSION_ID_PARAM = 'sas-set-session-id';
const SAS_SET_SESSION_ID_MASK = AMAZON_URLS.map(i => i + `*${SET_SESSION_ID_PARAM}*`);

const NEW_AMZ_MASK_PARAM = '*ssas*=*sass*';
const SAS_NEW_AMZ_MASK = AMAZON_URLS.map(i => i + `${NEW_AMZ_MASK_PARAM}`);

const REMOVE_COOKIES_PARAM = 'sas-remove-cookies';
const REMOVE_COOKIES_MASK_NEW = REMOVE_COOKIES_MASK.concat(AMAZON_URLS.map(i => i + `*${REMOVE_COOKIES_PARAM}*`));


// add "custom" cookie to add to cart request
chrome.webRequest.onBeforeSendHeaders.addListener(
	details => {
		// get session-id from our custom header
		const sessionID = details.requestHeaders.find(
			h => h.name.toLowerCase() === STOCKCHECKEXT_SESSION_ID_HEADER,
		);

		if (sessionID) {
			// add cookie header with session-id
			details.requestHeaders.push({
				name: 'cookie',
				value: `session-id=${sessionID.value}`,
			});
		}
		return { requestHeaders: details.requestHeaders };
	},
	// filters
	{
		urls: REMOVE_COOKIES_MASK,
	},
	// extraInfoSpec
	['blocking', 'requestHeaders', 'extraHeaders'],
);

// getting session-id from address change request
chrome.webRequest.onHeadersReceived.addListener(
	details => {
		//console.log('onHeadersReceived');
		const headerSessionID = [...details.responseHeaders].find(
			h =>
				h.name.toLowerCase() === 'set-cookie' &&
				h.value.match(/session-id=(\d+-\d+-\d+);/),
		);

		if (headerSessionID) {
			const sessionID = headerSessionID.value.match(/session-id=(\d+-\d+-\d+);/)[1];

			// add session-id header
			details.responseHeaders.push({
				name: STOCKCHECKEXT_SESSION_ID_HEADER,
				value: sessionID,
			});
		}

		// remove all cookies from requests to avoid overwritting user's cookie
		removeHeader(details.responseHeaders, 'set-cookie');

		return { responseHeaders: details.responseHeaders };
	},
	{
		urls: ADDRESS_CHANGE_MASK,
	},
	['blocking', 'responseHeaders', 'extraHeaders'],
);

chrome.webRequest.onHeadersReceived.addListener(

	details => {
		const headerSessionID = [...details.responseHeaders].find(
			h =>
				h.name.toLowerCase() === 'set-cookie' &&
				h.value.match(/session-id=(\d+-\d+-\d+);/),
		);
		if (headerSessionID) {
			const sessionID = headerSessionID.value.match(/session-id=(\d+-\d+-\d+);/)[1];

			// add session-id header
			details.responseHeaders.push({
				name: STOCKCHECKEXT_SESSION_ID_HEADER,
				value: sessionID,
			});
		}

		return { responseHeaders: details.responseHeaders };
	},
	{
		urls: SAS_SET_SESSION_ID_MASK
	},
	['blocking', 'responseHeaders', 'extraHeaders'],
);

// remove cookies from responses
chrome.webRequest.onHeadersReceived.addListener(
	
	details => {
		removeHeader(details.responseHeaders, 'set-cookie');
		return { responseHeaders: details.responseHeaders };
	},
	{
		urls: REMOVE_COOKIES_MASK_NEW,
	},
	['blocking', 'responseHeaders', 'extraHeaders'],
);


function createRandomString(aLength, aIncludeNumbers = false, aIncludeLower = false) 
{
	var result = "";
	var lChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
	if(aIncludeNumbers) lChars += "0123456789";
	if(aIncludeLower) lChars += "abcdefghijklmnopqrstuvwxyz";
	const lCharLen = lChars.length;
	for(var i = 0; i < aLength; i++) 
	{
		result += lChars.charAt(Math.floor(Math.random() * lCharLen));
	}
	return result;
}

function replaceSasHeaders(headers) {
	let i = 0;
	while (i < headers.length) {
		if(lSasXHeader = headers[i].name.match(/(x-sas-)(.*)/)) 
		{
			headers[i].name = lSasXHeader[2];
		} 
		i++;	
	}
}

// remove cookies from responses
chrome.webRequest.onHeadersReceived.addListener(
	
	details => {
		const headerSessionID = [...details.responseHeaders].find(
			h =>
				h.name.toLowerCase() === 'set-cookie' &&
				h.value.match(/session-id=(\d+-\d+-\d+);/),
		);
		if (headerSessionID) {
			const sessionID = headerSessionID.value.match(/session-id=(\d+-\d+-\d+);/)[1];

			details.responseHeaders.push({
				name: STOCKCHECKEXT_SESSION_ID_HEADER,
				value: sessionID,
			});
		}

		const lcUrlParams = new URLSearchParams(details.url);
		const lSasRequestId = lcUrlParams.has("sasRequestId") ? lcUrlParams.get("sasRequestId") : null;	
		const lSasRequest = SAS_REQUEST_LIST.find(
			e => e.sasRequestId == lSasRequestId
		);

		if(lSasRequest)
		{
			lSasRequest.cookies = getCookieString(details.responseHeaders);
		}
		else if(lSasRequestId !== null)
		{
			SAS_REQUEST_LIST.push({
				sasRequestId: lSasRequestId,
				cookies: getCookieString(details.responseHeaders),
			});
		}
		removeHeader(details.responseHeaders, 'set-cookie');
		return { responseHeaders: details.responseHeaders };
	},
	{
		urls: SAS_NEW_AMZ_MASK,
	},
	['blocking', 'responseHeaders', 'extraHeaders'],
);


chrome.webRequest.onBeforeSendHeaders.addListener(
	details => {
		const lUa = [...details.requestHeaders].find(
			h =>
				h.name.toLowerCase() === 'x-sas-ua'
		);
		if (lUa) {
			removeHeader(details.requestHeaders, 'user-agent');
			removeHeader(details.requestHeaders, 'x-sas-ua');
			details.requestHeaders.push({
				name: 'user-agent',
				value: lUa.value,
			});
		}
		
		const lOrigin = [...details.requestHeaders].find(
			h =>
				h.name.toLowerCase() === 'x-sas-origin'
		);
		if (lOrigin) {
			removeHeader(details.requestHeaders, 'origin');
			removeHeader(details.requestHeaders, 'x-sas-origin');
			details.requestHeaders.push({
				name: 'origin',
				value: lOrigin.value,
			});
		}


		const lResestCookiesHeader = [...details.requestHeaders].find(
			h =>
				h.name.toLowerCase() === 'x-sas-reset-cookies'
		);
		var lResetCookies = false || (lResestCookiesHeader && +lResestCookiesHeader.value);
		removeHeader(details.requestHeaders, 'x-sas-reset-cookies');

		replaceSasHeaders(details.requestHeaders);

		const lcUrlParams = new URLSearchParams(details.url);
		const lSasRequestId = lcUrlParams.has("sasRequestId") ? lcUrlParams.get("sasRequestId") : null;	
		const lSasRequest = SAS_REQUEST_LIST.find(
			e => e.sasRequestId == lSasRequestId
		);

		if(lSasRequest)
		{
		//	console.log(`${details.url} ${lResetCookies} ${lSasRequest.cookies}`);
			if(lResetCookies)
			{
				lSasRequest.cookies = "";
			}
			
			if(!lResetCookies)
			{
				details.requestHeaders.push({
					name: 'cookie',
					value: lSasRequest.cookies,
				});
			}
		}

		return { requestHeaders: details.requestHeaders };
	},
	{
		urls: SAS_NEW_AMZ_MASK,
	},
	['blocking', 'requestHeaders', 'extraHeaders'],
);

/*
chrome.webRequest.onBeforeSendHeaders.addListener(
	details => {
		const lOrigin = [...details.requestHeaders].find(
			h =>
				h.name.toLowerCase() === 'x-sas-origin'
		);
		if (lOrigin) {
			removeHeader(details.requestHeaders, 'origin');
			removeHeader(details.requestHeaders, 'x-sas-origin');
			details.requestHeaders.push({
				name: 'origin',
				value: lOrigin.value,
			});
		}

		replaceSasHeaders(details.requestHeaders);

		return { requestHeaders: details.requestHeaders };
	},
	{
		urls: ['https://sellercentral.amazon.com/revenuecalculator/*'],
	},
	['blocking', 'requestHeaders', 'extraHeaders'],
);
*/