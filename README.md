# GitHub PR Whitespace Hider

A simple Chrome extension that automatically adds the `?w=1` parameter to GitHub Pull Request file URLs to hide whitespace changes, and adds useful shortcuts for PR management.

## Features

### Whitespace Hiding
This extension detects when you visit a URL like:
```
https://github.com/COMPANY-NAME/PROJECT-NAME/pull/xxxx/files
```

And automatically transforms it to:
```
https://github.com/COMPANY-NAME/PROJECT-NAME/pull/xxxx/files?w=1
```

The `?w=1` parameter tells GitHub to hide changes that only affect whitespace, making code review clearer.

### Wider Sidebar
When viewing PR files with the `?w=1` parameter, the extension automatically increases the width of the sidebar by 100px for better readability.

### Keyboard Shortcuts

1. **Toggle Viewed Checkboxes** - `Cmd+Shift+O` (Mac) or `Ctrl+Shift+O` (Windows/Linux)  
   Unchecks all currently checked "viewed" checkboxes in PR file views.

2. **Copy PR List** - `Cmd+Shift+S` (Mac) or `Ctrl+Shift+S` (Windows/Linux)  
   When viewing a PR list page (`https://github.com/*/pulls`), formats and copies all non-draft PRs to clipboard.
   PRs with the "Review: Approved 🚀" label are marked with a ✅.

## Installation

### From the Chrome Web Store
*(The extension is not yet available on the Chrome Web Store)*

### Manual Installation (Developer Mode)
1. Download or clone this repository to your computer
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" (top right)
4. Click "Load unpacked extension"
5. Select the folder containing the extension files

## Extension Contents

- `manifest.json`: Extension configuration
- `background.js`: Script that detects and modifies URLs, processes keyboard shortcuts
- `content.js`: Content script for page interaction
- `icon.svg`: Vector icon for the extension

## File Structure

```
github-pr-whitespace-hider/
├── manifest.json
├── background.js
├── content.js
├── icon.svg
└── README.md
```

## Permissions

The extension requires the following permissions:
- `webNavigation`: To detect navigation to PR file views
- `tabs`: To update tabs with modified URLs
- `activeTab`: To access the active tab content
- `scripting`: To execute scripts in page context
- `clipboardWrite`: To copy PR list to clipboard

## Notes

This extension uses an SVG file directly as an icon, which is supported by recent Chrome versions. If you need to generate PNG icons, you can use the included `icon-generator.html` file.
