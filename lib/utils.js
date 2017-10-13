'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.noop = noop;
exports.returnTrue = returnTrue;
exports.charIsNumber = charIsNumber;
exports.escapeRegExp = escapeRegExp;
exports.removeLeadingZero = removeLeadingZero;
exports.splitString = splitString;
exports.limitToPrecision = limitToPrecision;
exports.roundToPrecision = roundToPrecision;
exports.omit = omit;
exports.setCaretPosition = setCaretPosition;


// basic noop function
function noop() {}
function returnTrue() {
  return true;
}

function charIsNumber(char) {
  return !!(char || '').match(/\d/);
}

function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

function removeLeadingZero(numStr) {
  //remove leading zeros
  return numStr.replace(/^0+/, '') || '0';
}

function splitString(str, index) {
  return [str.substring(0, index), str.substring(index)];
}

/**
 * limit decimal numbers to given precision
 * Not used .fixedTo because that will break with big numbers
 */
function limitToPrecision(numStr, precision) {
  var str = '';
  for (var i = 0; i <= precision - 1; i++) {
    str += numStr[i] || '0';
  }
  return str;
}

/**
 * This method is required to round prop value to given precision.
 * Not used .round or .fixedTo because that will break with big numbers
 */
function roundToPrecision(numStr, precision) {
  var numberParts = numStr.split('.');
  var roundedDecimalParts = parseFloat('0.' + (numberParts[1] || '0')).toFixed(precision).split('.');
  var intPart = numberParts[0].split('').reverse().reduce(function (roundedStr, current, idx) {
    if (roundedStr.length > idx) {
      return (Number(roundedStr[0]) + Number(current)).toString() + roundedStr.substring(1, roundedStr.length);
    }
    return current + roundedStr;
  }, roundedDecimalParts[0]);

  var decimalPart = roundedDecimalParts[1];

  return intPart + (decimalPart ? '.' + decimalPart : '');
}

function omit(obj, keyMaps) {
  var filteredObj = {};
  Object.keys(obj).forEach(function (key) {
    if (!keyMaps[key]) filteredObj[key] = obj[key];
  });
  return filteredObj;
}

/** set the caret positon in an input field **/
function setCaretPosition(el, caretPos) {
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