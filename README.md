# SVG to TSX Converter - User Guide

A powerful VS Code extension that converts SVG files to React TypeScript components with built-in optimization. Perfect for developers who want to use SVG icons in their React projects with minimal setup.

## 🎯 What This Extension Does

This extension helps you:

- **Convert SVG files to React components** with a single command
- **Optimize SVG files** to reduce file size by 50-70%
- **Batch process multiple files** at once
- **Automatically organize** components by icon type
- **Generate proper TypeScript** components ready for React

## 🚀 Getting Started

### Step 1: Install the Extension

**Option A: From VS Code Marketplace (Recommended)**

1. Open VS Code
2. Press `Ctrl+Shift+X` (Windows/Linux) or `Cmd+Shift+X` (Mac) to open Extensions
3. Search for "SVG to TSX"
4. Click "Install"

**Option B: From Source**

```bash
git clone https://github.com/nnthanh01061999/svg-2-tsx.git
cd svg-2-tsx
pnpm install
pnpm run compile
```

### Step 2: Start the Optimization Server

Before using the extension, you need to start the SVG optimization server:

1. Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac) to open Command Palette
2. Type "S2T: Start SVG Optimization Server" and press Enter
3. You'll see a message confirming the server is running on port 3600

## 📖 How to Use

### Converting SVG to React Component

**Method 1: Using Clipboard (Easiest)**

1. **Copy an SVG** to your clipboard (from a file, website, or design tool)
2. **Open Command Palette**: `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
3. **Run the command**: Type "S2T: SVG to React Component" and press Enter
4. **Select icon type**: Choose from Outline, Fill, Color, or 3D
5. **Enter component name**: Use PascalCase (e.g., "HomeIcon", "UserAvatar")
6. **Done!** The component will be created in the appropriate folder

**Example:**

```
Input SVG: <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
           <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
           </svg>

Output: const HomeIcon = () => (
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
           <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
           </svg>
         );

         export default HomeIcon;
```

### Optimizing Existing SVG Components

#### Single File Optimization

**Method 1: Right-click Menu**

1. Right-click on any `.tsx` file containing SVG components
2. Select "S2T: Optimize SVG in File"
3. The extension will automatically optimize the SVG and show you the results

**Method 2: Command Palette**

1. Open Command Palette: `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
2. Type "S2T: Optimize SVG in File" and press Enter
3. Select the file you want to optimize

**What happens:**

- The extension extracts SVG content from your component
- Sends it to the optimization server
- Replaces the original SVG with the optimized version
- Shows you the size reduction achieved

#### Batch Optimization (Multiple Files)

**Method 1: Right-click on Folder**

1. Right-click on any folder containing `.tsx` files
2. Select "S2T: Optimize All SVG in Folder"
3. The extension will process all files and show progress

**Method 2: Command Palette**

1. Open Command Palette: `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
2. Type "S2T: Optimize All SVG in Folder" and press Enter
3. Select the folder to process

**What happens:**

- Scans the folder for all `.tsx` files
- Processes each file that contains SVG components
- Shows progress as it works
- Displays a summary of results

## ⚙️ Configuration

### Accessing Settings

1. Open VS Code Settings: `Ctrl+,` (Windows/Linux) or `Cmd+,` (Mac)
2. Search for "svg2tsx" to see all available options

### Key Settings

#### Icon Paths

Control where different types of icons are saved:

```json
{
  "svg2tsx.iconPaths": {
    "Outline": "src/components/icons/outline",
    "Fill": "src/components/icons/fill",
    "Color": "src/components/icons/color",
    "3D": "src/components/icons/3d"
  }
}
```

#### Color Replacement

Automatically replace specific colors with `currentColor`:

```json
{
  "svg2tsx.replaceColor": {
    "color": "#2B2B2B",
    "type": ["Fill", "Outline"]
  }
}
```

#### Auto Export

Automatically generate index files for easy importing:

```json
{
  "svg2tsx.autoExportModule": true
}
```

#### Server Port

Change the optimization server port if needed:

```json
{
  "svg2tsx.optimizationServerPort": 3600
}
```

## 🔧 Advanced Features

### SVG Optimization Server API

The extension includes a RESTful API server that you can use programmatically:

#### Optimize a Single SVG

```bash
curl -X POST http://localhost:3600/api/optimize \
  -H "Content-Type: application/json" \
  -d '{
    "svgString": "<svg>...</svg>",
    "config": {
      "multipass": true,
      "plugins": ["preset-default"]
    }
  }'
