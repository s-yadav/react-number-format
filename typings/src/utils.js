"use strict";
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.useInternalValues = exports.caretUnknownFormatBoundary = exports.getCaretPosition = exports.getMaskAtIndex = exports.getDefaultChangeMeta = exports.addInputMode = exports.geInputCaretPosition = exports.clamp = exports.findChangeRange = exports.findChangedIndex = exports.setCaretPosition = exports.roundToPrecision = exports.toNumericString = exports.limitToScale = exports.fixLeadingZero = exports.splitDecimal = exports.usePersistentCallback = exports.applyThousandSeparator = exports.getThousandsGroupRegex = exports.escapeRegExp = exports.isNanValue = exports.isNil = exports.charIsNumber = exports.returnTrue = exports.noop = void 0;
var react_1 = require("react");
// basic noop function
function noop() { }
exports.noop = noop;
function returnTrue() {
    return true;
}
exports.returnTrue = returnTrue;
function charIsNumber(char) {
    return !!(char || '').match(/\d/);
}
exports.charIsNumber = charIsNumber;
function isNil(val) {
    return val === null || val === undefined;
}
exports.isNil = isNil;
function isNanValue(val) {
    return typeof val === 'number' && isNaN(val);
}
exports.isNanValue = isNanValue;
function escapeRegExp(str) {
    return str.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&');
}
exports.escapeRegExp = escapeRegExp;
function getThousandsGroupRegex(thousandsGroupStyle) {
    switch (thousandsGroupStyle) {
        case 'lakh':
            return /(\d+?)(?=(\d\d)+(\d)(?!\d))(\.\d+)?/g;
        case 'wan':
            return /(\d)(?=(\d{4})+(?!\d))/g;
        case 'thousand':
        default:
            return /(\d)(?=(\d{3})+(?!\d))/g;
    }
}
exports.getThousandsGroupRegex = getThousandsGroupRegex;
function applyThousandSeparator(str, thousandSeparator, thousandsGroupStyle) {
    var thousandsGroupRegex = getThousandsGroupRegex(thousandsGroupStyle);
    var index = str.search(/[1-9]/);
    index = index === -1 ? str.length : index;
    return (str.substring(0, index) +
        str.substring(index, str.length).replace(thousandsGroupRegex, '$1' + thousandSeparator));
}
exports.applyThousandSeparator = applyThousandSeparator;
function usePersistentCallback(cb) {
    var callbackRef = (0, react_1.useRef)(cb);
    // keep the callback ref upto date
    callbackRef.current = cb;
    /**
     * initialize a persistent callback which never changes
     * through out the component lifecycle
     */
    var persistentCbRef = (0, react_1.useRef)(function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return callbackRef.current.apply(callbackRef, __spreadArray([], __read(args), false));
    });
    return persistentCbRef.current;
}
exports.usePersistentCallback = usePersistentCallback;
//spilt a float number into different parts beforeDecimal, afterDecimal, and negation
function splitDecimal(numStr, allowNegative) {
    if (allowNegative === void 0) { allowNegative = true; }
    var hasNegation = numStr[0] === '-';
    var addNegation = hasNegation && allowNegative;
    numStr = numStr.replace('-', '');
    var parts = numStr.split('.');
    var beforeDecimal = parts[0];
    var afterDecimal = parts[1] || '';
    return {
        beforeDecimal: beforeDecimal,
        afterDecimal: afterDecimal,
        hasNegation: hasNegation,
        addNegation: addNegation
    };
}
exports.splitDecimal = splitDecimal;
function fixLeadingZero(numStr) {
    if (!numStr)
        return numStr;
    var isNegative = numStr[0] === '-';
    if (isNegative)
        numStr = numStr.substring(1, numStr.length);
    var parts = numStr.split('.');
    var beforeDecimal = parts[0].replace(/^0+/, '') || '0';
    var afterDecimal = parts[1] || '';
    return "".concat(isNegative ? '-' : '').concat(beforeDecimal).concat(afterDecimal ? ".".concat(afterDecimal) : '');
}
exports.fixLeadingZero = fixLeadingZero;
/**
 * limit decimal numbers to given scale
 * Not used .fixedTo because that will break with big numbers
 */
