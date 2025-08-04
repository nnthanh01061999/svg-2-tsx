export const svgToTsx = (svgString: string): string => {
  // Remove XML declarations & DOCTYPE
  svgString = svgString.replace(/<\?xml.*?\?>/g, "");
  svgString = svgString.replace(/<!DOCTYPE.*?>/g, "");

  // ReplaceAll class -> className
  svgString = svgString.replace(/\bclass=/g, "className=");

  // Convert dash-case attributes to camelCase (stroke-width -> strokeWidth)
  svgString = svgString.replace(/([a-zA-Z-]+)=/g, (match, attrName) => {
    const camelAttr = attrName.replace(
      /-([a-z])/g,
      (_: string, letter: string) => letter.toUpperCase()
    );
    return `${camelAttr}=`;
  });

  // Convert style="..." to React style={{ ... }}
  svgString = svgString.replace(/style="([^"]*)"/g, (match, styleContent) => {
    const styleObj: string[] = [];
    styleContent.split(";").forEach((style: string) => {
      const [key, value] = style.split(":").map((s) => s.trim());
      if (key && value) {
        const camelKey = key.replace(/-([a-z])/g, (_, char) =>
          char.toUpperCase()
        );
        styleObj.push(`${camelKey}: '${value}'`);
      }
    });
    return `style={{ ${styleObj.join(", ")} }}`;
  });

  // Self-close tags like <path></path> => <path />
  svgString = svgString.replace(/<(\w+)([^>]*)><\/\1>/g, "<$1$2 />");

  // Clean up newlines and multiple spaces
  svgString = svgString.replace(/[\r\n]+/g, " ").replace(/\s{2,}/g, " ");

  // Wrap in React component
  return `const Icon = () => (\n  ${svgString}\n);\n\nexport default Icon;\n`;
};

export function tsxToSvg(svgString: string): string {
  // Replace className to class
  svgString = svgString.replace(/\bclassName=/g, "class=");

  // Replace JSX attribute values {number} or {string} → "value"
  svgString = svgString.replace(/=\{(\d+)\}/g, '="$1"');
  svgString = svgString.replace(/=\{['"]([^'"]+)['"]\}/g, '="$1"');

  // Remove React Fragments if exist
  svgString = svgString.replace(/<>|<\/>/g, "");

  // Optional: Beautify indentation
  const beautifyXml = (xml: string) => {
    let formatted = "";
    const reg = /(>)(<)(\/*)/g;
    xml = xml.replace(reg, "$1\n$2$3");
    let pad = 0;
    xml.split("\n").forEach((node) => {
      let indent = 0;
      if (node.match(/.+<\/\w[^>]*>$/)) {
        indent = 0;
      } else if (node.match(/^<\/\w/)) {
        if (pad !== 0) {
          pad -= 1;
        }
      } else if (node.match(/^<\w([^>]*[^/])?>.*$/)) {
        indent = 1;
      } else {
        indent = 0;
      }
      const padding = "  ".repeat(pad);
      formatted += padding + node + "\n";
      pad += indent;
    });
    return formatted.trim();
  };

  return beautifyXml(svgString);
}

export const replaceColor = (svgString: string, color: string) => {
  return svgString.replace(new RegExp(color, "g"), "currentColor");
};
