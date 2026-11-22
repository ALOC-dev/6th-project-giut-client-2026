import { openBrowserAsync } from 'expo-web-browser';
import { Alert } from 'react-native';

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

// 앱 안 브라우저로 열고, 실패하면 에러 대신 안내 창을 띄워요
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
