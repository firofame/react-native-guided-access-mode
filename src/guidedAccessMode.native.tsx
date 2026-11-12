import type { EventSubscription } from 'react-native';

import GuidedAccessMode from './NativeGuidedAccessMode';
import type { GuidedAccessStatus } from './NativeGuidedAccessMode';

type StatusListener = (status: GuidedAccessStatus) => void;

export function isGuidedAccessEnabledAsync(): Promise<boolean> {
  return GuidedAccessMode.isGuidedAccessEnabled();
}

export function onGuidedAccessStatusChange(
  listener: StatusListener
): EventSubscription {
  return GuidedAccessMode.onGuidedAccessStatusChange(listener);
}

/**
 * Compatibility shim for the v0.1.x API.
 *
 * @deprecated Use {@link onGuidedAccessStatusChange} instead.
 */
export const guidedAccessEventEmitter = {
  addListener(
    eventType: 'guidedAccessStatusDidChange',
    listener: StatusListener
  ): EventSubscription {
    if (eventType !== 'guidedAccessStatusDidChange') {
      throw new Error(`Unsupported event: ${eventType}`);
    }
    return onGuidedAccessStatusChange(listener);
  },
};
