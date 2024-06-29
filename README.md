# react-native-guided-access-mode

accessibility features while using Guided Access

## Installation

```sh
yarn add react-native-guided-access-mode
npx pod-install
```

## Usage

```js
import React, { useState, useEffect } from 'react';
import { View, Text, NativeEventEmitter, NativeModules } from 'react-native';

const { GuidedAccessMode } = NativeModules;
const guidedAccessEventEmitter = new NativeEventEmitter(GuidedAccessMode);

const App = () => {
  const [isGuidedAccessEnabled, setIsGuidedAccessEnabled] = useState(false);

  useEffect(() => {
    const checkGuidedAccessEnabled = async () => {
      try {
        const enabled = await GuidedAccessMode.isGuidedAccessEnabled();
        setIsGuidedAccessEnabled(enabled);
      } catch (error) {
        console.error('Failed to check Guided Access status:', error);
      }
    };

    checkGuidedAccessEnabled();

    const subscription = guidedAccessEventEmitter.addListener(
      'guidedAccessStatusDidChange',
      (event) => {
        setIsGuidedAccessEnabled(event.enabled);
      }
    );

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>{`Guided Access is currently ${isGuidedAccessEnabled ? 'enabled' : 'disabled'}`}</Text>
    </View>
  );
};

export default App;
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
