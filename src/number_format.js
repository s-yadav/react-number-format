//const React = require('react');
import PropTypes from 'prop-types';
import React from 'react';

function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

const propTypes = {
  thousandSeparator: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  decimalSeparator: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  decimalPrecision: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
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
  ]),
  customInput: PropTypes.func,
  allowNegative: PropTypes.bool,
  onKeyDown: PropTypes.func,
  onChange: PropTypes.func
};

const defaultProps = {
  displayType: 'input',
  decimalSeparator: '.',
  decimalPrecision: false,
  allowNegative: true
};

class NumberFormat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.formatInput(props.value).formattedValue
    }
    this.onChange = this.onChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if(newProps.value !== this.props.value) {
      this.setState({
        value : this.formatInput(newProps.value).formattedValue
      });
    }
  }

  getSeparators() {
    let {thousandSeparator, decimalSeparator} = this.props;
    if (thousandSeparator === true) {
      thousandSeparator = ','
    }

    if (decimalSeparator && thousandSeparator && typeof decimalSeparator !== 'string') {
      decimalSeparator = thousandSeparator === '.' ? ',' : '.';
    }

    if (thousandSeparator === '.') {
      decimalSeparator = ',';
    }

    if (decimalSeparator === true) {
      decimalSeparator = '.'
    }

    return {
      decimalSeparator,
      thousandSeparator
    }
  }

  getNumberRegex(g, ignoreDecimalSeperator) {
    const {format} = this.props;
    const {decimalSeparator} = this.getSeparators();
    return new RegExp('\\d' + (decimalSeparator && !ignoreDecimalSeperator && !format ? '|' + escapeRegExp(decimalSeparator) : ''), g ? 'g' : undefined);
  }

  setCaretPosition(el, caretPos) {
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
    const {prefix, suffix, mask, format, allowNegative, decimalPrecision} = this.props;
    const {thousandSeparator, decimalSeparator} = this.getSeparators();
    const maskPattern = format && typeof format == 'string' && !!mask;
    const numRegex = this.getNumberRegex(true);
    let hasNegative, removeNegative;

    //change val to string if its number
    if(typeof val === 'number') val = val + '';

    const negativeRegex = new RegExp('(-)');
    const doubleNegativeRegex = new RegExp('(-)(.)*(-)');

    if (allowNegative && !format) {
      // Check number has '-' value
      hasNegative = negativeRegex.test(val);
      // Check number has 2 or more '-' values
      removeNegative = doubleNegativeRegex.test(val);
    }

    const valMatch = val && val.match(numRegex);
    
    if (!valMatch && removeNegative) {
      return {value :'', formattedValue: ''} 
    } else if (!valMatch && hasNegative) {
      return {value :'', formattedValue: '-'} 
    } else if (!valMatch) {
      return {value :'', formattedValue: (maskPattern ? '' : '')} 
    }

    const num = val.match(numRegex).join('');

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
      const hasDecimals = formattedValue.indexOf(decimalSeparator) !== -1 || decimalPrecision !== false;
      if(decimalSeparator && hasDecimals) {
        let parts;
        if (decimalPrecision !== false) {
          const precision = decimalPrecision === true ? 2 : decimalPrecision;
          if (decimalSeparator !== '.') {
            // Replace custom decimalSeparator with '.' for parseFloat function
            parts = parseFloat(formattedValue.replace(decimalSeparator, '.')).toFixed(precision)
            // Put custom decimalSeparator back
            parts = parts.replace('.', decimalSeparator);
          } else {
            parts = parseFloat(formattedValue).toFixed(precision)
          }
          parts = parts.split(decimalSeparator);
        } else {
          parts = formattedValue.split(decimalSeparator);
        }
        beforeDecimal = parts[0];
        afterDecimal = parts[1];
      }
      if(thousandSeparator) {
        beforeDecimal = beforeDecimal.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + thousandSeparator);
      }
      //add prefix and suffix
      if(prefix) beforeDecimal = prefix + beforeDecimal;
      if(suffix) afterDecimal = afterDecimal + suffix;

      if (hasNegative && !removeNegative) beforeDecimal = '-' + beforeDecimal;

      formattedValue = beforeDecimal + (hasDecimals && decimalSeparator ||  '') + afterDecimal;
    }

    return {
        value : (hasNegative && !removeNegative ? '-' : '') + formattedValue.match(numRegex).join(''),
        formattedValue : formattedValue
    }
  }

  getCursorPosition(inputValue, formattedValue, cursorPos) {
    const numRegex = this.getNumberRegex();
    let j, i;

    j=0;
    for(i=0; i<cursorPos; i++){
      if(!inputValue[i].match(numRegex) && inputValue[i] !== formattedValue[j]) continue;
      while(inputValue[i] !== formattedValue[j] && j<formattedValue.length) j++;
      j++;
    }

    return j;
  }

  onChangeHandler(e,callback) {
    e.persist();
    const el = e.target;
    const inputValue = el.value;
    const {formattedValue,value} = this.formatInput(inputValue);
    let cursorPos = el.selectionStart;

    //change the state
    this.setState({value : formattedValue},()=>{
      cursorPos = this.getCursorPosition(inputValue, formattedValue, cursorPos );
      /*
        setting caret position within timeout of 0ms is required for mobile chrome,
        otherwise browser resets the caret position after we set it
        We are also setting it without timeout so that in normal browser we don't see the flickering
       */
      this.setCaretPosition(el, cursorPos);
      setTimeout(() => this.setCaretPosition(el, cursorPos), 0);
      if(callback) callback(e,value);
    });

    return value;
  }

  onChange(e) {
    this.onChangeHandler(e,this.props.onChange);
  }
  onKeyDown(e) {
    const el = e.target;
    const {selectionStart, selectionEnd, value} = el;
    const {decimalPrecision} = this.props;
    const {key} = e;
    const numRegex = this.getNumberRegex(false, decimalPrecision !== false);
    const negativeRegex = new RegExp('-');
    //Handle backspace and delete against non numerical/decimal characters
    if(selectionEnd - selectionStart === 0) {
      if (key === 'Delete' && !numRegex.test(value[selectionStart]) && !negativeRegex.test(value[selectionStart])) {
        e.preventDefault();
        let nextCursorPosition = selectionStart;
        while (!numRegex.test(value[nextCursorPosition]) && nextCursorPosition < value.length) nextCursorPosition++;
        this.setCaretPosition(el, nextCursorPosition);
      } else if (key === 'Backspace' && !numRegex.test(value[selectionStart - 1]) && !negativeRegex.test(value[selectionStart-1])) {
        e.preventDefault();
        let prevCursorPosition = selectionStart;
        while (!numRegex.test(value[prevCursorPosition - 1]) && prevCursorPosition > 0) prevCursorPosition--;
        this.setCaretPosition(el, prevCursorPosition);
      }
    }

    if (this.props.onKeyDown) this.props.onKeyDown(e);
  }
  render() {
    const props = Object.assign({}, this.props);

    Object.keys(propTypes).forEach((key) => {
      delete props[key];
    });

    const inputProps = Object.assign({}, props, {
      type:'text',
      value:this.state.value,
      onChange:this.onChange,
      onKeyDown:this.onKeyDown,
    })

    if( this.props.displayType === 'text'){
      return (<span {...props}>{this.state.value}</span>);
    }

    else if (this.props.customInput) {
      const CustomInput = this.props.customInput;
      return (
        <CustomInput
          {...inputProps}
        />
      )
    }

    return (
      <input
        {...inputProps}
      />
    )
  }
}

NumberFormat.propTypes = propTypes;
NumberFormat.defaultProps = defaultProps;

module.exports =  NumberFormat;