function limitToScale(numStr, scale, fixedDecimalScale) {
    var str = '';
    var filler = fixedDecimalScale ? '0' : '';
    for (var i = 0; i <= scale - 1; i++) {
        str += numStr[i] || filler;
    }
    return str;
}
exports.limitToScale = limitToScale;
function repeat(str, count) {
    return Array(count + 1).join(str);
}
function toNumericString(num) {
    var _num = num + ''; // typecast number to string
    // store the sign and remove it from the number.
    var sign = _num[0] === '-' ? '-' : '';
    if (sign)
        _num = _num.substring(1);
    // split the number into cofficient and exponent
    var _a = __read(_num.split(/[eE]/g), 2), coefficient = _a[0], exponent = _a[1];
    // covert exponent to number;
    exponent = Number(exponent);
    // if there is no exponent part or its 0, return the coffiecient with sign
    if (!exponent)
        return sign + coefficient;
    coefficient = coefficient.replace('.', '');
    /**
     * for scientific notation the current decimal index will be after first number (index 0)
     * So effective decimal index will always be 1 + exponent value
     */
    var decimalIndex = 1 + exponent;
    var coffiecientLn = coefficient.length;
    if (decimalIndex < 0) {
        // if decimal index is less then 0 add preceding 0s
        // add 1 as join will have
        coefficient = '0.' + repeat('0', Math.abs(decimalIndex)) + coefficient;
    }
    else if (decimalIndex >= coffiecientLn) {
        // if decimal index is less then 0 add leading 0s
        coefficient = coefficient + repeat('0', decimalIndex - coffiecientLn);
    }
    else {
        // else add decimal point at proper index
        coefficient =
            (coefficient.substring(0, decimalIndex) || '0') + '.' + coefficient.substring(decimalIndex);
    }
    return sign + coefficient;
}
exports.toNumericString = toNumericString;
/**
 * This method is required to round prop value to given scale.
 * Not used .round or .fixedTo because that will break with big numbers
 */
