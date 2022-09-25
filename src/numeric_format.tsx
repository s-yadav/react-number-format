import React from 'react';
import {
  escapeRegExp,
  splitDecimal,
  limitToScale,
  applyThousandSeparator,
  getDefaultChangeMeta,
  fixLeadingZero,
  noop,
  useInternalValues,
  isNil,
  roundToPrecision,
  isNanValue,
  setCaretPosition,
  toNumericString,
} from './utils';
import {
  NumericFormatProps,
  ChangeMeta,
  SourceType,
  InputAttributes,
  FormatInputValueFunction,
  RemoveFormattingFunction,
  InternalNumberFormatBase,
} from './types';
import NumberFormatBase from './number_format_base';

export function format<BaseType = InputAttributes>(
  numStr: string,
  props: NumericFormatProps<BaseType>,
) {
  const {
    decimalScale,
    fixedDecimalScale,
    prefix = '',
    suffix = '',
    allowNegative = true,
    thousandsGroupStyle = 'thousand',
  } = props;

  // don't apply formatting on empty string or '-'
  if (numStr === '' || numStr === '-') {
    return numStr;
  }

  const { thousandSeparator, decimalSeparator } = getSeparators(props);

  /**
   * Keep the decimal separator
   * when decimalScale is not defined or non zero and the numStr has decimal in it
   * Or if decimalScale is > 0 and fixeDecimalScale is true (even if numStr has no decimal)
   */
  const hasDecimalSeparator =
    (decimalScale !== 0 && numStr.indexOf('.') !== -1) || (decimalScale && fixedDecimalScale);

  let { beforeDecimal, afterDecimal, addNegation } = splitDecimal(numStr, allowNegative); // eslint-disable-line prefer-const

  //apply decimal precision if its defined
  if (decimalScale !== undefined) {
    afterDecimal = limitToScale(afterDecimal, decimalScale, !!fixedDecimalScale);
  }

  if (thousandSeparator) {
    beforeDecimal = applyThousandSeparator(beforeDecimal, thousandSeparator, thousandsGroupStyle);
  }

  //add prefix and suffix when there is a number present
  if (prefix) beforeDecimal = prefix + beforeDecimal;
  if (suffix) afterDecimal = afterDecimal + suffix;

  //restore negation sign
  if (addNegation) beforeDecimal = '-' + beforeDecimal;

  numStr = beforeDecimal + ((hasDecimalSeparator && decimalSeparator) || '') + afterDecimal;

  return numStr;
}

