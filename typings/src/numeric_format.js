"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.useNumericFormat = exports.getCaretBoundary = exports.removeFormatting = exports.format = void 0;
var react_1 = __importDefault(require("react"));
var utils_1 = require("./utils");
var types_1 = require("./types");
var number_format_base_1 = __importDefault(require("./number_format_base"));
function format(numStr, props) {
    var decimalScale = props.decimalScale, fixedDecimalScale = props.fixedDecimalScale, _a = props.prefix, prefix = _a === void 0 ? '' : _a, _b = props.suffix, suffix = _b === void 0 ? '' : _b, _c = props.allowNegative, allowNegative = _c === void 0 ? true : _c, _d = props.thousandsGroupStyle, thousandsGroupStyle = _d === void 0 ? 'thousand' : _d;
    // don't apply formatting on empty string or '-'
    if (numStr === '' || numStr === '-') {
        return numStr;
    }
    var _e = getSeparators(props), thousandSeparator = _e.thousandSeparator, decimalSeparator = _e.decimalSeparator;
    /**
     * Keep the decimal separator
     * when decimalScale is not defined or non zero and the numStr has decimal in it
     * Or if decimalScale is > 0 and fixeDecimalScale is true (even if numStr has no decimal)
     */
    var hasDecimalSeparator = (decimalScale !== 0 && numStr.indexOf('.') !== -1) || (decimalScale && fixedDecimalScale);
    var _f = (0, utils_1.splitDecimal)(numStr, allowNegative), beforeDecimal = _f.beforeDecimal, afterDecimal = _f.afterDecimal, addNegation = _f.addNegation; // eslint-disable-line prefer-const
    //apply decimal precision if its defined
    if (decimalScale !== undefined) {
        afterDecimal = (0, utils_1.limitToScale)(afterDecimal, decimalScale, fixedDecimalScale);
    }
    if (thousandSeparator) {
        beforeDecimal = (0, utils_1.applyThousandSeparator)(beforeDecimal, thousandSeparator, thousandsGroupStyle);
    }
    //add prefix and suffix when there is a number present
    if (prefix)
        beforeDecimal = prefix + beforeDecimal;
    if (suffix)
        afterDecimal = afterDecimal + suffix;
    //restore negation sign
    if (addNegation)
        beforeDecimal = '-' + beforeDecimal;
    numStr = beforeDecimal + ((hasDecimalSeparator && decimalSeparator) || '') + afterDecimal;
    return numStr;
}
exports.format = format;
function getSeparators(props) {
    var _a = props.decimalSeparator, decimalSeparator = _a === void 0 ? '.' : _a;
    var thousandSeparator = props.thousandSeparator, allowedDecimalSeparators = props.allowedDecimalSeparators;
    if (thousandSeparator === true) {
        thousandSeparator = ',';
    }
    if (!allowedDecimalSeparators) {
        allowedDecimalSeparators = [decimalSeparator, '.'];
    }
    return {
        decimalSeparator: decimalSeparator,
        thousandSeparator: thousandSeparator,
        allowedDecimalSeparators: allowedDecimalSeparators
    };
}
function handleNegation(value, allowNegative) {
    if (value === void 0) { value = ''; }
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
function getNumberRegex(decimalSeparator, decimalScale, global) {
    return new RegExp("(^-)|[0-9]|".concat((0, utils_1.escapeRegExp)(decimalSeparator)), global ? 'g' : undefined);
}
function removeFormatting(value, changeMeta, props) {
    if (changeMeta === void 0) { changeMeta = (0, utils_1.getDefaultChangeMeta)(value); }
    var _a = props.allowNegative, allowNegative = _a === void 0 ? true : _a, _b = props.prefix, prefix = _b === void 0 ? '' : _b, _c = props.suffix, suffix = _c === void 0 ? '' : _c, decimalScale = props.decimalScale;
    var from = changeMeta.from, to = changeMeta.to;
    var start = to.start, end = to.end;
    var _d = getSeparators(props), allowedDecimalSeparators = _d.allowedDecimalSeparators, decimalSeparator = _d.decimalSeparator;
    var isBeforeDecimalSeparator = value[end] === decimalSeparator;
    /** Check for any allowed decimal separator is added in the numeric format and replace it with decimal separator */
    if (end - start === 1 && allowedDecimalSeparators.indexOf(value[start]) !== -1) {
        var separator = decimalScale === 0 ? '' : decimalSeparator;
        value = value.substring(0, start) + separator + value.substring(start + 1, value.length);
    }
    var hasNegation = false;
    /**
     * if prefix starts with - the number hast to have two - at the start
     * if suffix starts with - and the value length is same as suffix length, then the - sign is from the suffix
     * In other cases, if the value starts with - then it is a negation
     */
    if (prefix.startsWith('-'))
        hasNegation = value.startsWith('--');
    else if (suffix.startsWith('-') && value.length === suffix.length)
        hasNegation = false;
    else if (value[0] === '-')
        hasNegation = true;
    // remove negation from start to simplify prefix logic as negation comes before prefix
    if (hasNegation) {
        value = value.substring(1);
        // account for the removal of the negation for start and end index
        start -= 1;
        end -= 1;
    }
    /**
     * remove prefix
     * Remove whole prefix part if its present on the value
     * If the prefix is partially deleted (in which case change start index will be less the prefix length)
     * Remove only partial part of prefix.
     */
    var startIndex = 0;
    if (value.startsWith(prefix))
        startIndex += prefix.length;
    else if (start < prefix.length)
        startIndex = start;
    value = value.substring(startIndex);
    // account for deleted prefix for end index
    end -= startIndex;
    /**
     * Remove suffix
     * Remove whole suffix part if its present on the value
     * If the suffix is partially deleted (in which case change end index will be greater than the suffixStartIndex)
     * remove the partial part of suffix
     */
    var endIndex = value.length;
    var suffixStartIndex = value.length - suffix.length;
    if (value.endsWith(suffix))
        endIndex = suffixStartIndex;
    else if (end > value.length - suffix.length)
        endIndex = end;
    value = value.substring(0, endIndex);
    // add the negation back and handle for double negation
    value = handleNegation(hasNegation ? "-".concat(value) : value, allowNegative);
    // remove non numeric characters
    value = (value.match(getNumberRegex(decimalSeparator, decimalScale, true)) || []).join('');
    // replace the decimalSeparator with ., and only keep the first separator, ignore following ones
    var firstIndex = value.indexOf(decimalSeparator);
    value = value.replace(new RegExp((0, utils_1.escapeRegExp)(decimalSeparator), 'g'), function (match, index) {
        return index === firstIndex ? '.' : '';
    });
    //check if beforeDecimal got deleted and there is nothing after decimal,
    //clear all numbers in such case while keeping the - sign
    var _e = (0, utils_1.splitDecimal)(value, allowNegative), beforeDecimal = _e.beforeDecimal, afterDecimal = _e.afterDecimal, addNegation = _e.addNegation; // eslint-disable-line prefer-const
    //clear only if something got deleted before decimal (cursor is before decimal)
    if (to.end - to.start < from.end - from.start &&
        beforeDecimal === '' &&
        isBeforeDecimalSeparator &&
        !parseFloat(afterDecimal)) {
        value = addNegation ? '-' : '';
    }
    return value;
}
exports.removeFormatting = removeFormatting;
function getCaretBoundary(formattedValue, props) {
    var _a = props.prefix, prefix = _a === void 0 ? '' : _a, _b = props.suffix, suffix = _b === void 0 ? '' : _b;
    var boundaryAry = Array.from({ length: formattedValue.length + 1 }).map(function () { return true; });
    var hasNegation = formattedValue[0] === '-';
    // fill for prefix and negation
    boundaryAry.fill(false, 0, prefix.length + (hasNegation ? 1 : 0));
    // fill for suffix
    var valLn = formattedValue.length;
    boundaryAry.fill(false, valLn - suffix.length + 1, valLn + 1);
    return boundaryAry;
}
exports.getCaretBoundary = getCaretBoundary;
function validateProps(props) {
    var _a = getSeparators(props), thousandSeparator = _a.thousandSeparator, decimalSeparator = _a.decimalSeparator;
    if (thousandSeparator === decimalSeparator) {
        throw new Error("\n        Decimal separator can't be same as thousand separator.\n        thousandSeparator: ".concat(thousandSeparator, " (thousandSeparator = {true} is same as thousandSeparator = \",\")\n        decimalSeparator: ").concat(decimalSeparator, " (default value for decimalSeparator is .)\n     "));
    }
}
function useNumericFormat(props) {
    var allowLeadingZeros = props.allowLeadingZeros, _a = props.onKeyDown, onKeyDown = _a === void 0 ? utils_1.noop : _a, _b = props.onBlur, onBlur = _b === void 0 ? utils_1.noop : _b, thousandSeparator = props.thousandSeparator, decimalScale = props.decimalScale, fixedDecimalScale = props.fixedDecimalScale, _c = props.prefix, prefix = _c === void 0 ? '' : _c, defaultValue = props.defaultValue, value = props.value, isNumericString = props.isNumericString, onValueChange = props.onValueChange;
    // validate props
    validateProps(props);
    var _format = function (numStr) { return format(numStr, props); };
    var _removeFormatting = function (inputValue, changeMeta) {
        return removeFormatting(inputValue, changeMeta, props);
    };
    var _isNumericString = isNumericString;
    if (!(0, utils_1.isNil)(value)) {
        _isNumericString = isNumericString !== null && isNumericString !== void 0 ? isNumericString : typeof value === 'number';
    }
    else if (!(0, utils_1.isNil)(defaultValue)) {
        _isNumericString = isNumericString !== null && isNumericString !== void 0 ? isNumericString : typeof defaultValue === 'number';
    }
    var roundIncomingValueToPrecision = function (value) {
        if ((0, utils_1.isNil)(value) || (0, utils_1.isNanValue)(value))
            return value;
        if (typeof value === 'number') {
            value = (0, utils_1.toNumericString)(value);
        }
        /**
         * only round numeric or float string values coming through props,
         * we don't need to do it for onChange events, as we want to prevent typing there
         */
        if (_isNumericString && typeof decimalScale === 'number') {
            return (0, utils_1.roundToPrecision)(value, decimalScale, fixedDecimalScale);
        }
        return value;
    };
    var _d = __read((0, utils_1.useInternalValues)(roundIncomingValueToPrecision(value), roundIncomingValueToPrecision(defaultValue), _isNumericString, _format, _removeFormatting, onValueChange), 2), _e = _d[0], numAsString = _e.numAsString, formattedValue = _e.formattedValue, _onValueChange = _d[1];
    var _onKeyDown = function (e) {
        var el = e.target;
        var key = e.key;
        var selectionStart = el.selectionStart, selectionEnd = el.selectionEnd, _a = el.value, value = _a === void 0 ? '' : _a;
        // if multiple characters are selected and user hits backspace, no need to handle anything manually
        if (selectionStart !== selectionEnd) {
            onKeyDown(e);
            return;
        }
        // if user hits backspace, while the cursor is before prefix, and the input has negation, remove the negation
        if (key === 'Backspace' && value[0] === '-' && selectionStart === prefix.length + 1) {
            // bring the cursor to after negation
            (0, utils_1.setCaretPosition)(el, 1);
        }
        // don't allow user to delete decimal separator when decimalScale and fixedDecimalScale is set
        var decimalSeparator = getSeparators(props).decimalSeparator;
        if (key === 'Backspace' &&
            value[selectionStart - 1] === decimalSeparator &&
            decimalScale &&
            fixedDecimalScale) {
            (0, utils_1.setCaretPosition)(el, selectionStart - 1);
            e.preventDefault();
        }
        // move cursor when delete or backspace is pressed before/after thousand separator
        if (key === 'Backspace' && value[selectionStart - 1] === thousandSeparator) {
            (0, utils_1.setCaretPosition)(el, selectionStart - 1);
        }
        if (key === 'Delete' && value[selectionStart] === thousandSeparator) {
            (0, utils_1.setCaretPosition)(el, selectionStart + 1);
        }
        onKeyDown(e);
    };
    var _onBlur = function (e) {
        var _value = numAsString;
        // if there no no numeric value, clear the input
        if (!_value.match(/\d/g)) {
            _value = '';
        }
        // clear leading 0s
        if (!allowLeadingZeros) {
            _value = (0, utils_1.fixLeadingZero)(_value);
        }
        // apply fixedDecimalScale on blur event
        if (fixedDecimalScale && decimalScale) {
            _value = (0, utils_1.roundToPrecision)(_value, decimalScale, fixedDecimalScale);
        }
        if (_value !== numAsString) {
            var formattedValue_1 = format(_value, props);
            _onValueChange({
                formattedValue: formattedValue_1,
                value: _value,
                floatValue: parseFloat(_value)
            }, {
                event: e,
                source: types_1.SourceType.event
            });
        }
        onBlur(e);
    };
    return {
        value: formattedValue,
        isNumericString: false,
        onValueChange: _onValueChange,
        format: _format,
        removeFormatting: _removeFormatting,
        getCaretBoundary: function (formattedValue) { return getCaretBoundary(formattedValue, props); },
        onKeyDown: _onKeyDown,
        onBlur: _onBlur
    };
}
exports.useNumericFormat = useNumericFormat;
function NumericFormat(props) {
    var 
    /* eslint-disable no-unused-vars */
    decimalSeparator = props.decimalSeparator, allowedDecimalSeparators = props.allowedDecimalSeparators, thousandsGroupStyle = props.thousandsGroupStyle, suffix = props.suffix, allowNegative = props.allowNegative, allowLeadingZeros = props.allowLeadingZeros, onKeyDown = props.onKeyDown, onBlur = props.onBlur, thousandSeparator = props.thousandSeparator, decimalScale = props.decimalScale, fixedDecimalScale = props.fixedDecimalScale, _a = props.prefix, prefix = _a === void 0 ? '' : _a, defaultValue = props.defaultValue, value = props.value, isNumericString = props.isNumericString, onValueChange = props.onValueChange, 
    /* eslint-enable no-unused-vars */
    restProps = __rest(props, ["decimalSeparator", "allowedDecimalSeparators", "thousandsGroupStyle", "suffix", "allowNegative", "allowLeadingZeros", "onKeyDown", "onBlur", "thousandSeparator", "decimalScale", "fixedDecimalScale", "prefix", "defaultValue", "value", "isNumericString", "onValueChange"]);
    var numericFormatProps = useNumericFormat(props);
    return react_1["default"].createElement(number_format_base_1["default"], __assign({}, restProps, numericFormatProps));
}
exports["default"] = NumericFormat;
