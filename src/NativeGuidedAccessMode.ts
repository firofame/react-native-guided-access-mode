import {
  TurboModuleRegistry,
  type CodegenTypes,
  type TurboModule,
} from 'react-native';

export interface GuidedAccessStatus {
  enabled: boolean;
}

export interface Spec extends TurboModule {
  isGuidedAccessEnabled(): Promise<boolean>;
  readonly onGuidedAccessStatusChange: CodegenTypes.EventEmitter<GuidedAccessStatus>;
}

const LINKING_ERROR =
  "The package 'react-native-guided-access-mode' doesn't seem to be linked. Make sure: \n\n" +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

// Resolved lazily via a proxy so that importing the package never throws
// (e.g. in Expo Go or before the app is rebuilt); the error is raised on
// first API call instead.
const GuidedAccessMode = new Proxy(
  {},
  {
    get(_target, prop) {
      const module = TurboModuleRegistry.get<Spec>('GuidedAccessMode');
      if (module == null) {
        throw new Error(LINKING_ERROR);
      }
      const value = Reflect.get(module as object, prop) as unknown;
      return typeof value === 'function' ? value.bind(module) : value;
    },
  }
);

export default GuidedAccessMode as Spec;
