type FormatInputValueFunction = (inputValue: string) => string;

// basic noop function
export function noop() {}
export function returnTrue() {
  return true;
}

export function charIsNumber(char?: string) {
  return !!(char || '').match(/\d/);
}

export function isNil(val: any) {
  return val === null || val === undefined;
}

export function escapeRegExp(str: string) {
  return str.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&');
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

export function applyThousandSeparator(
  str: string,
  thousandSeparator: string,
  thousandsGroupStyle: string,
) {
  const thousandsGroupRegex = getThousandsGroupRegex(thousandsGroupStyle);
  let index = str.search(/[1-9]/);
  index = index === -1 ? str.length : index;
  return (
    str.substring(0, index) +
    str.substring(index, str.length).replace(thousandsGroupRegex, '$1' + thousandSeparator)
  );
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
    addNegation,
  };
}

export function fixLeadingZero(numStr?: string) {
  if (!numStr) return numStr;
  const isNegative = numStr[0] === '-';
  if (isNegative) numStr = numStr.substring(1, numStr.length);
  const parts = numStr.split('.');
  const beforeDecimal = parts[0].replace(/^0+/, '') || '0';
  const afterDecimal = parts[1] || '';

  return `${isNegative ? '-' : ''}${beforeDecimal}${afterDecimal ? `.${afterDecimal}` : ''}`;
}

/**
 * limit decimal numbers to given scale
 * Not used .fixedTo because that will break with big numbers
 */
export function limitToScale(numStr: string, scale: number, fixedDecimalScale: boolean) {
  let str = '';
  const filler = fixedDecimalScale ? '0' : '';
  for (let i = 0; i <= scale - 1; i++) {
    str += numStr[i] || filler;
  }
  return str;
}

function repeat(str, count) {
  return Array(count + 1).join(str);
}

export function toNumericString(num) {
  num += ''; // typecast number to string

  // store the sign and remove it from the number.
  const sign = num[0] === '-' ? '-' : '';
  if (sign) num = num.substring(1);

  // split the number into cofficient and exponent
  let [coefficient, exponent] = num.split(/[eE]/g);

  // covert exponent to number;
  exponent = Number(exponent);

  // if there is no exponent part or its 0, return the coffiecient with sign
  if (!exponent) return sign + coefficient;

  coefficient = coefficient.replace('.', '');

  /**
   * for scientific notation the current decimal index will be after first number (index 0)
   * So effective decimal index will always be 1 + exponent value
   */
  const decimalIndex = 1 + exponent;

  const coffiecientLn = coefficient.length;

  if (decimalIndex < 0) {
    // if decimal index is less then 0 add preceding 0s
    // add 1 as join will have
    coefficient = '0.' + repeat('0', Math.abs(decimalIndex)) + coefficient;
  } else if (decimalIndex >= coffiecientLn) {
    // if decimal index is less then 0 add leading 0s
    coefficient = coefficient + repeat('0', decimalIndex - coffiecientLn);
  } else {
    // else add decimal point at proper index
    coefficient =
      (coefficient.substring(0, decimalIndex) || '0') + '.' + coefficient.substring(decimalIndex);
  }

  return sign + coefficient;
}

/**
 * This method is required to round prop value to given scale.
 * Not used .round or .fixedTo because that will break with big numbers
 */
export function roundToPrecision(numStr: string, scale: number, fixedDecimalScale: boolean) {
  //if number is empty don't do anything return empty string
  if (['', '-'].indexOf(numStr) !== -1) return numStr;

  const shoudHaveDecimalSeparator = numStr.indexOf('.') !== -1 && scale;
  const { beforeDecimal, afterDecimal, hasNagation } = splitDecimal(numStr);
  const floatValue = parseFloat(`0.${afterDecimal || '0'}`);
  const floatValueStr =
    afterDecimal.length <= scale ? `0.${afterDecimal}` : floatValue.toFixed(scale);
  const roundedDecimalParts = floatValueStr.split('.');
  const intPart = beforeDecimal
    .split('')
    .reverse()
    .reduce((roundedStr, current, idx) => {
      if (roundedStr.length > idx) {
        return (
          (Number(roundedStr[0]) + Number(current)).toString() +
          roundedStr.substring(1, roundedStr.length)
        );
      }
      return current + roundedStr;
    }, roundedDecimalParts[0]);

  const decimalPart = limitToScale(
    roundedDecimalParts[1] || '',
    Math.min(scale, afterDecimal.length),
    fixedDecimalScale,
  );
  const negation = hasNagation ? '-' : '';
  const decimalSeparator = shoudHaveDecimalSeparator ? '.' : '';
  return `${negation}${intPart}${decimalSeparator}${decimalPart}`;
}

