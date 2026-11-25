import { openBrowserAsync, type WebBrowserResult } from 'expo-web-browser';
import { Alert } from 'react-native';
import { openExternalUrl } from '@/utils/link';

jest.mock('expo-web-browser', () => ({
  openBrowserAsync: jest.fn(),
}));

const openBrowserMock = jest.mocked(openBrowserAsync);

describe('openExternalUrl', () => {
  const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    alertSpy.mockRestore();
  });

  it('rejects missing and unsafe URLs', async () => {
    await openExternalUrl(undefined);
    await openExternalUrl('javascript:alert(1)');

    expect(openBrowserMock).not.toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalledTimes(2);
  });

  it('opens HTTP and HTTPS URLs in the in-app browser', async () => {
    openBrowserMock.mockResolvedValue({ type: 'dismiss' } as WebBrowserResult);

    await openExternalUrl('https://giut.store/team/1');

    expect(openBrowserMock).toHaveBeenCalledWith('https://giut.store/team/1');
    expect(alertSpy).not.toHaveBeenCalled();
  });

  it('shows guidance when the browser fails to open', async () => {
    openBrowserMock.mockRejectedValue(new Error('browser unavailable'));

    await openExternalUrl('https://giut.store');

    expect(alertSpy).toHaveBeenCalledWith('링크를 열 수 없어요', '잠시 후 다시 시도해 주세요.');
  });
});
