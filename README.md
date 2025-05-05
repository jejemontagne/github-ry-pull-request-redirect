# GitHub PR Whitespace Hider

A simple Chrome extension that automatically adds the `?w=1` parameter to GitHub Pull Request file URLs to hide whitespace changes.

## Feature

This extension detects when you visit a URL like:
```
https://github.com/COMPANY-NAME/PROJECT-NAME/pull/xxxx/files
```

And automatically transforms it to:
```
https://github.com/COMPANY-NAME/PROJECT-NAME/pull/xxxx/files?w=1
```

The `?w=1` parameter tells GitHub to hide changes that only affect whitespace, making code review clearer.

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
- `background.js`: Script that detects and modifies URLs
- `icon.svg`: Vector icon for the extension

## File Structure

```
github-pr-whitespace-hider/
├── manifest.json
├── background.js
├── icon.svg
└── README.md
```

## Notes

This extension uses an SVG file directly as an icon, which is supported by recent Chrome versions. If you need to generate PNG icons, you can use the included `icon-generator.html` file.