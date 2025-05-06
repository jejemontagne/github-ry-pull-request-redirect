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

// Function to inject CSS for wider sidebar
function injectWideSidebar(tabId) {
  chrome.scripting.executeScript({
    target: { tabId: tabId },
    function: () => {
      // Create a style element
      const style = document.createElement('style');
      style.textContent = `
        .Layout-sidebar.diff-sidebar {
          width: calc(var(--Layout-sidebar-width) + 100px) !important;
        }
      `;
      // Add the style to the document
      document.head.appendChild(style);
      console.log("GitHub PR Whitespace Hider: Sidebar width increased by 100px");
    }
  });
}

// Listener for completed navigations (full page loads)
chrome.webNavigation.onCompleted.addListener(
  function(details) {
    const newUrl = transformUrl(details.url);
    if (newUrl) {
      chrome.tabs.update(details.tabId, { url: newUrl });
    }
    
    // If it's a PR files page with w=1 parameter, increase sidebar width
    if (details.url.match(/https:\/\/github\.com\/.*\/pull\/.*\/files(\?|\&)w=1/)) {
      injectWideSidebar(details.tabId);
    }
  },
  {
    url: [{
      hostEquals: 'github.com',
      pathContains: '/pull/',
      pathContains: '/files'
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
    
    // If it's a PR files page with w=1 parameter, increase sidebar width
    if (details.url.match(/https:\/\/github\.com\/.*\/pull\/.*\/files(\?|\&)w=1/)) {
      injectWideSidebar(details.tabId);
    }
  },
  {
    url: [{
      hostEquals: 'github.com',
      pathContains: '/pull/',
      pathContains: '/files'
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
    
    // If it's a PR files page with w=1 parameter, increase sidebar width
    if (changeInfo.url && changeInfo.url.match(/https:\/\/github\.com\/.*\/pull\/.*\/files(\?|\&)w=1/)) {
      injectWideSidebar(tabId);
    }
  }
});

// Function to toggle viewed checkboxes
function toggleViewedCheckboxes(tabId) {
  chrome.scripting.executeScript({
    target: { tabId: tabId },
    function: () => {
      // Toggle "viewed" checkboxes that are currently checked
      document.getElementsByName("viewed").forEach(checkbox => {
        if(checkbox.checked) {
          checkbox.click();
        }
      });
    }
  });
}

// Function to get PR list and copy to clipboard
function copyPRList(tabId) {
  chrome.scripting.executeScript({
    target: { tabId: tabId },
    function: () => {
      // Extract PR information and format it
      const prList = Array.from(document.querySelectorAll("div[aria-label='Issues'] div[id^='issue_']"))
        .filter(div => {
          const isDraft = div.querySelector('[aria-label="Draft"]') || div.textContent.includes("Draft");
          return !isDraft;
        })
        .map(div => {
          const link = div.querySelector("a.js-navigation-open");
          const title = link?.textContent.trim();
          const href = link?.getAttribute("href");
          const numberMatch = title?.match(/#?(\d{1,})$/) || href?.match(/(\d+)(?!.*\d)/);
          const issueNumber = numberMatch ? numberMatch[1] : '';
          const issueUrl = `https://github.com${href}`;
          const hasApprovedLabel = Array.from(div.querySelectorAll("a.IssueLabel")).some(label => 
            label.textContent.trim() === "Review: Approved 🚀"
          );
          const checkmark = hasApprovedLabel ? "✅ " : "";
          return `${checkmark}${title} #${issueNumber} ${issueUrl}`;
        })
        .join("\n");
      
      // Log the PR list to console
      console.log(prList);
      
      // Copy the PR list to clipboard
      navigator.clipboard.writeText(prList)
        .then(() => {
          console.log("PR list copied to clipboard successfully!");
        })
        .catch(err => {
          console.error("Failed to copy PR list to clipboard: ", err);
        });
    }
  });
}

// Listen for keyboard shortcuts
chrome.commands.onCommand.addListener((command) => {
  // Get the active tab
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
      const activeTab = tabs[0];
      
      if (command === "toggle-viewed-checkboxes") {
        toggleViewedCheckboxes(activeTab.id);
      } else if (command === "copy-pr-list") {
        // Check if the current URL matches the pattern for GitHub PR list
        const isPRListPage = /https:\/\/github\.com\/.*\/pulls/.test(activeTab.url);
        if (isPRListPage) {
          copyPRList(activeTab.id);
        } else {
          console.log("This command can only be used on GitHub PR list pages");
        }
      }
    }
  });
});
