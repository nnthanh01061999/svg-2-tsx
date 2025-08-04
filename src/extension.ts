// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { SVGOptimizationServer } from "./svgOptimizationServer";
import {
  readClipboard,
  showFilePicker,
  showFolderPicker,
  showNameInput,
  showTypeQuickPick,
  warningNoActiveEditor,
} from "./utils/ui";
import { getConfig } from "./utils/config";
import { optimizeSvg, validateOptimizationServer } from "./utils/optimize";
import { replaceColor, svgToTsx, tsxToSvg } from "./utils/svg";
import { exportModule, saveTsxFile, upsertDictionary } from "./utils/file";
import { SVGOConfig } from "svgo";

let optimizationServer: SVGOptimizationServer | null = null;

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  const svgToReactComponentCommand = vscode.commands.registerCommand(
    "svg-2-tsx.svgToReactComponent",
    async () => {
      if (!warningNoActiveEditor()) {
        return;
      }

      try {
        const clipboardText = await readClipboard();

        if (!clipboardText.trim().startsWith("<svg")) {
          vscode.window.showErrorMessage("Clipboard content is not an SVG.");
          return;
        }

        const iconType = await showTypeQuickPick();

        if (!iconType) {
          vscode.window.showInformationMessage("No icon type selected.");
          return;
        }

        const iconName = await showNameInput();

        if (!iconName) {
          vscode.window.showInformationMessage("No icon name entered.");
          return;
        }

        const iconPaths = getConfig("svg2tsx.iconPaths");

        const iconPath =
          iconPaths[iconType as keyof typeof iconPaths] ||
          `src/components/Common/Icon/icons/${iconType.toLowerCase()}`;

        const configReplaceColor = getConfig("svg2tsx.replaceColor");

        const autoExportModule = getConfig("svg2tsx.autoExportModule");

        const svgOptimize = getConfig("svg2tsx.svgOptimize");
        const svgOptimizeConfig = getConfig("svg2tsx.svgOptimizeConfig");

        let processedSvg = clipboardText;

        if (svgOptimize.enabled) {
          processedSvg = (
            await optimizeSvg({
              svgString: clipboardText,
              url: svgOptimize.url,
              config: svgOptimizeConfig,
            })
          ).optimizedSvg;
        }

        if (configReplaceColor.type.includes(iconType)) {
          processedSvg = replaceColor(processedSvg, configReplaceColor.color);
        }

        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
          vscode.window.showErrorMessage("No workspace folder open");
          return;
        }

        const path = require("path");
        const fullIconPath = path.join(
          workspaceFolders[0].uri.fsPath,
          iconPath
        );

        upsertDictionary(fullIconPath);

        const filePath = path.join(fullIconPath, `${iconName}.tsx`);

        const componentCode = svgToTsx(processedSvg);

        saveTsxFile(filePath, componentCode);

        if (autoExportModule) {
          exportModule(fullIconPath, iconName, iconType);
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

  // Start optimization server command
  const startOptimizationServerCommand = vscode.commands.registerCommand(
    "svg-2-tsx.startOptimizationServer",
    async () => {
      try {
        if (optimizationServer && optimizationServer.isRunning()) {
          vscode.window.showInformationMessage(
            `SVG Optimization Server is already running on port ${optimizationServer.getPort()}`
          );
          return;
        }

        const port = getConfig("svg2tsx.optimizationServerPort");

        optimizationServer = new SVGOptimizationServer(port);
        await optimizationServer.start();

        vscode.window.showInformationMessage(
          `SVG Optimization Server started successfully on port ${port}:\nServer running on: http://localhost:${port}\nAvailable endpoints:\n- POST /api/optimize - Optimize single SVG`
        );
      } catch (error) {
        vscode.window.showErrorMessage(
          `Failed to start SVG Optimization Server: ${(error as Error).message}`
        );
      }
    }
  );

  // Stop optimization server command
  const stopOptimizationServerCommand = vscode.commands.registerCommand(
    "svg-2-tsx.stopOptimizationServer",
    async () => {
      try {
        if (!optimizationServer || !optimizationServer.isRunning()) {
          vscode.window.showInformationMessage(
            "SVG Optimization Server is not running"
          );
          return;
        }

        await optimizationServer.stop();
        optimizationServer = null;

        vscode.window.showInformationMessage(
          "SVG Optimization Server stopped successfully"
        );
      } catch (error) {
        vscode.window.showErrorMessage(
          `Failed to stop SVG Optimization Server: ${(error as Error).message}`
        );
      }
    }
  );

  // Optimize all SVG components in folder command
  const optimizeAllSvgInFolderCommand = vscode.commands.registerCommand(
    "svg-2-tsx.optimizeAllSvgInFolder",
    async (folderUri?: vscode.Uri) => {
      try {
        if (!folderUri) {
          const selectedFolder = await showFolderPicker();
          if (!selectedFolder) {
            return;
          }
          folderUri = selectedFolder;
        }

        try {
          const stat = await vscode.workspace.fs.stat(folderUri);
          if (stat.type !== vscode.FileType.Directory) {
            vscode.window.showErrorMessage(
              "Please select a folder, not a file."
            );
            return;
          }
        } catch (error) {
          vscode.window.showErrorMessage(
            `Invalid folder path: ${folderUri.fsPath}`
          );
          return;
        }

        const config = vscode.workspace.getConfiguration("svg2tsx");
        const svgOptimize = getConfig("svg2tsx.svgOptimize");

        const svgOptimizeConfig = config.get<SVGOConfig>(
          "svgOptimizeConfig",
          {}
        );

        if (!svgOptimize.enabled) {
          vscode.window.showErrorMessage(
            "SVG optimization is disabled. Please enable it in settings."
          );
          return;
        }

        if (!optimizationServer?.isRunning()) {
          await vscode.window
            .showErrorMessage(
              "SVG Optimization Server is not running. Please start it first.",
              "Start SVG Optimization Server"
            )
            .then(() => {
              vscode.commands.executeCommand(
                "svg-2-tsx.startOptimizationServer"
              );
            });
          return;
        }

        await vscode.window.withProgress(
          {
            location: vscode.ProgressLocation.Notification,
            title: "Optimizing SVG components in folder...",
            cancellable: false,
          },
          async (progress) => {
            // Find all TSX files in the folder
            const tsxFiles = await vscode.workspace.findFiles(
              new vscode.RelativePattern(folderUri!, "**/*.tsx")
            );

            if (tsxFiles.length === 0) {
              vscode.window.showInformationMessage(
                "No TSX files found in the selected folder."
              );
              return;
            }

            let processedCount = 0;
            let optimizedCount = 0;
            let errorCount = 0;

            progress.report({
              message: `Found ${tsxFiles.length} TSX files. Processing...`,
            });

            for (const fileUri of tsxFiles) {
              try {
                progress.report({
                  message: `Processing ${fileUri.fsPath.split("/").pop()}...`,
                  increment: 100 / tsxFiles.length,
                });

                const document = await vscode.workspace.openTextDocument(
                  fileUri
                );
                const content = document.getText();

                const svgMatch = content.match(/<svg[^>]*>[\s\S]*?<\/svg>/i);
                if (!svgMatch) {
                  continue;
                }

                const originalSvg = svgMatch[0];
                processedCount++;

                const { data } = await optimizeSvg({
                  svgString: tsxToSvg(originalSvg),
                  url: svgOptimize.url,
                  config: svgOptimizeConfig,
                });

                if (data.success && data.data) {
                  const optimizedContent = content.replace(
                    originalSvg,
                    data.data
                  );

                  const edit = new vscode.WorkspaceEdit();
                  edit.replace(
                    fileUri,
                    new vscode.Range(
                      new vscode.Position(0, 0),
                      new vscode.Position(document.lineCount, 0)
                    ),
                    optimizedContent
                  );

                  await vscode.workspace.applyEdit(edit);
                  optimizedCount++;
                } else {
                  errorCount++;
                  vscode.window.showWarningMessage(
                    `Failed to optimize SVG in ${fileUri.fsPath}:` +
                      JSON.stringify(data.error)
                  );
                }
              } catch (error) {
                errorCount++;
                vscode.window.showWarningMessage(
                  `Error processing ${fileUri.fsPath}:` + JSON.stringify(error)
                );
              }
            }

            const message = `Processed: ${processedCount} files\nOptimized: ${optimizedCount} files\nErrors: ${errorCount} files`;

            if (errorCount > 0) {
              vscode.window.showWarningMessage(
                "Optimization complete!",
                message
              );
            } else {
              vscode.window.showInformationMessage(message);
            }
          }
        );
      } catch (error) {
        vscode.window.showErrorMessage(
          `Failed to optimize SVG components:\n${JSON.stringify(error)}`
        );
      }
    }
  );

  // Optimize single TSX file command
  const optimizeSingleTsxFileCommand = vscode.commands.registerCommand(
    "svg-2-tsx.optimizeSingleTsxFile",
    async (fileUri?: vscode.Uri) => {
      try {
        if (!fileUri) {
          const selectUri = await showFilePicker();
          if (!selectUri) {
            return;
          }
          fileUri = selectUri;
        }

        if (!fileUri.fsPath.endsWith(".tsx")) {
          vscode.window.showErrorMessage(
            "Please select a .tsx file, not another file type."
          );
          return;
        }

        if (await validateOptimizationServer(optimizationServer?.isRunning())) {
          return;
        }

        try {
          const stat = await vscode.workspace.fs.stat(fileUri);
          if (stat.type !== vscode.FileType.File) {
            vscode.window.showErrorMessage(
              "Please select a file, not a folder."
            );
            return;
          }
        } catch (error) {
          vscode.window.showErrorMessage(
            `Invalid file path: ${fileUri.fsPath}`
          );
          return;
        }

        const config = vscode.workspace.getConfiguration("svg2tsx");
        const svgOptimize = config.get<{ url: string; enabled: boolean }>(
          "svgOptimizeUrl",
          {
            url: "http://localhost:3600/api/optimize",
            enabled: true,
          }
        );

        if (!svgOptimize.enabled) {
          vscode.window.showErrorMessage(
            "SVG optimization is disabled. Please enable it in settings."
          );
          return;
        }

        await vscode.window.withProgress(
          {
            location: vscode.ProgressLocation.Notification,
            title: "Optimizing SVG in TSX file...",
            cancellable: false,
          },
          async (progress) => {
            progress.report({
              message: `Processing ${fileUri!.fsPath.split("/").pop()}...`,
            });

            const document = await vscode.workspace.openTextDocument(fileUri!);
            const content = document.getText();

            // Extract SVG content from TSX component
            const svgMatch = content.match(/<svg[^>]*>[\s\S]*?<\/svg>/i);
            if (!svgMatch) {
              vscode.window.showWarningMessage(
                "No SVG content found in the selected TSX file."
              );
              return;
            }

            const originalSvg = svgMatch[0];
            const originalSize = originalSvg.length;

            const svgOptimizeConfig = config.get<SVGOConfig>(
              "svgOptimizeConfig",
              {}
            );

            const { data } = await optimizeSvg({
              svgString: tsxToSvg(originalSvg),
              url: svgOptimize.url,
              config: svgOptimizeConfig,
            });

            if (data.success && data.data) {
              const optimizedContent = content.replace(originalSvg, data.data);

              const edit = new vscode.WorkspaceEdit();
              edit.replace(
                fileUri!,
                new vscode.Range(
                  new vscode.Position(0, 0),
                  new vscode.Position(document.lineCount, 0)
                ),
                optimizedContent
              );

              await vscode.workspace.applyEdit(edit);

              const optimizedSize = data.data.length;
              const reductionPercentage = (
                ((originalSize - optimizedSize) / originalSize) *
                100
              ).toFixed(2);

              const message = `File: ${fileUri!.fsPath
                .split("/")
                .pop()}\nOriginal size: ${originalSize} bytes\nOptimized size: ${optimizedSize} bytes\nReduction: ${reductionPercentage}%`;

              vscode.window.showInformationMessage(
                `SVG optimization complete!\n${message}\n${tsxToSvg(
                  originalSvg
                )}pnp`
              );
            } else {
              vscode.window.showErrorMessage(
                `Failed to optimize SVG:\n${
                  data.error || "Unknown error"
                } ${tsxToSvg(originalSvg)}`
              );
            }
          }
        );
      } catch (error) {
        vscode.window.showErrorMessage(
          `Failed to optimize SVG in file:\n${(error as Error).message}`
        );
      }
    }
  );

  context.subscriptions.push(
    svgToReactComponentCommand,
    startOptimizationServerCommand,
    stopOptimizationServerCommand,
    optimizeAllSvgInFolderCommand,
    optimizeSingleTsxFileCommand
  );
}

// This method is called when your extension is deactivated
export function deactivate() {
  if (optimizationServer && optimizationServer.isRunning()) {
    optimizationServer.stop().catch((error) => {
      vscode.window.showWarningMessage(
        `Error stopping optimization server: ${error}`
      );
    });
  }
}
