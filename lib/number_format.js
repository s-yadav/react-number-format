'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
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


function noop() {};

function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

function removeLeadingZero(numStr) {
  //remove leading zeros
  return numStr.replace(/^0+/, '') || '0';
}

function limitToPrecision(numStr, precision) {
  var str = '';
  for (var i = 0; i <= precision - 1; i++) {
    str += numStr[i] || '0';
  }
  return str;
}

function omit(obj, keyMaps) {
  var filteredObj = {};
  Object.keys(obj).forEach(function (key) {
    if (!keyMaps[key]) filteredObj[key] = obj[key];
  });
  return filteredObj;
}

var propTypes = {
  thousandSeparator: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.oneOf([true])]),
  decimalSeparator: _propTypes2.default.string,
  decimalPrecision: _propTypes2.default.number,
  displayType: _propTypes2.default.oneOf(['input', 'text']),
  prefix: _propTypes2.default.string,
  suffix: _propTypes2.default.string,
  format: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.func]),
  mask: _propTypes2.default.string,
  value: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]),
  customInput: _propTypes2.default.func,
  allowNegative: _propTypes2.default.bool,
  onKeyDown: _propTypes2.default.func,
  onChange: _propTypes2.default.func,
  type: _propTypes2.default.oneOf(['text', 'tel']),
  isAllowed: _propTypes2.default.func
};

var defaultProps = {
  displayType: 'input',
  decimalSeparator: '.',
  allowNegative: true,
  type: 'text',
  onChange: noop,
  onKeyDown: noop,
  isAllowed: function isAllowed() {
    return true;
  }
};

