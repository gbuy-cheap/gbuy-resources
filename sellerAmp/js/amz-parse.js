/*const TARGET_SELECTOR = '.s-main-slot';

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

selectors.forEach((objSelectors) => {
	document
		.querySelectorAll(objSelectors.CARD_SELECTOR)
		.forEach((e) => process(e, objSelectors));
});

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