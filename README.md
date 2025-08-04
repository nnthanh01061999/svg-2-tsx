# SVG to TSX Converter

A VS Code extension that converts SVG files to React TypeScript components with built-in SVG optimization capabilities.

## Features

- **SVG to React Component Conversion**: Convert SVG files to React TypeScript components
- **SVG Optimization Server**: Built-in RESTful API server for optimizing SVG files using SVGO
- **Multiple Icon Types**: Support for Outline, Fill, Color, and 3D icon types
- **Color Replacement**: Automatic replacement of specific colors with `currentColor`
- **Auto Export**: Automatic module export generation
- **Batch Processing**: Optimize multiple SVG files at once

## Installation

1. Install the extension from the VS Code marketplace
2. Install dependencies:
   ```bash
   pnpm install
   ```

## Usage

### SVG to React Component

1. Copy an SVG to your clipboard
2. Open the command palette (`Cmd+Shift+P` on Mac, `Ctrl+Shift+P` on Windows/Linux)
3. Run the command: `S2T: SVG to React Component`
4. Select the icon type (Outline, Fill, Color, or 3D)
5. Enter a name for the component (PascalCase)
6. The component will be created in the appropriate directory

### SVG Optimization Server

The extension includes a built-in RESTful API server for optimizing SVG files using SVGO.

#### Starting the Server

1. Open the command palette
2. Run: `S2T: Start SVG Optimization Server`
3. The server will start on the configured port (default: 3600)

#### Stopping the Server

1. Open the command palette
2. Run: `S2T: Stop SVG Optimization Server`

#### API Endpoints

##### POST /api/optimize

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

##### POST /api/optimize/batch

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

##### GET /api/plugins

Get a list of available SVGO plugins.

**Response:**

```json
{
  "success": true,
  "plugins": [
    "removeDoctype",
    "removeXMLProcInst",
    "removeComments"
    // ... more plugins
  ]
}
```

##### GET /health

Health check endpoint.

**Response:**

```json
{
  "status": "ok",
  "message": "SVG Optimization Server is running"
}
```

#### Example Usage with curl

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

## Configuration

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
  "svg2tsx.optimizationServerPort": 3600
}
```

### Configuration Options

- **iconPaths**: Customize the output paths for different icon types
- **replaceColor**: Configure color replacement settings
- **autoExportModule**: Enable/disable automatic module export generation
- **optimizationServerPort**: Set the port for the SVG optimization server

## Development

### Prerequisites

- Node.js 18+
- pnpm

### Setup

1. Clone the repository
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

### Testing

Run the test suite:

```bash
pnpm test
```

### Building

Build the extension:

```bash
pnpm run build
```

## Dependencies

- **SVGO**: SVG optimization library
- **Express**: Web framework for the RESTful API
- **CORS**: Cross-origin resource sharing middleware

## License

MIT License - see LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history and changes.
