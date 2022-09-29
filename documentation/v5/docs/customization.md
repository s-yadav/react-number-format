---
title: Customization
sidebar_position: 5
---

## Concept

React Number Format v5 is a complete rewrite with a goal of keeping it fully customizable to support all the custom case different product can have.

The primary thing which react number format controls is apply formatting in place (in the input) while managing correct caret position. It tries to understand what user is trying to do, add number, cut/paste, delete, and manage cursor position accordingly.

At the core of React number format lies NumberFormatBase, which works on three main props controlled from parent.

- **format**: A format function which can turn any numeric string to a formatted string.
- **removeFormatting**: A function to removing formatting from a formatted string and return numeric string.
- **getCaretBoundary**: A function given a formatted string, returns boundaries of valid cursor position. basically an array of boolean, where index of specify caret position. true at a index signifies user can put their caret at the position, false means the caret position is not allowed and the caret will move to closet allowed position.

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

  return <NumberFormatBase {...props} format={_format} {...rest} />;
}
```

<details>
  <summary>
  Demo
  </summary>
  <iframe src="https://codesandbox.io/embed/card-expiry-field-with-usepatternformat-2wd7ej?fontsize=14&hidenavigation=1&theme=dark&view=preview"
     title="Card Expiry Field with usePatternFormat"
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
  const { format, removeFormatting, ...rest } = useNumericFormat(props);

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

  return <NumberFormatBase format={_format} removeFormatting={_removeFormatting} {...rest} />;
}
```

<details>
  <summary>
  Demo
  </summary>
  <iframe src="https://codesandbox.io/embed/custom-numeral-numer-format-forked-s8e1s4?fontsize=14&hidenavigation=1&theme=dark&view=preview"
     title="Custom Numeral (Numer Format)"
     className="csb"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
</details>
