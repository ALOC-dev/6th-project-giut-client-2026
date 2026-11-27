import { Image } from 'expo-image';
import { ImageIcon } from 'phosphor-react-native';
import { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  View,
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';

import { Text } from '@/components/ui';
import { color } from '@/theme';

import { S } from './PortfolioImages.styles';

type PortfolioImagesProps = {
  imageUrls: string[];
};

// 옆으로 넘겨 보는 프로젝트 이미지
export function PortfolioImages({ imageUrls }: PortfolioImagesProps) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const { width, height } = size;

  const listRef = useRef<FlatList<string>>(null);
  const [page, setPage] = useState(0);

  const count = imageUrls.length;

  // 너비가 바뀌면(화면 회전 등) 보던 이미지 위치로 다시 맞춰요
  useEffect(() => {
    listRef.current?.scrollToOffset({ offset: page * width, animated: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width]);

  const handleLayout = (e: LayoutChangeEvent) => {
    const { layout } = e.nativeEvent;
    setSize({ width: layout.width, height: layout.height });
  };

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const next = Math.round(e.nativeEvent.contentOffset.x / width);
    setPage(Math.min(Math.max(next, 0), count - 1));
  };

  return (
    <View style={S.frame} onLayout={handleLayout}>
      {count > 0 && width > 0 ? (
        <FlatList
          ref={listRef}
          data={imageUrls}
          keyExtractor={(_, index) => String(index)}
          renderItem={({ item, index }) => (
            <View style={{ width, height }}>
              <ImagePlaceholder />
              <Image
                source={item}
                style={S.image}
                contentFit="cover"
                accessible
                accessibilityLabel={`프로젝트 이미지 ${count}장 중 ${index + 1}번째`}
              />
            </View>
          )}
          getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
          horizontal
          pagingEnabled
          bounces={false}
          showsHorizontalScrollIndicator={false}
          scrollEnabled={count > 1}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          initialNumToRender={1}
          windowSize={3}
        />
      ) : (
        <ImagePlaceholder />
      )}

      {count > 1 && (
        <View
          style={S.counter}
          pointerEvents="none"
          importantForAccessibility="no-hide-descendants"
          accessibilityElementsHidden
        >
          <Text variant="meta" color="surface">
            {page + 1} / {count}
          </Text>
        </View>
      )}
    </View>
  );
}

// 이미지가 없거나 불러오는 중일 때 보이는 배경
function ImagePlaceholder() {
  return (
    <View style={S.placeholder}>
      <ImageIcon size={32} color={color.textFaint} />
    </View>
  );
}
