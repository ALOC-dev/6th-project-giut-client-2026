import { fireEvent, render } from '@testing-library/react-native';
import { Button } from '@/components/ui/Button';

describe('Button', () => {
  it('calls onPress when enabled', async () => {
    const onPress = jest.fn();
    const { getByRole } = await render(<Button label="지원하기" onPress={onPress} />);

    await fireEvent.press(getByRole('button', { name: '지원하기' }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', async () => {
    const onPress = jest.fn();
    const { getByRole } = await render(<Button label="지원하기" disabled onPress={onPress} />);
    const button = getByRole('button', { name: '지원하기' });

    await fireEvent.press(button);

    expect(button.props.accessibilityState).toEqual({ disabled: true, busy: false });
    expect(onPress).not.toHaveBeenCalled();
  });

  it('exposes the loading state and hides the label', async () => {
    const { getByRole, queryByText } = await render(
      <Button label="보내기" loading onPress={jest.fn()} />,
    );

    expect(getByRole('button', { name: '보내기' }).props.accessibilityState).toEqual({
      disabled: true,
      busy: true,
    });
    expect(queryByText('보내기')).toBeNull();
  });
});
