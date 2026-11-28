import { CaretRightIcon } from 'phosphor-react-native';
import { useState } from 'react';
import { StyleSheet } from 'react-native';

import { Press, Text } from '@/components/ui';
import { color, radius, space } from '@/theme';

import type { College } from './colleges';
import { DepartmentSheet } from './DepartmentSheet';

type DepartmentFieldProps = {
  value: string;
  colleges: College[];
  onChange: (department: string) => void;
};

// 누르면 학과 선택 바텀시트가 올라와요
export function DepartmentField({ value, colleges, onChange }: DepartmentFieldProps) {
  const [open, setOpen] = useState(false);
  // 열 때마다 새로 그려서 지금 학과와 그 단과대에서 시작해요
  const [openCount, setOpenCount] = useState(0);

  const handleOpen = () => {
    setOpenCount((count) => count + 1);
    setOpen(true);
  };

  return (
    <>
      <Press
        onPress={handleOpen}
        accessibilityRole="button"
        accessibilityLabel={`학과, ${value || '선택 안 함'}`}
        accessibilityHint="학과 목록을 열어요"
        scaleOnPress={false}
        style={S.box}
      >
        <Text color={value ? 'ink' : 'textDisabled'} style={S.value} numberOfLines={1}>
          {value || '학과를 선택해 주세요'}
        </Text>
        <CaretRightIcon size={16} color={color.textFaint} />
      </Press>

      <DepartmentSheet
        key={openCount}
        visible={open}
        colleges={colleges}
        value={value}
        onSelect={(department) => onChange(department.name)}
        onClose={() => setOpen(false)}
      />
    </>
  );
}

const S = StyleSheet.create({
  box: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
    paddingHorizontal: space[4],
    borderWidth: 1,
    borderColor: color.line,
    borderRadius: radius.xl,
    borderCurve: 'continuous',
    backgroundColor: color.surface,
  },
  value: {
    flex: 1,
  },
});
