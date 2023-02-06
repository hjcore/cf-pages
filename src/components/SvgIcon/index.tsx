const fileContext = require.context('/public', true, /\.svg$/);

interface SvgIconProps {
  path: string; // icon path
  color?: string; // icon color
  width?: string; // icon width
  height?: string; // icon height
}

/**
 * pitfall: if the color property was not worked when you setted
 * you must check the fill attribute of raw svg files download from UI design doc,
 * if you find the "fill" attribute in the code of svg files, remove it, because the
 * "fill" attribute in the svg code has the highest priority
 */
export default function SvgIcon({ color, path, width, height }: SvgIconProps) {
  const MatchSvg = fileContext(`public/${path}.svg`).default;
  return <MatchSvg width={width} height={height} fill={color} />;
}
