import PropTypes from 'prop-types';
import React from 'react';

function noop(){}

function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

function removeLeadingZero(numStr) {
  //remove leading zeros
  return numStr.replace(/^0+/,'') || '0';
}

/**
 * limit decimal numbers to given precision
 * Not used .fixedTo because that will break with big numbers
 */
function limitToPrecision(numStr, precision) {
  let str = ''
  for (let i=0; i<=precision - 1; i++) {
    str += numStr[i] || '0'
  }
  return str;
}

/**
 * This method is required to round prop value to given precision.
 * Not used .round or .fixedTo because that will break with big numbers
 */
function roundToPrecision(numStr, precision) {
  const numberParts = numStr.split('.');
  const roundedDecimalParts = parseFloat(`0.${numberParts[1] || '0'}`).toFixed(precision).split('.');
  const intPart = numberParts[0].split('').reverse().reduce((roundedStr, current, idx) => {
    if (roundedStr.length > idx) {
      return (Number(roundedStr[0]) + Number(current)).toString() + roundedStr.substring(1, roundedStr.length);
    }
    return current + roundedStr;
  }, roundedDecimalParts[0])

  const decimalPart = roundedDecimalParts[1];

  return intPart + (decimalPart ? '.' + decimalPart : '');
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
  onMouseUp: PropTypes.func,
  onChange: PropTypes.func,
  type: PropTypes.oneOf(['text', 'tel']),
  isAllowed: PropTypes.func
};

