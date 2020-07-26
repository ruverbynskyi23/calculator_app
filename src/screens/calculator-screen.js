import React from 'react';
import { View } from 'react-native';
import { Display, Button } from '../components/index';
import { styles } from './calculator-screen.style';


export class Calculator extends React.Component {
  constructor() {
    super();
    
    this.state = {
      display: '',
      chunks: null,
    };

  }

  makeChunks() {
    const {display} = this.state;
    const regex = /([\+\*\/\-])/;

    const arr = display.split(regex);

    this.setState({chunks: arr});
  }

  handleTouch(value) {
    const {display} = this.state;
    const operators = ['+', '-', '/', '*', '%'];

    if(!isNaN(value) && value !=='0') {
      this.setState({display: display + value});
    }
    if(operators.includes(value)) {
      this.handleOperators(value);
    }
    if(value === '.') {
      this.handleDecimal(value);
    }
    if(value === '0') {
      this.handleZeroButton(value);
    }
    if(value === 'AC') {
      this.clearDisplay();
    }
    if(value === '=') {
      this.calculate();
    }

  }

  handleOperators(value) {
    const {display} = this.state;
    const operators = ['+', '-', '/', '*', '%'];

    if(display === '' && value !== '-') {
      return;
    }
    if(display === '-' && isNaN(value)) {
      this.clearDisplay();
      return;
    }
    if(display.substr(-1) === '%' && value !== '%') {
      this.setState({display: display + value});
      return;
    }
    if(isNaN(display.substr(-1)) && operators.includes(value)) {
      this.setState({display: display.substr(0, display.length - 1) + value});
      return;
    }

    this.setState({display: display + value});
  }

  handleDecimal(value) {
    const {display, chunks} = this.state;
    const isNum = isNaN(display[display.length - 1]);

    if(display === '') {
      this.setState({display: '0.'});
      return;
    }
    if(isNum || chunks[chunks.length - 1].includes('.')) {
      return;
    }

    this.setState({display: display + value});
  }

  handleZeroButton(value) {    
    const {display} = this.state;

    if(display !== '') {
      this.setState({display: display + value});
    }
  }

  clearDisplay() {
    this.setState({display: ''});
  }

  // changeSign() {
  //   const {displayValue, plusMinusSign} = this.state;
  //   const formated = displayValue.replace(/[+-]?(\+?\-?[0-9]+)$/, `${plusMinusSign}$1`);

  //   this.setState({
  //     plusMinusSign: plusMinusSign === '+' ? '-' : '+',
  //     displayValue: formated,
  //   })
  // }

  percentage(arr) {
    return arr.map((item, i) => {
      if(item.includes('%') && arr[i - 1] !== undefined) {
        return item = arr[i - 2]/100*item.substr(0, item.length - 1);
      }
      return item;
    })
  }

  async calculate() {
    await this.makeChunks();
    let {display, chunks} = this.state;
    let arr = this.percentage(chunks);

    if(display === '' || (isNaN(display.substr(-1)) && display.substr(-1) !== '%')) return;
    
    while(arr.includes('*')) {
      const i = arr.indexOf('*');
      arr[i - 1] = arr[i - 1] * arr[i + 1];
      arr.splice(i, 2);
    }
    while(arr.includes('/')) {
      const i = arr.indexOf('/');
      arr[i - 1] = arr[i - 1] / arr[i + 1];
      arr.splice(i, 2);
    }
    while(arr.includes('+')) {
      const i = arr.indexOf('+');
      arr[i - 1] = +arr[i - 1] + +arr[i + 1];
      arr.splice(i, 2);
    }
    while(arr.includes('-')) {
      const i = arr.indexOf('-');
      arr[i - 1] = arr[i - 1] - arr[i + 1];
      arr.splice(i, 2);
    }

    this.setState({display: arr[0].toString()})
  }

  // clearMemory() {
  //   this.setState({memory: ''});
  // }

  // readMemory() {
  //   const {memory} = this.state;
  //   this.setState({displayValue: memory.toString()});
  // }
  
  // decrementMemory() {
  //   const {memory} = this.state;
  //   this.setState({memory: +memory - 1});
  // }

  // incrementMemory() {
  //   const {memory} = this.state;
  //   this.setState({memory: +memory + 1});
  // }

  render() {
    return (
      <View style={styles.container}>
        <Display value={this.state.display}/>
        <View style={styles.btnWrapper}>
          <View style={styles.row}>
            <Button value="AC" background="#bdbdbd" press={this.handleTouch.bind(this)}/>
            <Button value="+/-" background="#bdbdbd" press={this.handleTouch.bind(this)}/>
            <Button value="%" background="#bdbdbd" press={this.handleTouch.bind(this)}/>
            <Button value="/" background="#FB8C00" press={this.handleTouch.bind(this)}/>
          </View>
          <View style={styles.row}>
            <Button value="mc" background="#616161" line="31" press={this.handleTouch.bind(this)}/>
            <Button value="mr" background="#616161" line="31" press={this.handleTouch.bind(this)}/>
            <Button value="m-" background="#616161" line="31" press={this.handleTouch.bind(this)}/>
            <Button value="m+" background="#FB8C00" line="31" press={this.handleTouch.bind(this)}/>
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
            <Button value="=" background="#FB8C00" press={this.handleTouch.bind(this)}/>
          </View>
        </View>
      </View>
    );
  }
}
