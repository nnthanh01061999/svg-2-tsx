export const defaultConfig = {
  "svg2tsx.iconPaths": {
    Outline: "src/components/Common/Icon/icons/outline",
    Fill: "src/components/Common/Icon/icons/fill",
    Color: "src/components/Common/Icon/icons/color",
    "3D": "src/components/Common/Icon/icons/3d",
  },
  "svg2tsx.replaceColor": {
    color: "#2B2B2B",
    type: ["Fill", "Outline"],
  },
  "svg2tsx.autoExportModule": true,
  "svg2tsx.svgOptimize": {
    url: "http://localhost:3600/api/optimize",
    enabled: true,
  },
  "svg2tsx.optimizationServerPort": 3600,
  "svg2tsx.svgOptimizeConfig": {
    multipass: true,
    plugins: [
      {
        name: "preset-default",
        params: {
          overrides: {
            removeViewBox: false,
            removeTitle: false,
            removeDesc: false,
            removeDoctype: true,
            removeXMLProcInst: true,
            removeComments: true,
            removeMetadata: true,
            removeEditorsNSData: true,
            cleanupAttrs: true,
            mergeStyles: true,
            inlineStyles: true,
            minifyStyles: true,
            cleanupIDs: true,
            removeUselessDefs: true,
            convertPathData: true,
            convertColors: true,
            removeUnknownsAndDefaults: true,
            removeUselessStrokeAndFill: true,
            removeEnableBackground: true,
            removeHiddenElems: true,
            removeEmptyText: true,
            convertShapeToPath: true,
            moveElemsAttrsToGroup: true,
            moveGroupAttrsToElems: true,
            collapseGroups: true,
            convertEllipseToCircle: true,
            convertTransform: true,
            removeEmptyAttrs: true,
            removeEmptyContainers: true,
            mergePaths: true,
            cleanupNumericValues: true,
            sortAttrs: true,
            sortDefsChildren: true,
            removeDimensions: true,
          },
        },
      },
    ],
  },
};

export type KeyConfig = keyof typeof defaultConfig;
export type ValueConfig<K extends KeyConfig> = (typeof defaultConfig)[K];