```

#### Check Server Health

```bash
curl http://localhost:3600/health
```

#### Get Available Plugins

```bash
curl http://localhost:3600/api/plugins
```

### Using the API in Your Code

```javascript
// Optimize SVG programmatically
const optimizeSvg = async (svgString) => {
  const response = await fetch("http://localhost:3600/api/optimize", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      svgString,
      config: { multipass: true, plugins: ["preset-default"] },
    }),
  });

  const result = await response.json();
  return result.data; // Optimized SVG
};
```

## 📁 File Organization

The extension automatically organizes your components:

```
src/
├── components/
│   └── icons/
│       ├── outline/
│       │   ├── HomeIcon.tsx
│       │   ├── UserIcon.tsx
│       │   └── index.ts
│       ├── fill/
│       │   ├── HomeIcon.tsx
│       │   └── index.ts
│       ├── color/
│       │   └── index.ts
│       └── 3d/
│           └── index.ts
```

### Importing Components

With auto-export enabled, you can import components like this:

```typescript
import { HomeIconOutline } from "./components/icons/outline";
import { UserIconFill } from "./components/icons/fill";
```

## 🐛 Troubleshooting

### Common Issues and Solutions

#### 1. "Server won't start"

**Problem**: Port 3600 is already in use
**Solution**:

- Change the port in settings: `"svg2tsx.optimizationServerPort": 3601`
- Or stop other services using port 3600

#### 2. "Context menu not showing"

**Problem**: Right-click menu options don't appear
**Solution**:

- Reload VS Code: `Ctrl+Shift+P` → "Developer: Reload Window"
- Make sure you're right-clicking on a folder (not a file) for folder operations
- Try using the command palette instead

#### 3. "Optimization failed"

**Problem**: SVG optimization doesn't work
**Solution**:

- Check if the server is running
- Verify your SVG is valid
- Try a simpler SVG first

#### 4. "Folder optimization error"

**Problem**: "Illegal argument: base" error
**Solution**:

- Use the command palette instead of right-click
- Make sure the folder exists and is accessible
- Try selecting the folder manually when prompted

#### 5. "Build errors"

**Problem**: Extension won't compile
**Solution**:

- Ensure Node.js 18+ is installed
- Run `pnpm install` to install dependencies
- Check TypeScript compilation: `pnpm run compile`

### Getting Help

- **GitHub Issues**: [Report bugs here](https://github.com/nnthanh01061999/svg-2-tsx/issues)
- **Discussions**: [Ask questions here](https://github.com/nnthanh01061999/svg-2-tsx/discussions)
- **VS Code Marketplace**: Check for updates

## 📊 Performance Tips

### Best Practices

1. **Use the optimization server** for best results
2. **Batch process** multiple files instead of one by one
3. **Organize by icon type** for better maintainability
4. **Use PascalCase** for component names
5. **Enable auto-export** for easier importing

### Expected Results

- **File size reduction**: 50-70% for most SVGs
- **Processing speed**: ~100ms per SVG
- **Batch processing**: Can handle hundreds of files
- **Memory usage**: Minimal impact on VS Code performance

## 🎨 Icon Type Guidelines

### When to Use Each Type

- **Outline**: Icons with stroke-based design, good for navigation
- **Fill**: Solid icons, good for primary actions
- **Color**: Multi-colored icons, good for branding
- **3D**: Three-dimensional icons, good for special features

### Example Use Cases

```typescript
// Navigation icons (Outline)
import { HomeIconOutline, SettingsIconOutline } from "./icons/outline";

// Action buttons (Fill)
import { AddIconFill, DeleteIconFill } from "./icons/fill";

// Brand icons (Color)
import { LogoIconColor } from "./icons/color";

// Feature icons (3D)
import { TrophyIcon3D } from "./icons/3d";
```

## 🔄 Workflow Examples

### Complete Workflow: Adding New Icons

1. **Get SVG**: Copy SVG from design tool or website
2. **Convert**: Use "S2T: SVG to React Component"
3. **Optimize**: Right-click file → "S2T: Optimize SVG in File"
4. **Import**: Use the generated component in your code

### Complete Workflow: Optimizing Existing Project

1. **Start server**: "S2T: Start SVG Optimization Server"
2. **Batch optimize**: Right-click project folder → "S2T: Optimize All SVG in Folder"
3. **Review results**: Check the optimization summary
4. **Stop server**: "S2T: Stop SVG Optimization Server" when done

## 📈 What's New

### Latest Features

- **Folder context menu**: Right-click folders to optimize all SVG components
- **File context menu**: Right-click individual files to optimize single components
- **Batch processing**: Process hundreds of files at once
- **Real-time optimization**: Automatic optimization during conversion
- **Progress tracking**: See optimization progress in real-time

## 🤝 Contributing

Want to help improve this extension?

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**
4. **Add tests** if applicable
5. **Commit**: `git commit -m 'Add amazing feature'`
6. **Push**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

## 📄 License

MIT License - feel free to use this extension in your projects!

## 🙏 Acknowledgments

- **SVGO**: For powerful SVG optimization
- **VS Code Team**: For the excellent extension API
- **Express.js**: For the web server framework
- **Community**: For feedback and contributions

---

**Made with ❤️ for the React/TypeScript community**

_Need help? Check out our [GitHub repository](https://github.com/nnthanh01061999/svg-2-tsx) for more information and support._
