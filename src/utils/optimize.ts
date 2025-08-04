import { SVGOConfig } from "svgo";
import * as vscode from "vscode";

export type OptimizeSvgResult = {
  success: boolean;
  data?: string;
  error?: string;
  originalSize?: number;
  optimizedSize?: number;
  reductionPercentage?: number;
};

export const optimizeSvg = async ({
  svgString,
  url,
  config,
}: {
  svgString: string;
  url: string;
  config: SVGOConfig;
}) => {
  let optimizedSvg = svgString;
  let optionResult: OptimizeSvgResult = {
    success: false,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        svgString,
        config,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = (await response.json()) as {
      success: boolean;
      data?: string;
      error?: string;
    };

    if (data.success && data.data) {
      optimizedSvg = data.data;
      optionResult = data;
    } else {
      vscode.window.showErrorMessage(
        `SVG optimization failed:\n${JSON.stringify(data.error)}`
      );
    }
  } catch (error) {
    vscode.window.showErrorMessage(
      `Failed to optimize SVG:\n${JSON.stringify(error)}`
    );
  }

  return {
    optimizedSvg,
    data: optionResult,
  };
};

export const validateOptimizationServer = async (isRunning?: boolean) => {
  if (isRunning) {
    return false;
  } else {
    await vscode.window
      .showErrorMessage(
        "SVG Optimization Server is not running. Please start it first.",
        "Start SVG Optimization Server"
      )
      .then(() => {
        vscode.commands.executeCommand("svg-2-tsx.startOptimizationServer");
      });
    return true;
  }
};
