// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  const svgToReactComponentCommand = vscode.commands.registerCommand(
    "svg-2-tsx.svgToReactComponent",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showInformationMessage("No active text editor.");
        return;
      }

      try {
        // Get clipboard text
        const clipboardText = await vscode.env.clipboard.readText();

        // Check if the clipboard content is an SVG
        if (!clipboardText.trim().startsWith("<svg")) {
          vscode.window.showErrorMessage("Clipboard content is not an SVG.");
          return;
        }

        // Get icon type from user
        const iconType = await vscode.window.showQuickPick(
          ["outline", "fill", "color", "3d"],
          {
            placeHolder: "Select icon type",
            canPickMany: false,
          }
        );

        if (!iconType) {
          return; // User cancelled
        }

        // Get icon name from user
        const iconName = await vscode.window.showInputBox({
          placeHolder: "Enter icon name (PascalCase)",
          prompt: "Name for the icon component",
          validateInput: (value) => {
            if (!value) {
              return "Name is required";
            }
            if (!/^[A-Z][a-zA-Z0-9]*$/.test(value)) {
              return "Name must be in PascalCase";
            }
            return null;
          },
        });

        if (!iconName) {
          return; // User cancelled
        }

        // Get configuration
        const config = vscode.workspace.getConfiguration("svg2tsx");
        const iconPaths = config.get<Record<string, string>>("iconPaths", {
          outline: "src/components/Common/Icon/icons/outline",
          fill: "src/components/Common/Icon/icons/fill",
          color: "src/components/Common/Icon/icons/color",
          "3d": "src/components/Common/Icon/icons/3d",
        });

        const iconPath =
          iconPaths[iconType] || `src/components/Common/Icon/icons/${iconType}`;

        const replaceColor = config.get<string>("replaceColor", "#2B2B2B");

        // Process the SVG
        let processedSvg = clipboardText.replace(
          new RegExp(replaceColor, "g"),
          "currentColor"
        ); // Replace color with currentColor

        // Create React component
        const componentCode = `
	const Icon = () => (
	  ${processedSvg}
	);
	export default Icon;
	`;

        // Get workspace
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
          vscode.window.showErrorMessage("No workspace folder open");
          return;
        }

        // Create directory if it doesn't exist
        const fs = require("fs");
        const path = require("path");
        const fullIconPath = path.join(
          workspaceFolders[0].uri.fsPath,
          iconPath
        );

        try {
          if (!fs.existsSync(fullIconPath)) {
            fs.mkdirSync(fullIconPath, { recursive: true });
          }
        } catch (err: any) {
          vscode.window.showErrorMessage(
            `Failed to create directory: ${err.message}`
          );
          return;
        }

        // Create the file
        const filePath = path.join(fullIconPath, `${iconName}.tsx`);
        fs.writeFileSync(filePath, componentCode);

        const fileIndexPath = path.join(fullIconPath, "index.tsx");
        fs.writeFileSync(
          fileIndexPath,
          fs
            .readFileSync(fileIndexPath, "utf8")
            .concat(
              `export const ${iconName}${
                iconType.charAt(0).toUpperCase() + iconType.slice(1)
              } = dynamic(() => import('./${iconName}'));\n`
            )
        );

        // Open the file
        const document = await vscode.workspace.openTextDocument(filePath);
        await vscode.window.showTextDocument(document);

        vscode.window.showInformationMessage(
          `SVG converted to React component and saved as ${iconName}
			  .tsx`
        );
      } catch (error) {
        vscode.window.showErrorMessage(
          `Failed to convert SVG to React component: ${
            (error as Error).message
          }`
        );
      }
    }
  );

  context.subscriptions.push(svgToReactComponentCommand);
}

// This method is called when your extension is deactivated
export function deactivate() {}