/** set the caret positon in an input field **/
export function setCaretPosition(el: HTMLInputElement, caretPos: number) {
  el.value = el.value;
  // ^ this is used to not only get 'focus', but
  // to make sure we don't have it everything -selected-
  // (it causes an issue in chrome, and having it doesn't hurt any other browser)
  if (el !== null) {
    /* @ts-ignore */
    if (el.createTextRange) {
      /* @ts-ignore */
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
  let i = 0,
    j = 0;
  const prevLength = prevValue.length;
  const newLength = newValue.length;
  while (prevValue[i] === newValue[i] && i < prevLength) i++;

  //check what has been changed from last
  while (
    prevValue[prevLength - 1 - j] === newValue[newLength - 1 - j] &&
    newLength - j > i &&
    prevLength - j > i
  ) {
    j++;
  }

  return { start: i, end: prevLength - j };
}

/*
  Returns a number whose value is limited to the given range
*/
export function clamp(num: number, min: number, max: number) {
  return Math.min(Math.max(num, min), max);
}

export function getCurrentCaretPosition(el: HTMLInputElement) {
  /*Max of selectionStart and selectionEnd is taken for the patch of pixel and other mobile device caret bug*/
  return Math.max(el.selectionStart, el.selectionEnd);
}

export function addInputMode(format: string | FormatInputValueFunction) {
  return (
    format ||
    (typeof navigator !== 'undefined' &&
      !(navigator.platform && /iPhone|iPod/.test(navigator.platform)))
  );
}

export function getMaskAtIndex(mask: string | string[] = ' ', index: number) {
  if (typeof mask === 'string') {
    return mask;
  }

  return mask[index] || ' ';
}

export function getCaretPosition(formattedValue: string, curValue: stirng, curCaretPos: number) {
  const curValLn = curValue.length;
  const formattedValueLn = formattedValue.length;

  // create index map
  const addedIndexMap = {};
  const indexMap = new Array(curValLn);

  for (let i = 0; i < curValLn; i++) {
    indexMap[i] = -1;
    for (let j = 0, jLn = formattedValueLn; j < jLn; j++) {
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
  let pos = curCaretPos;
  while (pos < curValLn && (indexMap[pos] === -1 || !charIsNumber(curValue[pos]))) {
    pos++;
  }

  // if the caret position is on last keep the endIndex as last for formatted value
  const endIndex = pos === curValLn || indexMap[pos] === -1 ? formattedValueLn : indexMap[pos];

  pos = curCaretPos - 1;
  while (pos > 0 && (indexMap[pos] === -1 || !charIsNumber(curValue[pos]))) pos--;
  const startIndex = pos === -1 || indexMap[pos] === -1 ? 0 : indexMap[pos] + 1;

  /**
   * case where a char is added on suffix and removed from middle, example 2sq345 becoming $2,345 sq
   * there is still a mapping but the order of start index and end index is changed
   */
  if (startIndex > endIndex) return endIndex;

  /**
   * given the current caret position if it closer to startIndex
   * keep the new caret position on start index or keep it closer to endIndex
   */
  return curCaretPos - startIndex < endIndex - curCaretPos ? startIndex : endIndex;
}

export function caretNumericBoundary(formattedValue: string, props) {
  const { prefix, suffix } = props;
  const boundaryAry = Array.from({ length: formattedValue.length + 1 }).map(() => true);

  const hasNegation = formattedValue[0] === '-';

  // fill for prefix and negation
  boundaryAry.fill(false, 0, prefix.length + (hasNegation ? 1 : 0));

  // fill for suffix
  const valLn = formattedValue.length;
  boundaryAry.fill(false, valLn - suffix.length + 1, valLn + 1);

  return boundaryAry;
}

export function caretPatternBoundary(formattedValue: string, props) {
  const { format, mask, patternChar = '#' } = props;
  const boundaryAry = Array.from({ length: formattedValue.length + 1 }).map(() => true);

  let hashCount = 0;
  const maskAndFormatMap = format.split('').map((char) => {
    if (char === patternChar) {
      hashCount++;
      return getMaskAtIndex(mask, hashCount - 1);
    }

    return undefined;
  });

  const isPosAllowed = (pos: number) => {
    // the position is allowed if the position is not masked and valid number area
    return format[pos] === patternChar && formattedValue[pos] !== maskAndFormatMap[pos];
  };

  for (let i = 0, ln = boundaryAry.length; i < ln; i++) {
    // consider caret to be in boundary if it is before or after numeric value
    // Note: on pattern based format its denoted by patternCharacter
    boundaryAry[i] = isPosAllowed(i) || isPosAllowed(i - 1);
  }

  // the first patternChar position is always allowed
  boundaryAry[format.indexOf(patternChar)] = true;

  return boundaryAry;
}

export function caretUnknownFormatBoundary(formattedValue: string) {
  const boundaryAry = Array.from({ length: formattedValue.length + 1 }).map(() => true);

  for (let i = 0, ln = boundaryAry.length; i < ln; i++) {
    // consider caret to be in boundary if it is before or after numeric value
    boundaryAry[i] = Boolean(
      charIsNumber(formattedValue[i]) || charIsNumber(formattedValue[i - 1]),
    );
  }

  return boundaryAry;
}
