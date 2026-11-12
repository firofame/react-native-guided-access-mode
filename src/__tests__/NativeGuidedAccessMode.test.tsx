import { describe, expect, it, jest } from '@jest/globals';

// Simulate an app where the native module is not linked (e.g. Expo Go) by
// making TurboModuleRegistry.get return null.
jest.mock('react-native', () => ({
  __esModule: true,
  TurboModuleRegistry: {
    get: jest.fn(() => null),
  },
}));

describe('NativeGuidedAccessMode', () => {
  it('throws a helpful error on first use when the native module is missing', () => {
    const GuidedAccessMode = require('../NativeGuidedAccessMode').default;

    expect(() => GuidedAccessMode.isGuidedAccessEnabled()).toThrow(
      "The package 'react-native-guided-access-mode' doesn't seem to be linked"
    );
  });
});
