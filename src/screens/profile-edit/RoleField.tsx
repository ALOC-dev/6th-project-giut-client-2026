import {
  ClipboardTextIcon,
  CodeIcon,
  PaletteIcon,
  SpeakerHighIcon,
  type Icon,
} from 'phosphor-react-native';
import { useRef, useState, type ComponentRef } from 'react';
import { Platform, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { Press, Text } from '@/components/ui';
import { ROLE_LABEL, type RoleKey } from '@/screens/teams';
import { color, role, useMotion } from '@/theme';

import { S } from './RoleField.styles';
import { getDetailRoles, MAX_DETAIL_ROLES, ROLE_KEYS, type RoleSelection } from './roles';

const ROLE_ICON: Record<RoleKey, Icon> = {
  dev: CodeIcon,
  design: PaletteIcon,
  plan: ClipboardTextIcon,
  mkt: SpeakerHighIcon,
};

type RoleFieldProps = {
  value: RoleSelection;
  onChange: (value: RoleSelection) => void;
  // 새로 열린 세부 역할 상자의 화면상 아래쪽 위치. 가려져 있으면 화면이 스크롤해서 보여줘요
  onReveal?: (bottomInWindow: number) => void;
};

// 큰 역할을 고르면 그 아래에 세부 역할 칩이 차례로 나타나요
// 세부 역할은 어느 큰 역할에서든 합쳐서 3개까지 고를 수 있어요
export function RoleField({ value, onChange, onReveal }: RoleFieldProps) {
  const { primaryKeys, roles } = value;
  const isFull = roles.length >= MAX_DETAIL_ROLES;
  const openKeys = ROLE_KEYS.filter((key) => primaryKeys.includes(key));

  // 방금 사용자가 연 큰 역할 (처음 화면에 열려 있던 상자는 스크롤하지 않아요)
  const [justOpened, setJustOpened] = useState<RoleKey | null>(null);

  const handleReveal = (bottomInWindow: number) => {
    setJustOpened(null);
    onReveal?.(bottomInWindow);
  };

  const togglePrimary = (key: RoleKey) => {
    if (primaryKeys.includes(key)) {
      // 큰 역할을 빼면 그 아래 세부 역할도 같이 빠져요
      const detailCodes = getDetailRoles(key).map(({ code }) => code);
      onChange({
        primaryKeys: primaryKeys.filter((it) => it !== key),
        roles: roles.filter((code) => !detailCodes.includes(code)),
      });
      return;
    }
    setJustOpened(key);
    onChange({ primaryKeys: [...primaryKeys, key], roles });
  };

  const toggleDetail = (code: string) => {
    if (roles.includes(code)) {
      onChange({ primaryKeys, roles: roles.filter((it) => it !== code) });
      return;
    }
    if (!isFull) onChange({ primaryKeys, roles: [...roles, code] });
  };

  return (
    <View style={S.wrap}>
      <View style={S.primaryRow}>
        {ROLE_KEYS.map((key) => {
          const selected = primaryKeys.includes(key);
          const RoleIcon = ROLE_ICON[key];
          const tone = role[key];

          return (
            <Press
              key={key}
              onPress={() => togglePrimary(key)}
              accessibilityRole="checkbox"
              accessibilityLabel={ROLE_LABEL[key]}
              accessibilityState={{ checked: selected }}
              style={[
                S.primary,
                selected && { backgroundColor: tone.tint, borderColor: tone.base },
              ]}
            >
              <RoleIcon size={20} color={selected ? tone.text : color.textMuted} />
              <Text variant="caption" color={selected ? tone.text : 'textSecondary'}>
                {ROLE_LABEL[key]}
              </Text>
            </Press>
          );
        })}
      </View>

      {openKeys.map((key) => (
        <DetailPanel
          key={key}
          roleKey={key}
          selectedRoles={roles}
          isFull={isFull}
          onToggle={toggleDetail}
          onReveal={key === justOpened ? handleReveal : undefined}
        />
      ))}
    </View>
  );
}

type DetailPanelProps = {
  roleKey: RoleKey;
  selectedRoles: string[];
  isFull: boolean;
  onToggle: (code: string) => void;
  onReveal?: (bottomInWindow: number) => void; // 있으면 자리를 잡은 뒤 위치를 알려줘요
};

// 큰 역할 하나의 세부 역할 칩 묶음
function DetailPanel({ roleKey, selectedRoles, isFull, onToggle, onReveal }: DetailPanelProps) {
  const { enter, stagger } = useMotion();
  const panelRef = useRef<ComponentRef<typeof View>>(null);

  const handleLayout = () => {
    if (!onReveal) return;
    panelRef.current?.measureInWindow((_x, y, _width, height) => onReveal(y + height));
  };
  const tone = role[roleKey];
  const details = getDetailRoles(roleKey);

  // 처음 열릴 때만 차례로 나타나요. 매번 새로 만들면 다시 그릴 때마다 애니메이션이 반복돼요
  // 웹에서는 위 상자가 움직일 때 칩이 제자리를 못 찾아서 애니메이션을 꺼요
  const [enterings] = useState(() =>
    details.map((_, index) =>
      Platform.OS === 'web' ? undefined : enter.fadeUp(index, stagger.tight),
    ),
  );

  return (
    <View ref={panelRef} onLayout={handleLayout} style={[S.panel, { backgroundColor: tone.tint }]}>
      <Text variant="meta" color={tone.text}>
        {ROLE_LABEL[roleKey]} 세부 역할
      </Text>
      <View style={S.chips}>
        {details.map(({ code, name }, index) => {
          const selected = selectedRoles.includes(code);
          const disabled = !selected && isFull;

          return (
            <Animated.View key={code} entering={enterings[index]}>
              <Press
                onPress={() => onToggle(code)}
                disabled={disabled}
                accessibilityRole="checkbox"
                accessibilityLabel={name}
                accessibilityState={{ checked: selected, disabled }}
                style={[
                  S.chip,
                  { borderColor: selected ? tone.base : tone.tint },
                  selected && { backgroundColor: tone.base },
                  disabled && S.disabled,
                ]}
              >
                <Text variant="caption" color={selected ? 'surface' : tone.text}>
                  {name}
                </Text>
              </Press>
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
}
