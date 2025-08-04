import * as vscode from "vscode";

export const upsertDictionary = (targetPath: string) => {
  const fs = require("fs");
  try {
    if (!fs.existsSync(targetPath)) {
      fs.mkdirSync(targetPath, { recursive: true });
    }
  } catch (err: any) {
    vscode.window.showErrorMessage(
      `Failed to create directory:\n${err.message}`
    );
  }
};

export const saveTsxFile = (filePath: string, content: string) => {
  const fs = require("fs");
  try {
    fs.writeFileSync(filePath, content);
  } catch (err: any) {
    vscode.window.showErrorMessage(`Failed to save TSX file:\n${err.message}`);
  }
};

export const exportModule = (
  dirPath: string,
  iconName: string,
  iconType: string
) => {
  const fs = require("fs");
  const path = require("path");
  const fileIndexPath = path.join(dirPath, "index.ts");
  const fileIndexContent = fs.readFileSync(fileIndexPath, "utf8");

  const importDynamic = `import dynamic from 'next/dynamic';\n`;
  const exportIcon = `export const ${iconName}${iconType} = dynamic(() => import('./${iconName}'));\n`;
  fs.writeFileSync(
    fileIndexPath,
    fileIndexContent
      .concat(fileIndexContent.includes(importDynamic) ? "" : importDynamic)
      .concat(fileIndexContent.includes(exportIcon) ? "" : exportIcon)
  );
};
