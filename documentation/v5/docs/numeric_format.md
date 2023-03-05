---
title: Numeric Format
sidebar_position: 3
---

# Props

### allowLeadingZeros `boolean`

**default**: `false`

This allows enabling or disabling leading zeros in the input field. By default, on blur of an input, leading zeros are removed. To allow leading 0s in the input field, set `allowLeadingZeros` to `true`. This does not, however, control trailing zeros.

```js
import { NumericFormat } from 'react-number-format';

<NumericFormat value="20020220" allowLeadingZeros thousandSeparator="," />;
```

<details>
  <summary>
  Demo
  </summary>
  <iframe src="https://codesandbox.io/embed/allowleadingzeros-demo-ji97mv?fontsize=14&hidenavigation=1&theme=dark&view=preview"
        className='csb'
        title="allowLeadingZeros-demo"
        allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
        sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
        ></iframe>

</details>

### allowNegative `boolean`

**default**: `true`

If set to `false`, negative numbers will not be allowed

```js
import { NumericFormat } from 'react-number-format';

<NumericFormat value="-12" allowNegative />;
```

<details>
  <summary>
  Demo
  </summary>
    <iframe src="https://codesandbox.io/embed/allownegative-demo-dx8gdf?fontsize=14&hidenavigation=1&theme=dark&view=preview"
     className='csb'
     title="allowNegative-demo"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
</details>

### allowedDecimalSeparators `Array<string>`

**default**: `undefined`

Characters which when pressed result in a decimal separator. When missing, decimal separator and '.' are used.

```js
import { NumericFormat } from 'react-number-format';

<NumericFormat value="12" allowedDecimalSeparators={['%']} />;
```

<details>
  <summary>
  Demo
  </summary>

  <iframe src="https://codesandbox.io/embed/allownegative-demo-forked-3ufso6?fontsize=14&hidenavigation=1&theme=dark&view=preview"
     className='csb'
     title="allowNegative-demo (forked)"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

</details>

### customInput `React.Component<any>`

**default**: `null`

This allow supporting custom input components with number format.

```js
import { NumericFormat } from 'react-number-format';
import { TextField } from '@mui/material';

<NumericFormat value={12323} customInput={TextField} />;
```

<details>
  <summary>
  Demo
  </summary>
  <iframe src="https://codesandbox.io/embed/custominput-demo-u3wg9m?fontsize=14&hidenavigation=1&theme=dark&view=preview"
     className="csb"
     title="customInput-demo"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
</details>

### decimalScale `number`

**default**: `undefined`

If defined, it limits the number of digits after the decimal point.

```js
import { NumericFormat } from 'react-number-format';

<NumericFormat value={12323.3334} decimalScale={3} />;
```

<details>
  <summary>
  Demo
  </summary>

<iframe src="https://codesandbox.io/embed/decimalscale-demo-uc92li?fontsize=14&hidenavigation=1&theme=dark&view=preview"
     className='csb'
     title="decimalScale-demo"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
</details>

### decimalSeparator `string`

**default**: '.'

Defines the decimal character.

```js
import { NumericFormat } from 'react-number-format';

<NumericFormat value={12323.3333} decimalSeparator="," />;
```

<details>
  <summary>
  Demo
  </summary>

   <iframe src="https://codesandbox.io/embed/decimalseparator-demo-tv9ptw?fontsize=14&hidenavigation=1&theme=dark&view=preview"
     className='csb'
     title="decimalSeparator-demo"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
</details>

### fixedDecimalScale `boolean`

**default**: `false`

If set to `true`, it adds trailing 0s after `decimalSeparator` to match given `decimalScale`.

```js
import { NumericFormat } from 'react-number-format';

<NumericFormat value={12323.1} decimalScale={3} fixedDecimalScale />;
```

<details>
  <summary>
  Demo
  </summary>
    <iframe src="https://codesandbox.io/s/fixeddecimalscale-demo-3jnvz7?fontsize=14&hidenavigation=1&theme=dark&view=preview"
     className='csb'
     title="allowNegative-demo"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
</details>

### prefix `string`

**default**:`undefined`

Adds the prefix character before the input value.

```js
import { NumericFormat } from 'react-number-format';

<NumericFormat value={1234} prefix={'$'} />;
```

<details>
  <summary>
  Demo
  </summary>
  <iframe src="https://codesandbox.io/embed/prefix-demo-6ibo72?fontsize=14&hidenavigation=1&theme=dark&view=preview"
      className='csb'
      title="prefix-demo"
      allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
      sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
</details>

### suffix `string`

**default**: `undefined`

Adds the suffix after the input value

```js
import { NumericFormat } from 'react-number-format';

<NumericFormat value={123} suffix={'/ -'} />;
```

<details>
  <summary>
  Demo
  </summary>
  <iframe src="https://codesandbox.io/embed/suffice-demo-7tlerm?fontsize=14&hidenavigation=1&theme=dark&view=preview"
      className='csb'
      title="suffice-demo"
      allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
      sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
  </details>

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

<details>
  <summary>
  Demo
  </summary>
  <iframe src="https://codesandbox.io/embed/thousandsgroupstyle-demo-u3ip59?fontsize=14&hidenavigation=1&theme=dark&view=preview"
      className='csb'
      title="thousandsGroupStyle-demo"
      allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
      sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
</details>

### Common Props

- [See Common Props](/docs/props)

**Other than this it accepts all the props which can be given to a input or span based on displayType you selected.**