var NumberFormat = function (_React$Component) {
  _inherits(NumberFormat, _React$Component);

  function NumberFormat(props) {
    _classCallCheck(this, NumberFormat);

    var _this = _possibleConstructorReturn(this, (NumberFormat.__proto__ || Object.getPrototypeOf(NumberFormat)).call(this, props));

    var value = _this.optimizeValueProp(props);
    _this.state = {
      value: _this.formatInput(value).formattedValue
    };
    _this.onChange = _this.onChange.bind(_this);
    _this.onKeyDown = _this.onKeyDown.bind(_this);
    return _this;
  }

  _createClass(NumberFormat, [{
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps, prevState) {
      this.updateValueIfRequired(prevProps, prevState);
    }
  }, {
    key: 'updateValueIfRequired',
    value: function updateValueIfRequired(prevProps) {
      var props = this.props,
          state = this.state;


      if (prevProps !== props) {
        var stateValue = state.value;

        var value = this.optimizeValueProp(props);
        if (value === undefined) value = stateValue;

        var _formatInput = this.formatInput(value),
            formattedValue = _formatInput.formattedValue;

        if (formattedValue !== stateValue) {
          this.setState({
            value: formattedValue
          });
        }
      }
    }
  }, {
    key: 'getFloatValue',
    value: function getFloatValue(num) {
      var decimalSeparator = this.props.decimalSeparator;

      return parseFloat(num.replace(decimalSeparator, '.')) || 0;
    }
  }, {
    key: 'optimizeValueProp',
    value: function optimizeValueProp(props) {
      var _getSeparators = this.getSeparators(props),
          decimalSeparator = _getSeparators.decimalSeparator;

      var decimalPrecision = props.decimalPrecision,
          format = props.format;
      var value = props.value;


      if (format || value === undefined) return value;

      var isNumber = typeof value === 'number';

      if (isNumber) value = value.toString();

      //correct decimal separator
      if (decimalSeparator && isNumber) {
        value = value.replace('.', decimalSeparator);
      }

      //if decimalPrecision is 0 remove decimalNumbers
      if (decimalPrecision === 0) return value.split(decimalSeparator)[0];

      return value;
    }
  }, {
    key: 'getSeparators',
    value: function getSeparators(props) {
      props = props || this.props;

      var _props = props,
          decimalSeparator = _props.decimalSeparator;
      var _props2 = props,
          thousandSeparator = _props2.thousandSeparator;


      if (thousandSeparator === true) {
        thousandSeparator = ',';
      }

      if (decimalSeparator === thousandSeparator) {
        throw new Error('\n          Decimal separator can\'t be same as thousand separator.\n\n          thousandSeparator: ' + thousandSeparator + ' (thousandSeparator = {true} is same as thousandSeparator = ",")\n          decimalSeparator: ' + decimalSeparator + ' (default value for decimalSeparator is .)\n       ');
      }

      return {
        decimalSeparator: decimalSeparator,
        thousandSeparator: thousandSeparator
      };
    }
  }, {
    key: 'getNumberRegex',
    value: function getNumberRegex(g, ignoreDecimalSeparator) {
      var _props3 = this.props,
          format = _props3.format,
          decimalPrecision = _props3.decimalPrecision;

      var _getSeparators2 = this.getSeparators(),
          decimalSeparator = _getSeparators2.decimalSeparator;

      return new RegExp('\\d' + (decimalSeparator && decimalPrecision !== 0 && !ignoreDecimalSeparator && !format ? '|' + escapeRegExp(decimalSeparator) : ''), g ? 'g' : undefined);
    }
  }, {
    key: 'setCaretPosition',
    value: function setCaretPosition(el, caretPos) {
      el.value = el.value;
      // ^ this is used to not only get "focus", but
      // to make sure we don't have it everything -selected-
      // (it causes an issue in chrome, and having it doesn't hurt any other browser)
      if (el !== null) {
        if (el.createTextRange) {
          var range = el.createTextRange();
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
  }, {
    key: 'setPatchedCaretPosition',
    value: function setPatchedCaretPosition(el, caretPos, currentValue) {
      var _this2 = this;

      /*
      setting caret position within timeout of 0ms is required for mobile chrome,
      otherwise browser resets the caret position after we set it
      We are also setting it without timeout so that in normal browser we don't see the flickering
      */
      this.setCaretPosition(el, caretPos);
      setTimeout(function () {
        if (el.value === currentValue) _this2.setCaretPosition(el, caretPos);
      }, 0);
    }
  }, {
    key: 'formatWithPattern',
    value: function formatWithPattern(str) {
      var _props4 = this.props,
          format = _props4.format,
          mask = _props4.mask;

      if (!format) return str;
      var hashCount = format.split('#').length - 1;
      var hashIdx = 0;
      var frmtdStr = format;

      for (var i = 0, ln = str.length; i < ln; i++) {
        if (i < hashCount) {
          hashIdx = frmtdStr.indexOf('#');
          frmtdStr = frmtdStr.replace('#', str[i]);
        }
      }

      var lastIdx = frmtdStr.lastIndexOf('#');

      if (mask) {
        return frmtdStr.replace(/#/g, mask);
      }
      return frmtdStr.substring(0, hashIdx + 1) + (lastIdx !== -1 ? frmtdStr.substring(lastIdx + 1, frmtdStr.length) : '');
    }
  }, {
    key: 'formatInput',
    value: function formatInput(val) {
      var _props5 = this.props,
          prefix = _props5.prefix,
          suffix = _props5.suffix,
          mask = _props5.mask,
          format = _props5.format,
          allowNegative = _props5.allowNegative,
          decimalPrecision = _props5.decimalPrecision;

      var _getSeparators3 = this.getSeparators(),
          thousandSeparator = _getSeparators3.thousandSeparator,
          decimalSeparator = _getSeparators3.decimalSeparator;

      var maskPattern = format && typeof format == 'string' && !!mask;
      var numRegex = this.getNumberRegex(true);
      var hasNegative = void 0,
          removeNegative = void 0;

      //change val to string if its number
      if (typeof val === 'number') val = val + '';

      var negativeRegex = new RegExp('(-)');
      var doubleNegativeRegex = new RegExp('(-)(.)*(-)');

      if (allowNegative && !format) {
        // Check number has '-' value
        hasNegative = negativeRegex.test(val);
        // Check number has 2 or more '-' values
        removeNegative = doubleNegativeRegex.test(val);
      }

      var valMatch = val && val.match(numRegex);

      if (!valMatch && removeNegative) {
        return { value: '', formattedValue: '' };
      } else if (!valMatch && hasNegative) {
        return { value: '', formattedValue: '-' };
      } else if (!valMatch) {
        return { value: '', formattedValue: maskPattern ? '' : '' };
      }

      var num = val.match(numRegex).join('');

      var formattedValue = num;

      if (format) {
        if (typeof format == 'string') {
          formattedValue = this.formatWithPattern(formattedValue);
        } else if (typeof format == 'function') {
          formattedValue = format(formattedValue);
        }
      } else {
        var hasDecimalSeparator = formattedValue.indexOf(decimalSeparator) !== -1 || decimalPrecision;

        var parts = formattedValue.split(decimalSeparator);
        var beforeDecimal = parts[0];
        var afterDecimal = parts[1] || '';

        //remove leading zeros from number before decimal
        beforeDecimal = removeLeadingZero(beforeDecimal);

        //apply decimal precision if its defined
        if (decimalPrecision !== undefined) afterDecimal = limitToPrecision(afterDecimal, decimalPrecision);

        if (thousandSeparator) {
          beforeDecimal = beforeDecimal.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + thousandSeparator);
        }

        //add prefix and suffix
        if (prefix) beforeDecimal = prefix + beforeDecimal;
        if (suffix) afterDecimal = afterDecimal + suffix;

        if (hasNegative && !removeNegative) beforeDecimal = '-' + beforeDecimal;

        formattedValue = beforeDecimal + (hasDecimalSeparator && decimalSeparator || '') + afterDecimal;
      }

      return {
        value: (hasNegative && !removeNegative ? '-' : '') + formattedValue.match(numRegex).join(''),
        formattedValue: formattedValue
      };
    }
  }, {
    key: 'getCursorPosition',
    value: function getCursorPosition(inputValue, formattedValue, cursorPos) {
      var numRegex = this.getNumberRegex();
      var j = void 0,
          i = void 0;

      j = 0;

      for (i = 0; i < cursorPos; i++) {
        if (!inputValue[i].match(numRegex) && inputValue[i] !== formattedValue[j]) continue;
        if (inputValue[i] === '0' && (formattedValue[j] || '').match(numRegex) && formattedValue[j] !== '0') continue;
        while (inputValue[i] !== formattedValue[j] && j < formattedValue.length) {
          j++;
        }j++;
      }

      return j;
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

      var lastValue = state.value;

      var _formatInput2 = this.formatInput(inputValue),
          formattedValue = _formatInput2.formattedValue,
          value = _formatInput2.value;

      /*Max of selectionStart and selectionEnd is taken for the patch of pixel and other mobile device cursor bug*/


      var currentCursorPosition = Math.max(el.selectionStart, el.selectionEnd);

      var cursorPos = this.getCursorPosition(inputValue, formattedValue, currentCursorPosition);

      if (!isAllowed(formattedValue, value, this.getFloatValue(value))) {
        formattedValue = lastValue;
      }

      //set the value imperatively, this is required for IE fix
      el.value = formattedValue;

      //set caret position
      this.setPatchedCaretPosition(el, cursorPos, formattedValue);

      //change the state
      if (formattedValue !== lastValue) {
        this.setState({ value: formattedValue }, function () {
          props.onChange(e, value);
        });
      }

      return value;
    }
  }, {
    key: 'onKeyDown',
    value: function onKeyDown(e) {
      var el = e.target;
      var selectionStart = el.selectionStart,
          selectionEnd = el.selectionEnd,
          value = el.value;
      var decimalPrecision = this.props.decimalPrecision;
      var key = e.key;

      var numRegex = this.getNumberRegex(false, decimalPrecision !== undefined);
      var negativeRegex = new RegExp('-');
      //Handle backspace and delete against non numerical/decimal characters
      if (selectionEnd - selectionStart === 0) {
        if (key === 'Delete' && !numRegex.test(value[selectionStart]) && !negativeRegex.test(value[selectionStart])) {
          e.preventDefault();
          var nextCursorPosition = selectionStart;
          while (!numRegex.test(value[nextCursorPosition]) && nextCursorPosition < value.length) {
            nextCursorPosition++;
          }this.setPatchedCaretPosition(el, nextCursorPosition, value);
        } else if (key === 'Backspace' && !numRegex.test(value[selectionStart - 1]) && !negativeRegex.test(value[selectionStart - 1])) {
          e.preventDefault();
          var prevCursorPosition = selectionStart;
          while (!numRegex.test(value[prevCursorPosition - 1]) && prevCursorPosition > 0) {
            prevCursorPosition--;
          }this.setPatchedCaretPosition(el, prevCursorPosition, value);
        }
      }

      this.props.onKeyDown(e);
    }
  }, {
    key: 'render',
    value: function render() {
      var props = omit(this.props, propTypes);

      var inputProps = _extends({}, props, {
        type: this.props.type,
        value: this.state.value,
        onChange: this.onChange,
        onKeyDown: this.onKeyDown
      });

      if (this.props.displayType === 'text') {
        return _react2.default.createElement(
          'span',
          props,
          this.state.value
        );
      } else if (this.props.customInput) {
        var CustomInput = this.props.customInput;
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
