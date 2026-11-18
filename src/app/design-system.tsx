import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  AppHeader, BottomNavigation, BottomSheet,
  Button,
  Card,
  Chip,
  Press,
  SegmentedControl,
  Text,
  Toast, useToast,
} from '@/components/ui';
import { TAB_ITEMS } from '@/constants/navigation';
import {
  color,
  radius,
  role,
  shadow,
  space,
  text as type,
  useFloat,
  useMotion, usePulse,
} from '@/theme';

const fieldOptions = [
  '기획/아이디어',
  '광고/마케팅',
  '논문/리포트',
  '영상/콘텐츠',
  '서포터즈/기자단',
  'IT/개발',
  '디자인',
] as const;

export default function DesignSystemScreen() {
  return <Inner />;
}

function Section({
  title,
  note,
  children,
}: {
  title: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <View style={{ gap: space[3], paddingTop: space[8] }}>
      <View style={{ gap: 2 }}>
        <Text variant="titleLg">{title}</Text>
        {note ? (
          <Text variant="caption" color="textMuted">
            {note}
          </Text>
        ) : null}
      </View>
      {children}
    </View>
  );
}

function PropValue({ children }: { children: string }) {
  return (
    <View
      style={{
        alignSelf: 'flex-start',
        maxWidth: '100%',
        paddingHorizontal: space[2],
        paddingVertical: 5,
        borderRadius: radius.sm,
        backgroundColor: color.surfaceMuted,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: color.line,
      }}
    >
      <Text variant="micro" color="textSecondary" style={{ fontFamily: 'monospace' }}>
        {children}
      </Text>
    </View>
  );
}

