var contentTabId;

chrome.tabs.onUpdated.addListener(function
	(tabId, changeInfo, tab) {
	  // read changeInfo data and do something with it (like read the url)
	  if (changeInfo.url) {
		var regex = RegExp("https*:\/\/(?:www\.)*(?:smile\.)*amazon\.(co\.uk|es|it|de|fr|com|ca)\/(.*\/)*(dp|gp\/product|gp\/offer-listing)\/(.*\/)*([A-Z0-9]{10})");
		var m = changeInfo.url.match(regex);
		if(m && m.length > 4) 
		{ 
			chrome.tabs.sendMessage(tab.id, {
				command: "dosas",
				source_url: changeInfo.url,
				selectionText: m[5],
				no_display_update: true
			}, function(response) {});	
		}
	  }
	}
);

chrome.webRequest.onHeadersReceived.addListener(info => {
	const headers = info.responseHeaders; // original headers
	if(info.type == 'main_frame') {
		for (let i=headers.length-1; i>=0; --i) {
			let header = headers[i].name.toLowerCase();
			if (header === "content-security-policy") { // csp header is found
				headers[i].value = headers[i].value.replace("frame-src", "frame-src https://*.selleramp.com");
				headers[i].value = headers[i].value.replace("child-src", "child-src https://*.selleramp.com");
			}
		}	
	}
	// return modified headers
	return {responseHeaders: headers};
}, {
	urls: [ "<all_urls>" ], // match all pages
}, ["blocking", "responseHeaders"]);

chrome.contextMenus.create({
	title: 'SAS Search >> %s',
	id: 'cmSas',
	contexts: ['selection', 'link'],
	"onclick": contextMenuClick
});


chrome.contextMenus.create({
	title: 'SAS Smart Search',
	id: 'cmSasPage',
	contexts: ['page' ],
	"onclick": contextMenuClick
});

function contextMenuClick(info, tab) {
	if(info.menuItemId == "cmSas" || info.menuItemId == "cmSasPage" || info.menuItemId == "cmSasLink")
	{
		chrome.tabs.sendMessage(tab.id, {
			command: "dosas",
			selectionText: info.selectionText,
			linkUrl: info.linkUrl,
			pageUrl: info.pageUrl,
			source_url: tab.url,
			smartSearch: info.menuItemId == "cmSasPage",
			linkSearch: info.menuItemId == "cmSasLink"
		}, function(response) {});	
	}	
	else if(info.menuItemId == "cmPopup")
	{
		chrome.tabs.sendMessage(tab.id, {
			command: "togglePopup",
			source_url: tab.url
		}, function(response) {});	
	}	
}

chrome.browserAction.onClicked.addListener(function(tab) {
	chrome.tabs.query({
		active: true,
		currentWindow: true
	}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {
			command: "togglesas"
		}, function(response) {});
	});
});