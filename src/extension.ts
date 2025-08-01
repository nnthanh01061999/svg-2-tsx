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
        const clipboardText = await vscode.env.clipboard.readText();

        if (!clipboardText.trim().startsWith("<svg")) {
          vscode.window.showErrorMessage("Clipboard content is not an SVG.");
          return;
        }

        const iconType = await vscode.window.showQuickPick(
          ["Outline", "Fill", "Color", "3D"],
          {
            placeHolder: "Select icon type",
            canPickMany: false,
          }
        );

        if (!iconType) {
          return;
        }

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
          return;
        }

        const config = vscode.workspace.getConfiguration("svg2tsx");
        const iconPaths = config.get<Record<string, string>>("iconPaths", {
          outline: "src/components/Common/Icon/icons/outline",
          fill: "src/components/Common/Icon/icons/fill",
          color: "src/components/Common/Icon/icons/color",
          "3d": "src/components/Common/Icon/icons/3d",
        });

        const iconPath =
          iconPaths[iconType] ||
          `src/components/Common/Icon/icons/${iconType.toLowerCase()}`;

        const replaceColor = config.get<string>("replaceColor", "#2B2B2B");

        const autoExportModule = config.get<boolean>("autoExportModule", false);

        let processedSvg = clipboardText.replace(
          new RegExp(replaceColor, "g"),
          "currentColor"
        );

        const componentCode = `const Icon = () => (\n\t\t${processedSvg}\n\t\t);\n\texport default Icon;\n`;

        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
          vscode.window.showErrorMessage("No workspace folder open");
          return;
        }

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

        const filePath = path.join(fullIconPath, `${iconName}.tsx`);
        fs.writeFileSync(filePath, componentCode);

        const fileIndexPath = path.join(fullIconPath, "index.ts");
        const fileIndexContent = fs.readFileSync(fileIndexPath, "utf8");

        if (autoExportModule) {
          const importDynamic = `import dynamic from 'next/dynamic';\n`;
          const exportIcon = `export const ${iconName}${iconType} = dynamic(() => import('./${iconName}'));\n`;
          fs.writeFileSync(
            fileIndexPath,
            fileIndexContent
              .concat(
                fileIndexContent.includes(importDynamic) ? "" : importDynamic
              )
              .concat(fileIndexContent.includes(exportIcon) ? "" : exportIcon)
          );
        }

        const document = await vscode.workspace.openTextDocument(filePath);
        await vscode.window.showTextDocument(document);
        await vscode.commands.executeCommand("workbench.action.files.save");

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