function getSeparators<BaseType = InputAttributes>(props: NumericFormatProps<BaseType>) {
  const { decimalSeparator = '.' } = props;
  let { thousandSeparator, allowedDecimalSeparators } = props;
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

function getNumberRegex(decimalSeparator: string, global: boolean) {
  return new RegExp(`(^-)|[0-9]|${escapeRegExp(decimalSeparator)}`, global ? 'g' : undefined);
}

export function removeFormatting<BaseType = InputAttributes>(
  value: string,
  changeMeta: ChangeMeta = getDefaultChangeMeta(value),
  props: NumericFormatProps<BaseType>,
) {
  const { allowNegative = true, prefix = '', suffix = '', decimalScale } = props;
  const { from, to } = changeMeta;
  let { start, end } = to;
  const { allowedDecimalSeparators, decimalSeparator } = getSeparators(props);

  const isBeforeDecimalSeparator = value[end] === decimalSeparator;

  /** Check for any allowed decimal separator is added in the numeric format and replace it with decimal separator */
  if (end - start === 1 && allowedDecimalSeparators.indexOf(value[start]) !== -1) {
    const separator = decimalScale === 0 ? '' : decimalSeparator;
    value = value.substring(0, start) + separator + value.substring(start + 1, value.length);
  }

  let hasNegation = false;

  /**
   * if prefix starts with - the number hast to have two - at the start
   * if suffix starts with - and the value length is same as suffix length, then the - sign is from the suffix
   * In other cases, if the value starts with - then it is a negation
   */
  if (prefix.startsWith('-')) hasNegation = value.startsWith('--');
  else if (suffix.startsWith('-') && value.length === suffix.length) hasNegation = false;
  else if (value[0] === '-') hasNegation = true;

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
  else if (end > value.length - suffix.length) endIndex = end;

  value = value.substring(0, endIndex);

  // add the negation back and handle for double negation
  value = handleNegation(hasNegation ? `-${value}` : value, allowNegative);

  // remove non numeric characters
  value = (value.match(getNumberRegex(decimalSeparator, true)) || []).join('');

  // replace the decimalSeparator with ., and only keep the first separator, ignore following ones
  const firstIndex = value.indexOf(decimalSeparator);
  value = value.replace(new RegExp(escapeRegExp(decimalSeparator), 'g'), (match, index) => {
    return index === firstIndex ? '.' : '';
  });

  //check if beforeDecimal got deleted and there is nothing after decimal,
  //clear all numbers in such case while keeping the - sign
  const { beforeDecimal, afterDecimal, addNegation } = splitDecimal(value, allowNegative); // eslint-disable-line prefer-const

  //clear only if something got deleted before decimal (cursor is before decimal)
  if (
    to.end - to.start < from.end - from.start &&
    beforeDecimal === '' &&
    isBeforeDecimalSeparator &&
    !parseFloat(afterDecimal)
  ) {
    value = addNegation ? '-' : '';
  }

  return value;
}

export function getCaretBoundary<BaseType = InputAttributes>(
  formattedValue: string,
  props: NumericFormatProps<BaseType>,
) {
  const { prefix = '', suffix = '' } = props;
  const boundaryAry = Array.from({ length: formattedValue.length + 1 }).map(() => true);

  const hasNegation = formattedValue[0] === '-';

  // fill for prefix and negation
  boundaryAry.fill(false, 0, prefix.length + (hasNegation ? 1 : 0));

  // fill for suffix
  const valLn = formattedValue.length;
  boundaryAry.fill(false, valLn - suffix.length + 1, valLn + 1);

  return boundaryAry;
}

function validateProps<BaseType = InputAttributes>(props: NumericFormatProps<BaseType>) {
  const { thousandSeparator, decimalSeparator } = getSeparators(props);

  if (thousandSeparator === decimalSeparator) {
    throw new Error(`
        Decimal separator can't be same as thousand separator.
        thousandSeparator: ${thousandSeparator} (thousandSeparator = {true} is same as thousandSeparator = ",")
        decimalSeparator: ${decimalSeparator} (default value for decimalSeparator is .)
     `);
  }
}

export function useNumericFormat<BaseType = InputAttributes>(props: NumericFormatProps<BaseType>) {
  const {
    allowLeadingZeros,
    onKeyDown = noop,
    onBlur = noop,
    thousandSeparator,
    decimalScale,
    fixedDecimalScale,
    prefix = '',
    defaultValue,
    value,
    valueIsNumericString,
    onValueChange,
  } = props;

  // validate props
  validateProps(props);

  const _format: FormatInputValueFunction = (numStr) => format(numStr, props);

  const _removeFormatting: RemoveFormattingFunction = (inputValue, changeMeta) =>
    removeFormatting(inputValue, changeMeta, props);

  let _valueIsNumericString = valueIsNumericString;

  if (!isNil(value)) {
    _valueIsNumericString = valueIsNumericString ?? typeof value === 'number';
  } else if (!isNil(defaultValue)) {
    _valueIsNumericString = valueIsNumericString ?? typeof defaultValue === 'number';
  }

  const roundIncomingValueToPrecision = (value: string | number | null | undefined) => {
    if (isNil(value) || isNanValue(value)) return value;

    if (typeof value === 'number') {
      value = toNumericString(value);
    }

    /**
     * only round numeric or float string values coming through props,
     * we don't need to do it for onChange events, as we want to prevent typing there
     */
    if (_valueIsNumericString && typeof decimalScale === 'number') {
      return roundToPrecision(value, decimalScale, Boolean(fixedDecimalScale));
    }

    return value;
  };

  const [{ numAsString, formattedValue }, _onValueChange] = useInternalValues(
    roundIncomingValueToPrecision(value),
    roundIncomingValueToPrecision(defaultValue),
    Boolean(_valueIsNumericString),
    _format,
    _removeFormatting,
    onValueChange,
  );

  const _onKeyDown: InputAttributes['onKeyDown'] = (e) => {
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
      // bring the cursor to after negation
      setCaretPosition(el, 1);
    }

    // don't allow user to delete decimal separator when decimalScale and fixedDecimalScale is set
    const { decimalSeparator } = getSeparators(props);
    if (
      key === 'Backspace' &&
      value[(selectionStart as number) - 1] === decimalSeparator &&
      decimalScale &&
      fixedDecimalScale
    ) {
      setCaretPosition(el, (selectionStart as number) - 1);
      e.preventDefault();
    }

    const _thousandSeparator = thousandSeparator === true ? ',' : thousandSeparator;

    // move cursor when delete or backspace is pressed before/after thousand separator
    if (key === 'Backspace' && value[(selectionStart as number) - 1] === _thousandSeparator) {
      setCaretPosition(el, (selectionStart as number) - 1);
    }

    if (key === 'Delete' && value[selectionStart as number] === _thousandSeparator) {
      setCaretPosition(el, (selectionStart as number) + 1);
    }

    onKeyDown(e);
  };

  const _onBlur: InputAttributes['onBlur'] = (e) => {
    let _value = numAsString;

    // if there no no numeric value, clear the input
    if (!_value.match(/\d/g)) {
      _value = '';
    }

    // clear leading 0s
    if (!allowLeadingZeros) {
      _value = fixLeadingZero(_value) as string;
    }

    // apply fixedDecimalScale on blur event
    if (fixedDecimalScale && decimalScale) {
      _value = roundToPrecision(_value, decimalScale, fixedDecimalScale);
    }

    if (_value !== numAsString) {
      const formattedValue = format(_value, props);
      _onValueChange(
        {
          formattedValue,
          value: _value,
          floatValue: parseFloat(_value),
        },
        {
          event: e,
          source: SourceType.event,
        },
      );
    }

    onBlur(e);
  };

  return {
    value: formattedValue,
    valueIsNumericString: false,
    onValueChange: _onValueChange,
    format: _format,
    removeFormatting: _removeFormatting,
    getCaretBoundary: (formattedValue: string) => getCaretBoundary(formattedValue, props),
    onKeyDown: _onKeyDown,
    onBlur: _onBlur,
  };
}

export default function NumericFormat<BaseType = InputAttributes>(
  props: NumericFormatProps<BaseType>,
) {
  const {
    /* eslint-disable no-unused-vars */
    decimalSeparator,
    allowedDecimalSeparators,
    thousandsGroupStyle,
    suffix,
    allowNegative,
    allowLeadingZeros,
    onKeyDown,
    onBlur,
    thousandSeparator,
    decimalScale,
    fixedDecimalScale,
    prefix = '',
    defaultValue,
    value,
    valueIsNumericString,
    onValueChange,
    /* eslint-enable no-unused-vars */
    ...restProps
  } = props;

  const numericFormatProps = useNumericFormat(props);

  return <NumberFormatBase {...(restProps as InternalNumberFormatBase)} {...numericFormatProps} />;
}
