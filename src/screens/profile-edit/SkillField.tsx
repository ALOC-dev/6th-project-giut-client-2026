import { CaretDownIcon, CaretUpIcon, CheckIcon, PlusIcon } from 'phosphor-react-native';
import { useState } from 'react';
import { TextInput, View } from 'react-native';

import { Press, Text } from '@/components/ui';
import type { ProfileTag } from '@/screens/mypage';
import { color } from '@/theme';

import { S } from './SkillField.styles';
import { MAX_SKILL_NAME_LENGTH, MAX_SKILLS, normalizeSkillName } from './skills';

// 접혀 있을 때 보이는 칩 수 (고른 칩은 이 수와 상관없이 항상 보여요)
const COLLAPSED_COUNT = 8;

type SkillFieldProps = {
  options: ProfileTag[];
  value: ProfileTag[]; // 고른 기술 (고른 순서)
  onChange: (skills: ProfileTag[]) => void;
};

export function SkillField({ options, value, onChange }: SkillFieldProps) {
  const isSelected = (skill: ProfileTag) => value.some((it) => it.id === skill.id);

  // 처음 고른 기술을 앞에 두고, 그 뒤로는 순서를 고정해요 (누를 때마다 칩이 움직이지 않게)
  const [items, setItems] = useState(() => [
    ...value,
    ...options.filter((option) => !value.some((it) => it.id === option.id)),
  ]);
  const [expanded, setExpanded] = useState(false);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState('');

  const isFull = value.length >= MAX_SKILLS;
  const visibleItems = expanded
    ? items
    : items.filter((skill, index) => index < COLLAPSED_COUNT || isSelected(skill));
  const hiddenCount = items.length - visibleItems.length;

  const toggle = (skill: ProfileTag) => {
    if (isSelected(skill)) {
      onChange(value.filter((it) => it.id !== skill.id));
      return;
    }
    if (!isFull) onChange([...value, skill]);
  };

  // 목록에 있으면 그 기술을 고르고, 없으면 새로 만들어서 골라요
  const handleAdd = () => {
    const name = draft.trim();
    if (!name) return;

    const existing = items.find(
      (skill) => normalizeSkillName(skill.name) === normalizeSkillName(name),
    );
    // TODO: API 연결 시 POST /api/profile/tags/skills로 만들고 받은 id 사용
    const skill = existing ?? { id: -Date.now(), type: 'SKILL' as const, name };

    if (!existing) setItems((prev) => [...prev, skill]);
    if (!isSelected(skill) && !isFull) onChange([...value, skill]);

    setDraft('');
    setAdding(false);
  };

  return (
    <View style={S.wrap}>
      <View style={S.chips}>
        {visibleItems.map((skill) => {
          const selected = isSelected(skill);
          const disabled = !selected && isFull;

          return (
            <Press
              key={skill.id}
              onPress={() => toggle(skill)}
              disabled={disabled}
              accessibilityRole="checkbox"
              accessibilityLabel={skill.name}
              accessibilityState={{ checked: selected, disabled }}
              style={[S.chip, selected && S.chipSelected, disabled && S.disabled]}
            >
              {selected && <CheckIcon size={14} color={color.brandStrong} weight="bold" />}
              <Text variant="caption" color={selected ? 'brandStrong' : 'textBody'}>
                {skill.name}
              </Text>
            </Press>
          );
        })}

        {(hiddenCount > 0 || expanded) && (
          <Press
            onPress={() => setExpanded((prev) => !prev)}
            accessibilityRole="button"
            accessibilityLabel={expanded ? '기술 스택 접기' : `기술 스택 ${hiddenCount}개 더보기`}
            accessibilityState={{ expanded }}
            style={[S.chip, S.moreChip]}
          >
            <Text variant="caption" color="textMuted">
              {expanded ? '접기' : `더보기 +${hiddenCount}`}
            </Text>
            {expanded ? (
              <CaretUpIcon size={12} color={color.textMuted} weight="bold" />
            ) : (
              <CaretDownIcon size={12} color={color.textMuted} weight="bold" />
            )}
          </Press>
        )}

        {!adding && (
          <Press
            onPress={() => setAdding(true)}
            disabled={isFull}
            accessibilityRole="button"
            accessibilityLabel="기술 스택 직접 입력"
            accessibilityState={{ disabled: isFull }}
            style={[S.chip, S.addChip, isFull && S.disabled]}
          >
            <PlusIcon size={12} color={color.brand} weight="bold" />
            <Text variant="caption" color="brand">
              직접 입력
            </Text>
          </Press>
        )}
      </View>

      {adding && (
        <View style={S.addRow}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            onSubmitEditing={handleAdd}
            maxLength={MAX_SKILL_NAME_LENGTH}
            autoFocus
            placeholder="기술 이름 (예: Vue)"
            placeholderTextColor={color.textDisabled}
            selectionColor={color.brand}
            returnKeyType="done"
            accessibilityLabel="추가할 기술 이름"
            style={S.addInput}
          />
          <Press
            onPress={() => {
              setDraft('');
              setAdding(false);
            }}
            accessibilityRole="button"
            style={S.addAction}
          >
            <Text variant="caption" color="textMuted">
              취소
            </Text>
          </Press>
          <Press
            onPress={handleAdd}
            disabled={!draft.trim()}
            accessibilityRole="button"
            accessibilityState={{ disabled: !draft.trim() }}
            style={S.addAction}
          >
            <Text variant="caption" color={draft.trim() ? 'brand' : 'textDisabled'}>
              추가
            </Text>
          </Press>
        </View>
      )}

      {isFull && (
        <Text variant="caption" color="textMuted">
          최대 {MAX_SKILLS}개까지 고를 수 있어요
        </Text>
      )}
    </View>
  );
}
