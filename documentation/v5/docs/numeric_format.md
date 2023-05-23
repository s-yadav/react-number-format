---
title: Numeric Format
sidebar_position: 3
---

import AllowLeadingZeros from '../src/components/Examples/NumericFormat/AllowLeadingZeros'
import AllowNegative from '../src/components/Examples/NumericFormat/AllowNegative'
import AllowDecimalSeparators from '../src/components/Examples/NumericFormat/AllowDecimalSeparators'
import CustomInput from '../src/components/Examples/Props/CustomInput'
import DecimalScale from '../src/components/Examples/NumericFormat/DecimalScale'
import DecimalSeparator from '../src/components/Examples/NumericFormat/DecimalSeparator'
import FixedDecimalScale from '../src/components/Examples/NumericFormat/FixedDecimalScale'
import Prefix from '../src/components/Examples/NumericFormat/Prefix'
import Suffix from '../src/components/Examples/NumericFormat/Suffix'
import ThousandsGroupStyle from '../src/components/Examples/NumericFormat/ThousandsGroupStyle'

# Props

### allowLeadingZeros `boolean`

**default**: `false`

This allows enabling or disabling leading zeros in the input field. By default, on blur of an input, leading zeros are removed. To allow leading 0s in the input field, set `allowLeadingZeros` to `true`. This does not, however, control trailing zeros.

```js
import { NumericFormat } from 'react-number-format';

<NumericFormat value="20020220" allowLeadingZeros thousandSeparator="," />;
```

:::note Example

<AllowLeadingZeros />
:::

### allowNegative `boolean`

**default**: `true`

If set to `false`, negative numbers will not be allowed

```js
import { NumericFormat } from 'react-number-format';

<NumericFormat value="-12" allowNegative />;
```

:::note Example

<AllowNegative />
:::

### allowedDecimalSeparators `Array<string>`

**default**: `undefined`

Characters which when pressed result in a decimal separator. When missing, decimal separator and '.' are used.

```js
import { NumericFormat } from 'react-number-format';

<NumericFormat value="12" allowedDecimalSeparators={['%']} />;
```

:::note Example

<AllowDecimalSeparators />
:::

### customInput `React.Component<any>`

**default**: `null`

This allow supporting custom input components with number format.

```js
import { NumericFormat } from 'react-number-format';
import { TextField } from '@mui/material';

<NumericFormat value={12323} customInput={TextField} />;
```

:::note Example

<CustomInput />
:::

### decimalScale `number`

**default**: `undefined`

If defined, it limits the number of digits after the decimal point.

```js
import { NumericFormat } from 'react-number-format';

<NumericFormat value={12323.3334} decimalScale={3} />;
```

:::note Example

<DecimalScale />
:::

### decimalSeparator `string`

**default**: '.'

Defines the decimal character.

```js
import { NumericFormat } from 'react-number-format';

<NumericFormat value={12323.3333} decimalSeparator="," />;
```

:::note Example

<DecimalSeparator />
:::

### fixedDecimalScale `boolean`

**default**: `false`

If set to `true`, it adds trailing 0s after `decimalSeparator` to match given `decimalScale`.

```js
import { NumericFormat } from 'react-number-format';

<NumericFormat value={12323.1} decimalScale={3} fixedDecimalScale />;
```

:::note Example

<FixedDecimalScale />
:::

### prefix `string`

**default**:`undefined`

Adds the prefix character before the input value.

```js
import { NumericFormat } from 'react-number-format';

<NumericFormat value={1234} prefix={'$'} />;
```

:::note Example

<Prefix />
:::

### suffix `string`

**default**: `undefined`

Adds the suffix after the input value

```js
import { NumericFormat } from 'react-number-format';

<NumericFormat value={123} suffix={'/ -'} />;
```

:::note Example

<Suffix />
:::

### thousandsGroupStyle `string`

**default**: `,`

Defines the thousand grouping style.

:::info
Supported types. thousand style (thousand) : 123,456,789, indian style (lakh) : 12,34,56,789, chinese style (wan) : 1,2345,6789.
:::

```js
import { NumericFormat } from 'react-number-format';

<NumericFormat type="text" value={1231231} thousandsGroupStyle="lakh" thousandSeparator="," />;
```

:::note Example

<ThousandsGroupStyle />
:::

### Common Props

- [See Common Props](/docs/props)

**Other than this it accepts all the props which can be given to a input or span based on displayType you selected.**

## Other exports

With v5.0 we expose some more utils/hooks which can be used for customization or other utilities

### numericFormatter `(numString: string, props: NumericFormatProps) => string`

In some places we need to just format the number before we pass it down as value, or in general just to render it. In such cases `numericFormatter` can be used directly.

**Parameters**

1st. `numString`(non formatted number string)

2nd. `props` (the format props applicable on numeric format)

**Return**
`formattedString` returns the formatted number.

### removeNumericFormat `(inputValue: string, changeMeta: ChangeMeta, props: NumericFormatProps) => string`

Most of the time you might not need this, but in some customization case you might wan't to write a patched version on top of removeNumericFormat.

However for customization case its recommended to use `useNumericFormat` and patch the methods it returns, as lot of other handling is done in the hook.

**Parameters**

1st. `inputValue`: the value after user has typed, this will be formatted value with the additional character typed by user.

2nd. `changeMeta`: This is the change information rnf sends internally, its basically the change information from the last formatted value and the current typed input value.

The type is following

```js
{
  from: {start: number, end: number},
  to: {start: number, end: number},
  lastValue: string
}
```

3rd. `props`: all the numeric format props

**Return**
`numString` returns the number in string format.

### getNumericCaretBoundary `(formattedValue: string, props: NumericFormatProps) => Array<boolean>`

This method returns information about what all position in formatted value where caret can be places, it returns n+1 length array of booleans(where n is the length of formattedValue).

Most of time you don't need this, but in case if you very specific usecase you can patch the function to handle your case.

See more details on [Concept](https://s-yadav.github.io/react-number-format/docs/customization/#concept)

### useNumericFormat: `(props: NumericFormatProps) => NumberFormatBaseProps`

The whole numeric format logic is inside useNumericFormat hook, this returns all the required props which can be passed to `NumberFormatBase`. For customization you can use to patch methods returned by `useNumericFormat` and pass to `NumberFormatBase`.

See more details in [Customization](https://s-yadav.github.io/react-number-format/docs/customization/)
