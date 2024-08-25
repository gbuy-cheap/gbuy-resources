chrome.action.onClicked.addListener(async (tab) => {
  let [currentTab] = await chrome.tabs.query({ active: true, currentWindow: true });
  await chrome.tabs.create({ url: "app.html" });
});

chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason === "install") {
	    chrome.tabs.create({url: "app.html"}, function (tab) {});
		chrome.storage.sync.set({ 'links': "" }, function(){ });
		chrome.storage.sync.set({ 'focus': true }, function(){ });
		chrome.storage.sync.set({ 'remdups': true }, function(){ });
    }
    if (details.reason === "update") {

    }
})


function onInstall() 
{
	chrome.tabs.create({url: "app.html"}, function (tab) {});
	chrome.storage.sync.set({ 'links': "" }, function(){ });
	chrome.storage.sync.set({ 'focus': true }, function(){ });
	chrome.storage.sync.set({ 'remdups': true }, function(){ });

}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) 
{
    if (request.method == "open")
    {
		var link = request.link;
		var focus = request.focus;

		console.log(link);
		chrome.tabs.create({url: link, active: focus});
    }

    if (request.method == "get-all-tabs")
    {
	  var links = [];
	  chrome.tabs.query( {} ,function (tabs) { // The Query {} was missing here
	    for (var i = 0; i < tabs.length; i++) {
	      links.push(tabs[i].url);
	      console.log(tabs[i].url);
	    } 
	    sendResponse({link: links});
	  });
    }
    
    return true;
});