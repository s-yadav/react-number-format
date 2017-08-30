//@flow
import PropTypes from 'prop-types';
import React from 'react';

/** type defination **/
declare class SyntheticKeyboardInputEvent extends SyntheticKeyboardEvent {
    target: HTMLInputElement
}

declare class SyntheticMouseInputEvent extends SyntheticMouseEvent {
    target: HTMLInputElement
}

function noop(){}

function charIsNumber(char) {
  return !!(char || '').match(/\d/);
}

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
  removeFormatting: PropTypes.func,
  mask: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]),
  isNumericString: PropTypes.bool,
  customInput: PropTypes.func,
  allowNegative: PropTypes.bool,
  onKeyDown: PropTypes.func,
  onMouseUp: PropTypes.func,
  onChange: PropTypes.func,
  type: PropTypes.oneOf(['text', 'tel']),
  isAllowed: PropTypes.func,
  renderText: PropTypes.func
};

const defaultProps = {
  displayType: 'input',
  decimalSeparator: '.',
  prefix: '',
  suffix: '',
  allowNegative: true,
  isNumericString: false,
  type: 'text',
  onChange: noop,
  onKeyDown: noop,
  onMouseUp: noop,
  isAllowed: function() {return true;}
};

class NumberFormat extends React.Component {
  state: {
    value?: string
  }
  onChange: Function
  onKeyDown: Function
  onMouseUp: Function
  static defaultProps: Object
  constructor(props: Object) {
    super(props);
    this.state = {
      value: this.formatValueProp()
    }
    this.onChange = this.onChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
  }

  componentDidUpdate(prevProps: Object) {
    this.updateValueIfRequired(prevProps);
  }

  updateValueIfRequired(prevProps: Object) {
    const {props, state} = this;

    if(prevProps !== props) {
      const stateValue = state.value;

      let value = this.formatValueProp();
      if (value === undefined) value = stateValue;

      const {formattedValue} = this.formatInput(value);

      if (formattedValue !== stateValue) {
        this.setState({
          value : formattedValue
        })
      }
    }
  }

  /** Misc methods **/
  getFloatString(num: string = '') {
    const {decimalSeparator} = this.getSeparators();
    const numRegex = this.getNumberRegex(true);

    //remove negation for regex check
    const hasNegation = num[0] === '-';
    if(hasNegation) num = num.replace('-', '');

    num  = (num.match(numRegex) || []).join('').replace(decimalSeparator, '.');

    //remove extra decimals
    const firstDecimalIndex = num.indexOf('.');

    if (firstDecimalIndex !== -1) {
      num = `${num.substring(0, firstDecimalIndex)}.${num.substring(firstDecimalIndex + 1, num.length).replace(new RegExp(escapeRegExp(decimalSeparator), 'g'), '')}`
    }

    //add negation back
    if(hasNegation) num = '-' + num;

    return num;
  }

  //returned regex assumes decimalSeparator is as per prop
  getNumberRegex(g: boolean, ignoreDecimalSeparator?: boolean) {
    const {format, decimalPrecision} = this.props;
    const {decimalSeparator} = this.getSeparators();
    return new RegExp('\\d' + (decimalSeparator && decimalPrecision !== 0 && !ignoreDecimalSeparator && !format ? '|' + escapeRegExp(decimalSeparator) : ''), g ? 'g' : undefined);
  }

