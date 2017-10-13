'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var propTypes = {
  thousandSeparator: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.oneOf([true])]),
  decimalSeparator: _propTypes2.default.string,
  decimalPrecision: _propTypes2.default.number,
  displayType: _propTypes2.default.oneOf(['input', 'text']),
  prefix: _propTypes2.default.string,
  suffix: _propTypes2.default.string,
  format: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.func]),
  removeFormatting: _propTypes2.default.func,
  mask: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.arrayOf(_propTypes2.default.string)]),
  value: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]),
  isNumericString: _propTypes2.default.bool,
  customInput: _propTypes2.default.func,
  allowNegative: _propTypes2.default.bool,
  onKeyDown: _propTypes2.default.func,
  onMouseUp: _propTypes2.default.func,
  onChange: _propTypes2.default.func,
  onFocus: _propTypes2.default.func,
  type: _propTypes2.default.oneOf(['text', 'tel']),
  isAllowed: _propTypes2.default.func,
  renderText: _propTypes2.default.func
};

var defaultProps = {
  displayType: 'input',
  decimalSeparator: '.',
  prefix: '',
  suffix: '',
  allowNegative: true,
  isNumericString: false,
  type: 'text',
  onChange: _utils.noop,
  onKeyDown: _utils.noop,
  onMouseUp: _utils.noop,
  onFocus: _utils.noop,
  isAllowed: _utils.returnTrue
};