function Inner() {
  const insets = useSafeAreaInsets();
  const { enter } = useMotion();
  const toast = useToast();
  const [chips, setChips] = useState<Record<string, boolean>>({ 해커톤: true });
  const [recent, setRecent] = useState(['서울시', 'UX 디자인', '환경 챌린지']);
  const [filter, setFilter] = useState('all');
  const [seed, setSeed] = useState(0);
  const [bottomTab, setBottomTab] = useState('team');
  const [fieldSheetOpen, setFieldSheetOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<string>();

  return (
    <View style={{ flex: 1, backgroundColor: color.surfaceSunken }}>
      <View style={{ paddingTop: insets.top, backgroundColor: color.surface }}>
        <AppHeader
          hasUnreadNotification
          onPressLogo={() => toast.show('홈으로 이동')}
          onPressNotification={() => toast.show('알림 열기')}
          onPressSearch={() => toast.show('검색 열기')}
        />
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: space[5],
          paddingTop: space[6],
          paddingBottom: 160,
        }}
        contentInsetAdjustmentBehavior="never"
      >
        <Text variant="titleXl">디자인 시스템 점검</Text>
        <Text variant="body" color="textSecondary" style={{ marginTop: 6 }}>
          아래 항목을 하나씩 눌러 보며 토큰과 상호작용을 점검할 수 있습니다.
        </Text>

        <Section title="글자" note="variant별 fontSize, lineHeight, fontWeight를 함께 표시한다">
          <Card elevation="card" bordered>
            {(Object.keys(type) as (keyof typeof type)[]).map((k, i) => (
              <View
                key={k}
                style={{
                  paddingVertical: 8,
                  borderTopWidth: i === 0 ? 0 : StyleSheet.hairlineWidth,
                  borderTopColor: color.lineSoft,
                }}
              >
                <Text variant="micro" color="textFaint">
                  variant=&quot;{k}&quot; · size {type[k].fontSize} · line {type[k].lineHeight} ·
                  weight {type[k].fontWeight}
                </Text>
                <Text variant={k}>어느 자리에 지원할까요?</Text>
              </View>
            ))}
          </Card>
        </Section>

        <Section
          title="색"
          note="토큰 이름과 실제 색상값을 표시한다. 반투명은 파랑·흰색·검정 띠 위에서 확인한다"
        >
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space[2] }}>
            {(Object.keys(color) as (keyof typeof color)[]).map((k) => (
              <View key={k} style={{ width: 104, gap: 4 }}>
                <View
                  style={{
                    height: 44,
                    borderRadius: radius.sm,
                    overflow: 'hidden',
                    borderWidth: StyleSheet.hairlineWidth,
                    borderColor: color.line,
                    flexDirection: 'row',
                  }}
                >
                  <View style={{ flex: 1, backgroundColor: color.brand }} />
                  <View style={{ flex: 1, backgroundColor: color.surface }} />
                  <View style={{ flex: 1, backgroundColor: color.ink }} />
                  <View style={[StyleSheet.absoluteFill, { backgroundColor: color[k] }]} />
                </View>
                <Text variant="micro" color="textSecondary">
                  {k} · {color[k]}
                </Text>
              </View>
            ))}
          </View>

          <Text variant="label" style={{ marginTop: space[3] }}>
            직군 색
          </Text>
          <View style={{ gap: space[2] }}>
            {(Object.keys(role) as (keyof typeof role)[]).map((r) => (
              <View key={r} style={{ flexDirection: 'row', gap: space[2], alignItems: 'center' }}>
                <Text variant="caption" style={{ width: 56 }}>
                  {r}
                </Text>
                {(['base', 'tint', 'text'] as const).map((v) => (
                  <View
                    key={v}
                    style={{
                      flex: 1,
                      minHeight: 44,
                      borderRadius: radius.sm,
                      backgroundColor: role[r][v],
                      alignItems: 'center',
                      justifyContent: 'center',
                      paddingHorizontal: 2,
                    }}
                  >
                    <Text
                      variant="micro"
                      style={{ color: v === 'base' || v === 'text' ? '#FFF' : color.ink }}
                    >
                      {v}
                      {'\n'}
                      {role[r][v]}
                    </Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        </Section>

        <Section
          title="모서리와 그림자"
          note="borderCurve: continuous — iOS에서 애플 스쿼클이 되는지 본다"
        >
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space[2] }}>
            {(Object.keys(radius) as (keyof typeof radius)[]).map((k) => (
              <View key={k} style={{ width: 96, gap: 4 }}>
                <View
                  style={{
                    height: 56,
                    backgroundColor: color.surface,
                    borderRadius: radius[k],
                    borderCurve: 'continuous',
                    borderWidth: 1,
                    borderColor: color.line,
                  }}
                />
                <Text variant="micro" color="textSecondary">
                  {k} · {radius[k]}
                </Text>
              </View>
            ))}
          </View>
          <View
            style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space[3], marginTop: space[2] }}
          >
            {(Object.keys(shadow) as (keyof typeof shadow)[]).map((k) => (
              <View key={k} style={{ width: 148, gap: 6 }}>
                <View
                  style={[
                    { height: 56, backgroundColor: color.surface, borderRadius: radius.lg },
                    shadow[k],
                  ]}
                />
                <Text variant="micro" color="textSecondary">
                  shadow.{k}
                  {'\n'}
                  {shadow[k].boxShadow}
                </Text>
              </View>
            ))}
          </View>
        </Section>

        <Section title="Card" note="눌러서 scale(.95)가 도는지 확인">
          <View style={{ gap: 6 }}>
            <Card onPress={() => toast.show('카드를 눌렀어요')}>
              <Text variant="titleMd">팀 찾아줘</Text>
              <Text variant="caption" color="textMuted">
                캠퍼스 문제 해결 해커톤 · 눌러보세요
              </Text>
            </Card>
            <PropValue>{'elevation="card" · corner="lg" · padding={16} · onPress'}</PropValue>
          </View>
          <View style={{ gap: 6 }}>
            <Card corner="2xl" padding={20}>
              <Text variant="titleMd">radius-2xl</Text>
              <Text variant="caption" color="textMuted">
                화면에 꽉 차는 큰 카드
              </Text>
            </Card>
            <PropValue>{'elevation="card" · corner="2xl" · padding={20}'}</PropValue>
          </View>
          <View style={{ gap: 6 }}>
            <Card elevation="flat" bordered>
              <Text variant="label">테두리만</Text>
            </Card>
            <PropValue>{'elevation="flat" · bordered={true}'}</PropValue>
          </View>
        </Section>

        <Section title="Button">
          <View style={{ gap: 6 }}>
            <Button label="지원서 보내기" onPress={() => toast.show('지원서를 보냈어요')} />
            <PropValue>{'variant="primary" · full={true}'}</PropValue>
          </View>
          <View style={{ flexDirection: 'row', gap: space[2] }}>
            <View style={{ flex: 1, gap: 6 }}>
              <Button
                label="계속 기다리기"
                variant="secondary"
                onPress={() => toast.show('계속 기다려요')}
              />
              <PropValue>{'variant="secondary"'}</PropValue>
            </View>
            <View style={{ flex: 1, gap: 6 }}>
              <Button
                label="지원 취소하기"
                variant="danger"
                onPress={() => toast.show('지원을 취소했어요')}
              />
              <PropValue>{'variant="danger"'}</PropValue>
            </View>
          </View>
          <View style={{ flexDirection: 'row', gap: space[2] }}>
            <View style={{ flex: 1, gap: 6 }}>
              <Button label="비활성" disabled onPress={() => {}} />
              <PropValue>{'disabled={true}'}</PropValue>
            </View>
            <View style={{ flex: 1, gap: 6 }}>
              <Button label="보내는 중" loading onPress={() => {}} />
              <PropValue>{'loading={true}'}</PropValue>
            </View>
          </View>
          <View style={{ gap: 6 }}>
            <Button
              label="지원 취소하기"
              variant="link"
              onPress={() => toast.show('지원 취소 링크를 눌렀어요')}
            />
            <PropValue>{'variant="link"'}</PropValue>
          </View>
        </Section>

        <Section
          title="Chip"
          note="크기 변화 없이 선택 색상이 바뀌고, 삭제형의 ×가 따로 눌리는지 확인"
        >
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space[2] }}>
            {['해커톤', '공모전', '서포터즈', '봉사', '인턴'].map((label) => (
              <Chip
                key={label}
                label={label}
                selected={!!chips[label]}
                onPress={() => setChips((c) => ({ ...c, [label]: !c[label] }))}
              />
            ))}
          </View>
          <PropValue>{'label · selected={boolean} · onPress'}</PropValue>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space[2] }}>
            {recent.map((label) => (
              <Chip
                key={label}
                label={label}
                onPress={() => toast.show(`'${label}' 검색`)}
                onDelete={() => setRecent((r) => r.filter((x) => x !== label))}
              />
            ))}
            {recent.length === 0 ? (
              <Text variant="caption" color="textFaint">
                전부 지웠어요
              </Text>
            ) : null}
          </View>
          <PropValue>{'label · onPress · onDelete'}</PropValue>
        </Section>

        <Section title="SegmentedControl" note="알약이 미끄러지는지, 첫 렌더에 깜빡이지 않는지">
          <SegmentedControl
            segments={[
              { key: 'all', label: '전체', count: 9 },
              { key: 'post', label: '게시물', count: 6 },
              { key: 'team', label: '팀', count: 3 },
            ]}
            value={filter}
            onChange={setFilter}
          />
          <PropValue>{`segments={3} · value="${filter}" · onChange`}</PropValue>
          <SegmentedControl
            segments={[
              { key: 'a', label: '모집 중' },
              { key: 'b', label: '마감' },
            ]}
            value={filter === 'all' ? 'a' : 'b'}
            onChange={(k) => setFilter(k === 'a' ? 'all' : 'team')}
          />
          <PropValue>{`segments={2} · value="${filter === 'all' ? 'a' : 'b'}" · onChange`}</PropValue>
        </Section>

        <Section
          title="Toast"
          note="1.6초 뒤 저절로 사라지고, 떠 있는 동안에도 뒤를 누를 수 있어야 한다"
        >
          <Button
            label="토스트 띄우기"
            variant="secondary"
            onPress={() => toast.show('링크를 복사했어요')}
          />
          <PropValue>{'message="링크를 복사했어요" · visible={boolean} · bottom={108}'}</PropValue>
        </Section>

        <Section
          title="BottomNavigation"
          note="화면 아래에 고정된 실제 컴포넌트를 눌러 상태를 확인"
        >
          <PropValue>{`items={5} · value="${bottomTab}" · onChange`}</PropValue>
        </Section>

        <Section title="BottomSheet" note="분야 필터 예제. 배경이나 뒤로가기를 누르면 닫힌다">
          <Button
            label={selectedField ? `선택: ${selectedField}` : '분야 선택 열기'}
            variant="secondary"
            onPress={() => setFieldSheetOpen(true)}
          />
          <PropValue>{`visible={${fieldSheetOpen}} · title="분야 선택" · headerAction · footer`}</PropValue>
        </Section>

        <Section title="모션" note="진입 프리셋. 버튼을 누르면 다시 재생된다">
          <Button label="다시 재생" variant="secondary" onPress={() => setSeed((s) => s + 1)} />
          <View key={seed} style={{ gap: space[2] }}>
            {(
              [
                ['fadeUp', enter.fadeUp(0)],
                ['fade', enter.fade(0)],
                ['menu', enter.menu()],
                ['step (right)', enter.step('right')],
                ['step (left)', enter.step('left')],
                ['pop', enter.pop(0)],
                ['pill', enter.pill()],
                ['toast', enter.toast()],
              ] as const
            ).map(([label, anim]) => (
              <Animated.View key={label} entering={anim}>
                <Card elevation="card" padding={12}>
                  <Text variant="caption">{label}</Text>
                </Card>
              </Animated.View>
            ))}

            <Text variant="label" style={{ marginTop: space[2] }}>
              스태거 (카드 80ms)
            </Text>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <Animated.View key={i} entering={enter.fadeUp(i)}>
                <Card elevation="card" padding={10}>
                  <Text variant="caption" color="textMuted">
                    {i + 1}번째
                  </Text>
                </Card>
              </Animated.View>
            ))}
          </View>

          <Text variant="label" style={{ marginTop: space[2] }}>
            반복되는 연출
          </Text>
          <View style={{ flexDirection: 'row', gap: space[2], alignItems: 'stretch' }}>
            <PulseDot />
            <FloatCard />
          </View>
        </Section>
      </ScrollView>

      <View
        pointerEvents="box-none"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          paddingBottom: insets.bottom > 0 ? space[3] : 0,
        }}
      >
        <BottomNavigation
          items={TAB_ITEMS}
          value={bottomTab}
          onChange={setBottomTab}
        />
      </View>

      <BottomSheet
        visible={fieldSheetOpen}
        onClose={() => setFieldSheetOpen(false)}
        title="분야 선택"
        headerAction={
          <Press
            onPress={() => setSelectedField(undefined)}
            accessibilityRole="button"
            accessibilityLabel="분야 선택 초기화"
            style={{ minHeight: 44, justifyContent: 'center' }}
          >
            <Text variant="micro" color="textMuted">
              초기화
            </Text>
          </Press>
        }
        footer={
          <Button
            label="10건 보기"
            onPress={() => {
              setFieldSheetOpen(false);
              toast.show(selectedField ? `${selectedField} 결과 10건` : '전체 결과 10건');
            }}
            style={{ height: 48, borderRadius: radius.md }}
          />
        }
      >
        {fieldOptions.map((option) => {
          const selected = selectedField === option;
          return (
            <Press
              key={option}
              onPress={() => setSelectedField(option)}
              accessibilityRole="radio"
              accessibilityState={{ checked: selected }}
              style={{
                minHeight: 44,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Text variant="caption" color="textBody">
                {option}
              </Text>
              <View
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: radius.full,
                  borderWidth: 1,
                  borderColor: selected ? color.brand : color.line,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {selected ? (
                  <View
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: radius.full,
                      backgroundColor: color.brand,
                    }}
                  />
                ) : null}
              </View>
            </Press>
          );
        })}
      </BottomSheet>

      <Toast {...toast.props} />
    </View>
  );
}

