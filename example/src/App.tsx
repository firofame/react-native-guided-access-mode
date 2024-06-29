import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';

import {
  isGuidedAccessEnabledAsync,
  guidedAccessEventEmitter,
} from 'react-native-guided-access-mode';

const App = () => {
  const [isGuidedAccessEnabled, setIsGuidedAccessEnabled] = useState(false);

  useEffect(() => {
    const checkGuidedAccessEnabled = async () => {
      try {
        const enabled = await isGuidedAccessEnabledAsync();
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
