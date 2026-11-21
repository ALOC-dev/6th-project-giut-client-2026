import { openBrowserAsync } from 'expo-web-browser';
import { Alert } from 'react-native';

// http(s) 주소인지 확인해요 (빈 값이나 잘못된 주소 거르기)
function isWebUrl(url: string | undefined): url is string {
  if (!url) return false;
  try {
    const { protocol } = new URL(url);
    return protocol === 'http:' || protocol === 'https:';
  } catch {
    return false;
  }
}

function alertCannotOpen() {
  Alert.alert('링크를 열 수 없어요', '잠시 후 다시 시도해 주세요.');
}

// 외부 링크를 앱 안 브라우저로 열어요.
// 주소가 잘못됐거나 열기에 실패하면 안내 창을 띄우고, 에러를 밖으로 던지지 않아요.
export async function openExternalUrl(url: string | undefined) {
  if (!isWebUrl(url)) {
    alertCannotOpen();
    return;
  }
  try {
    await openBrowserAsync(url);
  } catch {
    alertCannotOpen();
  }
}
