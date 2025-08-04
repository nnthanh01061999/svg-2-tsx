# SVG to TSX Converter

A VS Code extension that converts SVG files to React TypeScript components with built-in SVG optimization capabilities using SVGO.

## ✨ Features

- **SVG to React Component Conversion**: Convert SVG files to React TypeScript components
- **SVG Optimization Server**: Built-in RESTful API server for optimizing SVG files using SVGO
- **Multiple Icon Types**: Support for Outline, Fill, Color, and 3D icon types
- **Color Replacement**: Automatic replacement of specific colors with `currentColor`
- **Auto Export**: Automatic module export generation
- **Batch Processing**: Optimize multiple SVG files at once
- **Real-time Optimization**: Automatically optimize SVGs during component conversion

## 🚀 Quick Start

### Installation

1. **From VS Code Marketplace** (Recommended)

   - Open VS Code
   - Go to Extensions (Ctrl+Shift+X)
   - Search for "SVG to TSX"
   - Install the extension

2. **From Source**
   ```bash
   git clone https://github.com/nnthanh01061999/svg-2-tsx.git
   cd svg-2-tsx
   pnpm install
   pnpm run compile
   ```

### Basic Usage

1. Copy an SVG to your clipboard
2. Open the command palette (`Cmd+Shift+P` on Mac, `Ctrl+Shift+P` on Windows/Linux)
3. Run: `S2T: SVG to React Component`
4. Select the icon type (Outline, Fill, Color, or 3D)
5. Enter a name for the component (PascalCase)
6. The component will be created in the appropriate directory

## 🔧 SVG Optimization Server

The extension includes a powerful built-in RESTful API server for optimizing SVG files using SVGO.

### Starting the Server

1. Open the command palette
2. Run: `S2T: Start SVG Optimization Server`
3. The server will start on the configured port (default: 3600)

### Stopping the Server

1. Open the command palette
2. Run: `S2T: Stop SVG Optimization Server`

### API Endpoints

#### `POST /api/optimize`

Optimize a single SVG file.

**Request Body:**

```json
{
  "svgString": "<svg>...</svg>",
  "config": {
    "multipass": true,
    "plugins": ["preset-default"]
  }
}
```

**Response:**

```json
{
  "success": true,
  "data": "<optimized-svg>",
  "originalSize": 1418,
  "optimizedSize": 619,
  "reductionPercentage": 56.35
}
```

#### `POST /api/optimize/batch`

Optimize multiple SVG files.

**Request Body:**

```json
{
  "svgFiles": [
    {
      "name": "icon1.svg",
      "content": "<svg>...</svg>"
    },
    {
      "name": "icon2.svg",
      "content": "<svg>...</svg>"
    }
  ],
  "config": {
    "multipass": true,
    "plugins": ["preset-default"]
  }
}
```

#### `GET /api/plugins`

Get a list of available SVGO plugins.

**Response:**

```json
{
  "success": true,
  "plugins": [
    "removeDoctype",
    "removeXMLProcInst",
    "removeComments",
    "removeMetadata",
    "removeEditorsNSData",
    "cleanupAttrs",
    "mergeStyles",
    "inlineStyles",
    "minifyStyles",
    "cleanupIDs",
    "removeUselessDefs",
    "cleanupNumericValues",
    "convertColors",
    "removeUnknownsAndDefaults",
    "removeNonInheritableGroupAttrs",
    "removeUselessStrokeAndFill",
    "removeViewBox",
    "cleanupEnableBackground",
    "removeHiddenElems",
    "removeEmptyText",
    "convertShapeToPath",
    "convertEllipseToCircle",
    "moveElemsAttrsToGroup",
    "moveGroupAttrsToElems",
    "collapseGroups",
    "convertPathData",
    "convertTransform",
    "removeEmptyAttrs",
    "removeEmptyContainers",
    "mergePaths",
    "removeUnusedNS",
    "sortDefsChildren",
    "removeTitle",
    "removeDesc"
  ]
}
```

#### `GET /health`

Health check endpoint.

**Response:**

```json
{
  "status": "ok",
  "message": "SVG Optimization Server is running"
}
```

### Example Usage

#### Using curl

```bash
# Optimize a single SVG
curl --location 'http://localhost:3600/api/optimize' \
--header 'Content-Type: application/json' \
--data '{
  "svgString": "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M6.74776 5.99756V2.99658C6.74776 2.58244 7.08364 2.24669 7.49776 2.24658C7.91197 2.24658 8.24776 2.58237 8.24776 2.99658V5.99756C8.24776 6.41177 7.91197 6.74756 7.49776 6.74756C7.08364 6.74745 6.74776 6.4117 6.74776 5.99756Z\" fill=\"#2B2B2B\"/></svg>",
  "config": {
    "multipass": true,
    "plugins": ["preset-default"]
  }
}'

# Health check
curl http://localhost:3600/health
```

#### Using JavaScript/TypeScript

