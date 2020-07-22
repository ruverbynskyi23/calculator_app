import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from './calculator-butons.style';

export class Button extends React.Component {
  render() {
    return (
      <TouchableOpacity
        style={[
          styles.btn,
          {
            backgroundColor: this.props.background
          },
          {...this.props.style}
        ]}
        onPress={this.props.press.bind(null, this.props.value)}>
          <View style={styles.wrapper}>
            <Text style={[styles.text, {lineHeight: this.props.line ? Number(this.props.line) : 34}]}>{this.props.value}</Text>
          </View>
      </TouchableOpacity>
    );
  }
}