function roundToPrecision(numStr, scale, fixedDecimalScale) {
    //if number is empty don't do anything return empty string
    if (['', '-'].indexOf(numStr) !== -1)
        return numStr;
    var shoudHaveDecimalSeparator = numStr.indexOf('.') !== -1 && scale;
    var _a = splitDecimal(numStr), beforeDecimal = _a.beforeDecimal, afterDecimal = _a.afterDecimal, hasNegation = _a.hasNegation;
    var floatValue = parseFloat("0.".concat(afterDecimal || '0'));
    var floatValueStr = afterDecimal.length <= scale ? "0.".concat(afterDecimal) : floatValue.toFixed(scale);
    var roundedDecimalParts = floatValueStr.split('.');
    var intPart = beforeDecimal
        .split('')
        .reverse()
        .reduce(function (roundedStr, current, idx) {
        if (roundedStr.length > idx) {
            return ((Number(roundedStr[0]) + Number(current)).toString() +
                roundedStr.substring(1, roundedStr.length));
        }
        return current + roundedStr;
    }, roundedDecimalParts[0]);
    var decimalPart = limitToScale(roundedDecimalParts[1] || '', scale, fixedDecimalScale);
    var negation = hasNegation ? '-' : '';
    var decimalSeparator = shoudHaveDecimalSeparator ? '.' : '';
    return "".concat(negation).concat(intPart).concat(decimalSeparator).concat(decimalPart);
}
exports.roundToPrecision = roundToPrecision;
/** set the caret positon in an input field **/
function setCaretPosition(el, caretPos) {
    el.value = el.value;
    // ^ this is used to not only get 'focus', but
    // to make sure we don't have it everything -selected-
    // (it causes an issue in chrome, and having it doesn't hurt any other browser)
    if (el !== null) {
        /* @ts-ignore */
        if (el.createTextRange) {
            /* @ts-ignore */
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
exports.setCaretPosition = setCaretPosition;
/**
  Given previous value and newValue it returns the index
  start - end to which values have changed.
  This function makes assumption about only consecutive
  characters are changed which is correct assumption for caret input.
*/
function findChangedIndex(prevValue, newValue) {
    var i = 0, j = 0;
    var prevLength = prevValue.length;
    var newLength = newValue.length;
    while (prevValue[i] === newValue[i] && i < prevLength)
        i++;
    //check what has been changed from last
    while (prevValue[prevLength - 1 - j] === newValue[newLength - 1 - j] &&
        newLength - j > i &&
        prevLength - j > i) {
        j++;
    }
    return { start: i, end: prevLength - j };
}
exports.findChangedIndex = findChangedIndex;
function findChangeRange(prevValue, newValue) {
    var i = 0, j = 0;
    var prevLength = prevValue.length;
    var newLength = newValue.length;
    while (prevValue[i] === newValue[i] && i < prevLength)
        i++;
    //check what has been changed from last
    while (prevValue[prevLength - 1 - j] === newValue[newLength - 1 - j] &&
        newLength - j > i &&
        prevLength - j > i) {
        j++;
    }
    return {
        from: { start: i, end: prevLength - j },
        to: { start: i, end: newLength - j }
    };
}
exports.findChangeRange = findChangeRange;
/*
  Returns a number whose value is limited to the given range
*/
function clamp(num, min, max) {
    return Math.min(Math.max(num, min), max);
}
exports.clamp = clamp;
function geInputCaretPosition(el) {
    /*Max of selectionStart and selectionEnd is taken for the patch of pixel and other mobile device caret bug*/
    return Math.max(el.selectionStart, el.selectionEnd);
}
exports.geInputCaretPosition = geInputCaretPosition;
function addInputMode() {
    return (typeof navigator !== 'undefined' &&
        !(navigator.platform && /iPhone|iPod/.test(navigator.platform)));
}
exports.addInputMode = addInputMode;
function getDefaultChangeMeta(value) {
    return {
        from: {
            start: 0,
            end: 0
        },
        to: {
            start: 0,
            end: value.length
        },
        lastValue: ''
    };
}
exports.getDefaultChangeMeta = getDefaultChangeMeta;
function getMaskAtIndex(mask, index) {
    if (mask === void 0) { mask = ' '; }
    if (typeof mask === 'string') {
        return mask;
    }
    return mask[index] || ' ';
}
exports.getMaskAtIndex = getMaskAtIndex;
function getCaretPosition(formattedValue, curValue, curCaretPos) {
    var curValLn = curValue.length;
    var formattedValueLn = formattedValue.length;
    // create index map
    var addedIndexMap = {};
    var indexMap = new Array(curValLn);
    for (var i = 0; i < curValLn; i++) {
        indexMap[i] = -1;
        for (var j = 0, jLn = formattedValueLn; j < jLn; j++) {
            if (curValue[i] === formattedValue[j] && addedIndexMap[j] !== true) {
                indexMap[i] = j;
                addedIndexMap[j] = true;
                break;
            }
        }
    }
    /**
     * For current caret position find closest characters (left and right side)
     * which are properly mapped to formatted value.
     * The idea is that the new caret position will exist always in the boundary of
     * that mapped index
     */
    var pos = curCaretPos;
    while (pos < curValLn && (indexMap[pos] === -1 || !charIsNumber(curValue[pos]))) {
        pos++;
    }
    // if the caret position is on last keep the endIndex as last for formatted value
    var endIndex = pos === curValLn || indexMap[pos] === -1 ? formattedValueLn : indexMap[pos];
    pos = curCaretPos - 1;
    while (pos > 0 && (indexMap[pos] === -1 || !charIsNumber(curValue[pos])))
        pos--;
    var startIndex = pos === -1 || indexMap[pos] === -1 ? 0 : indexMap[pos] + 1;
    /**
     * case where a char is added on suffix and removed from middle, example 2sq345 becoming $2,345 sq
     * there is still a mapping but the order of start index and end index is changed
     */
    if (startIndex > endIndex)
        return endIndex;
    /**
     * given the current caret position if it closer to startIndex
     * keep the new caret position on start index or keep it closer to endIndex
     */
    return curCaretPos - startIndex < endIndex - curCaretPos ? startIndex : endIndex;
}
exports.getCaretPosition = getCaretPosition;
function caretUnknownFormatBoundary(formattedValue) {
    var boundaryAry = Array.from({ length: formattedValue.length + 1 }).map(function () { return true; });
    for (var i = 0, ln = boundaryAry.length; i < ln; i++) {
        // consider caret to be in boundary if it is before or after numeric value
        boundaryAry[i] = Boolean(charIsNumber(formattedValue[i]) || charIsNumber(formattedValue[i - 1]));
    }
    return boundaryAry;
}
exports.caretUnknownFormatBoundary = caretUnknownFormatBoundary;
function useInternalValues(value, defaultValue, isNumericString, format, removeFormatting, onValueChange) {
    if (onValueChange === void 0) { onValueChange = noop; }
    var propValues = (0, react_1.useRef)();
    var getValues = usePersistentCallback(function (value) {
        var formattedValue, numAsString;
        if (isNil(value) || isNanValue(value)) {
            numAsString = '';
            formattedValue = '';
        }
        else if (typeof value === 'number' || isNumericString) {
            numAsString = typeof value === 'number' ? toNumericString(value) : value;
            formattedValue = format(numAsString);
        }
        else {
            numAsString = removeFormatting(value, undefined);
            formattedValue = value;
        }
        return { formattedValue: formattedValue, numAsString: numAsString };
    });
    var _a = __read((0, react_1.useState)(function () {
        return getValues(defaultValue);
    }), 2), values = _a[0], setValues = _a[1];
    var _onValueChange = function (values, sourceInfo) {
        setValues({
            formattedValue: values.formattedValue,
            numAsString: values.value
        });
        onValueChange(values, sourceInfo);
    };
    (0, react_1.useMemo)(function () {
        //if element is moved to uncontrolled mode, don't reset the value
        if (!isNil(value)) {
            propValues.current = getValues(value);
            setValues(propValues.current);
        }
        else {
            propValues.current = undefined;
        }
    }, [value, getValues]);
    return [values, _onValueChange];
}
exports.useInternalValues = useInternalValues;
