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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.usePatternFormat = exports.getCaretBoundary = exports.removeFormatting = exports.format = void 0;
var react_1 = __importDefault(require("react"));
var utils_1 = require("./utils");
var number_format_base_1 = __importDefault(require("./number_format_base"));
function format(numStr, props) {
    var format = props.format;
    var allowEmptyFormatting = props.allowEmptyFormatting, mask = props.mask;
    if (numStr === '' && !allowEmptyFormatting)
        return '';
    var hashCount = 0;
    var formattedNumberAry = format.split('');
    for (var i = 0, ln = format.length; i < ln; i++) {
        if (format[i] === '#') {
            formattedNumberAry[i] = numStr[hashCount] || (0, utils_1.getMaskAtIndex)(mask, hashCount);
            hashCount += 1;
        }
    }
    return formattedNumberAry.join('');
}
exports.format = format;
function removeFormatting(value, changeMeta, props) {
    if (changeMeta === void 0) { changeMeta = (0, utils_1.getDefaultChangeMeta)(value); }
    var format = props.format;
    var _a = props.patternChar, patternChar = _a === void 0 ? '#' : _a;
    var from = changeMeta.from, to = changeMeta.to, _b = changeMeta.lastValue, lastValue = _b === void 0 ? '' : _b;
    var isNumericSlot = function (caretPos) { return format[caretPos] === patternChar; };
    var removeFormatChar = function (string, startIndex) {
        var str = '';
        for (var i = 0; i < string.length; i++) {
            if (isNumericSlot(startIndex + i)) {
                str += string[i];
            }
        }
        return str;
    };
    var extractNumbers = function (str) { return str.replace(/[^0-9]/g, ''); };
    // if format doesn't have any number, remove all the non numeric characters
    if (!format.match(/\d/)) {
        return extractNumbers(value);
    }
    /**
     * if user paste the whole formatted text in an empty input, check if matches to the pattern
     * and remove the format characters, if there is a mismatch on the pattern, do plane number extract
     */
    if (lastValue === '' && value.length === format.length) {
        var str = '';
        for (var i = 0; i < value.length; i++) {
            if (isNumericSlot(i)) {
                str += value[i];
            }
            else if (value[i] !== format[i]) {
                // if there is a mismatch on the pattern, do plane number extract
                return extractNumbers(value);
            }
        }
        return str;
    }
    /**
     * For partial change,
     * where ever there is a change on the input, we can break the number in three parts
     * 1st: left part which is unchanged
     * 2nd: middle part which is changed
     * 3rd: right part which is unchanged
     *
     * The first and third section will be same as last value, only the middle part will change
     * We can consider on the change part all the new characters are non format characters.
     * And on the first and last section it can have partial format characters.
     *
     * We pick first and last section from the lastValue (as that has 1-1 mapping with format)
     * and middle one from the update value.
     */
    var firstSection = lastValue.substring(0, from.start);
    var middleSection = value.substring(to.start, to.end);
    var lastSection = lastValue.substring(from.end);
    return "".concat(removeFormatChar(firstSection, 0)).concat(extractNumbers(middleSection)).concat(removeFormatChar(lastSection, from.end));
}
exports.removeFormatting = removeFormatting;
function getCaretBoundary(formattedValue, props) {
    var format = props.format;
    var mask = props.mask, _a = props.patternChar, patternChar = _a === void 0 ? '#' : _a;
    var boundaryAry = Array.from({ length: formattedValue.length + 1 }).map(function () { return true; });
    var hashCount = 0;
    var maskAndFormatMap = format.split('').map(function (char) {
        if (char === patternChar) {
            hashCount++;
            return (0, utils_1.getMaskAtIndex)(mask, hashCount - 1);
        }
        return undefined;
    });
    var isPosAllowed = function (pos) {
        // the position is allowed if the position is not masked and valid number area
        return format[pos] === patternChar && formattedValue[pos] !== maskAndFormatMap[pos];
    };
    for (var i = 0, ln = boundaryAry.length; i < ln; i++) {
        // consider caret to be in boundary if it is before or after numeric value
        // Note: on pattern based format its denoted by patternCharacter
        boundaryAry[i] = isPosAllowed(i) || isPosAllowed(i - 1);
    }
    // the first patternChar position is always allowed
    boundaryAry[format.indexOf(patternChar)] = true;
    return boundaryAry;
}
exports.getCaretBoundary = getCaretBoundary;
function validateProps(props) {
    var mask = props.mask;
    if (mask) {
        var maskAsStr = mask === 'string' ? mask : mask.toString();
        if (maskAsStr.match(/\d/g)) {
            throw new Error("Mask ".concat(mask, " should not contain numeric character;"));
        }
    }
}
function usePatternFormat(props) {
    var formatProp = props.format, _a = props.inputMode, inputMode = _a === void 0 ? 'numeric' : _a, _b = props.onKeyDown, onKeyDown = _b === void 0 ? utils_1.noop : _b, _c = props.patternChar, patternChar = _c === void 0 ? '#' : _c;
    // validate props
    validateProps(props);
    var _onKeyDown = function (e) {
        var key = e.key;
        var el = e.target;
        var selectionStart = el.selectionStart, selectionEnd = el.selectionEnd;
        // if multiple characters are selected and user hits backspace, no need to handle anything manually
        if (selectionStart !== selectionEnd) {
            onKeyDown(e);
            return;
        }
        // if backspace is pressed after the format characters, bring it to numeric section
        // if delete is pressed before the format characters, bring it to numeric section
        if (key === 'Backspace' || key === 'Delete') {
            // bring the cursor to closest numeric section
            var index = selectionStart;
            if (key === 'Backspace') {
                while (index > 0 && formatProp[index - 1] !== patternChar) {
                    index--;
                }
            }
            else {
                var formatLn = formatProp.length;
                while (index < formatLn && formatProp[index] !== patternChar) {
                    index++;
                }
            }
            if (index !== selectionStart) {
                (0, utils_1.setCaretPosition)(el, index);
            }
        }
        onKeyDown(e);
    };
    return {
        inputMode: inputMode,
        format: function (numStr) { return format(numStr, props); },
        removeFormatting: function (inputValue, changeMeta) {
            return removeFormatting(inputValue, changeMeta, props);
        },
        getCaretBoundary: function (formattedValue) { return getCaretBoundary(formattedValue, props); },
        onKeyDown: _onKeyDown
    };
}
exports.usePatternFormat = usePatternFormat;
function PatternFormat(props) {
    var 
    /* eslint-disable no-unused-vars */
    mask = props.mask, allowEmptyFormatting = props.allowEmptyFormatting, formatProp = props.format, inputMode = props.inputMode, onKeyDown = props.onKeyDown, patternChar = props.patternChar, 
    /* eslint-enable no-unused-vars */
    restProps = __rest(props, ["mask", "allowEmptyFormatting", "format", "inputMode", "onKeyDown", "patternChar"]);
    var patternFormatProps = usePatternFormat(props);
    return react_1["default"].createElement(number_format_base_1["default"], __assign({}, restProps, patternFormatProps));
}
exports["default"] = PatternFormat;