const defaultProps = {
  displayType: 'input',
  decimalSeparator: '.',
  prefix: '',
  suffix: '',
  allowNegative: true,
  type: 'text',
  onChange: noop,
  onKeyDown: noop,
  onMouseUp: noop,
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
    this.onMouseUp = this.onMouseUp.bind(this);
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

  getFloatString(num, props) {
    props = props || this.props;
    const {decimalSeparator, thousandSeparator} = this.getSeparators(props);
    return (num || '').replace(new RegExp(escapeRegExp(thousandSeparator || ''), 'g'), '').replace(decimalSeparator, '.');
  }

  getFloatValue(num, props) {
    props = props || this.props;
    return parseFloat(this.getFloatString(num, props)) || 0;
  }

  optimizeValueProp(props) {
    const {decimalSeparator} = this.getSeparators(props);
    const {decimalPrecision, format} = props;

    let {value} = props;

    if (format || !(value || value === 0)) return value;

    const isNumber = typeof value === 'number';

    if (isNumber) value = value.toString();

    value = this.removePrefixAndSuffix(isNumber ? value: this.getFloatString(value, props), props);

    //round off value
    if(typeof decimalPrecision === 'number') value = roundToPrecision(value, decimalPrecision);

    //correct decimal separator
    if (decimalSeparator) {
      value = value.replace('.', decimalSeparator);
    }

    //throw error if value has two decimal seperators
    if (value.split(decimalSeparator).length > 2) {
      throw new Error(`
          Wrong input for value props.\n
          More than one decimalSeparator found
       `);
    }

    //if decimalPrecision is 0 remove decimalNumbers
    if (decimalPrecision === 0) return value.split(decimalSeparator)[0]

    return value;
  }

  removePrefixAndSuffix(val, props) {
    const {format, prefix, suffix} = props;

    //remove prefix and suffix
    if (!format && val) {
      const isNegative = val[0] === '-';

      //remove negation sign
      if (isNegative) val = val.substring(1, val.length);

      //remove prefix
      val = prefix && val.indexOf(prefix) === 0 ? val.substring(prefix.length, val.length) : val;

      //remove suffix
      const suffixLastIndex = val.lastIndexOf(suffix);
      val = suffix && suffixLastIndex !== -1 && suffixLastIndex === val.length - suffix.length ? val.substring(0, suffixLastIndex) : val;

      //add negation sign back
      if (isNegative) val = '-' + val;
    }

    return val;
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

  setPatchedCaretPosition(el, caretPos, currentValue) {
        /*
      setting caret position within timeout of 0ms is required for mobile chrome,
      otherwise browser resets the caret position after we set it
      We are also setting it without timeout so that in normal browser we don't see the flickering
      */
    this.setCaretPosition(el, caretPos);
    setTimeout(() => {
      if(el.value === currentValue) this.setCaretPosition(el, caretPos);
    }, 0);
  }

  /* This keeps the caret within typing area so people can't type in between prefix or suffix */
  correctCaretPosition(value, caretPos) {
    const {prefix, suffix} = this.props;
    return Math.min(Math.max(caretPos, prefix.length), (value.length - suffix.length));
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
    const {props, removePrefixAndSuffix} = this;
    const {prefix, suffix, mask, format, allowNegative, decimalPrecision} = props;
    const {thousandSeparator, decimalSeparator} = this.getSeparators();
    const maskPattern = format && typeof format == 'string' && !!mask;
    const numRegex = this.getNumberRegex(true);
    let hasNegative, removeNegative;

    //change val to string if its number
    if(typeof val === 'number') val = val + '';

    const negativeRegex = new RegExp('(-)');
    const doubleNegativeRegex = new RegExp('(-)(.)*(-)');

    //check if it has negative numbers
    if (allowNegative && !format) {
      // Check number has '-' value
      hasNegative = negativeRegex.test(val);
      // Check number has 2 or more '-' values
      removeNegative = doubleNegativeRegex.test(val);
    }

    //remove prefix and suffix
    val = removePrefixAndSuffix(val, props);

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
        value : (hasNegative && !removeNegative ? '-' : '') + removePrefixAndSuffix(formattedValue, props).match(numRegex).join(''),
        formattedValue : formattedValue
    }
  }
  getCaretPosition(inputValue, formattedValue, caretPos) {
    const numRegex = this.getNumberRegex(true);
    const inputNumber = (inputValue.match(numRegex) || []).join('');
    const formattedNumber = (formattedValue.match(numRegex) || []).join('');
    let j, i;

    j=0;

    for(i=0; i<caretPos; i++){
      const currentInputChar = inputValue[i];
      const currentFormatChar = formattedValue[j]||'';
      //no need to increase new cursor position if formatted value does not have those characters
      //case inputValue = 1a23 and formattedValue =  123
      if(!currentInputChar.match(numRegex) && currentInputChar !== currentFormatChar) continue;

      //When we are striping out leading zeros maintain the new cursor position
      //Case inputValue = 00023 and formattedValue = 23;
      if (currentInputChar === '0' && currentFormatChar.match(numRegex) && currentFormatChar !== '0' && inputNumber.length !== formattedNumber.length) continue;

      //we are not using currentFormatChar because j can change here
      while(currentInputChar !== formattedValue[j] && !(formattedValue[j]||'').match(numRegex) && j<formattedValue.length) j++;
      j++;
    }

    //correct caret position if its outsize of editable area
    j = this.correctCaretPosition(formattedValue, j);

    return j;
  }

  onChange(e) {
    e.persist();
    const el = e.target;
    const inputValue = el.value;
    const {state, props} = this;
    const {isAllowed} = props;
    const lastValue = state.value;
    let {formattedValue, value} = this.formatInput(inputValue); // eslint-disable-line prefer-const

    /*Max of selectionStart and selectionEnd is taken for the patch of pixel and other mobile device caret bug*/
    const currentCaretPosition = Math.max(el.selectionStart, el.selectionEnd);

    const valueObj = {
      formattedValue,
      value,
      floatValue: this.getFloatValue(value)
    };

    if (!isAllowed(valueObj)) {
      formattedValue = lastValue;
    }

    //set the value imperatively, this is required for IE fix
    el.value = formattedValue;

    //get the caret position
    const caretPos = this.getCaretPosition(inputValue, formattedValue, currentCaretPosition);

    //set caret position
    this.setPatchedCaretPosition(el, caretPos, formattedValue);

    //change the state
    if (formattedValue !== lastValue) {
      this.setState({value : formattedValue},()=>{
        props.onChange(e, valueObj);
      });
    }

    return value;
  }

  onKeyDown(e) {
    const el = e.target;
    const {selectionEnd, value} = el;
    let {selectionStart} = el;
    const {decimalPrecision, prefix, suffix} = this.props;
    const {key} = e;
    const numRegex = this.getNumberRegex(false, decimalPrecision !== undefined);
    const negativeRegex = new RegExp('-');

    //Handle backspace and delete against non numerical/decimal characters
    if(selectionStart === selectionEnd) {
      let newCaretPosition = selectionStart;

      if (key === 'ArrowLeft' || key === 'ArrowRight') {
        selectionStart += key === 'ArrowLeft' ? -1 : +1;
        newCaretPosition = this.correctCaretPosition(value, selectionStart);
      } else if (key === 'Delete' && !numRegex.test(value[selectionStart]) && !negativeRegex.test(value[selectionStart])) {
        while (!numRegex.test(value[newCaretPosition]) && newCaretPosition < (value.length - suffix.length)) newCaretPosition++;
      } else if (key === 'Backspace' && !numRegex.test(value[selectionStart - 1]) && !negativeRegex.test(value[selectionStart-1])) {
        while (!numRegex.test(value[newCaretPosition - 1]) && newCaretPosition > prefix.length) newCaretPosition--;
      }

      if (newCaretPosition !== selectionStart) {
        e.preventDefault();
        this.setPatchedCaretPosition(el, newCaretPosition, value);
      }
    }

    this.props.onKeyDown(e);
  }

  onMouseUp(e) {
    const el = e.target;
    const {selectionStart, selectionEnd, value} = el;

    if (selectionStart === selectionEnd) {
      const caretPostion = this.correctCaretPosition(value, selectionStart);
      if (caretPostion !== selectionStart) {
        this.setPatchedCaretPosition(el, caretPostion, value);
      }
    }

    this.props.onMouseUp(e);
  }

  render() {
    const props = omit(this.props, propTypes);

    const inputProps = Object.assign({}, props, {
      type:this.props.type,
      value:this.state.value,
      onChange:this.onChange,
      onKeyDown:this.onKeyDown,
      onMouseUp: this.onMouseUp
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
