//const React = require('react');
import React, {PropTypes} from 'react';

function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

const propTypes = {
  thousandSeparator: PropTypes.oneOf([',', '.', true, false]),
  decimalSeparator: PropTypes.oneOf([',', '.', true, false]),
  displayType: PropTypes.oneOf(['input', 'text']),
  prefix: PropTypes.string,
  suffix: PropTypes.string,
  format: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func
  ]),
  mask: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ])
};

const defaultProps = {
  displayType: 'input',
  decimalSeparator: '.'
};

class NumberFormat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.formatInput(props.value).formattedValue
    }
    this.onChange = this.onChange.bind(this);
    this.onInput = this.onInput.bind(this);
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      value : this.formatInput(newProps.value).formattedValue
    });
  }

  getSeperators() {
    let {thousandSeparator, decimalSeparator} = this.props;
    if (thousandSeparator === true) {
      thousandSeparator = ','
    }

    if (decimalSeparator && thousandSeparator) {
      decimalSeparator = thousandSeparator === ',' ? '.' : ',';
    }

    if (decimalSeparator === true) {
      decimalSeparator = '.'
    }

    return {
      decimalSeparator,
      thousandSeparator
    }
  }

  getNumberRegex(g) {
    const {decimalSeparator} = this.getSeperators();
    return new RegExp('\\d' + (decimalSeparator ? '|' + escapeRegExp(decimalSeparator) : ''), g ? 'g' : undefined);
  }

  setCaretPosition(caretPos) {
    const el = this.refs.input;
      el.value = el.value;
      // ^ this is used to not only get "focus", but
      // to make sure we don't have it everything -selected-
      // (it causes an issue in chrome, and having it doesn't hurt any other browser)
      if (el !== null) {
          if (el.createTextRange) {
              const range = el.createTextRange();
              range.move('character', caretPos);
              range.select();
              return true;
          }
          // (el.selectionStart === 0 added for Firefox bug)
          if (el.selectionStart || el.selectionStart === 0) {
              el.focus();
              el.setSelectionRange(caretPos, caretPos);
              return true;
          }

          // fail city, fortunately this never happens (as far as I've tested) :)
          el.focus();
          return false;

      }
  }

  formatWithPattern(str) {
    const {format,mask} = this.props;
    if (!format) return str;
    const hashCount = format.split('#').length - 1;
    let hashIdx = 0;
    let frmtdStr = format;

    for(let i=0, ln=str.length; i<ln; i++ ){
      if(i < hashCount){
        hashIdx = frmtdStr.indexOf('#');
        frmtdStr = frmtdStr.replace('#',str[i]);
      }
    }

    const lastIdx = frmtdStr.lastIndexOf('#');

    if(mask){
      return frmtdStr.replace(/#/g,mask);
    }
    return frmtdStr.substring(0,hashIdx + 1) + (lastIdx!==-1 ? frmtdStr.substring(lastIdx + 1, frmtdStr.length) :'');
  }

  formatInput(val) {
    const {prefix, suffix, mask, format} = this.props;
    const {thousandSeparator, decimalSeparator} = this.getSeperators()
    const maskPattern = format && typeof format == 'string' && !!mask;

    const numRegex = this.getNumberRegex(true);

    if(!val || !((val+'').match(numRegex))) return {value :'', formattedValue: (maskPattern ? '' : '')}
    const num = (val+'').match(numRegex).join('');

    let formattedValue = num;

    if(format){
      if(typeof format == 'string'){
        formattedValue = this.formatWithPattern(formattedValue);
      }
      else if(typeof format == 'function'){
        formattedValue = format(formattedValue);
      }
    }
    else{
      let beforeDecimal = formattedValue, afterDecimal = '';
      const hasDecimals = formattedValue.indexOf(decimalSeparator) !== -1;
      if(decimalSeparator && hasDecimals) {
        const parts = formattedValue.split(decimalSeparator)
        beforeDecimal = parts[0];
        afterDecimal = parts[1];
      }
      if(thousandSeparator) {
        beforeDecimal = beforeDecimal.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + thousandSeparator);
      }
      //add prefix and suffix
      if(prefix) beforeDecimal = prefix + beforeDecimal;
      if(suffix) afterDecimal = afterDecimal + suffix;

      formattedValue = beforeDecimal + (hasDecimals && decimalSeparator || '') + afterDecimal;
    }

    return {
        value : formattedValue.match(numRegex).join(''),
        formattedValue : formattedValue
    }
  }

  getCursorPosition(inputValue, formattedValue, cursorPos) {
    const numRegex = this.getNumberRegex();

    let j=0;
    for(let i=0; i<cursorPos; i++){
      if(!inputValue[i].match(numRegex) && inputValue[i] !== formattedValue[j]) continue;
      while(inputValue[i] !== formattedValue[j] && j<formattedValue.length) j++;
      j++;
    }

    //check if there is no number before caret position
    while(j > 0 && formattedValue[j]){
      if(!formattedValue[j-1].match(numRegex)) j--;
      else break;
    }
    return j;
  }

  onChangeHandler(e,callback) {
    e.persist();
    const inputValue = e.target.value + '';
    const {formattedValue,value} = this.formatInput(inputValue);
    let cursorPos = this.refs.input.selectionStart;

    //change the state
    this.setState({value : formattedValue},()=>{
      cursorPos = this.getCursorPosition(inputValue, formattedValue, cursorPos );
      this.setCaretPosition(cursorPos);
      if(callback) callback(e,value);
    });

    return value;
  }

  onChange(e) {
    this.onChangeHandler(e,this.props.onChange);
  }
  onInput(e) {
    this.onChangeHandler(e,this.props.onInput);
  }
  render() {
    const props = Object.assign({}, this.props);

    Object.keys(propTypes).forEach((key) => {
      delete props[key];
    });


    if(this.props.displayType === 'text'){
      return (<span {...props}>{this.state.value}</span>);
    }
    return (
      <input
        {...props}
        type="tel"
        value={this.state.value}
        ref="input"
        onInput={this.onChange}
        onChange={this.onChange}
      />
    )
  }
}

NumberFormat.propTypes = propTypes;
NumberFormat.defaultProps = defaultProps;

module.exports =  NumberFormat;
