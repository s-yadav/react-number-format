import React from 'react';
import { PatternFormatProps, InputAttributes, ChangeMeta, NumberFormatBaseProps } from './types';
import {
  charIsNumber,
  getCaretPosInBoundary,
  getDefaultChangeMeta,
  getMaskAtIndex,
  isNil,
  noop,
  setCaretPosition,
} from './utils';
import NumberFormatBase from './number_format_base';

function _getFormattedNumberArray(format: string, patternChar: string, numStr: string, formatOnType: boolean) {
  const formatArray = format.split('');
  if (!formatOnType) {
    return formatArray;
  }
  let hashCount = 0;
  // find last pattern index
  const replacePatternIdx = formatArray.findIndex((char) => {
    if (char === patternChar) {
      hashCount += 1;
    }
    return hashCount === numStr.length
  })

  // filter format array until numStr length
  return formatArray.filter((_, index) => {
    return replacePatternIdx >= 0 
      ? index <= replacePatternIdx
      : true
  });
}

export function format<BaseType = InputAttributes>(
  numStr: string,
  props: PatternFormatProps<BaseType>,
) {
  const format = props.format as string;
  const { allowEmptyFormatting, mask, patternChar = '#', formatOnType } = props;

  if (numStr === '' && !allowEmptyFormatting) return '';

  const formattedNumberAry = _getFormattedNumberArray(format, patternChar, numStr, formatOnType);
  
  let hashCount = 0

  for (let i = 0, ln = format.length; i < ln; i++) {
    if (format[i] === patternChar) {
      formattedNumberAry[i] = numStr[hashCount] || getMaskAtIndex(mask, hashCount, formatOnType);
      hashCount += 1;
    }
  }
  return formattedNumberAry.join('');
}

