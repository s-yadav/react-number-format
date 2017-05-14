/*!
 * react-number-format - 1.2.1
 * Author : Sudhanshu Yadav
 * Copyright (c) 2016,2017 to Sudhanshu Yadav - ignitersworld.com , released under the MIT license.
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"));
	else if(typeof define === 'function' && define.amd)
		define(["react"], factory);
	else if(typeof exports === 'object')
		exports["NumberFormat"] = factory(require("react"));
	else
		root["NumberFormat"] = factory(root["React"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_7__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _propTypes = __webpack_require__(2);

	var _propTypes2 = _interopRequireDefault(_propTypes);

	var _react = __webpack_require__(7);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } //const React = require('react');


	function escapeRegExp(str) {
	  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
	}

	var propTypes = {
	  thousandSeparator: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.bool]),
	  decimalSeparator: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.bool]),
	  decimalPrecision: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.bool]),
	  displayType: _propTypes2.default.oneOf(['input', 'text']),
	  prefix: _propTypes2.default.string,
	  suffix: _propTypes2.default.string,
	  format: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.func]),
	  mask: _propTypes2.default.string,
	  value: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]),
	  customInput: _propTypes2.default.func,
	  allowNegative: _propTypes2.default.bool,
	  onKeyDown: _propTypes2.default.func,
	  onChange: _propTypes2.default.func
	};

	var defaultProps = {
	  displayType: 'input',
	  decimalSeparator: '.',
	  decimalPrecision: false,
	  allowNegative: true
	};

	var NumberFormat = function (_React$Component) {
	  _inherits(NumberFormat, _React$Component);

	  function NumberFormat(props) {
	    _classCallCheck(this, NumberFormat);

	    var _this = _possibleConstructorReturn(this, (NumberFormat.__proto__ || Object.getPrototypeOf(NumberFormat)).call(this, props));

	    _this.state = {
	      value: _this.formatInput(props.value).formattedValue
	    };
	    _this.onChange = _this.onChange.bind(_this);
	    _this.onKeyDown = _this.onKeyDown.bind(_this);
	    return _this;
	  }

	  _createClass(NumberFormat, [{
	    key: 'componentWillReceiveProps',
	    value: function componentWillReceiveProps(newProps) {
	      if (newProps.value !== this.props.value) {
	        this.setState({
	          value: this.formatInput(newProps.value).formattedValue
	        });
	      }
	    }
	  }, {
	    key: 'getSeparators',
	    value: function getSeparators() {
	      var _props = this.props,
	          thousandSeparator = _props.thousandSeparator,
	          decimalSeparator = _props.decimalSeparator;

	      if (thousandSeparator === true) {
	        thousandSeparator = ',';
	      }

	      if (decimalSeparator && thousandSeparator && typeof decimalSeparator !== 'string') {
	        decimalSeparator = thousandSeparator === '.' ? ',' : '.';
	      }

	      if (thousandSeparator === '.') {
	        decimalSeparator = ',';
	      }

	      if (decimalSeparator === true) {
	        decimalSeparator = '.';
	      }

	      return {
	        decimalSeparator: decimalSeparator,
	        thousandSeparator: thousandSeparator
	      };
	    }
	  }, {
	    key: 'getNumberRegex',
	    value: function getNumberRegex(g, ignoreDecimalSeperator) {
	      var format = this.props.format;

	      var _getSeparators = this.getSeparators(),
	          decimalSeparator = _getSeparators.decimalSeparator;

	      return new RegExp('\\d' + (decimalSeparator && !ignoreDecimalSeperator && !format ? '|' + escapeRegExp(decimalSeparator) : ''), g ? 'g' : undefined);
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
	    key: 'formatWithPattern',
	    value: function formatWithPattern(str) {
	      var _props2 = this.props,
	          format = _props2.format,
	          mask = _props2.mask;

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
	      var _props3 = this.props,
	          prefix = _props3.prefix,
	          suffix = _props3.suffix,
	          mask = _props3.mask,
	          format = _props3.format,
	          allowNegative = _props3.allowNegative,
	          decimalPrecision = _props3.decimalPrecision;

	      var _getSeparators2 = this.getSeparators(),
	          thousandSeparator = _getSeparators2.thousandSeparator,
	          decimalSeparator = _getSeparators2.decimalSeparator;

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
	        var beforeDecimal = formattedValue,
	            afterDecimal = '';
	        var hasDecimals = formattedValue.indexOf(decimalSeparator) !== -1 || decimalPrecision !== false;
	        if (decimalSeparator && hasDecimals) {
	          var parts = void 0;
	          if (decimalPrecision !== false) {
	            var precision = decimalPrecision === true ? 2 : decimalPrecision;
	            if (decimalSeparator !== '.') {
	              // Replace custom decimalSeparator with '.' for parseFloat function
	              parts = parseFloat(formattedValue.replace(decimalSeparator, '.')).toFixed(precision);
	              // Put custom decimalSeparator back
	              parts = parts.replace('.', decimalSeparator);
	            } else {
	              parts = parseFloat(formattedValue).toFixed(precision);
	            }
	            parts = parts.split(decimalSeparator);
	          } else {
	            parts = formattedValue.split(decimalSeparator);
	          }
	          beforeDecimal = parts[0];
	          afterDecimal = parts[1];
	        }
	        if (thousandSeparator) {
	          beforeDecimal = beforeDecimal.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + thousandSeparator);
	        }
	        //add prefix and suffix
	        if (prefix) beforeDecimal = prefix + beforeDecimal;
	        if (suffix) afterDecimal = afterDecimal + suffix;

	        if (hasNegative && !removeNegative) beforeDecimal = '-' + beforeDecimal;

	        formattedValue = beforeDecimal + (hasDecimals && decimalSeparator || '') + afterDecimal;
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
	        while (inputValue[i] !== formattedValue[j] && j < formattedValue.length) {
	          j++;
	        }j++;
	      }

	      return j;
	    }
	  }, {
	    key: 'onChangeHandler',
	    value: function onChangeHandler(e, callback) {
	      var _this2 = this;

	      e.persist();
	      var el = e.target;
	      var inputValue = el.value;

	      var _formatInput = this.formatInput(inputValue),
	          formattedValue = _formatInput.formattedValue,
	          value = _formatInput.value;

	      var cursorPos = el.selectionStart;

	      //change the state
	      this.setState({ value: formattedValue }, function () {
	        cursorPos = _this2.getCursorPosition(inputValue, formattedValue, cursorPos);
	        /*
	          setting caret position within timeout of 0ms is required for mobile chrome,
	          otherwise browser resets the caret position after we set it
	          We are also setting it without timeout so that in normal browser we don't see the flickering
	         */
	        _this2.setCaretPosition(el, cursorPos);
	        setTimeout(function () {
	          return _this2.setCaretPosition(el, cursorPos);
	        }, 0);
	        if (callback) callback(e, value);
	      });

	      return value;
	    }
	  }, {
	    key: 'onChange',
	    value: function onChange(e) {
	      this.onChangeHandler(e, this.props.onChange);
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

	      var numRegex = this.getNumberRegex(false, decimalPrecision !== false);
	      var negativeRegex = new RegExp('-');
	      //Handle backspace and delete against non numerical/decimal characters
	      if (selectionEnd - selectionStart === 0) {
	        if (key === 'Delete' && !numRegex.test(value[selectionStart]) && !negativeRegex.test(value[selectionStart])) {
	          e.preventDefault();
	          var nextCursorPosition = selectionStart;
	          while (!numRegex.test(value[nextCursorPosition]) && nextCursorPosition < value.length) {
	            nextCursorPosition++;
	          }this.setCaretPosition(el, nextCursorPosition);
	        } else if (key === 'Backspace' && !numRegex.test(value[selectionStart - 1]) && !negativeRegex.test(value[selectionStart - 1])) {
	          e.preventDefault();
	          var prevCursorPosition = selectionStart;
	          while (!numRegex.test(value[prevCursorPosition - 1]) && prevCursorPosition > 0) {
	            prevCursorPosition--;
	          }this.setCaretPosition(el, prevCursorPosition);
	        }
	      }

	      if (this.props.onKeyDown) this.props.onKeyDown(e);
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var props = _extends({}, this.props);

	      Object.keys(propTypes).forEach(function (key) {
	        delete props[key];
	      });

	      var inputProps = _extends({}, props, {
	        type: 'text',
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

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 */

	if (false) {
	  var REACT_ELEMENT_TYPE = (typeof Symbol === 'function' &&
	    Symbol.for &&
	    Symbol.for('react.element')) ||
	    0xeac7;

	  var isValidElement = function(object) {
	    return typeof object === 'object' &&
	      object !== null &&
	      object.$$typeof === REACT_ELEMENT_TYPE;
	  };

	  // By explicitly using `prop-types` you are opting into new development behavior.
	  // http://fb.me/prop-types-in-prod
	  var throwOnDirectAccess = true;
	  module.exports = require('./factoryWithTypeCheckers')(isValidElement, throwOnDirectAccess);
	} else {
	  // By explicitly using `prop-types` you are opting into new production behavior.
	  // http://fb.me/prop-types-in-prod
	  module.exports = __webpack_require__(3)();
	}


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 */

	'use strict';

	var emptyFunction = __webpack_require__(4);
	var invariant = __webpack_require__(5);
	var ReactPropTypesSecret = __webpack_require__(6);

	module.exports = function() {
	  function shim(props, propName, componentName, location, propFullName, secret) {
	    if (secret === ReactPropTypesSecret) {
	      // It is still safe when called from React.
	      return;
	    }
	    invariant(
	      false,
	      'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
	      'Use PropTypes.checkPropTypes() to call them. ' +
	      'Read more at http://fb.me/use-check-prop-types'
	    );
	  };
	  shim.isRequired = shim;
	  function getShim() {
	    return shim;
	  };
	  // Important!
	  // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
	  var ReactPropTypes = {
	    array: shim,
	    bool: shim,
	    func: shim,
	    number: shim,
	    object: shim,
	    string: shim,
	    symbol: shim,

	    any: shim,
	    arrayOf: getShim,
	    element: shim,
	    instanceOf: getShim,
	    node: shim,
	    objectOf: getShim,
	    oneOf: getShim,
	    oneOfType: getShim,
	    shape: getShim
	  };

	  ReactPropTypes.checkPropTypes = emptyFunction;
	  ReactPropTypes.PropTypes = ReactPropTypes;

	  return ReactPropTypes;
	};


/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * 
	 */

	function makeEmptyFunction(arg) {
	  return function () {
	    return arg;
	  };
	}

	/**
	 * This function accepts and discards inputs; it has no side effects. This is
	 * primarily useful idiomatically for overridable function endpoints which
	 * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
	 */
	var emptyFunction = function emptyFunction() {};

	emptyFunction.thatReturns = makeEmptyFunction;
	emptyFunction.thatReturnsFalse = makeEmptyFunction(false);
	emptyFunction.thatReturnsTrue = makeEmptyFunction(true);
	emptyFunction.thatReturnsNull = makeEmptyFunction(null);
	emptyFunction.thatReturnsThis = function () {
	  return this;
	};
	emptyFunction.thatReturnsArgument = function (arg) {
	  return arg;
	};

	module.exports = emptyFunction;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 */

	'use strict';

	/**
	 * Use invariant() to assert state which your program assumes to be true.
	 *
	 * Provide sprintf-style format (only %s is supported) and arguments
	 * to provide information about what broke and what you were
	 * expecting.
	 *
	 * The invariant message will be stripped in production, but the invariant
	 * will remain to ensure logic does not differ in production.
	 */

	var validateFormat = function validateFormat(format) {};

	if (false) {
	  validateFormat = function validateFormat(format) {
	    if (format === undefined) {
	      throw new Error('invariant requires an error message argument');
	    }
	  };
	}

	function invariant(condition, format, a, b, c, d, e, f) {
	  validateFormat(format);

	  if (!condition) {
	    var error;
	    if (format === undefined) {
	      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
	    } else {
	      var args = [a, b, c, d, e, f];
	      var argIndex = 0;
	      error = new Error(format.replace(/%s/g, function () {
	        return args[argIndex++];
	      }));
	      error.name = 'Invariant Violation';
	    }

	    error.framesToPop = 1; // we don't care about invariant's own frame
	    throw error;
	  }
	}

	module.exports = invariant;

/***/ },
/* 6 */
/***/ function(module, exports) {

	/**
	 * Copyright 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 */

	'use strict';

	var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

	module.exports = ReactPropTypesSecret;


/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_7__;

/***/ }
/******/ ])
});
;