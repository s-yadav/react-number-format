---
sidebar_position: 1
---

# Concept

React Number Format v5 is a complete rewrite with a goal of keeping it fully customizable to support all the custom case different product can have.

The primary thing which react number format controls is apply formatting in place (in the input) while managing correct caret position. It tries to understand what user is trying to do, add number, cut/paste, delete, and manage cursor position accordingly.

At the core of React number format lies NumberFormatBase, which works on three main props controlled from parent.

- **format**: A format function which can turn any numeric string to a formatted string.
- **removeFormatting**: A function to removing formatting from a formatted string and return numeric string.
- **getCaretBoundary**: A function given a formatted string, returns boundaries of valid cursor position. basically an array of boolean, where index of specify caret position.

To give an example a basic implementation of number formatting if we don't have simple usecase can be.

```js
import { NumberFormatBase } from 'react-number-format';

function MyCustomNumberFormat(props) {
  const format = (numStr) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(numStr);

  // NOTE: this is default value for removeFormatting, so you can even skip this.
  const removeFormatting = (formattedString) => formattedString.replace(/[^0-9]/g, '');

  // NOTE: this is the default value for caret boundary, so you can even skip this.
  function charIsNumber(char) {
    return !!(char || '').match(/\d/);
  }

  const getCaretBoundary = (formattedString) => {
    const boundaryAry = Array.from({ length: formattedString.length + 1 }).map(() => true);

    for (let i = 0, ln = boundaryAry.length; i < ln; i++) {
      // consider caret to be in boundary if it is before or after numeric value
      boundaryAry[i] = Boolean(
        charIsNumber(formattedString[i]) || charIsNumber(formattedString[i - 1]),
      );
    }

    return boundaryAry;
  };

  return (
    <NumberFormatBase
      {...props}
      format={format}
      removeFormatting={removeFormatting}
      getCaretBoundary={getCaretBoundary}
    />
  );
}
```