var NumberFormat = function (_React$Component) {
  _inherits(NumberFormat, _React$Component);

  function NumberFormat(props) {
    _classCallCheck(this, NumberFormat);

    //validate props
    var _this = _possibleConstructorReturn(this, (NumberFormat.__proto__ || Object.getPrototypeOf(NumberFormat)).call(this, props));

    _this.validateProps();

    var formattedValue = _this.formatValueProp();

    _this.state = {
      value: formattedValue,
      numAsString: _this.removeFormatting(formattedValue)
    };

    _this.onChange = _this.onChange.bind(_this);
    _this.onKeyDown = _this.onKeyDown.bind(_this);
    _this.onMouseUp = _this.onMouseUp.bind(_this);
    _this.onFocus = _this.onFocus.bind(_this);
    return _this;
  }

  _createClass(NumberFormat, [{
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      this.updateValueIfRequired(prevProps);
    }
  }, {
    key: 'updateValueIfRequired',
    value: function updateValueIfRequired(prevProps) {
      var props = this.props,
          state = this.state;


      if (prevProps !== props) {
        //validate props
        this.validateProps();

        var stateValue = state.value;

        var lastNumStr = state.numAsString || '';

        var formattedValue = props.value === undefined ? this.formatNumString(lastNumStr).formattedValue : this.formatValueProp();

        if (formattedValue !== stateValue) {
          this.setState({
            value: formattedValue,
            numAsString: this.removeFormatting(formattedValue)
          });
        }
      }
    }

    /** Misc methods **/

  }, {
    key: 'getFloatString',
    value: function getFloatString() {
      var num = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

      var _getSeparators = this.getSeparators(),
          decimalSeparator = _getSeparators.decimalSeparator;

      var numRegex = this.getNumberRegex(true);

      //remove negation for regex check
      var hasNegation = num[0] === '-';
      if (hasNegation) num = num.replace('-', '');

      num = (num.match(numRegex) || []).join('').replace(decimalSeparator, '.');

      //remove extra decimals
      var firstDecimalIndex = num.indexOf('.');

      if (firstDecimalIndex !== -1) {
        num = num.substring(0, firstDecimalIndex) + '.' + num.substring(firstDecimalIndex + 1, num.length).replace(new RegExp((0, _utils.escapeRegExp)(decimalSeparator), 'g'), '');
      }

      //add negation back
      if (hasNegation) num = '-' + num;

      return num;
    }

    //returned regex assumes decimalSeparator is as per prop

  }, {
    key: 'getNumberRegex',
    value: function getNumberRegex(g, ignoreDecimalSeparator) {
      var _props = this.props,
          format = _props.format,
          decimalPrecision = _props.decimalPrecision;

      var _getSeparators2 = this.getSeparators(),
          decimalSeparator = _getSeparators2.decimalSeparator;

      return new RegExp('\\d' + (decimalSeparator && decimalPrecision !== 0 && !ignoreDecimalSeparator && !format ? '|' + (0, _utils.escapeRegExp)(decimalSeparator) : ''), g ? 'g' : undefined);
    }
  }, {
    key: 'getSeparators',
    value: function getSeparators() {
      var decimalSeparator = this.props.decimalSeparator;
      var thousandSeparator = this.props.thousandSeparator;


      if (thousandSeparator === true) {
        thousandSeparator = ',';
      }

      return {
        decimalSeparator: decimalSeparator,
        thousandSeparator: thousandSeparator
      };
    }
  }, {
    key: 'getMaskAtIndex',
    value: function getMaskAtIndex(index) {
      var _props$mask = this.props.mask,
          mask = _props$mask === undefined ? ' ' : _props$mask;

      if (typeof mask === 'string') {
        return mask;
      }

      return mask[index] || ' ';
    }
  }, {
    key: 'validateProps',
    value: function validateProps() {
      var mask = this.props.mask;

      //validate decimalSeparator and thousandSeparator

      var _getSeparators3 = this.getSeparators(),
          decimalSeparator = _getSeparators3.decimalSeparator,
          thousandSeparator = _getSeparators3.thousandSeparator;

      if (decimalSeparator === thousandSeparator) {
        throw new Error('\n          Decimal separator can\'t be same as thousand separator.\n\n          thousandSeparator: ' + thousandSeparator + ' (thousandSeparator = {true} is same as thousandSeparator = ",")\n          decimalSeparator: ' + decimalSeparator + ' (default value for decimalSeparator is .)\n       ');
      }

      //validate mask
      if (mask) {
        var maskAsStr = mask === 'string' ? mask : mask.toString();
        if (maskAsStr.match(/\d/g)) {
          throw new Error('\n          Mask ' + mask + ' should not contain numeric character;\n        ');
        }
      }
    }

    /** Misc methods end **/

    /** caret specific methods **/

  }, {
    key: 'setPatchedCaretPosition',
    value: function setPatchedCaretPosition(el, caretPos, currentValue) {
      /* setting caret position within timeout of 0ms is required for mobile chrome,
      otherwise browser resets the caret position after we set it
      We are also setting it without timeout so that in normal browser we don't see the flickering */
      (0, _utils.setCaretPosition)(el, caretPos);
      setTimeout(function () {
        if (el.value === currentValue) (0, _utils.setCaretPosition)(el, caretPos);
      }, 0);
    }

    /* This keeps the caret within typing area so people can't type in between prefix or suffix */

  }, {
    key: 'correctCaretPosition',
    value: function correctCaretPosition(value, caretPos, direction) {
      var _props2 = this.props,
          prefix = _props2.prefix,
          suffix = _props2.suffix,
          format = _props2.format;

      //in case of format as number limit between prefix and suffix

      if (!format) {
        var hasNegation = value[0] === '-';
        return Math.min(Math.max(caretPos, prefix.length + (hasNegation ? 1 : 0)), value.length - suffix.length);
      }

      //in case if custom format method don't do anything
      if (typeof format === 'function') return caretPos;

      /* in case format is string find the closest # position from the caret position */

      //in case the caretPos have input value on it don't do anything
      if (format[caretPos] === '#' && (0, _utils.charIsNumber)(value[caretPos])) return caretPos;

      //if caretPos is just after input value don't do anything
      if (format[caretPos - 1] === '#' && (0, _utils.charIsNumber)(value[caretPos - 1])) return caretPos;

      //find the nearest caret position
      var firstHashPosition = format.indexOf('#');
      var lastHashPosition = format.lastIndexOf('#');

      //limit the cursor between the first # position and the last # position
      caretPos = Math.min(Math.max(caretPos, firstHashPosition), lastHashPosition + 1);

      var nextPos = format.substring(caretPos, format.length).indexOf('#');
      var caretLeftBound = caretPos;
      var caretRightBoud = caretPos + (nextPos === -1 ? 0 : nextPos);

      //get the position where the last number is present
      while (caretLeftBound > firstHashPosition && (format[caretLeftBound] !== '#' || !(0, _utils.charIsNumber)(value[caretLeftBound]))) {
        caretLeftBound -= 1;
      }

      var goToLeft = !(0, _utils.charIsNumber)(value[caretRightBoud]) || direction === 'left' && caretPos !== firstHashPosition || caretPos - caretLeftBound < caretRightBoud - caretPos;

      return goToLeft ? caretLeftBound + 1 : caretRightBoud;
    }
  }, {
    key: 'getCaretPosition',
    value: function getCaretPosition(inputValue, formattedValue, caretPos) {
      var format = this.props.format;

      var stateValue = this.state.value;
      var numRegex = this.getNumberRegex(true);
      var inputNumber = (inputValue.match(numRegex) || []).join('');
      var formattedNumber = (formattedValue.match(numRegex) || []).join('');
      var j = void 0,
          i = void 0;

      j = 0;

      for (i = 0; i < caretPos; i++) {
        var currentInputChar = inputValue[i];
        var currentFormatChar = formattedValue[j] || '';
        //no need to increase new cursor position if formatted value does not have those characters
        //case inputValue = 1a23 and formattedValue =  123
        if (!currentInputChar.match(numRegex) && currentInputChar !== currentFormatChar) continue;

        //When we are striping out leading zeros maintain the new cursor position
        //Case inputValue = 00023 and formattedValue = 23;
        if (currentInputChar === '0' && currentFormatChar.match(numRegex) && currentFormatChar !== '0' && inputNumber.length !== formattedNumber.length) continue;

        //we are not using currentFormatChar because j can change here
        while (currentInputChar !== formattedValue[j] && j < formattedValue.length) {
          j++;
        }j++;
      }

      if (typeof format === 'string' && !stateValue) {
        //set it to the maximum value so it goes after the last number
        j = formattedValue.length;
      }

      //correct caret position if its outside of editable area
      j = this.correctCaretPosition(formattedValue, j);

      return j;
    }
    /** caret specific methods ends **/

    /** methods to remove formattting **/

  }, {
    key: 'removePrefixAndSuffix',
    value: function removePrefixAndSuffix(val) {
      var _props3 = this.props,
          format = _props3.format,
          prefix = _props3.prefix,
          suffix = _props3.suffix;

      //remove prefix and suffix

      if (!format && val) {
        var isNegative = val[0] === '-';

        //remove negation sign
        if (isNegative) val = val.substring(1, val.length);

        //remove prefix
        val = prefix && val.indexOf(prefix) === 0 ? val.substring(prefix.length, val.length) : val;

        //remove suffix
        var suffixLastIndex = val.lastIndexOf(suffix);
        val = suffix && suffixLastIndex !== -1 && suffixLastIndex === val.length - suffix.length ? val.substring(0, suffixLastIndex) : val;

        //add negation sign back
        if (isNegative) val = '-' + val;
      }

      return val;
    }
  }, {
    key: 'removePatternFormatting',
    value: function removePatternFormatting(val) {
      var format = this.props.format;

      var formatArray = format.split('#').filter(function (str) {
        return str !== '';
      });
      var start = 0;
      var numStr = '';

      for (var i = 0, ln = formatArray.length; i <= ln; i++) {
        var part = formatArray[i] || '';

        //if i is the last fragment take the index of end of the value
        //For case like +1 (911) 911 91 91 having pattern +1 (###) ### ## ##
        var index = i === ln ? val.length : val.indexOf(part, start);

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
  }, {
    key: 'removeFormatting',
    value: function removeFormatting(val) {
      var _props4 = this.props,
          format = _props4.format,
          removeFormatting = _props4.removeFormatting;

      if (!val) return val;

      if (!format) {
        val = this.removePrefixAndSuffix(val);
        val = this.getFloatString(val);
      } else if (typeof format === 'string') {
        val = this.removePatternFormatting(val);
      } else if (typeof removeFormatting === 'function') {
        //condition need to be handled if format method is provide,
        val = removeFormatting(val);
      } else {
        val = (val.match(/\d/g) || []).join('');
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

  }, {
    key: 'formatWithPattern',
    value: function formatWithPattern(numStr) {
      var format = this.props.format;

      var hashCount = 0;
      var formattedNumberAry = format.split('');
      for (var i = 0, ln = format.length; i < ln; i++) {
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

  }, {
    key: 'formatAsNumber',
    value: function formatAsNumber(numStr) {
      var _props5 = this.props,
          decimalPrecision = _props5.decimalPrecision,
          allowNegative = _props5.allowNegative,
          prefix = _props5.prefix,
          suffix = _props5.suffix;

      var _getSeparators4 = this.getSeparators(),
          thousandSeparator = _getSeparators4.thousandSeparator,
          decimalSeparator = _getSeparators4.decimalSeparator;

      // Check if its negative number and remove negation for futher formatting


      var hasNagation = numStr[0] === '-';
      var addNegation = hasNagation && allowNegative;
      numStr = numStr.replace('-', '');

      var hasDecimalSeparator = numStr.indexOf('.') !== -1 || decimalPrecision;

      var parts = numStr.split('.');
      var beforeDecimal = parts[0];
      var afterDecimal = parts[1] || '';

      //if beforeDecimal is empty and after decimal is 0 clear the input while keeping the negation sign
      if (beforeDecimal === '' && !parseFloat(afterDecimal)) {
        return addNegation ? '-' : '';
      }

      //remove leading zeros from number before decimal
      beforeDecimal = (0, _utils.removeLeadingZero)(beforeDecimal);

      //apply decimal precision if its defined
      if (decimalPrecision !== undefined) afterDecimal = (0, _utils.limitToPrecision)(afterDecimal, decimalPrecision);

      if (thousandSeparator) {
        beforeDecimal = beforeDecimal.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + thousandSeparator);
      }

      //add prefix and suffix
      if (prefix) beforeDecimal = prefix + beforeDecimal;
      if (suffix) afterDecimal = afterDecimal + suffix;

      //restore negation sign
      if (addNegation) beforeDecimal = '-' + beforeDecimal;

      numStr = beforeDecimal + (hasDecimalSeparator && decimalSeparator || '') + afterDecimal;

      return numStr;
    }
  }, {
    key: 'formatNumString',
    value: function formatNumString(value) {
      var format = this.props.format;

      var formattedValue = value;

      if (value === '') {
        formattedValue = '';
      } else if (value === '-' && !format) {
        formattedValue = '-';
        value = '';
      } else if (typeof format === 'string') {
        formattedValue = this.formatWithPattern(formattedValue);
      } else if (typeof format === 'function') {
        formattedValue = format(formattedValue);
      } else {
        formattedValue = this.formatAsNumber(formattedValue);
      }

      return {
        value: value,
        formattedValue: formattedValue
      };
    }
  }, {
    key: 'formatValueProp',
    value: function formatValueProp() {
      var _props6 = this.props,
          format = _props6.format,
          decimalPrecision = _props6.decimalPrecision;
      var _props7 = this.props,
          value = _props7.value,
          isNumericString = _props7.isNumericString;

      // if value is not defined return empty string

      if (value === undefined) return '';

      if (typeof value === 'number') {
        value = value.toString();
        isNumericString = true;
      }

      //round the number based on decimalPrecision
      //format only if non formatted value is provided
      if (isNumericString && !format && typeof decimalPrecision === 'number') {
        value = (0, _utils.roundToPrecision)(value, decimalPrecision);
      }

      var values = isNumericString ? this.formatNumString(value) : this.formatInput(value);

      return values.formattedValue;
    }
  }, {
    key: 'formatNegation',
    value: function formatNegation() {
      var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      var allowNegative = this.props.allowNegative;

      var negationRegex = new RegExp('(-)');
      var doubleNegationRegex = new RegExp('(-)(.)*(-)');

      // Check number has '-' value
      var hasNegation = negationRegex.test(value);

      // Check number has 2 or more '-' values
      var removeNegation = doubleNegationRegex.test(value);

      //remove negation
      value = value.replace(/-/g, '');

      if (hasNegation && !removeNegation && allowNegative) {
        value = '-' + value;
      }

      return value;
    }
  }, {
    key: 'formatInput',
    value: function formatInput() {
      var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      var format = this.props.format;

      //format negation only if we are formatting as number

      if (!format) {
        value = this.formatNegation(value);
      }

      //remove formatting from number
      value = this.removeFormatting(value);

      return this.formatNumString(value);
    }

    /*** format specific methods end ***/

  }, {
    key: 'isCharacterAFormat',
    value: function isCharacterAFormat(caretPos, value) {
      var _props8 = this.props,
          format = _props8.format,
          prefix = _props8.prefix,
          suffix = _props8.suffix,
          decimalPrecision = _props8.decimalPrecision;

      var _getSeparators5 = this.getSeparators(),
          decimalSeparator = _getSeparators5.decimalSeparator;

      //check within format pattern


      if (typeof format === 'string' && format[caretPos] !== '#') return true;

      //check in number format
      if (!format && (caretPos < prefix.length || caretPos >= value.length - suffix.length || decimalPrecision && value[caretPos] === decimalSeparator)) {
        return true;
      }

      return false;
    }
  }, {
    key: 'checkIfFormatGotDeleted',
    value: function checkIfFormatGotDeleted(start, end, value) {
      for (var i = start; i < end; i++) {
        if (this.isCharacterAFormat(i, value)) return true;
      }
      return false;
    }

    /**
     * This will check if any formatting got removed by the delete or backspace and reset the value
     * It will also work as fallback if android chome keyDown handler does not work
     **/

  }, {
    key: 'correctInputValue',
    value: function correctInputValue(caretPos, lastValue, value) {
      //don't do anyhting if something got added, or if value is empty string (when whole input is cleared)
      if (value.length >= lastValue.length || !value.length) {
        return value;
      }

      var start = caretPos;
      var lastValueParts = (0, _utils.splitString)(lastValue, caretPos);
      var newValueParts = (0, _utils.splitString)(value, caretPos);
      var deletedIndex = lastValueParts[1].lastIndexOf(newValueParts[1]);
      var diff = deletedIndex !== -1 ? lastValueParts[1].substring(0, deletedIndex) : '';
      var end = start + diff.length;

      //if format got deleted reset the value to last value
      if (this.checkIfFormatGotDeleted(start, end, lastValue)) {
        value = lastValue;
      }

      return value;
    }
  }, {
    key: 'onChange',
    value: function onChange(e) {
      e.persist();
      var el = e.target;
      var inputValue = el.value;
      var state = this.state,
          props = this.props;
      var isAllowed = props.isAllowed;

      var lastValue = state.value || '';

      /*Max of selectionStart and selectionEnd is taken for the patch of pixel and other mobile device caret bug*/
      var currentCaretPosition = Math.max(el.selectionStart, el.selectionEnd);

      inputValue = this.correctInputValue(currentCaretPosition, lastValue, inputValue);

      var _formatInput = this.formatInput(inputValue),
          _formatInput$formatte = _formatInput.formattedValue,
          formattedValue = _formatInput$formatte === undefined ? '' : _formatInput$formatte,
          value = _formatInput.value; // eslint-disable-line prefer-const

      var valueObj = {
        formattedValue: formattedValue,
        value: value,
        floatValue: parseFloat(value)
      };

      if (!isAllowed(valueObj)) {
        formattedValue = lastValue;
      }

      //set the value imperatively, this is required for IE fix
      el.value = formattedValue;

      //get the caret position
      var caretPos = this.getCaretPosition(inputValue, formattedValue, currentCaretPosition);

      //set caret position
      this.setPatchedCaretPosition(el, caretPos, formattedValue);

      //change the state
      if (formattedValue !== lastValue) {
        this.setState({ value: formattedValue, numAsString: this.removeFormatting(formattedValue) }, function () {
          props.onChange(e, valueObj);
        });
      }

      return value;
    }
  }, {
    key: 'onKeyDown',
    value: function onKeyDown(e) {
      var el = e.target;
      var key = e.key;
      var selectionEnd = el.selectionEnd,
          value = el.value;
      var selectionStart = el.selectionStart;

      var expectedCaretPosition = void 0;
      var _props9 = this.props,
          decimalPrecision = _props9.decimalPrecision,
          prefix = _props9.prefix,
          suffix = _props9.suffix,
          format = _props9.format,
          onKeyDown = _props9.onKeyDown;

      var numRegex = this.getNumberRegex(false, decimalPrecision !== undefined);
      var negativeRegex = new RegExp('-');
      var isPatternFormat = typeof format === 'string';

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

      var newCaretPosition = expectedCaretPosition;
      var leftBound = isPatternFormat ? format.indexOf('#') : prefix.length;
      var rightBound = isPatternFormat ? format.lastIndexOf('#') + 1 : value.length - suffix.length;

      if (key === 'ArrowLeft' || key === 'ArrowRight') {
        var direction = key === 'ArrowLeft' ? 'left' : 'right';
        newCaretPosition = this.correctCaretPosition(value, expectedCaretPosition, direction);
      } else if (key === 'Delete' && !numRegex.test(value[expectedCaretPosition]) && !negativeRegex.test(value[expectedCaretPosition])) {
        while (!numRegex.test(value[newCaretPosition]) && newCaretPosition < rightBound) {
          newCaretPosition++;
        }
      } else if (key === 'Backspace' && !numRegex.test(value[expectedCaretPosition]) && !negativeRegex.test(value[expectedCaretPosition])) {
        while (!numRegex.test(value[newCaretPosition - 1]) && newCaretPosition > leftBound) {
          newCaretPosition--;
        }
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

  }, {
    key: 'onMouseUp',
    value: function onMouseUp(e) {
      var el = e.target;
      var selectionStart = el.selectionStart,
          selectionEnd = el.selectionEnd,
          value = el.value;


      if (selectionStart === selectionEnd) {
        var caretPostion = this.correctCaretPosition(value, selectionStart);
        if (caretPostion !== selectionStart) {
          this.setPatchedCaretPosition(el, caretPostion, value);
        }
      }

      this.props.onMouseUp(e);
    }
  }, {
    key: 'onFocus',
    value: function onFocus(e) {
      var el = e.target;
      var selectionStart = el.selectionStart,
          value = el.value;


      var caretPostion = this.correctCaretPosition(value, selectionStart);
      if (caretPostion !== selectionStart) {
        this.setPatchedCaretPosition(el, caretPostion, value);
      }

      this.props.onFocus(e);
    }
  }, {
    key: 'render',
    value: function render() {
      var _props10 = this.props,
          type = _props10.type,
          displayType = _props10.displayType,
          customInput = _props10.customInput,
          renderText = _props10.renderText;
      var value = this.state.value;


      var otherProps = (0, _utils.omit)(this.props, propTypes);

      var inputProps = _extends({}, otherProps, {
        type: type,
        value: value,
        onChange: this.onChange,
        onKeyDown: this.onKeyDown,
        onMouseUp: this.onMouseUp,
        onFocus: this.onFocus
      });

      if (displayType === 'text') {
        return renderText ? renderText(value) || null : _react2.default.createElement(
          'span',
          otherProps,
          value
        );
      } else if (customInput) {
        var CustomInput = customInput;
        return _react2.default.createElement(CustomInput, inputProps);
      }

      return _react2.default.createElement('input', inputProps);
    }
  }]);

  return NumberFormat;
}(_react2.default.Component);

NumberFormat.propTypes = propTypes;
NumberFormat.defaultProps = defaultProps;

module.exports = NumberFormat;