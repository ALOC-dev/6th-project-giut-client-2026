import type { StyleProp, ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { color as palette } from '@/theme';

// 원본: assets/images/giut-mark.svg (viewBox 243 × 183)
const VIEWBOX_WIDTH = 243;
const VIEWBOX_HEIGHT = 183;

const MARK_PATH =
  'M15.2 181.2C2.8 177.1 0.7 171.0 1.1 140.5C1.6 98.8 5.9 88.7 29.6 75.1C44.0 66.7 74.5 68.1 87.6 77.8C90.7 80.1 108.3 97.7 115.3 105.5C120.5 111.3 120.5 111.3 135.4 96.4C156.0 75.8 166.2 70.7 186.3 70.8C209.5 70.9 225.6 80.5 235.8 100.3C240.6 109.6 240.9 111.7 241.5 136.7C242.2 166.9 241.8 169.7 235.5 175.9C227.4 184.1 213.1 183.3 206.1 174.3C202.8 170.2 202.4 167.1 202.4 145.6C202.4 115.4 199.7 109.4 186.3 109.4C177.6 109.4 174.6 111.4 154.6 130.7C145.0 140.1 134.7 149.6 131.8 151.8C121.9 159.3 107.3 156.2 98.9 144.8C97.7 143.1 90.9 135.6 84.0 128.2C65.9 109.0 57.0 105.4 46.4 113.0C41.2 116.7 41.2 116.7 41.2 143.1C41.2 169.4 41.2 169.4 35.4 175.0C29.3 180.8 21.4 183.2 15.2 181.2ZM40.9 50.5C23.8 40.1 22.8 18.1 39.0 5.8C59.9 -10.2 90.6 13.6 79.4 37.1C72.6 51.3 53.3 58.1 40.9 50.5ZM178.2 50.7C159.2 40.6 157.1 16.2 174.3 5.5C198.1 -9.1 225.7 18.6 209.6 40.9C200.7 53.2 189.4 56.7 178.2 50.7Z';

type GiutMarkProps = {
  width?: number; // 높이는 원본 비율에 맞춰 자동으로 정해져요
  color?: string;
  style?: StyleProp<ViewStyle>;
};

// 기웃 심볼 (벡터라서 크게 키워도 깨지지 않아요)
export function GiutMark({ width = 146, color = palette.brand, style }: GiutMarkProps) {
  const height = (width * VIEWBOX_HEIGHT) / VIEWBOX_WIDTH;

  return (
    <Svg
      width={width}
      height={height}
      viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
      style={style}
      accessibilityLabel="기웃"
    >
      <Path fill={color} fillRule="evenodd" d={MARK_PATH} />
    </Svg>
  );
}
