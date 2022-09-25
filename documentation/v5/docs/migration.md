---
sidebar_position: 6
title: Migration guide
---

# Migration guide

### NumberFormat -> NumericFormat and PatternFormat

The whole NumberFormat module is divided into smaller modules.

This changes from

```js
import NumberFormat from 'react-number-format';
```

to

```js
import { NumericFormat } from 'react-number-format';

\\ or

import { PatternFormat } from 'react-number-format';
```

1. [**NumericFormat**](/docs/numeric_format) for Number based formatting like currency inputs.
2. [**PatternFormat**](/docs/pattern_format) for Pattern based formatting like card numbers, phone number inputs.

It also provide lower level units allowing better customization. [See Customization Docs](/docs/customization)

### isNumericString -> valueIsNumericString

Number format modules need to know if the passed value is a formatting string or string representation of number to be able to properly separate format characters and numbers.

isNumericString prop was confusing and wasn't explaining what is numeric string. The prop is now renamed to more verbose name `valueIsNumericString`.

### customNumerals `Array<string>`

:::caution Removed
This is removed in v5.
:::

See custom numeral implementation with v5
[https://s-yadav.github.io/react-number-format/docs/customization#custom-numeral-example](https://s-yadav.github.io/react-number-format/docs/customization#custom-numeral-example)

---
