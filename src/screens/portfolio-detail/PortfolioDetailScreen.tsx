import { ScrollView, StyleSheet, View } from 'react-native';

import { DetailHeader } from '@/components/header/DetailHeader';
import { Text } from '@/components/ui';
import type { PortfolioItem } from '@/screens/mypage';
import { color, space } from '@/theme';

import { PortfolioDescriptionSection } from './PortfolioDescriptionSection';
import { PortfolioImages } from './PortfolioImages';
import { PortfolioInfoSection } from './PortfolioInfoSection';
import { PortfolioSkillSection } from './PortfolioSkillSection';

type PortfolioDetailScreenProps = {
  item: PortfolioItem;
  onPressEdit?: () => void; // 없으면 편집 버튼 숨김
};

export function PortfolioDetailScreen({ item, onPressEdit }: PortfolioDetailScreenProps) {
  return (
    <View style={S.screen}>
      <DetailHeader background="surface" onPressEdit={onPressEdit} />

      <ScrollView contentContainerStyle={S.content}>
        <PortfolioImages imageUrls={item.imageUrls} />
        <PortfolioInfoSection item={item} />
        <PortfolioSkillSection skills={item.skillTags} />
        <PortfolioDescriptionSection description={item.markdownContent} />
      </ScrollView>
    </View>
  );
}

export function PortfolioNotFoundScreen() {
  return (
    <View style={S.screen}>
      <DetailHeader background="surface" />
      <View style={S.notFound}>
        <Text variant="titleLg">존재하지 않는 포트폴리오예요.</Text>
      </View>
    </View>
  );
}

const S = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: color.surface,
  },
  content: {
    paddingTop: space[2],
    paddingBottom: space[8],
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
