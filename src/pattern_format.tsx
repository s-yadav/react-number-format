import React from 'react';
import { NumberFormatProps, ChangeMeta } from './types';
import { getDefaultChangeMeta, getMaskAtIndex } from './utils';
import NumberFormatBase from './number_format_base';

export function format(numStr: string, props: NumberFormatProps) {
  const format = props.format as string;
  const { mask } = props;

  let hashCount = 0;
  const formattedNumberAry = format.split('');
  for (let i = 0, ln = format.length; i < ln; i++) {
    if (format[i] === '#') {
      formattedNumberAry[i] = numStr[hashCount] || getMaskAtIndex(mask, hashCount);
      hashCount += 1;
    }
  }
  return formattedNumberAry.join('');
}

export function removeFormatting(
  value: string,
  changeMeta: ChangeMeta = getDefaultChangeMeta(value),
  props: NumberFormatProps,
) {
  const format = props.format as string;
  const { mask, patternChar = '#' } = props;
  const { from, to, lastValue = '' } = changeMeta;

  const isNumericSlot = (caretPos: number) => format[caretPos] === patternChar;

  const removeFormatChar = (string, startIndex) => {
    let str = '';
    for (let i = 0; i < string.length; i++) {
      if (!isNumericSlot(startIndex + i)) {
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
   * if user paste the whole formatted text in an empty input, check if matches to the pattern
   * and remove the format characters, if there is a mismatch on the pattern, do plane number extract
   */
  if (lastValue === '' && value.length === format.length) {
    let str = '';
    for (let i = 0; i < value.length; i++) {
      if (isNumericSlot(i)) {
        str += value[i];
      } else if (value[i] !== format[i]) {
        // if there is a mismatch on the pattern, do plane number extract
        return extractNumbers(value);
      }
    }
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

export function getCaretBoundary(formattedValue: string, props: NumberFormatProps) {
  const format = props.format as string;
  const { mask, patternChar = '#' } = props;
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

export default function PatternFormat(props: NumberFormatProps) {
  const {
    /* eslint-disable no-unused-vars */
    mask,
    allowEmptyFormatting,
    format: formatProp,
    /* eslint-enable no-unused-vars */
    ...restProps
  } = props;

  return (
    <NumberFormatBase
      {...props}
      format={(numStr) => format(numStr, props)}
      removeFormatting={(inputValue, changeMeta) => removeFormatting(inputValue, changeMeta, props)}
      getCaretBoundary={(formattedValue) => getCaretBoundary(formattedValue, props)}
    />
  );
}
