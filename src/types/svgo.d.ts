declare module "svgo" {
  export interface SVGOConfig {
    multipass?: boolean;
    plugins?: any[];
    path?: string;
    [key: string]: any;
  }

  export interface SVGOptimizeResult {
    data: string;
    info?: {
      width?: number;
      height?: number;
    };
  }

  export function optimize(
    svgString: string,
    config?: SVGOConfig
  ): SVGOptimizeResult;
}
