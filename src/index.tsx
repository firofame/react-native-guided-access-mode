import { NativeModules, NativeEventEmitter, Platform } from 'react-native';

const LINKING_ERROR =
  `The package 'react-native-guided-access-mode' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const GuidedAccessMode = NativeModules.GuidedAccessMode
  ? NativeModules.GuidedAccessMode
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export function isGuidedAccessEnabled(): Promise<boolean> {
  return GuidedAccessMode.isGuidedAccessEnabled();
}

export const guidedAccessEventEmitter = new NativeEventEmitter(
  GuidedAccessMode
);

export { GuidedAccessMode };
