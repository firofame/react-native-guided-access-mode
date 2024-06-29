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
