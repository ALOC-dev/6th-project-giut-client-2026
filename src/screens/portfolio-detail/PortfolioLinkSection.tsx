import {
  ArrowUpRightIcon,
  CodeIcon,
  FileTextIcon,
  LinkSimpleIcon,
  MonitorPlayIcon,
  type Icon,
} from 'phosphor-react-native';
import { StyleSheet, View } from 'react-native';

import { Card, Press, Text } from '@/components/ui';
import type { PortfolioLink } from '@/screens/mypage';
import { color, radius, space } from '@/theme';
import { openExternalUrl } from '@/utils/link';

import { DetailSection } from './DetailSection';

type SiteKind = 'code' | 'video' | 'document' | 'etc';

const SITE_ICON: Record<SiteKind, Icon> = {
  code: CodeIcon,
  video: MonitorPlayIcon,
  document: FileTextIcon,
  etc: LinkSimpleIcon,
};

const SITE_HOSTS: { kind: SiteKind; hosts: string[] }[] = [
  { kind: 'code', hosts: ['github.com', 'gitlab.com'] },
  { kind: 'video', hosts: ['youtube.com', 'youtu.be', 'vimeo.com'] },
  {
    kind: 'document',
    hosts: ['drive.google.com', 'docs.google.com', 'notion.so', 'notion.site'],
  },
];

type PortfolioLinkSectionProps = {
  links: PortfolioLink[];
};

export function PortfolioLinkSection({ links }: PortfolioLinkSectionProps) {
  if (links.length === 0) return null;

  return (
    <DetailSection title="링크">
      <Card corner="2xl" elevation="raised" padding={0} style={S.card}>
        {links.map((link, index) => (
          <LinkRow key={index} link={link} divided={index > 0} />
        ))}
      </Card>
    </DetailSection>
  );
}

function LinkRow({ link, divided }: { link: PortfolioLink; divided: boolean }) {
  const SiteIcon = SITE_ICON[getSiteKind(link.url)];

  return (
    <Press
      onPress={() => openExternalUrl(link.url)}
      accessibilityRole="link"
      accessibilityLabel={link.title}
      style={[S.row, divided && S.divider]}
    >
      <View style={S.iconBox}>
        <SiteIcon size={20} color={color.brand} />
      </View>

      <View style={S.texts}>
        <Text variant="label" numberOfLines={1}>
          {link.title}
        </Text>
        <Text variant="caption" color="textMuted" numberOfLines={1}>
          {getDisplayUrl(link.url)}
        </Text>
      </View>

      <ArrowUpRightIcon size={16} color={color.textFaint} />
    </Press>
  );
}

// 'https://www.github.com/giut/' → 'github.com/giut'
function getDisplayUrl(url: string) {
  return url.replace(/^https?:\/\/(www\.)?/i, '').replace(/\/$/, '');
}

function getSiteKind(url: string): SiteKind {
  const host = getDisplayUrl(url).split(/[/?#]/)[0].toLowerCase();
  const site = SITE_HOSTS.find(({ hosts }) =>
    // 'giut.notion.site'처럼 앞에 다른 이름이 붙은 주소도 포함
    hosts.some((name) => host === name || host.endsWith(`.${name}`)),
  );
  return site?.kind ?? 'etc';
}

const ICON_BOX = 40;

const S = StyleSheet.create({
  // 카드는 글자보다 넓게, 이미지와 같은 너비로
  card: {
    marginHorizontal: -space[1],
    borderWidth: 1,
    borderColor: color.lineSoft,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
    paddingVertical: space[3],
    marginHorizontal: space[4],
  },
  divider: {
    borderTopWidth: 1,
    borderTopColor: color.lineSoft,
  },
  iconBox: {
    width: ICON_BOX,
    height: ICON_BOX,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.lg,
    backgroundColor: color.brandSoft,
  },
  texts: {
    flex: 1,
  },
});
