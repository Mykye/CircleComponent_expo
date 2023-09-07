import { StyleSheet, View } from 'react-native';
import Circle from './components/Circle';

export default function App() {
  return (
    <View style={styles.container}>
      <Circle numSections={8} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
});
