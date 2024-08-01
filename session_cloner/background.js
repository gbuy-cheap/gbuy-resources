chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'getAllCookies') {
      chrome.cookies.getAll({}, function(cookies) {
        sendResponse({ cookies: cookies });
      });
    }
    return true;
  });