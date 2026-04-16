export default function CustomBar({ x, y, width, height, fill }) {
  return <rect x={x} y={y} width={width} height={height} fill={fill} rx={6} />;
}