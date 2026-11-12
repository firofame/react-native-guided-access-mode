# react-native-guided-access-mode

Access the [Guided Access](https://support.apple.com/en-us/HT202612) status from JavaScript.

Guided Access is an iOS accessibility feature that keeps the app in a single, restricted mode. On Android, this package reports whether **App Pinning** (lock task mode) is active — the closest equivalent of Guided Access.

## Installation

```sh
yarn add react-native-guided-access-mode
npx pod-install
```

Requires React Native **0.76 or newer** (New Architecture, enabled by default since 0.76).

## Usage

```tsx
import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';

import {
  isGuidedAccessEnabledAsync,
  onGuidedAccessStatusChange,
} from 'react-native-guided-access-mode';

const App = () => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    isGuidedAccessEnabledAsync().then(setEnabled);

    const subscription = onGuidedAccessStatusChange((event) => {
      setEnabled(event.enabled);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>{`Guided Access is currently ${enabled ? 'enabled' : 'disabled'}`}</Text>
    </View>
  );
};

export default App;
```

## API

### `isGuidedAccessEnabledAsync(): Promise<boolean>`

Resolves whether Guided Access is currently enabled.

- **iOS**: reflects the Guided Access status.
- **Android**: reflects the [App Pinning / lock task mode](https://developer.android.com/reference/android/app/ActivityManager#getLockTaskModeState()) state.
- **Web**: always resolves to `false`.

### `onGuidedAccessStatusChange(listener): EventSubscription`

Subscribes the listener to Guided Access status changes. The listener receives a `{ enabled: boolean }` event. Call `subscription.remove()` to unsubscribe.

**iOS only.** Android provides no public way to observe pinning changes, and web never emits events, so the listener is not invoked on those platforms.

### `guidedAccessEventEmitter` (deprecated)

Compatibility shim for the v0.1.x API:

```js
const subscription = guidedAccessEventEmitter.addListener(
  'guidedAccessStatusDidChange',
  (event) => {
    setEnabled(event.enabled);
  }
);

subscription.remove();
```

Prefer `onGuidedAccessStatusChange` in new code.

## Contributing

- [Development workflow](CONTRIBUTING.md#development-workflow)
- [Sending a pull request](CONTRIBUTING.md#sending-a-pull-request)
- [Code of conduct](CODE_OF_CONDUCT.md)

## License

MIT
