//@flow
import PropTypes from 'prop-types';
import React from 'react';

import {
  noop,
  returnTrue,
  charIsNumber,
  escapeRegExp,
  fixLeadingZero,
  limitToScale,
  roundToPrecision,
  omit,
  setCaretPosition,
  splitDecimal,
  findChangedIndex
} from './utils';


const propTypes = {
  thousandSeparator: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([true])]),
  decimalSeparator: PropTypes.string,
  decimalScale: PropTypes.number,
  fixedDecimalScale: PropTypes.bool,
  displayType: PropTypes.oneOf(['input', 'text']),
  prefix: PropTypes.string,
  suffix: PropTypes.string,
  format: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func
  ]),
  removeFormatting: PropTypes.func,
  mask: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  value: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]),
  isNumericString: PropTypes.bool,
  customInput: PropTypes.func,
  allowNegative: PropTypes.bool,
  onValueChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  onMouseUp: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  type: PropTypes.oneOf(['text', 'tel']),
  isAllowed: PropTypes.func,
  renderText: PropTypes.func,
  getInputRef: PropTypes.func
};

const defaultProps = {
  displayType: 'input',
  decimalSeparator: '.',
  fixedDecimalScale: false,
  prefix: '',
  suffix: '',
  allowNegative: true,
  isNumericString: false,
  type: 'text',
  onValueChange: noop,
  onChange: noop,
  onKeyDown: noop,
  onMouseUp: noop,
  onFocus: noop,
  onBlur: noop,
  isAllowed: returnTrue,
  getInputRef: noop
};

class NumberFormat extends React.Component {
  state: {
    value?: string,
    numAsString?: string
  }
  onChange: Function
  onKeyDown: Function
  onMouseUp: Function
  onFocus: Function
  onBlur: Function
  selectionBeforeInput: {
    selectionStart: number,
    selectionEnd: number
  }
  static defaultProps: Object
  constructor(props: Object) {
    super(props);

    //validate props
    this.validateProps();

    const formattedValue = this.formatValueProp();

    this.state = {
      value: formattedValue,
      numAsString: this.removeFormatting(formattedValue)
    }

    this.selectionBeforeInput = {
      selectionStart: 0,
      selectionEnd: 0
    };

    this.onChange = this.onChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }

  componentDidUpdate(prevProps: Object) {
    this.updateValueIfRequired(prevProps);
  }

