import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

interface ButtonProps{
  title: string;
}

function Button (props: ButtonProps) {
  return (
    <TouchableOpacity style={styles.button}>
      <Text>
        {props.title}
      </Text>
    </TouchableOpacity>
  );
}

export default function App() {
  return (
    <View style={styles.container}>
      
      <Button title="Send 1"/>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    fontStyle: 'italic',
    color: '#fff'
  },

  button: {
    backgroundColor: '#c1d1f6',
    border: '1px solid #000',
    borderRadius: 7,
    width: 130,
    height: 50,
    alignItems: 'center',
    padding: 3,
    justifyContent: 'center'
  }
});
