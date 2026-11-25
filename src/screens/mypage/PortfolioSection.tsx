import { CaretRightIcon } from 'phosphor-react-native/src/icons/CaretRight';
import { ImageIcon } from 'phosphor-react-native/src/icons/Image';
import { Image, View, type StyleProp, type ViewStyle } from 'react-native';

import { Card, Press, Text } from '@/components/ui';
import { color } from '@/theme';
import { formatMonthPeriod } from '@/utils/date';

import type { PortfolioItem } from './myProfile';
import { S } from './PortfolioSection.styles';
import { SectionHeader } from './SectionHeader';

const CAPTION_MAX_LINES = 2;
const HIDDEN_ORDER = Number.MAX_SAFE_INTEGER;

type PortfolioSectionProps = {
  items: PortfolioItem[];
  count: number;
  emptyMessage: string;
  onPressEdit?: () => void; // 없으면 편집 버튼 숨김
  onPressItem: (item: PortfolioItem) => void;
};

export function PortfolioSection({
  items,
  count,
  emptyMessage,
  onPressEdit,
  onPressItem,
}: PortfolioSectionProps) {
  // 공개 순서대로, 숨긴 포트폴리오는 맨 뒤
  const sorted = [...items].sort(
    (a, b) => (a.showcaseOrder ?? HIDDEN_ORDER) - (b.showcaseOrder ?? HIDDEN_ORDER),
  );
  const featured = sorted.find((item) => item.representative);
  const others = sorted.filter((item) => item !== featured);

  return (
    <View style={S.section}>
      <SectionHeader title="포트폴리오" count={count} onPressEdit={onPressEdit} />

      {featured && <FeaturedCard item={featured} onPress={() => onPressItem(featured)} />}

      {others.length > 0 && (
        <Card corner="2xl" elevation="raised" padding={0} style={S.card}>
          {others.map((item, index) => (
            <PortfolioRow
              key={item.id}
              item={item}
              divided={index > 0}
              onPress={() => onPressItem(item)}
            />
          ))}
        </Card>
      )}

      {items.length === 0 && (
        <View style={S.empty}>
          <Text color="textMuted" style={S.emptyText}>
            {emptyMessage}
          </Text>
        </View>
      )}
    </View>
  );
}

type ItemProps = {
  item: PortfolioItem;
  onPress: () => void;
};

function FeaturedCard({ item, onPress }: ItemProps) {
  return (
    <Card
      corner="2xl"
      elevation="raised"
      padding={0}
      onPress={onPress}
      accessibilityLabel={`대표 포트폴리오, ${item.title}, ${getMeta(item)}`}
      style={S.card}
    >
      <PortfolioImage uri={item.imageUrl} iconSize={28} style={S.cover} />

      <View style={S.featuredBody}>
        <View style={S.metaRow}>
          <View style={S.badge}>
            <Text variant="badge" color="surface">
              대표
            </Text>
          </View>
          <Text variant="caption" color="textMuted" numberOfLines={1} style={S.meta}>
            {getMeta(item)}
          </Text>
        </View>
        <Text variant="titleSm" numberOfLines={1}>
          {item.title}
        </Text>
        <Text color="textMuted" numberOfLines={CAPTION_MAX_LINES}>
          {item.caption}
        </Text>
      </View>
    </Card>
  );
}

function PortfolioRow({ item, divided, onPress }: ItemProps & { divided: boolean }) {
  return (
    <Press
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${item.title}, ${getMeta(item)}`}
      style={[S.row, divided && S.rowDivider]}
    >
      <PortfolioImage uri={item.imageUrl} iconSize={20} style={S.thumbnail} />

      <View style={S.rowTexts}>
        <Text variant="label" numberOfLines={1}>
          {item.title}
        </Text>
        <Text variant="caption" color="textMuted" numberOfLines={1}>
          {getMeta(item)}
        </Text>
      </View>

      <CaretRightIcon size={16} color={color.textDisabled} />
    </Press>
  );
}

type PortfolioImageProps = {
  uri: string | null;
  iconSize: number;
  style: StyleProp<ViewStyle>;
};

function PortfolioImage({ uri, iconSize, style }: PortfolioImageProps) {
  return (
    <View style={[S.placeholder, style]}>
      {uri ? (
        <Image source={{ uri }} accessible={false} resizeMode="cover" style={S.image} />
      ) : (
        <ImageIcon size={iconSize} color={color.textFaint} />
      )}
    </View>
  );
}

// '2025.05 – 2025.07 · 프론트엔드'
function getMeta(item: PortfolioItem) {
  const period = formatMonthPeriod(item.projectStartDate, item.projectEndDate);
  const roles = item.roles.map(({ name }) => name).join(', ');
  return [period, roles].filter(Boolean).join(' · ');
}
