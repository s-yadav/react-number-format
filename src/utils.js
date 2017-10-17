//@flow

// basic noop function
export function noop(){}
export function returnTrue(){ return true; }

export function charIsNumber(char?: string) {
  return !!(char || '').match(/\d/);
}

export function escapeRegExp(str: string) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

export function fixLeadingZero(numStr?: string) {
  if (!numStr) return numStr;
  const isNegative = numStr[0] === '-';
  if (isNegative) numStr = numStr.substring(1, numStr.length);
  const parts = numStr.split('.');
  const beforeDecimal = parts[0].replace(/^0+/,'') || '0';
  const afterDecimal = parts[1] || '';

  return `${isNegative ? '-': ''}${beforeDecimal}${afterDecimal ? `.${afterDecimal}` : ''}`;
}

export function splitString(str: string, index: number) {
  return [str.substring(0, index), str.substring(index)]
}

/**
 * limit decimal numbers to given scale
 * Not used .fixedTo because that will break with big numbers
 */
export function limitToScale(numStr: string, scale: number, fixedDecimalScale: boolean) {
  let str = ''
  const filler = fixedDecimalScale ? '0' : '';
  for (let i=0; i<=scale - 1; i++) {
    str += numStr[i] || filler;
  }
  return str;
}

/**
 * This method is required to round prop value to given scale.
 * Not used .round or .fixedTo because that will break with big numbers
 */
export function roundToPrecision(numStr: string, scale: number, fixedDecimalScale: boolean) {
  const numberParts = numStr.split('.');
  const roundedDecimalParts = parseFloat(`0.${numberParts[1] || '0'}`).toFixed(scale).split('.');
  const intPart = numberParts[0].split('').reverse().reduce((roundedStr, current, idx) => {
    if (roundedStr.length > idx) {
      return (Number(roundedStr[0]) + Number(current)).toString() + roundedStr.substring(1, roundedStr.length);
    }
    return current + roundedStr;
  }, roundedDecimalParts[0]);

  const decimalPart = limitToScale(roundedDecimalParts[1] || '', (numberParts[1] || '').length, fixedDecimalScale);

  return intPart + (decimalPart ? '.' + decimalPart : '');
}


export function omit(obj: Object, keyMaps: Object) {
  const filteredObj = {};
  Object.keys(obj).forEach((key) => {
    if (!keyMaps[key]) filteredObj[key] = obj[key]
  });
  return filteredObj;
}

/** set the caret positon in an input field **/
export function setCaretPosition(el: HTMLInputElement, caretPos: number) {
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
