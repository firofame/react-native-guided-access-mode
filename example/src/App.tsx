import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import {
  isGuidedAccessEnabledAsync,
  onGuidedAccessStatusChange,
} from 'react-native-guided-access-mode';

export default function App() {
  const [enabled, setEnabled] = useState<boolean>(false);

  useEffect(() => {
    isGuidedAccessEnabledAsync()
      .then(setEnabled)
      .catch((error) => {
        console.error('Failed to check Guided Access status:', error);
      });

    const subscription = onGuidedAccessStatusChange((event) => {
      setEnabled(event.enabled);
    });

    return () => subscription.remove();
  }, []);

  return (
    <View style={styles.container}>
      <Text>{`Guided Access is currently ${enabled ? 'enabled' : 'disabled'}`}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
