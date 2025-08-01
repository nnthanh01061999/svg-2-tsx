# SVG to TSX

A Visual Studio Code extension that converts SVG files from your clipboard into React TypeScript (TSX) components with just a few clicks.

![Version](https://img.shields.io/badge/version-0.0.1-blue)
![VS Code](https://img.shields.io/badge/VS%20Code-^1.102.0-brightgreen)
![License](https://img.shields.io/badge/license-MIT-green)

## Features

- **Convert SVG to React Component**: Transform SVG code from your clipboard into a properly formatted React TSX component
- **Icon Type Selection**: Organize components by icon type (outline, fill, color, 3d)
- **Automatic Directory Creation**: Files are saved to configurable directories based on icon type
- **Smart Color Replacement**: Automatically replaces specified colors with `currentColor` for selected icon types
- **Proper Formatting**: Creates well-structured React components with proper TypeScript support

## Installation

1. Run `pnpm install`
2. Then `pnpm build` now you got "svg-2-tsx-0.0.1.vsix"
3. Go to Extensions (or press `Ctrl+Shift+X` / `Cmd+Shift+X` on Mac)
4. Select "Install from VSIX..." choose vsix file.
5. Reload VS Code

Alternatively, use the already `.vsix` file in this repo and install manually.

## Usage

### SVG to React Component

1. Copy an SVG to your clipboard
2. Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on Mac)
3. Run the "SVG to React Component" command
4. Select the icon type (Outline, Fill, Color, 3D)
5. Enter a name for the icon component (in PascalCase)
6. The extension will:
   - Replace the configured color with `currentColor` for specified icon types
   - Create a new file in the configured directory based on icon type
   - Save the React component with proper formatting
   - Auto import new component to index file if `autoExportModule` is true
   - Open the newly created file

## Configuration

You can customize the extension settings in your VS Code settings:

```json
"svg2tsx.iconPaths": {
  "type": "object",
  "default": {
    "Outline": "src/components/Common/Icon/icons/outline",
    "Fill": "src/components/Common/Icon/icons/fill",
    "Color": "src/components/Common/Icon/icons/color",
    "3D": "src/components/Common/Icon/icons/3d"
  },
  "description": "Paths for different icon types"
},
"svg2tsx.replaceColor": {
  "type": "object",
  "default": {
    "color": "#2B2B2B",
    "type": [
      "Fill",
      "Outline"
    ]
  },
  "description": "Replace this color with currentColor"
},
"svg2tsx.autoExportModule": {
  "type": "boolean",
  "default": true,
  "description": "Auto export module"
}
```

## Requirements

- Visual Studio Code 1.102.0 or higher

## Known Issues

- None reported yet. Please submit issues on our GitHub repository.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Release Notes

### 0.0.1

- Initial release
- SVG to React Component conversion
- Configurable icon paths and color replacement

## License

This extension is licensed under the MIT License. See the LICENSE file for details.

## Feedback and Support

Feel free to [open an issue](https://github.com/nnthanh01061999/svg-2-tsx/issues) for bug reports, feature requests, or general feedback.