export function removeFormatting<BaseType = InputAttributes>(
  value: string,
  changeMeta: ChangeMeta = getDefaultChangeMeta(value),
  props: PatternFormatProps<BaseType>,
) {
  const format = props.format as string;
  const { patternChar = '#' } = props;
  const { from, to, lastValue = '' } = changeMeta;

  const isNumericSlot = (caretPos: number) => format[caretPos] === patternChar;

  const removeFormatChar = (string: string, startIndex: number) => {
    let str = '';
    for (let i = 0; i < string.length; i++) {
      if (isNumericSlot(startIndex + i) && charIsNumber(string[i])) {
        str += string[i];
      }
    }

    return str;
  };

  const extractNumbers = (str: string) => str.replace(/[^0-9]/g, '');

  // if format doesn't have any number, remove all the non numeric characters
  if (!format.match(/\d/)) {
    return extractNumbers(value);
  }

  /**
   * if user paste the whole formatted text in an empty input or doing select all and paste, check if matches to the pattern
   * and remove the format characters, if there is a mismatch on the pattern, do plane number extract
   */
  if (
    (lastValue === '' || from.end - from.start === lastValue.length) &&
    value.length === format.length
  ) {
    let str = '';
    for (let i = 0; i < value.length; i++) {
      if (isNumericSlot(i)) {
        if (charIsNumber(value[i])) {
          str += value[i];
        }
      } else if (value[i] !== format[i]) {
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

  const firstSection = lastValue.substring(0, from.start);
  const middleSection = value.substring(to.start, to.end);
  const lastSection = lastValue.substring(from.end);

  return `${removeFormatChar(firstSection, 0)}${extractNumbers(middleSection)}${removeFormatChar(
    lastSection,
    from.end,
  )}`;
}

export function getCaretBoundary<BaseType = InputAttributes>(
  formattedValue: string,
  props: PatternFormatProps<BaseType>,
) {
  const format = props.format as string;
  const { mask, patternChar = '#' } = props;
  const boundaryAry = Array.from({ length: formattedValue.length + 1 }).map(() => true);

  let hashCount = 0;
  let firstEmptySlot = -1;
  const maskAndIndexMap: Record<number, string | undefined> = {};

  format.split('').forEach((char, index) => {
    let maskAtIndex = undefined;
    if (char === patternChar) {
      hashCount++;
      maskAtIndex = getMaskAtIndex(mask, hashCount - 1);
      if (firstEmptySlot === -1 && formattedValue[index] === maskAtIndex) {
        firstEmptySlot = index;
      }
    }

    maskAndIndexMap[index] = maskAtIndex;
  });

  const isPosAllowed = (pos: number) => {
    // the position is allowed if the position is not masked and valid number area
    return format[pos] === patternChar && formattedValue[pos] !== maskAndIndexMap[pos];
  };

  for (let i = 0, ln = boundaryAry.length; i < ln; i++) {
    // consider caret to be in boundary if it is before or after numeric value
    // Note: on pattern based format its denoted by patternCharacter
    // we should also allow user to put cursor on first empty slot
    boundaryAry[i] = i === firstEmptySlot || isPosAllowed(i) || isPosAllowed(i - 1);
  }

  // the first patternChar position is always allowed
  boundaryAry[format.indexOf(patternChar)] = true;

  return boundaryAry;
}

function validateProps<BaseType = InputAttributes>(props: PatternFormatProps<BaseType>) {
  const { mask } = props;

  if (mask) {
    const maskAsStr = mask === 'string' ? mask : mask.toString();
    if (maskAsStr.match(/\d/g)) {
      throw new Error(`Mask ${mask} should not contain numeric character;`);
    }
  }
}

function isNumericString(val: string | number | null | undefined, format: string) {
  //we can treat empty string as numeric string
  if (val === '') return true;

  return !format?.match(/\d/) && typeof val === 'string' && (!!val.match(/^\d+$/) || val === '');
}

export function usePatternFormat<BaseType = InputAttributes>(
  props: PatternFormatProps<BaseType>,
): NumberFormatBaseProps<BaseType> {
  const {
    /* eslint-disable no-unused-vars */
    mask,
    allowEmptyFormatting,
    /* eslint-enable no-unused-vars */
    format: formatProp,
    inputMode = 'numeric',
    onKeyDown = noop,
    patternChar = '#',
    value,
    defaultValue,
    valueIsNumericString,
    ...restProps
  } = props;

  // validate props
  validateProps(props);

  const _getCaretBoundary = (formattedValue: string) => {
    return getCaretBoundary(formattedValue, props);
  };

  const _onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { key } = e;
    const el = e.target as HTMLInputElement;
    const { selectionStart, selectionEnd, value } = el;

    // if multiple characters are selected and user hits backspace, no need to handle anything manually
    if (selectionStart !== selectionEnd) {
      onKeyDown(e);
      return;
    }

    // bring the cursor to closest numeric section
    let caretPos = selectionStart;

    // if backspace is pressed after the format characters, bring it to numeric section
    // if delete is pressed before the format characters, bring it to numeric section
    if (key === 'Backspace' || key === 'Delete') {
      let direction: string = 'right';
      if (key === 'Backspace') {
        while (caretPos > 0 && formatProp[caretPos - 1] !== patternChar) {
          caretPos--;
        }
        direction = 'left';
      } else {
        const formatLn = formatProp.length;
        while (caretPos < formatLn && formatProp[caretPos] !== patternChar) {
          caretPos++;
        }
        direction = 'right';
      }

      caretPos = getCaretPosInBoundary(value, caretPos, _getCaretBoundary(value), direction);
    } else if (
      formatProp[caretPos] !== patternChar &&
      key !== 'ArrowLeft' &&
      key !== 'ArrowRight'
    ) {
      // if user is typing on format character position, bring user to next allowed caret position
      caretPos = getCaretPosInBoundary(value, caretPos + 1, _getCaretBoundary(value), 'right');
    }

    // if we changing caret position, set the caret position
    if (caretPos !== selectionStart) {
      setCaretPosition(el, caretPos);
    }

    onKeyDown(e);
  };

  // try to figure out isValueNumericString based on format prop and value
  const _value = isNil(value) ? defaultValue : value;
  const isValueNumericString = valueIsNumericString ?? isNumericString(_value, formatProp);

  const _props = { ...props, valueIsNumericString: isValueNumericString };

  return {
    ...(restProps as NumberFormatBaseProps<BaseType>),
    value,
    defaultValue,
    valueIsNumericString: isValueNumericString,
    inputMode,
    format: (numStr: string) => format(numStr, _props),
    removeFormatting: (inputValue: string, changeMeta: ChangeMeta) =>
      removeFormatting(inputValue, changeMeta, _props),
    getCaretBoundary: _getCaretBoundary,
    onKeyDown: _onKeyDown,
  };
}

export default function PatternFormat<BaseType = InputAttributes>(
  props: PatternFormatProps<BaseType>,
): React.ReactElement {
  const patternFormatProps = usePatternFormat(props);

  return <NumberFormatBase {...patternFormatProps} />;
}
