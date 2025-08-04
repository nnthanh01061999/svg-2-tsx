import * as vscode from "vscode";
import { defaultConfig, KeyConfig, ValueConfig } from "../default-config";

export const getConfig = <K extends KeyConfig>(key: K): ValueConfig<K> => {
  const config = vscode.workspace.getConfiguration("svg2tsx");
  return config.get<ValueConfig<K>>(key, defaultConfig[key]);
};
