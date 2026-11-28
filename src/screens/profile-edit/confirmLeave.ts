import { Alert, Platform } from 'react-native';

const TITLE = '수정한 내용이 저장되지 않아요';
const MESSAGE = '이대로 나갈까요?';

// 저장하지 않고 나갈지 물어봐요. 나가기를 고르면 onLeave를 불러요
// 웹에서는 Alert가 뜨지 않아서 브라우저 확인 창을 써요
export function confirmLeave(onLeave: () => void) {
  if (Platform.OS === 'web') {
    if (window.confirm(`${TITLE}\n${MESSAGE}`)) onLeave();
    return;
  }

  Alert.alert(TITLE, MESSAGE, [
    { text: '계속 편집', style: 'cancel' },
    { text: '나가기', style: 'destructive', onPress: onLeave },
  ]);
}
