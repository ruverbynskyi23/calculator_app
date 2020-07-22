import React from 'react';
import { View, TextInput } from 'react-native';
import { styles } from './calculator-display.style';

export class Display extends React.Component {
  render() {
    return (
      <View style={styles.wrapper}>
        <TextInput
          style={styles.text}
          value={this.props.value}
          editable={false}
          placeholder="0"
          placeholderTextColor="#fff"
        />
      </View>
    );
  }
}
