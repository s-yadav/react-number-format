---
title: Customization
sidebar_position: 5
---

## Concept

React Number Format v5 is a complete rewrite with a goal of keeping it fully customizable to support all the custom case different product can have.

The primary thing which react number format controls is apply formatting in place (in the input) while managing correct caret position. It tries to understand what user is trying to do, add number, cut/paste, delete, and manage cursor position accordingly.

At the core of React number format lies NumberFormatBase, which works on three main props controlled from parent.

- **format** `(numStr: string) => string`: A format function which can turn any numeric string to a formatted string.
- **removeFormatting** `(formattedStr: string) => string`: A function to removing formatting from a formatted string and return numeric string.
- **getCaretBoundary** `(formattedStr: string) => boolean[]`: A function given a formatted string, returns boundaries of valid cursor position. basically an array of boolean, where index of specify caret position. true at a index signifies user can put their caret at the position, false means the caret position is not allowed and the caret will move to closet allowed position.

Most of the time you don't have to define getCaretBoundary, as the default one is enough, but in case you need to define, it looks something like this.

```js
function caretUnknownFormatBoundary(formattedValue) {
  const boundaryAry = Array.from({ length: formattedValue.length + 1 }).map(() => true);

  for (let i = 0, ln = boundaryAry.length; i < ln; i++) {
    // consider caret to be in boundary if it is before or after numeric value
    boundaryAry[i] = Boolean(
      formattedValue[i].match(/\d/) || formattedValue[i - 1].match(/\d/);,
    );
  }

  return boundaryAry;
}
```

There are few more props to handle some corner case.

- **isValidInputCharacter** `(char: sting) => boolean`: A function to tell if a character in the formatted value is a valid typeable character. You don't need to pass it most of the time, as it defaults numeric characters (0-9). But case like additional character is allowed to type, for example decimal separator in currency format.
- **isCharacterSame** `(compareProps: CompareProps) => boolean`: Some time we would like to allow user pressing different key and that being interpreted as different key like custom numerals, or letting user press `.` for decimal separator when custom decimalSeparator is provided. In such case we need to inform the library that the two characters are same.

```js
type CompareProps = {
  currentValue: string, // current value in the input, before applying any formatting
  lastValue: string, // last formatted value
  formattedValue: string, // current formatted value.
  currentValueIndex: number, // character index in currentValue which we are comparing
  formattedValueIndex: number, // character index in formattedValue which we are comparing
};
```

