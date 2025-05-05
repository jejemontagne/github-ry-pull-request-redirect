// Function to transform the URL
function transformUrl(url) {
  // Check if the URL matches the GitHub PR files pattern
  const prFilesPattern = /^https:\/\/github\.com\/[^\/]+\/[^\/]+\/pull\/\d+\/files(?!\?|.*[?&]w=)/;
  
  if (prFilesPattern.test(url)) {
    // If the URL doesn't contain any parameters, add ?w=1
    if (url.indexOf('?') === -1) {
      return url + '?w=1';
    } 
    // If the URL already has parameters but not w=1, add &w=1
    else if (url.indexOf('w=1') === -1) {
      return url + '&w=1';
    }
  }
  return null; // No transformation needed
}

// Listener for completed navigations (full page loads)
chrome.webNavigation.onCompleted.addListener(
  function(details) {
    const newUrl = transformUrl(details.url);
    if (newUrl) {
      chrome.tabs.update(details.tabId, { url: newUrl });
    }
  },
  {
    url: [{
      hostEquals: 'github.com',
      pathContains: '/pull/',
      pathSuffix: '/files'
    }]
  }
);

// Listener for history state changes (SPA navigation)
chrome.webNavigation.onHistoryStateUpdated.addListener(
  function(details) {
    const newUrl = transformUrl(details.url);
    if (newUrl) {
      chrome.tabs.update(details.tabId, { url: newUrl });
    }
  },
  {
    url: [{
      hostEquals: 'github.com',
      pathContains: '/pull/',
      pathSuffix: '/files'
    }]
  }
);

// Additional listener to capture more URL change cases
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Check if the URL has changed
  if (changeInfo.url) {
    const newUrl = transformUrl(changeInfo.url);
    if (newUrl) {
      chrome.tabs.update(tabId, { url: newUrl });
    }
  }
});