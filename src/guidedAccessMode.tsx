import type { GuidedAccessStatus } from './NativeGuidedAccessMode';

type StatusListener = (status: GuidedAccessStatus) => void;

// Guided Access is an iOS accessibility feature and has no equivalent on the
// web, so this fallback reports a disabled state and never emits events.

export function isGuidedAccessEnabledAsync(): Promise<boolean> {
  return Promise.resolve(false);
}

export function onGuidedAccessStatusChange(_listener: StatusListener): {
  remove(): void;
} {
  return {
    remove() {
      // No-op: no events are emitted on this platform.
    },
  };
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
  ): { remove(): void } {
    if (eventType !== 'guidedAccessStatusDidChange') {
      throw new Error(`Unsupported event: ${eventType}`);
    }
    return onGuidedAccessStatusChange(listener);
  },
};
