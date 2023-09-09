import { useMemo, useRef, useState } from 'react';
import {
  NumberFormatBaseProps,
  FormatInputValueFunction,
  OnValueChange,
  IsCharacterSame,
} from './types';

// basic noop function
export function noop() {}
export function returnTrue() {
  return true;
}

export function memoizeOnce<T extends unknown[], R extends unknown>(cb: (...args: T) => R) {
  let lastArgs: T | undefined;
  let lastValue: R = undefined;
  return (...args: T) => {
    if (
      lastArgs &&
      args.length === lastArgs.length &&
      args.every((value, index) => value === lastArgs[index])
    ) {
      return lastValue;
    }
    lastArgs = args;
    lastValue = cb(...args);
    return lastValue;
  };
}

export function charIsNumber(char?: string) {
  return !!(char || '').match(/\d/);
}

export function isNil(val: any): val is null | undefined {
  return val === null || val === undefined;
}

export function isNanValue(val: string | number) {
  return typeof val === 'number' && isNaN(val);
}

export function isNotValidValue(val: string | number | null | undefined) {
  return isNil(val) || isNanValue(val) || (typeof val === 'number' && !isFinite(val));
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

export function usePersistentCallback<T extends (...args: any[]) => any>(cb: T) {
  const callbackRef = useRef<T>(cb);
  // keep the callback ref upto date
  callbackRef.current = cb;
  type Params = Parameters<T>;
  /**
   * initialize a persistent callback which never changes
   * through out the component lifecycle
   */
  const persistentCbRef = useRef(function (...args: Params) {
    return callbackRef.current(...args);
  } as T);

  return persistentCbRef.current;
}

//spilt a float number into different parts beforeDecimal, afterDecimal, and negation
export function splitDecimal(numStr: string, allowNegative: boolean = true) {
  const hasNegation = numStr[0] === '-';
  const addNegation = hasNegation && allowNegative;
  numStr = numStr.replace('-', '');

  const parts = numStr.split('.');
  const beforeDecimal = parts[0];
  const afterDecimal = parts[1] || '';

  return {
    beforeDecimal,
    afterDecimal,
    hasNegation,
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

function repeat(str: string, count: number) {
  return Array(count + 1).join(str);
}

export function toNumericString(num: string | number) {
  let _num = num + ''; // typecast number to string

  // store the sign and remove it from the number.
  const sign = _num[0] === '-' ? '-' : '';
  if (sign) _num = _num.substring(1);

  // split the number into cofficient and exponent
  let [coefficient, exponent] = _num.split(/[eE]/g) as [string, string | number | undefined];

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

  const shouldHaveDecimalSeparator = (numStr.indexOf('.') !== -1 || fixedDecimalScale) && scale;
  const { beforeDecimal, afterDecimal, hasNegation } = splitDecimal(numStr);
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

  const decimalPart = limitToScale(roundedDecimalParts[1] || '', scale, fixedDecimalScale);
  const negation = hasNegation ? '-' : '';
  const decimalSeparator = shouldHaveDecimalSeparator ? '.' : '';
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

export const findChangeRange = memoizeOnce((prevValue: string, newValue: string) => {
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

  return {
    from: { start: i, end: prevLength - j },
    to: { start: i, end: newLength - j },
  };
});

/*
  Returns a number whose value is limited to the given range
*/
export function clamp(num: number, min: number, max: number) {
  return Math.min(Math.max(num, min), max);
}

export function geInputCaretPosition(el: HTMLInputElement) {
  /*Max of selectionStart and selectionEnd is taken for the patch of pixel and other mobile device caret bug*/
  return Math.max(el.selectionStart as number, el.selectionEnd as number);
}

export function addInputMode() {
  return (
    typeof navigator !== 'undefined' &&
    !(navigator.platform && /iPhone|iPod/.test(navigator.platform))
  );
}

export function getDefaultChangeMeta(value: string) {
  return {
    from: {
      start: 0,
      end: 0,
    },
    to: {
      start: 0,
      end: value.length,
    },
    lastValue: '',
  };
}

export function getMaskAtIndex(mask: string | string[] = ' ', index: number) {
  if (typeof mask === 'string') {
    return mask;
  }

  return mask[index] || ' ';
}

function defaultIsCharacterSame({
  currentValue,
  formattedValue,
  currentValueIndex,
  formattedValueIndex,
}: Parameters<IsCharacterSame>[0]) {
  return currentValue[currentValueIndex] === formattedValue[formattedValueIndex];
}

export function getCaretPosition(
  newFormattedValue: string,
  lastFormattedValue: string,
  curValue: string,
  curCaretPos: number,
  boundary: boolean[],
  isValidInputCharacter: (char: string) => boolean,
  /**
   * format function can change the character, the caret engine relies on mapping old value and new value
   * In such case if character is changed, parent can tell which chars are equivalent
   * Some example, all allowedDecimalCharacters are updated to decimalCharacters, 2nd case if user is coverting
   * number to different numeric system.
   */
  isCharacterSame: IsCharacterSame = defaultIsCharacterSame,
) {
  /**
   * if something got inserted on empty value, add the formatted character before the current value,
   * This is to avoid the case where typed character is present on format characters
   */
  const firstAllowedPosition = boundary.findIndex((b) => b);
  const prefixFormat = newFormattedValue.slice(0, firstAllowedPosition);
  if (!lastFormattedValue && !curValue.startsWith(prefixFormat)) {
    lastFormattedValue = prefixFormat;
    curValue = prefixFormat + curValue;
    curCaretPos = curCaretPos + prefixFormat.length;
  }

  const curValLn = curValue.length;
  const formattedValueLn = newFormattedValue.length;

  // create index map
  const addedIndexMap: { [key: number]: boolean } = {};
  const indexMap = new Array(curValLn);

  for (let i = 0; i < curValLn; i++) {
    indexMap[i] = -1;
    for (let j = 0, jLn = formattedValueLn; j < jLn; j++) {
      const isCharSame = isCharacterSame({
        currentValue: curValue,
        lastValue: lastFormattedValue,
        formattedValue: newFormattedValue,
        currentValueIndex: i,
        formattedValueIndex: j,
      });

      if (isCharSame && addedIndexMap[j] !== true) {
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
  while (pos < curValLn && (indexMap[pos] === -1 || !isValidInputCharacter(curValue[pos]))) {
    pos++;
  }

  // if the caret position is on last keep the endIndex as last for formatted value
  const endIndex = pos === curValLn || indexMap[pos] === -1 ? formattedValueLn : indexMap[pos];

  pos = curCaretPos - 1;
  while (pos > 0 && indexMap[pos] === -1) pos--;
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

/* This keeps the caret within typing area so people can't type in between prefix or suffix or format characters */
export function getCaretPosInBoundary(
  value: string,
  caretPos: number,
  boundary: boolean[],
  direction?: string,
) {
  const valLn = value.length;

  // clamp caret position to [0, value.length]
  caretPos = clamp(caretPos, 0, valLn);

  if (direction === 'left') {
    while (caretPos >= 0 && !boundary[caretPos]) caretPos--;

    // if we don't find any suitable caret position on left, set it on first allowed position
    if (caretPos === -1) caretPos = boundary.indexOf(true);
  } else {
    while (caretPos <= valLn && !boundary[caretPos]) caretPos++;

    // if we don't find any suitable caret position on right, set it on last allowed position
    if (caretPos > valLn) caretPos = boundary.lastIndexOf(true);
  }

  // if we still don't find caret position, set it at the end of value
  if (caretPos === -1) caretPos = valLn;

  return caretPos;
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

export function useInternalValues(
  value: string | number | null | undefined,
  defaultValue: string | number | null | undefined,
  valueIsNumericString: boolean,
  format: FormatInputValueFunction,
  removeFormatting: NumberFormatBaseProps['removeFormatting'],
  onValueChange: NumberFormatBaseProps['onValueChange'] = noop,
): [{ formattedValue: string; numAsString: string }, OnValueChange] {
  type Values = { formattedValue: string; numAsString: string };

  const getValues = usePersistentCallback(
    (value: string | number | null | undefined, valueIsNumericString: boolean) => {
      let formattedValue, numAsString;
      if (isNotValidValue(value)) {
        numAsString = '';
        formattedValue = '';
      } else if (typeof value === 'number' || valueIsNumericString) {
        numAsString = typeof value === 'number' ? toNumericString(value) : value;
        formattedValue = format(numAsString);
      } else {
        numAsString = removeFormatting(value, undefined);
        formattedValue = format(numAsString);
      }

      return { formattedValue, numAsString };
    },
  );

  const [values, setValues] = useState<Values>(() => {
    return getValues(isNil(value) ? defaultValue : value, valueIsNumericString);
  });

  const _onValueChange: typeof onValueChange = (newValues, sourceInfo) => {
    if (newValues.formattedValue !== values.formattedValue) {
      setValues({
        formattedValue: newValues.formattedValue,
        numAsString: newValues.value,
      });
    }

    // call parent on value change if only if formatted value is changed
    onValueChange(newValues, sourceInfo);
  };

  // if value is switch from controlled to uncontrolled, use the internal state's value to format with new props
  let _value = value;
  let _valueIsNumericString = valueIsNumericString;
  if (isNil(value)) {
    _value = values.numAsString;
    _valueIsNumericString = true;
  }

  const newValues = getValues(_value, _valueIsNumericString);

  useMemo(() => {
    setValues(newValues);
  }, [newValues.formattedValue]);

  return [values, _onValueChange];
}