```javascript
// Optimize SVG
const response = await fetch("http://localhost:3600/api/optimize", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    svgString: "<svg>...</svg>",
    config: {
      multipass: true,
      plugins: ["preset-default"],
    },
  }),
});

const result = await response.json();
console.log(`Optimized SVG: ${result.data}`);
console.log(`Size reduction: ${result.reductionPercentage}%`);
```

## ⚙️ Configuration

The extension can be configured through VS Code settings:

```json
{
  "svg2tsx.iconPaths": {
    "Outline": "src/components/Common/Icon/icons/outline",
    "Fill": "src/components/Common/Icon/icons/fill",
    "Color": "src/components/Common/Icon/icons/color",
    "3D": "src/components/Common/Icon/icons/3d"
  },
  "svg2tsx.replaceColor": {
    "color": "#2B2B2B",
    "type": ["Fill", "Outline"]
  },
  "svg2tsx.autoExportModule": true,
  "svg2tsx.optimizationServerPort": 3600,
  "svg2tsx.svgOptimizeUrl": {
    "url": "http://localhost:3600/api/optimize",
    "enabled": true
  }
}
```

### Configuration Options

| Option                   | Type    | Default                                                          | Description                                       |
| ------------------------ | ------- | ---------------------------------------------------------------- | ------------------------------------------------- |
| `iconPaths`              | Object  | See above                                                        | Customize output paths for different icon types   |
| `replaceColor`           | Object  | `{"color": "#2B2B2B", "type": ["Fill", "Outline"]}`              | Configure color replacement settings              |
| `autoExportModule`       | Boolean | `true`                                                           | Enable/disable automatic module export generation |
| `optimizationServerPort` | Number  | `3600`                                                           | Set the port for the SVG optimization server      |
| `svgOptimizeUrl`         | Object  | `{"url": "http://localhost:3600/api/optimize", "enabled": true}` | Configure automatic SVG optimization              |

## 🛠️ Development

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/nnthanh01061999/svg-2-tsx.git
   cd svg-2-tsx
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Compile the extension:

   ```bash
   pnpm run compile
   ```

4. Package the extension:
   ```bash
   pnpm run package
   ```

### Available Scripts

| Script             | Description                      |
| ------------------ | -------------------------------- |
| `pnpm run compile` | Compile TypeScript to JavaScript |
| `pnpm run watch`   | Watch for changes and recompile  |
| `pnpm run lint`    | Run ESLint                       |
| `pnpm run test`    | Run tests                        |
| `pnpm run package` | Create VSIX package              |
| `pnpm run build`   | Compile and package              |

### Project Structure

```
svg-2-tsx/
├── src/
│   ├── extension.ts              # Main extension logic
│   ├── svgOptimizationServer.ts  # SVG optimization server
│   └── types/
│       └── svgo.d.ts            # SVGO type declarations
├── out/                         # Compiled JavaScript
├── package.json                 # Extension manifest
├── tsconfig.json               # TypeScript configuration
└── README.md                   # This file
```

## 📦 Dependencies

### Production Dependencies

- **SVGO** (v2.8.0): SVG optimization library
- **Express** (v4.21.2): Web framework for the RESTful API
- **CORS** (v2.8.5): Cross-origin resource sharing middleware

### Development Dependencies

- **TypeScript**: Type safety and compilation
- **ESLint**: Code linting
- **VS Code Extension API**: Extension development

## 🎯 Performance

The SVG optimization typically achieves:

- **50-70% file size reduction** for most SVGs
- **Real-time optimization** during component conversion
- **Batch processing** for multiple files
- **Configurable optimization levels** via SVGO plugins

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests if applicable
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use ESLint for code quality
- Add tests for new features
- Update documentation for API changes
- Follow the existing code style

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Troubleshooting

### Common Issues

1. **Server won't start**

   - Check if port 3600 is already in use
   - Try changing the port in settings
   - Ensure no other instances are running

2. **Optimization fails**

   - Verify the SVG is valid
   - Check server logs for errors
   - Ensure the server is running

3. **Build errors**
   - Run `pnpm install` to ensure all dependencies are installed
   - Check TypeScript compilation with `pnpm run compile`
   - Verify Node.js version (18+ required)

### Getting Help

- [Open an issue](https://github.com/nnthanh01061999/svg-2-tsx/issues) for bug reports
- [Create a discussion](https://github.com/nnthanh01061999/svg-2-tsx/discussions) for questions
- Check the [VS Code Extension Marketplace](https://marketplace.visualstudio.com/) for updates

## 📈 Changelog

### v0.0.1

- Initial release
- SVG to React component conversion
- SVG optimization server with RESTful API
- Multiple icon type support
- Color replacement functionality
- Auto export module generation

## 🙏 Acknowledgments

- [SVGO](https://github.com/svg/svgo) for SVG optimization
- [VS Code Extension API](https://code.visualstudio.com/api) for extension development
- [Express.js](https://expressjs.com/) for the web server
- All contributors and users of this extension

---

**Made with ❤️ for the React/TypeScript community**
