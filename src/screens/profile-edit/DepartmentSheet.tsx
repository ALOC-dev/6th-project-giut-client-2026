import { CheckIcon, XIcon } from 'phosphor-react-native';
import { useState } from 'react';
import { ScrollView, TextInput, useWindowDimensions, View } from 'react-native';

import { SearchIcon } from '@/components/icons';
import { BottomSheet, Button, Press, Text } from '@/components/ui';
import { color } from '@/theme';

import type { College, Department } from './colleges';
import { S } from './DepartmentSheet.styles';

// 화면 높이 중 시트가 차지하는 비율
const SHEET_HEIGHT_RATIO = 0.85;

type DepartmentSheetProps = {
  visible: boolean;
  colleges: College[];
  value: string; // 지금 학과 이름
  onSelect: (department: Department) => void;
  onClose: () => void;
};

// 왼쪽에서 단과대를 고르고 오른쪽에서 학과를 골라요. 아래 버튼을 눌러야 확정돼요
export function DepartmentSheet({
  visible,
  colleges,
  value,
  onSelect,
  onClose,
}: DepartmentSheetProps) {
  const { height } = useWindowDimensions();

  const findCollege = (name: string) =>
    colleges.find((college) => college.departments.some((it) => it.name === name));

  const [collegeName, setCollegeName] = useState(
    () => findCollege(value)?.name ?? colleges[0]?.name,
  );
  const [draft, setDraft] = useState<Department | undefined>(() =>
    findCollege(value)?.departments.find((it) => it.name === value),
  );
  const [query, setQuery] = useState('');

  const keyword = query.replace(/\s/g, '');
  const searching = keyword.length > 0;

  // 검색 중이면 모든 단과대에서 찾아요
  const visibleDepartments = searching
    ? colleges.flatMap((college) =>
        college.departments.filter((it) => it.name.replace(/\s/g, '').includes(keyword)),
      )
    : (colleges.find((college) => college.name === collegeName)?.departments ?? []);

  const handleConfirm = () => {
    if (!draft) return;
    onSelect(draft);
    onClose();
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      accessibilityLabel="학과 선택"
      sheetStyle={{ height: height * SHEET_HEIGHT_RATIO }}
      contentStyle={S.content}
      footer={
        <Button
          label={draft ? `${draft.name} 선택` : '학과를 선택해 주세요'}
          disabled={!draft}
          onPress={handleConfirm}
        />
      }
    >
      <View style={S.header}>
        <View style={S.headerTexts}>
          <Text variant="titleLg" accessibilityRole="header">
            학과 선택
          </Text>
          <Text variant="caption" color="textMuted">
            하나만 선택할 수 있어요
          </Text>
        </View>
        <Press
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="닫기"
          style={S.closeButton}
        >
          <XIcon size={20} color={color.ink} />
        </Press>
      </View>

      <View style={S.search}>
        <SearchIcon size={18} color={color.textFaint} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="학과 검색 (예: 컴퓨터)"
          placeholderTextColor={color.textDisabled}
          selectionColor={color.brand}
          returnKeyType="search"
          accessibilityLabel="학과 검색"
          style={S.searchInput}
        />
      </View>

      <View style={S.body}>
        {!searching && (
          <ScrollView style={S.colleges} showsVerticalScrollIndicator={false}>
            {colleges.map((college) => {
              const selected = college.name === collegeName;
              return (
                <Press
                  key={college.name}
                  onPress={() => setCollegeName(college.name)}
                  accessibilityRole="tab"
                  accessibilityState={{ selected }}
                  scaleOnPress={false}
                  style={[S.college, selected && S.collegeSelected]}
                >
                  <Text
                    variant="caption"
                    color={selected ? 'brand' : 'textMuted'}
                    style={selected && S.collegeTextSelected}
                  >
                    {college.name}
                  </Text>
                </Press>
              );
            })}
          </ScrollView>
        )}

        <ScrollView
          style={S.departments}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {visibleDepartments.map((department) => {
            const selected = department.code === draft?.code;
            return (
              <Press
                key={department.code}
                onPress={() => setDraft(department)}
                accessibilityRole="radio"
                accessibilityState={{ checked: selected }}
                scaleOnPress={false}
                style={[S.department, selected && S.departmentSelected]}
              >
                <Text color={selected ? 'brand' : 'textBody'} style={S.departmentName}>
                  {department.name}
                </Text>
                {selected && <CheckIcon size={18} color={color.brand} weight="bold" />}
              </Press>
            );
          })}

          {visibleDepartments.length === 0 && (
            <Text color="textMuted" style={S.noResult}>
              검색 결과가 없어요
            </Text>
          )}
        </ScrollView>
      </View>
    </BottomSheet>
  );
}
