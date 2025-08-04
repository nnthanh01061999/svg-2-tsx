import * as vscode from "vscode";

export const readClipboard = async () => {
  return await vscode.env.clipboard.readText();
};

export const warningNoActiveEditor = () => {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showInformationMessage("No active text editor.");
    return false;
  }
  return true;
};

export const showTypeQuickPick = async (
  options: string[] = ["Outline", "Fill", "Color", "3D"]
): Promise<string | undefined> => {
  return await vscode.window.showQuickPick(options, {
    placeHolder: "Select icon type",
    canPickMany: false,
  });
};

export const showNameInput = async (): Promise<string | undefined> => {
  return await vscode.window.showInputBox({
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
};

export const showFilePicker = async () => {
  const selectedFiles = await vscode.window.showOpenDialog({
    canSelectFiles: true,
    canSelectFolders: false,
    canSelectMany: false,
    openLabel: "Select TSX File to Optimize",
    filters: {
      "TypeScript React": ["tsx"],
    },
  });

  if (!selectedFiles || selectedFiles.length === 0) {
    return "";
  }

  return selectedFiles[0];
};

export const showFolderPicker = async () => {
  const selectedFolders = await vscode.window.showOpenDialog({
    canSelectFiles: false,
    canSelectFolders: true,
    canSelectMany: false,
    openLabel: "Select Folder to Optimize",
  });
  return selectedFolders?.[0];
};
