// This file enables communication between the background script and the page
console.log("GitHub PR Whitespace Hider content script loaded");

// Function to apply wider sidebar on PR file pages with ?w=1
function applyWideSidebar() {
  // Check if we're on a PR files page with w=1 parameter
  if (location.href.match(/https:\/\/github\.com\/.*\/pull\/.*\/files(\?|\&)w=1/)) {
    // Apply the wider sidebar style
    const style = document.createElement('style');
    style.textContent = `
      .Layout-sidebar.diff-sidebar {
        width: calc(var(--Layout-sidebar-width) + 100px) !important;
      }
    `;
    document.head.appendChild(style);
    console.log("GitHub PR Whitespace Hider: Sidebar width increased by 100px (via content script)");
  }
}

// Apply on initial page load
applyWideSidebar();

// Apply on dynamic content changes (for SPAs)
const observer = new MutationObserver(() => {
  // Check if sidebar exists but doesn't have our style
  const sidebar = document.querySelector('.Layout-sidebar.diff-sidebar');
  if (sidebar && window.getComputedStyle(sidebar).width.indexOf('+100px') === -1) {
    applyWideSidebar();
  }
});

// Start observing the document body for DOM changes
observer.observe(document.body, { 
  childList: true, 
  subtree: true 
});