Check the usage in [custom numeral example](#custom-numeral-example).

Apart from this prop some key handling are required depending on use case which can be done using native events, onKeyDown/onKeyUp etc.

## Examples

To give an example a basic implementation of number formatting if we have simple use case to format number without decimals and negative number support.

### Intl.NumberFormat based formatting

```js
import { NumberFormatBase } from 'react-number-format';

function MyCustomNumberFormat(props) {
  const format = (numStr) => {
    if (numStr === '') return '';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(numStr);
  };

  return <NumberFormatBase {...props} format={format} />;
}
```

<details>
  <summary>
  Demo
  </summary>
  <iframe src="https://codesandbox.io/embed/custom-numeric-format-ovl6km?fontsize=14&hidenavigation=1&theme=dark&view=preview"
      title="Custom Numeric Format"
      className="csb"
      allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
      sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
    ></iframe>
</details>

Another example of card expiry field.

### Card expiry field

```js
import { NumberFormatBase } from 'react-number-format';

function CardExpiry(props) {
  const format = (val) => {
    if (val === '') return '';
    let month = val.substring(0, 2);
    const year = val.substring(2, 4);

    if (month.length === 1 && month[0] > 1) {
      month = `0${month[0]}`;
    } else if (month.length === 2) {
      // set the lower and upper boundary
      if (Number(month) === 0) {
        month = `01`;
      } else if (Number(month) > 12) {
        month = '12';
      }
    }

    return `${month}/${year}`;
  };

  return <NumberFormatBase {...props} format={format} />;
}
```

<details>
  <summary>
  Demo
  </summary>
  <iframe src="https://codesandbox.io/embed/card-expiry-field-eovgoh?fontsize=14&hidenavigation=1&theme=dark&view=preview"
     title="Card Expiry Field"
     className="csb"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
</details>

A couple of time we want to get all the features of NumericFormat or PatterFormat, and apply some customization on top of it. Well NumberFormat allows to do that as well. It provides
`usePatternFormat` and `useNumericFormat` hook which can be used in conjunction with NumberFormatBase.

Let's take the same example of Card Expiry field.

### Card expiry field with usePatternFormat

```js
function CardExpiry(props) {
  /**
   * usePatternFormat, returns all the props required for NumberFormatBase
   * which we can extend in between
   */
  const { format, ...rest } = usePatternFormat({ ...props, format: '##/##' });

  const _format = (val) => {
    let month = val.substring(0, 2);
    const year = val.substring(2, 4);

    if (month.length === 1 && month[0] > 1) {
      month = `0${month[0]}`;
    } else if (month.length === 2) {
      // set the lower and upper boundary
      if (Number(month) === 0) {
        month = `01`;
      } else if (Number(month) > 12) {
        month = '12';
      }
    }

    return format(`${month}${year}`);
  };

  return <NumberFormatBase format={_format} {...rest} />;
}
```

<details>
  <summary>
  Demo
  </summary>
  <iframe src="https://codesandbox.io/embed/card-expiry-field-pattern-format-3yzksf?fontsize=14&hidenavigation=1&theme=dark&view=preview"
     title="Card Expiry Field (Pattern Format)"
     className="csb"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe> 
</details>

Another example for NumericFormat could be support for custom numerals.

### Custom numeral example

```js
const persianNumeral = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

function CustomNumeralNumericFormat(props) {
  const { format, removeFormatting, isCharacterSame, ...rest } = useNumericFormat(props);

  const _format = (val) => {
    const _val = format(val);
    return _val.replace(/\d/g, ($1) => persianNumeral[Number($1)]);
  };

  const _removeFormatting = (val) => {
    const _val = val.replace(new RegExp(persianNumeral.join('|'), 'g'), ($1) =>
      persianNumeral.indexOf($1),
    );

    return removeFormatting(_val);
  };

  const _isCharacterSame = (compareMeta) => {
    const isCharSame = isCharacterSame(compareMeta);
    const { formattedValue, currentValue, formattedValueIndex, currentValueIndex } = compareMeta;
    const curChar = currentValue[currentValueIndex];
    const newChar = formattedValue[formattedValueIndex];
    const curPersianChar = persianNumeral[Number(curChar)] ?? curChar;
    const newPersianChar = persianNumeral[Number(newChar)] ?? newChar;

    return isCharSame || curPersianChar || newPersianChar;
  };

  return (
    <NumberFormatBase
      format={_format}
      removeFormatting={_removeFormatting}
      isCharacterSame={_isCharacterSame}
      {...rest}
    />
  );
}
```

<details>
  <summary>
  Demo
  </summary>
  <iframe src="https://codesandbox.io/embed/custom-numeral-numer-format-forked-s8e1s4?fontsize=14&hidenavigation=1&theme=dark&view=preview"
     title="Custom numeral example"
     className="csb"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
</details>

### AllowEmptyFormatting on NumericFormat

Currently allowEmptyFormatting is only available on the pattern lock, while it isn't a common usecase in NumericFormat, you still might want that behavior, you can achieve it like following.

```js
function CustomNumberFormat(props) {
  const { prefix = '', suffix = '', allowEmptyFormatting } = props;
  const { format, ...numberFormatBaseProps } = useNumericFormat(props);
  const _format = (numStr, props) => {
    const formattedValue = format(numStr, props);
    return allowEmptyFormatting && formattedValue === '' ? prefix + suffix : formattedValue;
  };

  return <NumberFormatBase {...numberFormatBaseProps} format={_format} />;
}
```

<details>
  <summary>
  Demo
  </summary>
  <iframe src="https://codesandbox.io/embed/numeric-format-allowemptyformat-zt3mh8?fontsize=14&hidenavigation=1&theme=dark&view=preview"
     title="AllowEmptyFormatting on NumericFormat"
     className="csb"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
</details>

### Using parentheses to express negative numbers

In some financial application we may want to express negative numbers enclosed with parentheses `($111,222)` as opposed to negative sign ahead of the number `-$111,222`. This can be implemented outside of the lib since v5.

```js
const NEGATION_FORMAT_REGEX = /^\((.*)\)$/;

function extractNegationAndNumber(value) {
  let hasNegation = false;
  if (typeof value === 'number') {
    hasNegation = value < 0;
    value = hasNegation ? value * -1 : value;
  } else if (value?.[0] === '-') {
    hasNegation = true;
    value = value.substring(1);
  } else if (value?.match(NEGATION_FORMAT_REGEX)) {
    hasNegation = true;
    value = value.replace(NEGATION_FORMAT_REGEX, '$1');
  }

  return { hasNegation, value };
}

function CustomNegationNumberFormat({
  prefix = '',
  suffix = '',
  value,
  defaultValue,
  onValueChange,
  ...restProps
}) {
  const [hasNegation, toggleNegation] = useState(
    extractNegationAndNumber(value ?? defaultValue).hasNegation,
  );
  const [internalValue, setInternalValue] = useState(
    extractNegationAndNumber(value ?? defaultValue).value,
  );
  useEffect(() => {
    const { hasNegation, value: internalValue } = extractNegationAndNumber(value);
    setInternalValue(internalValue);
    toggleNegation(hasNegation);
  }, [value]);

  const _onValueChange = (values, sourceInfo) => {
    if (!onValueChange) return;

    const { formattedValue, value, floatValue } = values;
    onValueChange(
      {
        formattedValue,
        value: hasNegation ? `-${value}` : value,
        floatValue: hasNegation && !isNaN(floatValue) ? -floatValue : floatValue,
      },
      sourceInfo,
    );
  };

  const props = {
    prefix: hasNegation ? '(' + prefix : prefix,
    suffix: hasNegation ? suffix + ')' : suffix,
    // as we are controlling the negation logic outside, we don't want numeric format to handle this
    allowNegative: false,
    value: internalValue,
    onValueChange: _onValueChange,
    ...restProps,
  };
  const { format, onKeyDown, ...numberFormatBaseProps } = useNumericFormat(props);

  const _format = (numStr) => {
    const formattedValue = format(numStr, props);
    // if negation is present we need to always show negation with prefix and suffix even if value is empty
    return formattedValue === '' && hasNegation ? props.prefix + props.suffix : formattedValue;
  };

  const _onKeyDown = (e) => {
    const el = e.target;
    const { key } = e;
    const { selectionStart, selectionEnd, value = '' } = el;

    // if every thing is selected and deleted remove the negation as well
    if (selectionStart !== selectionEnd) {
      // if multiple characters are selected and user hits backspace, no need to handle anything manually
      onKeyDown(e);
      return;
    }

    // if user is pressing '-' we want to change it to '()', so mark there is negation in the number
    if (key === '-') {
      toggleNegation((hasNegation) => !hasNegation);
      e.preventDefault();
      return;
    }

    if (key === 'Backspace' && value[0] === '(' && selectionStart === props.prefix.length) {
      toggleNegation(false);
      e.preventDefault();
      return;
    }

    onKeyDown(e);
  };

  return <NumberFormatBase {...numberFormatBaseProps} onKeyDown={_onKeyDown} format={_format} />;
}
```

<details>
  <summary>
  Demo
  </summary>
  <iframe src="https://codesandbox.io/embed/parentheses-for-negation-forked-jn42cp?fontsize=14&hidenavigation=1&theme=dark&view=preview"
     title="Using parentheses to express negative numbers"
     className="csb"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
</details>
