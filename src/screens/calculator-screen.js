import React from 'react';
import { View } from 'react-native';
import { Display, Button } from '../components/index';
import { styles } from './calculator-screen.style';


export class Calculator extends React.Component {
  constructor() {
    super();
    
    this.state = {
      displayValue: '',
      memory: '',
      isCalculated: false,
      plusMinusSign: '+',
    };

  }

  handleTouch(value) {
    const {displayValue, isCalculated} = this.state;
    const operators = ['+', '-', '/', '*', '%'];

    if(displayValue.length >= 10 || isNaN(displayValue.substr(-1)) && operators.includes(value.substr(-1))) {
      this.setState({
        displayValue: displayValue.substr(0, displayValue.length - 1) + value.substr(-1)
      });
      return;
    }

    if(!isCalculated) {
      this.setState({displayValue: displayValue + value});
    }
    if(isCalculated && isNaN(parseInt(value))) {
      this.setState({displayValue: displayValue + value, isCalculated: false});
    }
    if(isCalculated && !isNaN(parseInt(value))) {
      this.setState({displayValue: value, isCalculated: false});
    }

  }

  clearDisplay() {
    this.setState({displayValue: ''});
  }

  changeSign() {
    const {displayValue, plusMinusSign} = this.state;
    const formated = displayValue.replace(/[+-]?(\+?\-?[0-9]+)$/, `${plusMinusSign}$1`);

    this.setState({
      plusMinusSign: plusMinusSign === '+' ? '-' : '+',
      displayValue: formated,
    })
  }

  calculate() {
    const {displayValue} = this.state;

    if(displayValue === '' || isNaN(displayValue.substr(-1))) return;

    let result = displayValue.replace(/([0-9]+\.?[0-9]+)\*([0-9]+\.?[0-9]+)%/g, '$1*($2/100)');
    result = eval(result).toString();

    this.setState({displayValue: result, isCalculated: true, memory: result});
  }

  clearMemory() {
    this.setState({memory: ''});
  }

  readMemory() {
    const {memory} = this.state;
    this.setState({displayValue: memory.toString()});
  }
  
  decrementMemory() {
    const {memory} = this.state;
    this.setState({memory: +memory - 1});
  }

  incrementMemory() {
    const {memory} = this.state;
    this.setState({memory: +memory + 1});
  }

  render() {
    return (
      <View style={styles.container}>
        <Display value={this.state.displayValue}/>
        <View style={styles.btnWrapper}>
          <View style={styles.row}>
            <Button value="AC" background="#bdbdbd" press={this.clearDisplay.bind(this)}/>
            <Button value="+/-" background="#bdbdbd" press={this.changeSign.bind(this)}/>
            <Button value="%" background="#bdbdbd" press={this.handleTouch.bind(this)}/>
            <Button value="/" background="#FB8C00" press={this.handleTouch.bind(this)}/>
          </View>
          <View style={styles.row}>
            <Button value="mc" background="#616161" line="31" press={this.clearMemory.bind(this)}/>
            <Button value="mr" background="#616161" line="31" press={this.readMemory.bind(this)}/>
            <Button value="m-" background="#616161" line="31" press={this.decrementMemory.bind(this)}/>
            <Button value="m+" background="#FB8C00" line="31" press={this.incrementMemory.bind(this)}/>
          </View>
          <View style={styles.row}>
            <Button value="7" background="#616161" press={this.handleTouch.bind(this)}/>
            <Button value="8" background="#616161" press={this.handleTouch.bind(this)}/>
            <Button value="9" background="#616161" press={this.handleTouch.bind(this)}/>
            <Button value="*" background="#FB8C00" press={this.handleTouch.bind(this)}/>
          </View>
          <View style={styles.row}>
            <Button value="4" background="#616161" press={this.handleTouch.bind(this)}/>
            <Button value="5" background="#616161" press={this.handleTouch.bind(this)}/>
            <Button value="6" background="#616161" press={this.handleTouch.bind(this)}/>
            <Button value="-" background="#FB8C00" press={this.handleTouch.bind(this)}/>
          </View>
          <View style={styles.row}>
            <Button value="1" background="#616161" press={this.handleTouch.bind(this)}/>
            <Button value="2" background="#616161" press={this.handleTouch.bind(this)}/>
            <Button value="3" background="#616161" press={this.handleTouch.bind(this)}/>
            <Button value="+" background="#FB8C00" press={this.handleTouch.bind(this)}/>
          </View>
          <View style={styles.row}>
            <Button value="0" background="#616161" style={{flex: 1}} press={this.handleTouch.bind(this)}/>
            <Button value="." background="#616161" press={this.handleTouch.bind(this)}/>
            <Button value="=" background="#FB8C00" press={this.calculate.bind(this)}/>
          </View>
        </View>
      </View>
    );
  }
}
