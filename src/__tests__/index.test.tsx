import { beforeEach, describe, expect, it, jest } from '@jest/globals';

jest.mock('../NativeGuidedAccessMode', () => ({
  __esModule: true,
  default: {
    isGuidedAccessEnabled: jest.fn(),
    onGuidedAccessStatusChange: jest.fn(),
  },
}));

import {
  guidedAccessEventEmitter,
  isGuidedAccessEnabledAsync,
  onGuidedAccessStatusChange,
} from '../index';

type NativeModuleMock = {
  default: {
    isGuidedAccessEnabled: jest.Mock<() => Promise<boolean>>;
    onGuidedAccessStatusChange: jest.Mock<
      (listener: (status: { enabled: boolean }) => void) => { remove(): void }
    >;
  };
};

const mockNativeModule = jest.requireMock(
  '../NativeGuidedAccessMode'
) as NativeModuleMock;
const mockIsGuidedAccessEnabled =
  mockNativeModule.default.isGuidedAccessEnabled;
const mockOnGuidedAccessStatusChange =
  mockNativeModule.default.onGuidedAccessStatusChange;
const mockSubscription = { remove: jest.fn() };

describe('isGuidedAccessEnabledAsync', () => {
  beforeEach(() => {
    mockIsGuidedAccessEnabled.mockClear();
  });

  it('resolves with the value returned by the native module', async () => {
    mockIsGuidedAccessEnabled.mockResolvedValueOnce(true);

    await expect(isGuidedAccessEnabledAsync()).resolves.toBe(true);
    expect(mockIsGuidedAccessEnabled).toHaveBeenCalledTimes(1);
  });

  it('resolves with false when Guided Access is disabled', async () => {
    mockIsGuidedAccessEnabled.mockResolvedValueOnce(false);

    await expect(isGuidedAccessEnabledAsync()).resolves.toBe(false);
  });
});

describe('onGuidedAccessStatusChange', () => {
  beforeEach(() => {
    mockOnGuidedAccessStatusChange.mockClear();
    mockOnGuidedAccessStatusChange.mockReturnValue(mockSubscription);
  });

  it('subscribes the listener to the native event', () => {
    const listener = jest.fn();

    const subscription = onGuidedAccessStatusChange(listener);

    expect(mockOnGuidedAccessStatusChange).toHaveBeenCalledWith(listener);
    expect(subscription).toBe(mockSubscription);
  });
});

describe('guidedAccessEventEmitter', () => {
  beforeEach(() => {
    mockOnGuidedAccessStatusChange.mockClear();
    mockSubscription.remove.mockClear();
    mockOnGuidedAccessStatusChange.mockReturnValue(mockSubscription);
  });

  it('is a compatible shim over onGuidedAccessStatusChange', () => {
    const listener = jest.fn();

    const subscription = guidedAccessEventEmitter.addListener(
      'guidedAccessStatusDidChange',
      listener
    );

    expect(mockOnGuidedAccessStatusChange).toHaveBeenCalledWith(listener);

    subscription.remove();
    expect(mockSubscription.remove).toHaveBeenCalledTimes(1);
  });

  it('rejects unknown event names', () => {
    expect(() =>
      guidedAccessEventEmitter.addListener(
        'someOtherEvent' as 'guidedAccessStatusDidChange',
        jest.fn()
      )
    ).toThrow('Unsupported event: someOtherEvent');
  });
});