  getSeparators() {
    const {decimalSeparator} = this.props;
    let {thousandSeparator} = this.props;

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

  getMaskAtIndex (index: number) {
    const {mask = ' '} = this.props;
    if (typeof mask === 'string') {
      return mask;
    }

    return mask[index] || ' ';
  }

  /** Misc methods end **/


  /** caret specific methods **/
  setCaretPosition(el: HTMLInputElement, caretPos: number) {
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

  setPatchedCaretPosition(el: HTMLInputElement, caretPos: number, currentValue: string) {
    /* setting caret position within timeout of 0ms is required for mobile chrome,
    otherwise browser resets the caret position after we set it
    We are also setting it without timeout so that in normal browser we don't see the flickering */
    this.setCaretPosition(el, caretPos);
    setTimeout(() => {
      if(el.value === currentValue) this.setCaretPosition(el, caretPos);
    }, 0);
  }

  /* This keeps the caret within typing area so people can't type in between prefix or suffix */
  correctCaretPosition(value: string, caretPos: number, direction?: string) {
    const {prefix, suffix, format} = this.props;

    //in case of format as number limit between prefix and suffix
    if (!format) {
      return Math.min(Math.max(caretPos, prefix.length), (value.length - suffix.length));
    }

    //in case if custom format method don't do anything
    if (typeof format === 'function') return caretPos;

    //in case format is string find the closest # position from the caret position
    if (format[caretPos] === '#' && charIsNumber(value[caretPos])) return caretPos;


    //find the nearest caret position
    const firstHashPosition = format.indexOf('#');
    const lastHashPosition = format.lastIndexOf('#');

    //limit the cursor between the first # position and the last hash position
    caretPos = Math.min(Math.max(caretPos, firstHashPosition), lastHashPosition + 1);

    const nextPos = format.substring(caretPos, format.length).indexOf('#');
    let caretLeftBound = caretPos;
    const caretRightBoud = caretPos + (nextPos === -1 ? 0 : nextPos)

    //get the position where the last number is present
    while (caretLeftBound > firstHashPosition && (format[caretLeftBound] !== '#' || !charIsNumber(value[caretLeftBound]))) {
      caretLeftBound -= 1;
    }

    const goToLeft = !charIsNumber(value[caretRightBoud])
    || (direction === 'left' && caretPos !== firstHashPosition)
    || (caretPos - caretLeftBound < caretRightBoud - caretPos);

    return goToLeft ? caretLeftBound + 1 : caretRightBoud;
  }

  getCaretPosition(inputValue: string, formattedValue: string, caretPos: number) {
    const {format} = this.props;
    const stateValue = this.state.value;
    const numRegex = this.getNumberRegex(true);
    const inputNumber = (inputValue.match(numRegex) || []).join('');
    const formattedNumber = (formattedValue.match(numRegex) || []).join('');
    let j, i;

    j = 0;

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

    //fix the initial input cursor position when format pattern is defined and has number in pattern before the hash
    //inputValue.length will be only less in case of initial input or delete
    if (typeof format === 'string' && !stateValue) {
      //set it to the maximum value so it goes after the last number
      j = formattedValue.length
    }

    //correct caret position if its outsize of editable area
    j = this.correctCaretPosition(formattedValue, j);

    return j;
  }
  /** caret specific methods ends **/


  /** methods to remove formattting **/
  removePrefixAndSuffix(val: string) {
    const {format, prefix, suffix} = this.props;

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

  removePatternFormatting(val: string) {
    const {format} = this.props;
    const formatArray = format.split('#').filter(str => str !== '');
    let start = 0;
    let numStr = '';

    for (let i=0, ln=formatArray.length; i <= ln; i++) {
      const part = formatArray[i] || '';

      //if i is the last fragment take the index of end of the value
      //For case like +1 (911) 911 91 91 having pattern +1 (###) ### ## ##
      const index = i === ln ? val.length : val.indexOf(part, start);

      /* in any case if we don't find the pattern part in the value assume the val as numeric string
      This will be also in case if user has started typing, in any other case it will not be -1
      unless wrong prop value is provided */
      if (index === -1) {
        numStr = val;
        break;
      } else {
        numStr += val.substring(start, index);
        start = index + part.length;
      }
    }

    return (numStr.match(/\d/g) || []).join('');
  }

  removeFormatting(val: string) {
    const {format, removeFormatting} = this.props;
    if (!val) return val;

    if (!format) {
      val = this.removePrefixAndSuffix(val);
      val = this.getFloatString(val);
    } else if (typeof format === 'string') {
      val = this.removePatternFormatting(val);
    } else if (typeof removeFormatting === 'function') { //condition need to be handled if format method is provide,
      val = removeFormatting(val);
    } else {
      val = (val.match(/\d/g) || []).join('')
    }
    return val;
  }
  /** methods to remove formattting end **/


  /*** format specific methods start ***/
  /**
   * Format when # based string is provided
   * @param  {string} numStr Numeric String
   * @return {string}        formatted Value
   */
  formatWithPattern(numStr: string) {
    const {format} = this.props;
    let hashCount = 0;
    const formattedNumberAry = format.split('');
    for (let i = 0, ln = format.length; i < ln; i++) {
      if (format[i] === '#') {
        formattedNumberAry[i] = numStr[hashCount] || this.getMaskAtIndex(hashCount);
        hashCount += 1;
      }
    }
    return formattedNumberAry.join('');
  }
  /**
   * @param  {string} numStr Numeric string/floatString] It always have decimalSeparator as .
   * @return {string} formatted Value
   */
  formatAsNumber(numStr: string) {
    const {decimalPrecision, allowNegative, prefix, suffix} = this.props;
    const {thousandSeparator, decimalSeparator} = this.getSeparators();

    // Check if its negative number and remove negation for futher formatting
    const hasNagation = numStr[0] === '-';
    numStr = numStr.replace('-', '');

    const hasDecimalSeparator = numStr.indexOf('.') !== -1 || decimalPrecision;

    const parts = numStr.split('.');
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

    //restore negation sign
    if (hasNagation && allowNegative) beforeDecimal = '-' + beforeDecimal;

    numStr = beforeDecimal + (hasDecimalSeparator && decimalSeparator ||  '') + afterDecimal;

    return numStr;
  }

  formatNumString(value: string) {
    const {format} = this.props;
    let formattedValue = value;

    //if value has negation or double negation without any number remove it as it should be only on formattedValue
    if (value === '-' || value === '--') value = '';

    if (value === '') {
      formattedValue = ''
    } else if (typeof format === 'string') {
      formattedValue = this.formatWithPattern(formattedValue);
    } else if (typeof format === 'function') {
      formattedValue = format(formattedValue);
    } else {
      formattedValue = this.formatAsNumber(formattedValue)
    }

    return {
      value,
      formattedValue
    }
  }

  formatValueProp() {
    const {format, decimalPrecision} = this.props;
    let {value, isNumericString} = this.props;

    if (value === undefined) return;

    if (typeof value === 'number') {
      value = value.toString();
      isNumericString = true;
    }

    //round the number based on decimalPrecision
    if (isNumericString && !format && typeof decimalPrecision === 'number') {
      value = roundToPrecision(value, decimalPrecision)
    }

    const values = isNumericString ? this.formatNumString(value) : this.formatInput(value);

    return values.formattedValue;
  }

  formatNegation(value: string = '') {
    const {allowNegative} = this.props;
    const negationRegex = new RegExp('(-)');
    const doubleNegationRegex = new RegExp('(-)(.)*(-)');

    // Check number has '-' value
    const hasNegation = negationRegex.test(value);

    // Check number has 2 or more '-' values
    const removeNegation = doubleNegationRegex.test(value);

    //remove negation
    value = value.replace(/-/g, '');

    if (hasNegation && !removeNegation && allowNegative) {
      value = '-' + value;
    }

    return value;
  }

  formatInput(value: string = '') {
    const {format} = this.props;

    //format negation only if we are formatting as number
    if (!format) {
      value = this.formatNegation(value);
    }

    //remove formatting from number
    value = this.removeFormatting(value);

    return this.formatNumString(value);
  }

  /*** format specific methods end ***/

  onChange(e: SyntheticInputEvent) {
    e.persist();
    const el = e.target;
    const inputValue = el.value;
    const {state, props} = this;
    const {isAllowed} = props;
    const lastValue = state.value || '';
    let {formattedValue = '', value} = this.formatInput(inputValue); // eslint-disable-line prefer-const

    /*Max of selectionStart and selectionEnd is taken for the patch of pixel and other mobile device caret bug*/
    const currentCaretPosition = Math.max(el.selectionStart, el.selectionEnd);

    const valueObj = {
      formattedValue,
      value,
      floatValue: parseFloat(value)
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

  onKeyDown(e: SyntheticKeyboardInputEvent) {
    const el = e.target;
    const {selectionEnd, value} = el;
    let {selectionStart} = el;
    const {decimalPrecision, prefix, suffix, format} = this.props;
    const {key} = e;
    const numRegex = this.getNumberRegex(false, decimalPrecision !== undefined);
    const negativeRegex = new RegExp('-');
    const isPatternFormat = typeof format === 'string';

    //Handle backspace and delete against non numerical/decimal characters
    if(selectionStart === selectionEnd) {
      let newCaretPosition = selectionStart;
      const leftBound = isPatternFormat ? format.indexOf('#') : prefix.length;
      const rightBound = isPatternFormat ? format.lastIndexOf('#') + 1 : value.length - suffix.length;

      if (key === 'ArrowLeft' || key === 'ArrowRight') {
        const direction = key === 'ArrowLeft' ? 'left' : 'right';
        selectionStart += key === 'ArrowLeft' ? -1 : +1;
        newCaretPosition = this.correctCaretPosition(value, selectionStart, direction);
      } else if (key === 'Delete' && !numRegex.test(value[selectionStart]) && !negativeRegex.test(value[selectionStart])) {
        while (!numRegex.test(value[newCaretPosition]) && newCaretPosition < rightBound) newCaretPosition++;
      } else if (key === 'Backspace' && !numRegex.test(value[selectionStart - 1]) && !negativeRegex.test(value[selectionStart-1])) {
        while (!numRegex.test(value[newCaretPosition - 1]) && newCaretPosition > leftBound) newCaretPosition--;
      }

      if (newCaretPosition !== selectionStart || newCaretPosition === leftBound || newCaretPosition === rightBound + 1) {
        e.preventDefault();
        this.setPatchedCaretPosition(el, newCaretPosition, value);
      }
    }

    this.props.onKeyDown(e);
  }

  onMouseUp(e: SyntheticMouseInputEvent) {
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
    const {type, displayType, customInput, renderText} = this.props;
    const {value} = this.state;

    const otherProps = omit(this.props, propTypes);

    const inputProps = Object.assign({}, otherProps, {
      type,
      value,
      onChange: this.onChange,
      onKeyDown: this.onKeyDown,
      onMouseUp: this.onMouseUp
    })

    if( displayType === 'text'){
      return renderText ? (renderText(value) || null) : <span {...otherProps}>{value}</span>;
    }

    else if (customInput) {
      const CustomInput = customInput;
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
