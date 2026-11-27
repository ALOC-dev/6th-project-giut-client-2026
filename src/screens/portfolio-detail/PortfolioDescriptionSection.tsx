import { ExpandableText } from '@/components/ui';

import { DetailSection } from './DetailSection';

const MAX_LINES = 5;

type PortfolioDescriptionSectionProps = {
  description: string;
};

// 서식 없이 줄바꿈만 그대로 보여줘요
export function PortfolioDescriptionSection({ description }: PortfolioDescriptionSectionProps) {
  const trimmed = description.trim();
  if (!trimmed) return null;

  return (
    <DetailSection title="프로젝트 설명">
      <ExpandableText maxLines={MAX_LINES} label="프로젝트 설명">
        {trimmed}
      </ExpandableText>
    </DetailSection>
  );
}
