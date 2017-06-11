/**
 * 1. Validate thousand separators and decimals throw error
 * 2. Thousand separator just have value true or any other string
 * 3. Decimal separator should be defined only as string
 * 4. Decimal precision should be only defined as number
 * 5. If user don't want floating numbers set decimalPrecision to 0
 * 6. User can pass value as floating point numbers or string, if user passes string decimal separator in string should match to provided decimalSeparator
 * 7. Add formattedValue, numeric value, value with string in event object and not as parameters so that getting values should look consistent
 * 8. dont use parseFloat that will not able to parse 2^23
 * 9. Always have decimal precision
 * 10. isAllowed props to validate input and block if returns false
 */
import PropTypes from 'prop-types';
import React from 'react';

function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

function removeLeadingZero(numStr) {
  //remove leading zeros
  return numStr.replace(/^0+/,'') || '0';
}

function limitToPrecision(numStr, precision) {
  let str = ''
  for (let i=0; i<=precision - 1; i++) {
    str += numStr[i] || '0'
  }
  return str;
}

function omit(obj, keyMaps) {
  const filteredObj = {};
  Object.keys(obj).forEach((key) => {
    if (!keyMaps[key]) filteredObj[key] = obj[key]
  });
  return filteredObj;
}

const propTypes = {
  thousandSeparator: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([true])]),
  decimalSeparator: PropTypes.string,
  decimalPrecision: PropTypes.number,
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
  onChange: PropTypes.func,
  type: PropTypes.oneOf(['text', 'tel']),
  isAllowed: PropTypes.func
};

const defaultProps = {
  displayType: 'input',
  decimalSeparator: '.',
  allowNegative: true,
  type: 'text',
  isAllowed: function() {return true;}
};

class NumberFormat extends React.Component {
  constructor(props) {
    super(props);
    const value = this.optimizeValueProp(props);
    this.state = {
      value: this.formatInput(value).formattedValue
    }
    this.onChange = this.onChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    this.updateValueIfRequired(prevProps, prevState);
  }

  updateValueIfRequired(prevProps) {
    const {props, state} = this;

    if(prevProps !== props) {
      const stateValue = state.value;

      let value = this.optimizeValueProp(props);
      if (value === undefined) value = stateValue;

      const {formattedValue} = this.formatInput(value);

      if (formattedValue !== stateValue) {
        this.setState({
          value : formattedValue
        })
      }
    }
  }

  getFloatValue(num) {
    const {decimalSeparator} = this.props;
    return parseFloat(num.replace(decimalSeparator, '.')) || 0;
  }

  optimizeValueProp(props) {
    const {decimalSeparator} = this.getSeparators(props);
    const {decimalPrecision, format} = props;

    let {value} = props;

    if (format || value === undefined) return value;

    const isNumber = typeof value === 'number';

    if (isNumber) value = value.toString();

    //correct decimal separator
    if (decimalSeparator && isNumber) {
      value = value.replace('.', decimalSeparator);
    }

    //if decimalPrecision is 0 remove decimalNumbers
    if (decimalPrecision === 0) return value.split(decimalSeparator)[0]

    return value;
  }

  getSeparators(props) {
    props = props || this.props;

    const {decimalSeparator} = props;

    let {thousandSeparator} = props;

    if (thousandSeparator === true) {
      thousandSeparator = ','
    }

    if (decimalSeparator === thousandSeparator) {
      throw new Error(`
          Decimal separator can\'t be same as thousand separator.\n
          thousandSeparator: ${thousandSeparator} (thousandSeparator = {true} is same as thousandSeparator = ",")
          decimalSeparator: ${decimalSeparator} (default value for decimalSeparator is .)
       `);
    }

    return {
      decimalSeparator,
      thousandSeparator
    }
  }

