import React from 'react';
import { View } from 'react-native';
import { Display, Button } from '../components/index';
import { styles } from './calculator-screen.style';


export class Calculator extends React.Component {
  constructor() {
    super();
    
    this.state = {
      display: '',
      memory: '',
      chunks: null,
      plusMinusSign: '-',
      signChanged: false,
      isCalculated: false,
      operators: ['+', '-', '/', '*', '%'],
    };

  }

  groupParentheses(arr) {
    arr[2] = arr.splice(2, 3, 0).join('');
    return arr;
  }

  makeChunks() {
    const {display} = this.state;
    const regex = /([\+\*\/\-])/;
    let arr = display.split(regex);

    if(arr[0] === '') {
      arr.shift();
    }
    if(arr[arr.length - 1] === '') {
      arr.pop();
    }
    if(arr[0] === '-') {
      arr[1] = `-${arr[1]}`;
      arr.shift();
    }
    if(arr.includes('(')) {
      arr = this.groupParentheses(arr);
    }

    this.setState({chunks: arr});
  }

  handleTouch(value) {
    const {display, isCalculated, operators} = this.state;

    if(display === 'Infinity') {
      this.setState({display: ''});
      return;
    }
    if(isCalculated && !isNaN(value)) {
      this.setState({display: value, isCalculated: false});
      return;
    }
    if(!isNaN(value) && value !=='0' && display.substr(-1) !== '%') {
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
    if(value === '+/-') {
      this.changeSign();
    }
    if(value === 'AC') {
      this.clearDisplay();
    }
    if(value === '=') {
      this.calculate();
    }
  }

  handleOperators(value) {
    const {display, operators} = this.state;

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
    if(isNaN(display.substr(-1)) && operators.includes(value) && display.substr(-1) !== ')') {
      this.setState({display: display.substr(0, display.length - 1) + value});
      return;
    }
    this.setState({display: display + value, isCalculated: false});
  }

  async handleDecimal(value) {
    await this.makeChunks();
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

    if(display === '') {
      this.setState({display: value});
      return;
    }
    if(display !== '' && display !== '0') {
      this.setState({display: display + value});
    }
  }

  clearDisplay() {
    this.setState({display: '', signChanged: false});
  }

  async changeSign() {
    if(!this.state.signChanged) {
      await this.makeChunks();
    }

    const {display, chunks, plusMinusSign} = this.state;
    const arr = chunks;
    let lastElem = arr[arr.length - 1];
    let newString;
    const valueIndex = display.lastIndexOf(lastElem);

    if(isNaN(Number(lastElem)) && lastElem.includes('(')) {
      lastElem = lastElem.split('').map((item, i) => i === 1 ? item = plusMinusSign : item = item).join('');
    }
    if(!isNaN(Number(lastElem))) {
      lastElem = `(${plusMinusSign}${lastElem})`;
    }

    arr[arr.length - 1] = lastElem;
    newString = `${display.slice(0, valueIndex)}${lastElem}`;

    this.setState({
      display: newString,
      chunks: arr,
      plusMinusSign: plusMinusSign === '+' ? '-' : '+',
      signChanged: true
    });
  }

  percentage(arr) {
    return arr.map((item, i) => {
      if(item.includes('%') && arr[i - 1] !== undefined) {
        return item = arr[i - 2]/100*item.substr(0, item.length - 1);
      }
      if(item.includes('%') && arr.length === 1) {
        return item = arr[i].slice(0, -1)/100;
      }
      return item;
    })
  }

  checkForParentheses(item){
    if(item.toString().includes('(')) {
      return item.slice(1, item.length - 1);
    }
    return item;
  }

  async calculate() {
    await this.makeChunks();
    
    let {display, chunks} = this.state;
    let arr = this.percentage(chunks);

    if(display === '' || (isNaN(display.substr(-1)) && display.substr(-1) !== '%' && display.substr(-1) !== ')')) return;

    while(arr.includes('*')) {
      const i = arr.indexOf('*');
      arr[i - 1] = this.checkForParentheses(arr[i - 1]) * this.checkForParentheses(arr[i + 1]);
      arr.splice(i, 2);
    }
    while(arr.includes('/')) {
      const i = arr.indexOf('/');
      arr[i - 1] = this.checkForParentheses(arr[i - 1]) / this.checkForParentheses(arr[i + 1]);
      arr.splice(i, 2);
    }
    while(arr.length > 1) {
      if(arr[1] === '-') {
        arr[0] = parseFloat(arr[0]) - parseFloat(this.checkForParentheses(arr[2]));
        arr.splice(1, 2);
      }
      if(arr[1] === '+') {
        arr[0] = parseFloat(arr[0]) + parseFloat(this.checkForParentheses(arr[2]));
        arr.splice(1, 2);
      }
    }

    if(arr[0].length > 5) {
      arr[0] = arr[0].toFixed(2);
    }

    this.setState({display: arr[0].toString(), isCalculated: true});
  }

  getLastNum(arr) {
    const lastItem = arr[arr.length - 1].indexOf('%') === -1 ? arr.pop() : arr.pop().slice(0, -1);
    return lastItem;
  }

  clearMemory() {
    this.setState({memory: ''});
  }

  async readMemory() {
    await this.makeChunks();
    const {display, memory, chunks, operators} = this.state;

    if(memory === '') {
      this.setState({memory: this.getLastNum(chunks)});
      return;
    }

    if(operators.includes(display.substr(-1)) && display.substr(-1) !== '%') {
      this.setState({display: display + memory});
      return;
    }
    if(isNaN(display.substr(-1)) && chunks.length > 1) {
      const i = display.indexOf(chunks[chunks.length - 2]);
      const newString = display.substr(0, i + 1) + memory;
      chunks[chunks.length - 1] = memory;
      this.setState({display: newString, chunks: chunks});
      return;
    }
    if(display !== '' && chunks.length === 1) {
      chunks[0] = memory;
      this.setState({display: memory, chunks: chunks});
      return;
    }

    this.setState({display: memory});
  }
  
  async decrementMemory() {
    await this.makeChunks();
    const {memory, chunks} = this.state;

    if(memory === '') {
      return;
    }

    const calc = parseFloat(this.checkForParentheses(memory)) - parseFloat(this.checkForParentheses(this.getLastNum(chunks)));
    this.setState({memory: calc});
  }

  async incrementMemory() {
    await this.makeChunks();
    const {memory, chunks} = this.state;

    if(memory === '') {
      this.setState({memory: this.getLastNum(chunks)});
      return;
    }

    const calc = parseFloat(this.checkForParentheses(memory)) + parseFloat(this.checkForParentheses(this.getLastNum(chunks)));
    this.setState({memory: calc});
  }

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
            <Button value="=" background="#FB8C00" press={this.handleTouch.bind(this)}/>
          </View>
        </View>
      </View>
    );
  }
}
