import React from 'react';
import {
  escapeRegExp,
  splitDecimal,
  limitToScale,
  applyThousandSeparator,
  getDefaultChangeMeta,
  fixLeadingZero,
} from './utils';
import { NumberFormatProps, ChangeMeta } from './types';
import NumberFormatBase from './number_format_base';

export function format(numStr: string, props: NumberFormatProps) {
  const { decimalScale, fixedDecimalScale, prefix, suffix, allowNegative, thousandsGroupStyle } =
    props;

  const { thousandSeparator, decimalSeparator } = getSeparators(
    props.thousandSeparator,
    props.decimalSeparator,
    props.allowedDecimalSeparators,
  );

  const hasDecimalSeparator = numStr.indexOf('.') !== -1 || (decimalScale && fixedDecimalScale);
  let { beforeDecimal, afterDecimal, addNegation } = splitDecimal(numStr, allowNegative); // eslint-disable-line prefer-const

  //apply decimal precision if its defined
  if (decimalScale !== undefined) {
    afterDecimal = limitToScale(afterDecimal, decimalScale, fixedDecimalScale);
  }

  if (thousandSeparator) {
    beforeDecimal = applyThousandSeparator(beforeDecimal, thousandSeparator, thousandsGroupStyle);
  }

  //add prefix and suffix
  if (prefix) beforeDecimal = prefix + beforeDecimal;
  if (suffix) afterDecimal = afterDecimal + suffix;

  //restore negation sign
  if (addNegation) beforeDecimal = '-' + beforeDecimal;

  numStr = beforeDecimal + ((hasDecimalSeparator && decimalSeparator) || '') + afterDecimal;

  return numStr;
}

function getSeparators(thousandSeparator, decimalSeparator, allowedDecimalSeparators) {
  if (thousandSeparator === true) {
    thousandSeparator = ',';
  }
  if (!allowedDecimalSeparators) {
    allowedDecimalSeparators = [decimalSeparator, '.'];
  }

  return {
    decimalSeparator,
    thousandSeparator,
    allowedDecimalSeparators,
  };
}

function handleNegation(value: string = '', allowNegative: boolean) {
  const negationRegex = new RegExp('(-)');
  const doubleNegationRegex = new RegExp('(-)(.)*(-)');

  // Check number has '-' value
  const hasNegation = negationRegex.test(value);

  // Check number has 2 or more '-' values
  const removeNegation = doubleNegationRegex.test(value);

  //remove negation
  value = value.replace(/-/g, '');

  if (hasNegation && !removeNegation && allowNegative) {
    value = '-' + value;
  }

  return value;
}

function getNumberRegex(decimalSeparator: string, decimalScale: number, global: boolean) {
  return new RegExp(
    `[0-9]${decimalSeparator && decimalScale !== 0 ? `|${escapeRegExp(decimalSeparator)}` : ''}`,
    global ? 'g' : undefined,
  );
}

export function removeFormatting(
  value: string,
  changeMeta: ChangeMeta = getDefaultChangeMeta(value),
  props: NumberFormatProps,
) {
  const { allowNegative, prefix, suffix, decimalScale } = props;
  const { to } = changeMeta;
  let { start, end } = to;
  const { allowedDecimalSeparators, decimalSeparator } = getSeparators(
    props.thousandSeparator,
    props.decimalSeparator,
    props.allowedDecimalSeparators,
  );

  /** Check for any allowed decimal separator is added in the numeric format and replace it with decimal separator */
  if (end - start === 1 && allowedDecimalSeparators.indexOf(value[start]) !== -1) {
    const separator = decimalScale === 0 ? '' : decimalSeparator;
    return value.substring(0, start) + separator + value.substring(start + 1, value.length);
  }

  const hasNegation = value[0] === '-';

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
  let startIndex = 0;
  if (value.startsWith(prefix)) startIndex += prefix.length;
  else if (start < prefix.length) startIndex = start;
  value = value.substring(startIndex);

  // account for deleted prefix for end index
  end -= startIndex;

  /**
   * Remove suffix
   * Remove whole suffix part if its present on the value
   * If the suffix is partially deleted (in which case change end index will be greater than the suffixStartIndex)
   * remove the partial part of suffix
   */
  let endIndex = value.length;
  const suffixStartIndex = value.length - suffix.length;

  if (value.endsWith(suffix)) endIndex = suffixStartIndex;
  if (end > value.length - suffix.length) endIndex = end;

  value = value.substring(0, endIndex);

  // add the negation back and handle for double negation
  value = handleNegation(hasNegation ? `-${value}` : value, allowNegative);

  // remove non numeric characters
  value = (value.match(getNumberRegex(decimalSeparator, decimalScale, true)) || []).join('');
}

export function getCaretBoundary(formattedValue: string, props: NumberFormatProps) {
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

export default function NumericFormat(props: NumberFormatProps) {
  const {
    /* eslint-disable no-unused-vars */
    thousandSeparator,
    decimalSeparator,
    allowedDecimalSeparators,
    thousandsGroupStyle,
    decimalScale,
    fixedDecimalScale,
    prefix = '',
    suffix,
    allowNegative,
    allowLeadingZeros,
    onKeyDown,
    /* eslint-enable no-unused-vars */
    ...restProps
  } = props;

  const _onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const el = e.target as HTMLInputElement;
    const { key } = e;
    const { selectionStart, selectionEnd, value = '' } = el;

    // if multiple characters are selected and user hits backspace, no need to handle anything manually
    if (selectionStart !== selectionEnd) {
      onKeyDown(e);
      return;
    }

    // if user hits backspace, while the cursor is before prefix, and the input has negation, remove the negation
    if (key === 'Backspace' && value[0] === '-' && selectionStart === prefix.length + 1) {
      // bring the negation after prefix so that it can be removed automatically be browser
      el.value = `${prefix}-${value.substring(prefix.length + 1)}`;
    }

    onKeyDown(e);
  };

  const _onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    let { numAsString } = state;
    const lastValue = state.value;

    // if the numAsString is not a valid number reset it to empty
    if (isNaN(parseFloat(numAsString))) {
      numAsString = '';
    }

    if (!allowLeadingZeros) {
      numAsString = fixLeadingZero(numAsString);
    }

    const formattedValue = this.formatNumString(numAsString);

    //change the state
    if (formattedValue !== lastValue) {
      // the event needs to be persisted because its properties can be accessed in an asynchronous way
      this.updateValue({
        formattedValue,
        numAsString,
        input: e.target,
        setCaretPosition: false,
        event: e,
        source: 'event',
      });
      onBlur(e);
      return;
    }
    onBlur(e);
  };

  return (
    <NumberFormatBase
      {...restProps}
      format={(numStr) => format(numStr, props)}
      removeFormatting={(inputValue, changeMeta) => removeFormatting(inputValue, changeMeta, props)}
      getCaretBoundary={(formattedValue) => getCaretBoundary(formattedValue, props)}
      onKeyDown={_onKeyDown}
    />
  );
}