  getNumberRegex(g, ignoreDecimalSeparator) {
    const {format, decimalPrecision} = this.props;
    const {decimalSeparator} = this.getSeparators();
    return new RegExp('\\d' + (decimalSeparator && decimalPrecision !== 0 && !ignoreDecimalSeparator && !format ? '|' + escapeRegExp(decimalSeparator) : ''), g ? 'g' : undefined);
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

  setPatchedCaretPosition(el, caretPos) {
        /*
      setting caret position within timeout of 0ms is required for mobile chrome,
      otherwise browser resets the caret position after we set it
      We are also setting it without timeout so that in normal browser we don't see the flickering
      */
    this.setCaretPosition(el, caretPos);
    setTimeout(() => this.setCaretPosition(el, caretPos), 0);
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
      const hasDecimalSeparator = formattedValue.indexOf(decimalSeparator) !== -1 || decimalPrecision;

      const parts = formattedValue.split(decimalSeparator);
      let beforeDecimal = parts[0];
      let afterDecimal = parts[1] || '';

      //remove leading zeros from number before decimal
      beforeDecimal = removeLeadingZero(beforeDecimal);

      //apply decimal precision if its defined
      if (decimalPrecision !== undefined) afterDecimal = limitToPrecision(afterDecimal, decimalPrecision);

      if(thousandSeparator) {
        beforeDecimal = beforeDecimal.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + thousandSeparator);
      }

      //add prefix and suffix
      if(prefix) beforeDecimal = prefix + beforeDecimal;
      if(suffix) afterDecimal = afterDecimal + suffix;

      if (hasNegative && !removeNegative) beforeDecimal = '-' + beforeDecimal;

      formattedValue = beforeDecimal + (hasDecimalSeparator && decimalSeparator ||  '') + afterDecimal;
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
      if (inputValue[i] === '0' && formattedValue[j].match(numRegex) && formattedValue[j] !== '0') continue;
      while(inputValue[i] !== formattedValue[j] && j<formattedValue.length) j++;
      j++;
    }

    return j;
  }

  onChangeHandler(e,callback) {
    e.persist();
    const el = e.target;
    const inputValue = el.value;
    const {isAllowed} = this.props;
    const lastValue = this.state.value;
    let {formattedValue, value} = this.formatInput(inputValue);

    /*Max of selectionStart and selectionEnd is taken for the patch of pixel and other mobile device cursor bug*/
    const currentCursorPosition = Math.max(el.selectionStart, el.selectionEnd);

    const cursorPos = this.getCursorPosition(inputValue, formattedValue, currentCursorPosition);

    //set caret position befor setState
    //this.setPatchedCaretPosition(el, cursorPos);

    if (!isAllowed(formattedValue, value, this.getFloatValue(value))) {
      formattedValue = lastValue;
    }

    //change the state
    this.setState({value : formattedValue},()=>{

      //reset again after setState so if formattedValue is other then
      this.setPatchedCaretPosition(el, cursorPos);

      if(callback && formattedValue !== lastValue) callback(e, value);
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
    const numRegex = this.getNumberRegex(false, decimalPrecision !== undefined);
    const negativeRegex = new RegExp('-');
    //Handle backspace and delete against non numerical/decimal characters
    if(selectionEnd - selectionStart === 0) {
      if (key === 'Delete' && !numRegex.test(value[selectionStart]) && !negativeRegex.test(value[selectionStart])) {
        e.preventDefault();
        let nextCursorPosition = selectionStart;
        while (!numRegex.test(value[nextCursorPosition]) && nextCursorPosition < value.length) nextCursorPosition++;
        this.setPatchedCaretPosition(el, nextCursorPosition);
      } else if (key === 'Backspace' && !numRegex.test(value[selectionStart - 1]) && !negativeRegex.test(value[selectionStart-1])) {
        e.preventDefault();
        let prevCursorPosition = selectionStart;
        while (!numRegex.test(value[prevCursorPosition - 1]) && prevCursorPosition > 0) prevCursorPosition--;
        this.setPatchedCaretPosition(el, prevCursorPosition);
      }
    }

    if (this.props.onKeyDown) this.props.onKeyDown(e);
  }
  render() {
    const props = omit(this.props, propTypes);

    const inputProps = Object.assign({}, props, {
      type:this.props.type,
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