function PulseDot() {
  const pulse = usePulse();
  return (
    <View
      style={{
        flex: 1,
        minHeight: 150,
        padding: space[3],
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: color.line,
        backgroundColor: color.surface,
      }}
    >
      <View style={{ width: 88, height: 88, alignItems: 'center', justifyContent: 'center' }}>
        <Animated.View
          style={[
            {
              position: 'absolute',
              width: 24,
              height: 24,
              borderRadius: radius.full,
              backgroundColor: role.plan.base,
            },
            pulse,
          ]}
        />
        <View
          style={{
            width: 24,
            height: 24,
            borderRadius: radius.full,
            backgroundColor: role.plan.base,
            borderWidth: 4,
            borderColor: role.plan.tint,
          }}
        />
      </View>
      <View style={{ alignItems: 'center', gap: 2 }}>
        <Text variant="caption">Pulse</Text>
        <Text variant="micro" color="textSecondary">
          usePulse()
        </Text>
      </View>
    </View>
  );
}

function FloatCard() {
  const float = useFloat();
  return (
    <View
      style={{
        flex: 1,
        minHeight: 150,
        padding: space[3],
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: color.line,
        backgroundColor: color.surface,
      }}
    >
      <View style={{ height: 88, alignItems: 'center', justifyContent: 'center' }}>
        <Animated.View style={float}>
          <View
            style={[
              {
                width: 112,
                height: 58,
                padding: space[3],
                gap: 7,
                borderRadius: radius.lg,
                backgroundColor: color.surface,
              },
              shadow.raised,
            ]}
          >
            <View
              style={{
                width: 52,
                height: 7,
                borderRadius: radius.full,
                backgroundColor: color.brandTint,
              }}
            />
            <View
              style={{
                width: 84,
                height: 6,
                borderRadius: radius.full,
                backgroundColor: color.line,
              }}
            />
            <View
              style={{
                width: 64,
                height: 6,
                borderRadius: radius.full,
                backgroundColor: color.lineSoft,
              }}
            />
          </View>
        </Animated.View>
      </View>
      <View style={{ alignItems: 'center', gap: 2 }}>
        <Text variant="caption">Float</Text>
        <Text variant="micro" color="textSecondary">
          useFloat()
        </Text>
      </View>
    </View>
  );
}