  updateValueIfRequired(prevProps: Object) {
    const {props, state} = this;

    if(prevProps !== props) {
      //validate props
      this.validateProps();

      const stateValue = state.value;

      const lastNumStr = state.numAsString || '';

      const formattedValue = props.value === undefined ? this.formatNumString(lastNumStr) : this.formatValueProp();

      if (formattedValue !== stateValue) {
        this.setState({
          value : formattedValue,
          numAsString: this.removeFormatting(formattedValue)
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
    const {format, decimalScale} = this.props;
    const {decimalSeparator} = this.getSeparators();
    return new RegExp('\\d' + (decimalSeparator && decimalScale !== 0 && !ignoreDecimalSeparator && !format ? '|' + escapeRegExp(decimalSeparator) : ''), g ? 'g' : undefined);
  }

  getSeparators() {
    const {decimalSeparator} = this.props;
    let {thousandSeparator} = this.props;

    if (thousandSeparator === true) {
      thousandSeparator = ','
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

  validateProps() {
    const {mask} = this.props;

    //validate decimalSeparator and thousandSeparator
    const {decimalSeparator, thousandSeparator} = this.getSeparators();


    if (decimalSeparator === thousandSeparator) {
      throw new Error(`
          Decimal separator can\'t be same as thousand separator.\n
          thousandSeparator: ${thousandSeparator} (thousandSeparator = {true} is same as thousandSeparator = ",")
          decimalSeparator: ${decimalSeparator} (default value for decimalSeparator is .)
       `);
    }

    //validate mask
    if (mask) {
      const maskAsStr = mask === 'string' ? mask : mask.toString();
      if (maskAsStr.match(/\d/g)) {
        throw new Error(`
          Mask ${mask} should not contain numeric character;
        `)
      }
    }

  }
  /** Misc methods end **/

  /** caret specific methods **/
  setPatchedCaretPosition(el: HTMLInputElement, caretPos: number, currentValue: string) {
    /* setting caret position within timeout of 0ms is required for mobile chrome,
    otherwise browser resets the caret position after we set it
    We are also setting it without timeout so that in normal browser we don't see the flickering */
    setCaretPosition(el, caretPos);
    setTimeout(() => {
      if(el.value === currentValue) setCaretPosition(el, caretPos);
    }, 0);
  }

  /* This keeps the caret within typing area so people can't type in between prefix or suffix */
  correctCaretPosition(value: string, caretPos: number, direction?: string) {
    const {prefix, suffix, format} = this.props;

    //in case of format as number limit between prefix and suffix
    if (!format) {
      const hasNegation = value[0] === '-';
      return Math.min(Math.max(caretPos, prefix.length + (hasNegation ? 1 : 0)), (value.length - suffix.length));
    }

    //in case if custom format method don't do anything
    if (typeof format === 'function') return caretPos;

    /* in case format is string find the closest # position from the caret position */

    //in case the caretPos have input value on it don't do anything
    if (format[caretPos] === '#' && charIsNumber(value[caretPos])) return caretPos;

    //if caretPos is just after input value don't do anything
    if (format[caretPos - 1] === '#' && charIsNumber(value[caretPos - 1])) return caretPos;

    //find the nearest caret position
    const firstHashPosition = format.indexOf('#');
    const lastHashPosition = format.lastIndexOf('#');

    //limit the cursor between the first # position and the last # position
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
      const currentInputChar = inputValue[i] || '';
      const currentFormatChar = formattedValue[j] || '';
      //no need to increase new cursor position if formatted value does not have those characters
      //case inputValue = 1a23 and formattedValue =  123
      if(!currentInputChar.match(numRegex) && currentInputChar !== currentFormatChar) continue;

      //When we are striping out leading zeros maintain the new cursor position
      //Case inputValue = 00023 and formattedValue = 23;
      if (currentInputChar === '0' && currentFormatChar.match(numRegex) && currentFormatChar !== '0' && inputNumber.length !== formattedNumber.length) continue;

      //we are not using currentFormatChar because j can change here
      while(currentInputChar !== formattedValue[j] && j < formattedValue.length) j++;
      j++;
    }

    if ((typeof format === 'string' && !stateValue)) {
      //set it to the maximum value so it goes after the last number
      j = formattedValue.length;
    }

    //correct caret position if its outside of editable area
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
    const {decimalScale, fixedDecimalScale, prefix, suffix, allowNegative} = this.props;
    const {thousandSeparator, decimalSeparator} = this.getSeparators();

    const hasDecimalSeparator = numStr.indexOf('.') !== -1 || (decimalScale && fixedDecimalScale);
    let {beforeDecimal, afterDecimal, addNegation} = splitDecimal(numStr, allowNegative); // eslint-disable-line prefer-const

    //apply decimal precision if its defined
    if (decimalScale !== undefined) afterDecimal = limitToScale(afterDecimal, decimalScale, fixedDecimalScale);

    if(thousandSeparator) {
      beforeDecimal = beforeDecimal.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + thousandSeparator);
    }

    //add prefix and suffix
    if(prefix) beforeDecimal = prefix + beforeDecimal;
    if(suffix) afterDecimal = afterDecimal + suffix;

    //restore negation sign
    if (addNegation) beforeDecimal = '-' + beforeDecimal;

    numStr = beforeDecimal + (hasDecimalSeparator && decimalSeparator ||  '') + afterDecimal;

    return numStr;
  }

  formatNumString(value: string = '') {
    const {format} = this.props;
    let formattedValue = value;

    if (value === '') {
      formattedValue = ''
    } else if (value === '-' && !format) {
      formattedValue = '-';
      value = '';
    } else if (typeof format === 'string') {
      formattedValue = this.formatWithPattern(formattedValue);
    } else if (typeof format === 'function') {
      formattedValue = format(formattedValue);
    } else {
      formattedValue = this.formatAsNumber(formattedValue)
    }

    return formattedValue;
  }

  formatValueProp() {
    const {format, decimalScale, fixedDecimalScale} = this.props;
    let {value, isNumericString} = this.props;

    // if value is not defined return empty string
    if (value === undefined) return '';

    if (typeof value === 'number') {
      value = value.toString();
      isNumericString = true;
    }

    //round the number based on decimalScale
    //format only if non formatted value is provided
    if (isNumericString && !format && typeof decimalScale === 'number') {
      value = roundToPrecision(value, decimalScale, fixedDecimalScale)
    }

    const formattedValue = isNumericString ? this.formatNumString(value) : this.formatInput(value);

    return formattedValue;
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
  isCharacterAFormat(caretPos: number, value: string) {
    const {format, prefix, suffix, decimalScale, fixedDecimalScale} = this.props;
    const {decimalSeparator} = this.getSeparators();

    //check within format pattern
    if (typeof format === 'string' && format[caretPos] !== '#') return true;

    //check in number format
    if (!format && (caretPos < prefix.length
      || caretPos >= value.length - suffix.length
      || (decimalScale && fixedDecimalScale && value[caretPos] === decimalSeparator))
    ) {
      return true;
    }

    return false;
  }

  checkIfFormatGotDeleted(start: number, end: number, value: string) {
    for (let i = start; i < end; i++) {
      if (this.isCharacterAFormat(i, value)) return true;
    }
    return false;
  }

  /**
   * This will check if any formatting got removed by the delete or backspace and reset the value
   * It will also work as fallback if android chome keyDown handler does not work
   **/
  correctInputValue(caretPos: number, lastValue: string, value: string) {
    const {format, decimalSeparator, allowNegative} = this.props;
    const lastNumStr = this.state.numAsString || '';
    const {selectionStart, selectionEnd} = this.selectionBeforeInput;
    const {start, end} = findChangedIndex(lastValue, value);

    /* don't do anyhting if something got added,
     or if value is empty string (when whole input is cleared)
     or whole input is replace with a number
    */
    if (
      value.length > lastValue.length
      || !value.length ||
      start === end ||
      (start === 0 && end === lastValue.length) ||
      (selectionStart === 0 && selectionEnd === lastValue.length)
    ) {
      return value;
    }

    //if format got deleted reset the value to last value
    if (this.checkIfFormatGotDeleted(start, end, lastValue)) {
      value = lastValue;
    }

    //for numbers check if beforeDecimal got deleted and there is nothing after decimal,
    //clear all numbers in such case while keeping the - sign
    if (!format) {
      const numericString = this.removeFormatting(value);
      let {beforeDecimal, afterDecimal, addNegation} = splitDecimal(numericString, allowNegative); // eslint-disable-line prefer-const

      //clear only if something got deleted
      const isBeforeDecimalPoint = caretPos < value.indexOf(decimalSeparator) + 1;
      if (numericString.length < lastNumStr.length && isBeforeDecimalPoint && beforeDecimal === '' && !parseFloat(afterDecimal)) {
        return addNegation ? '-' : '';
      }
    }

    return value;
  }

  onChange(e: SyntheticInputEvent) {
    e.persist();
    const el = e.target;
    let inputValue = el.value;
    const {state, props} = this;
    const {isAllowed} = props;
    const lastValue = state.value || '';

    /*Max of selectionStart and selectionEnd is taken for the patch of pixel and other mobile device caret bug*/
    const currentCaretPosition = Math.max(el.selectionStart, el.selectionEnd);

    inputValue =  this.correctInputValue(currentCaretPosition, lastValue, inputValue);

    let formattedValue = this.formatInput(inputValue) || '';
    const numAsString = this.removeFormatting(formattedValue);

    const valueObj = {
      formattedValue,
      value: numAsString,
      floatValue: parseFloat(numAsString)
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
      this.setState({value : formattedValue, numAsString}, () => {
        props.onValueChange(valueObj);
        props.onChange(e);
      });
    } else {
      props.onChange(e);
    }
  }

  onBlur(e: SyntheticInputEvent) {
    const {props, state} = this;
    const {format, onBlur} = props;
    let {numAsString} = state;
    const lastValue = state.value;
    if (!format) {
      numAsString = fixLeadingZero(numAsString);
      const formattedValue = this.formatNumString(numAsString);
      const valueObj = {
        formattedValue,
        value: numAsString,
        floatValue: parseFloat(numAsString)
      };

      //change the state
      if (formattedValue !== lastValue) {
        // the event needs to be persisted because its properties can be accessed in an asynchronous way
        e.persist();
        this.setState({value : formattedValue, numAsString}, () => {
          props.onValueChange(valueObj);
          onBlur(e);
        });
        return;
      }
    }
    onBlur(e);
  }

  onKeyDown(e: SyntheticKeyboardInputEvent) {
    const el = e.target;
    const {key} = e;
    const {selectionStart, selectionEnd, value} = el;
    let expectedCaretPosition;
    const {decimalScale, fixedDecimalScale, prefix, suffix, format, onKeyDown} = this.props;
    const ignoreDecimalSeparator = decimalScale !== undefined && fixedDecimalScale;
    const numRegex = this.getNumberRegex(false, ignoreDecimalSeparator);
    const negativeRegex = new RegExp('-');
    const isPatternFormat = typeof format === 'string';

    this.selectionBeforeInput = {
      selectionStart,
      selectionEnd
    }

    //Handle backspace and delete against non numerical/decimal characters or arrow keys
    if (key === 'ArrowLeft' || key === 'Backspace') {
      expectedCaretPosition = selectionStart - 1;
    } else if (key === 'ArrowRight') {
      expectedCaretPosition = selectionStart + 1;
    } else if (key === 'Delete') {
      expectedCaretPosition = selectionStart;
    }

    //if expectedCaretPosition is not set it means we don't want to Handle keyDown
    //also if multiple characters are selected don't handle
    if (expectedCaretPosition === undefined || selectionStart !== selectionEnd) {
      onKeyDown(e);
      return;
    }

    let newCaretPosition = expectedCaretPosition;
    const leftBound = isPatternFormat ? format.indexOf('#') : prefix.length;
    const rightBound = isPatternFormat ? format.lastIndexOf('#') + 1 : value.length - suffix.length;

    if (key === 'ArrowLeft' || key === 'ArrowRight') {
      const direction = key === 'ArrowLeft' ? 'left' : 'right';
      newCaretPosition = this.correctCaretPosition(value, expectedCaretPosition, direction);
    } else if (key === 'Delete' && !numRegex.test(value[expectedCaretPosition]) && !negativeRegex.test(value[expectedCaretPosition])) {
      while (!numRegex.test(value[newCaretPosition]) && newCaretPosition < rightBound) newCaretPosition++;
    } else if (key === 'Backspace' && !numRegex.test(value[expectedCaretPosition]) && !negativeRegex.test(value[expectedCaretPosition])) {
      while (!numRegex.test(value[newCaretPosition - 1]) && newCaretPosition > leftBound){ newCaretPosition--; }
      newCaretPosition = this.correctCaretPosition(value, newCaretPosition, 'left');
    }


    if (newCaretPosition !== expectedCaretPosition || expectedCaretPosition < leftBound || expectedCaretPosition > rightBound) {
      e.preventDefault();
      this.setPatchedCaretPosition(el, newCaretPosition, value);
    }

    /* NOTE: this is just required for unit test as we need to get the newCaretPosition,
            Remove this when you find different solution */
    if (e.isUnitTestRun) {
      this.setPatchedCaretPosition(el, newCaretPosition, value);
    }


    this.props.onKeyDown(e);

  }

  /** required to handle the caret position when click anywhere within the input **/
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

  onFocus(e: SyntheticInputEvent) {
    // Workaround Chrome and Safari bug https://bugs.chromium.org/p/chromium/issues/detail?id=779328
    // (onFocus event target selectionStart is always 0 before setTimeout)
    e.persist()
    setTimeout(() => {
      const el = e.target;
      const {selectionStart, value} = el;

      const caretPosition = this.correctCaretPosition(value, selectionStart);
      if (caretPosition !== selectionStart) {
        this.setPatchedCaretPosition(el, caretPosition, value);
      }

      this.props.onFocus(e);
    }, 0);
  }

  render() {
    const {type, displayType, customInput, renderText, getInputRef} = this.props;
    const {value} = this.state;

    const otherProps = omit(this.props, propTypes);

    const inputProps = Object.assign({}, otherProps, {
      type,
      value,
      onChange: this.onChange,
      onKeyDown: this.onKeyDown,
      onMouseUp: this.onMouseUp,
      onFocus: this.onFocus,
      onBlur: this.onBlur
    })

    if( displayType === 'text'){
      return renderText ? (renderText(value) || null) : <span {...otherProps} ref={getInputRef}>{value}</span>;
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
        ref = {getInputRef}
      />
    )
  }
}

NumberFormat.propTypes = propTypes;
NumberFormat.defaultProps = defaultProps;

module.exports =  NumberFormat;
