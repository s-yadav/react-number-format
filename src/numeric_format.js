import { escapeRegex, splitDecimal, limitToScale, applyThousandSeparator } from './utils';

function format(number, props) {
  const {
    decimalScale,
    fixedDecimalScale,
    prefix,
    suffix,
    allowNegative,
    thousandsGroupStyle,
  } = props;

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

type ChangeMeta = {
  changeIndex: {
    start: number,
    end: number,
  },
  selection: {
    start: number,
    end: number,
  },
  lastValue: string,
};

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

function getNumberRegex(decimalSeparator, decimalScale, global: boolean) {
  return new RegExp(
    `[0-9]${decimalSeparator && decimalScale !== 0 ? `|${escapeRegex(decimalSeparator)}` : ''}`,
    global ? 'g' : undefined,
  );
}

function removeFormatting(value, props, changeMeta: ChangeMeta) {
  const { allowNegative, prefix, suffix, decimalScale, customNumerals } = props;
  const { changeIndex, selection } = changeMeta;
  let { start, end } = changeIndex;
  const selectionStart = selection.start;
  const { allowedDecimalSeparators, decimalSeparator } = getSeparators(
    props.thousandSeparator,
    props.decimalSeparator,
    props.allowedDecimalSeparators,
  );

  /** Check for any allowed decimal separator is added in the numeric format and replace it with decimal separator */
  if (!format && start === end && allowedDecimalSeparators.indexOf(value[selectionStart]) !== -1) {
    const separator = decimalScale === 0 ? '' : decimalSeparator;
    return (
      value.substr(0, selectionStart) + separator + value.substr(selectionStart + 1, value.length)
    );
  }

  const hasNegation = value[0] === '-';

  // remove negation from start to simplify prefix logic as negation comes before prefix
  if (hasNegation) {
    value = value.substr(1);

    // account for the removal of the negation for start and end index
    start -= 1;
    end -= 1;
  }

  // remove prefix
  const deletedChar = start < prefix.length ? start : prefix.length;
  value = value.substr(deletedChar);

  // account for deleted prefix for end index
  end -= deletedChar;

  // remove suffix
  const suffixStartIndex = value.length - suffix.length;
  value = value.substr(0, end > suffixStartIndex ? end : suffixStartIndex);

  // add the negation back and handle for double negation
  value = handleNegation(hasNegation ? `-${value}` : value, allowNegative);

  // remove non numeric characters
  value = (
    value.match(getNumberRegex(decimalSeparator, decimalScale, customNumerals, true)) || []
  ).join('');
}
