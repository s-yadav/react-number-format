---
title: Pattern Format
sidebar_position: 4
---

import AllowEmptyFormatting from '../src/components/Examples/PatternFormat/AllowEmptyFormatting'
import Format from '../src/components/Examples/PatternFormat/Format'
import Mask from '../src/components/Examples/PatternFormat/Mask'
import PatternChar from '../src/components/Examples/PatternFormat/PatternChar'

# Props

### allowEmptyFormatting `boolean`

**default**: `false`

By default PatternFormat component does not apply formatting when value is empty (_null, undefined or ‘’_). If you want to apply formatting on empty values set `allowEmptyFormatting` to `true`.

```js
import { PatternFormat } from 'react-number-format';

<PatternFormat format="+1 (###) #### ###" allowEmptyFormatting mask="_" />;
```

:::note Example

<AllowEmptyFormatting />
:::

### format `string`

**default**: `undefined`

It defines the format pattern using the `#` (or a [`patternChar`](#patternchar-string) ) character. `#` is the placeholder character for numbers.

```js
import { PatternFormat } from 'react-number-format';

<PatternFormat value={123123} format="### ###" />;
```

:::note Example

<Format />
:::

### mask `string | Array<string>`

**default**: `undefined`

Used as mask character for numeric places, until any numeric character is provided for that position. You can provide different mask characters for every numeric positions by passing array of mask characters. **Note**: The length of mask characters should match the numbers of `#` [patternChar](#patternchar-string).

```js
import { PatternFormat } from 'react-number-format';

<PatternFormat value="411111" valueIsNumericString format="#### #### #### ####" mask="_" />;
```

:::note Example

<Mask />
:::

### patternChar `string`

**default**: `#`

This helps define the [`format`](#format-string) pattern character.

```js
import { PatternFormat } from 'react-number-format';

<PatternFormat format="%% (%%%)" patternChar="%" value={23456} />;
```

:::note Example

<PatternChar />
:::

### Common Props

- [See Common Props](/docs/props)

**Other than this it accepts all the props which can be given to a input or span based on displayType you selected.**

## Other exports

With v5.0 we expose some more utils/hooks which can be used for customization or other utilities

### patternFormatter `(numString: string, props: PatternFormatProps) => string`

In some places we need to just format the number before we pass it down as value, or in general just to render it. In such cases `patternFormatter` can be used directly.

**Parameters**

1st. `numString`(non formatted number string)

2nd. `props` (the format props applicable on numeric format)

**Return**
`formattedString` returns the formatted number.

### removePatternFormat `(inputValue: string, changeMeta: ChangeMeta, props: PatternFormatProps) => string`

Most of the time you might not need this, but in some customization case you might wan't to write a patched version on top of removePatternFormat.

However for customization case its recommended to use `usePatternFormat` and patch the methods it returns, as lot of other handling is done in the hook.

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

### getPatternCaretBoundary `(formattedValue: string, props: PatternFormatProps) => Array<boolean>`

This method returns information about what all position in formatted value where caret can be places, it returns n+1 length array of booleans(where n is the length of formattedValue).

Most of time you don't need this, but in case if you very specific usecase you can patch the function to handle your case.

See more details on [Concept](https://s-yadav.github.io/react-number-format/docs/customization/#concept)

### usePatternFormat: `(props: PatternFormatProps) => NumberFormatBaseProps`

The whole numeric format logic is inside usePatternFormat hook, this returns all the required props which can be passed to `NumberFormatBase`. For customization you can use to patch methods returned by `usePatternFormat` and pass to `NumberFormatBase`.

See more details in [Customization](https://s-yadav.github.io/react-number-format/docs/customization/)
