//@flow

type FormatInputValueFunction = (inputValue: string) => string;

// basic noop function
export function noop(){}
export function returnTrue(){ return true; }

export function charIsNumber(char?: string) {
  return !!(char || '').match(/\d/);
}

export function escapeRegExp(str: string) {
  return str.replace(/[-[\]/{}()*+?.\\^$|]/g, "\\$&");
}

export function getThousandsGroupRegex(thousandsGroupStyle: string) {
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

export function applyThousandSeparator(str: string, thousandSeparator: string, thousandsGroupStyle: string) {
  const thousandsGroupRegex = getThousandsGroupRegex(thousandsGroupStyle);
  let index = str.search(/[1-9]/);
  index = index === -1 ? str.length : index;
  return str.substring(0, index) + str.substring(index, str.length).replace(thousandsGroupRegex, '$1' + thousandSeparator);
}

//spilt a float number into different parts beforeDecimal, afterDecimal, and negation
export function splitDecimal(numStr: string, allowNegative: boolean = true) {
  const hasNagation = numStr[0] === '-';
  const addNegation = hasNagation && allowNegative;
  numStr = numStr.replace('-', '');

  const parts = numStr.split('.');
  const beforeDecimal = parts[0];
  const afterDecimal = parts[1] || '';

  return {
    beforeDecimal,
    afterDecimal,
    hasNagation,
    addNegation
  }
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
  //if number is empty don't do anything return empty string
  if (['', '-'].indexOf(numStr) !== -1) return numStr;

  const shoudHaveDecimalSeparator = numStr.indexOf('.') !== -1 && scale;
  const {beforeDecimal, afterDecimal, hasNagation} = splitDecimal(numStr);
  const roundedDecimalParts = parseFloat(`0.${afterDecimal || '0'}`).toFixed(scale).split('.');
  const intPart = beforeDecimal.split('').reverse().reduce((roundedStr, current, idx) => {
    if (roundedStr.length > idx) {
      return (Number(roundedStr[0]) + Number(current)).toString() + roundedStr.substring(1, roundedStr.length);
    }
    return current + roundedStr;
  }, roundedDecimalParts[0]);

  const decimalPart = limitToScale(roundedDecimalParts[1] || '', Math.min(scale, afterDecimal.length), fixedDecimalScale);
  const negation = hasNagation ? '-' : '';
  const decimalSeparator = shoudHaveDecimalSeparator ? '.' : '';
  return `${negation}${intPart}${decimalSeparator}${decimalPart}`;
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

/**
  Given previous value and newValue it returns the index
  start - end to which values have changed.
  This function makes assumption about only consecutive
  characters are changed which is correct assumption for caret input.
*/
export function findChangedIndex(prevValue: string, newValue: string) {
  let i = 0, j = 0;
  const prevLength = prevValue.length;
  const newLength = newValue.length;
  while (prevValue[i] === newValue[i] && i < prevLength) i++;

  //check what has been changed from last
  while (
    prevValue[prevLength - 1 - j] === newValue[newLength - 1 - j]
    && newLength - j > i
    && prevLength - j > i
  ) {
       j++;
    }

  return {start: i, end: prevLength - j};
}

/*
  Returns a number whose value is limited to the given range
*/
export function clamp(num: number, min: number, max: number) {
  return Math.min(Math.max(num, min), max);
}

export function getCurrentCaretPosition(el: HTMLInputElement ) {
  /*Max of selectionStart and selectionEnd is taken for the patch of pixel and other mobile device caret bug*/
  return Math.max(el.selectionStart, el.selectionEnd);
}

export function addInputMode(format: string | FormatInputValueFunction){
  return format || !(navigator.platform && /iPhone|iPod/.test(navigator.platform));
}