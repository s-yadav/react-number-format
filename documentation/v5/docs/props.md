---
sidebar_position: 2
title: Props
---

# Common Props

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

### value `number | string`

**default**: `undefined`

This is the value for the input field. It can be a float number or a formatted string.

:::info
If the value passed is a string representation of the number, the [`valueIsNumericString`](#valueIsNumericString) props should be passed as `true`
:::

```js
import { NumericFormat } from 'react-number-format';

<NumericFormat value={123} />;
```

<details>
  <summary>
  Demo
  </summary>
  <iframe src="https://codesandbox.io/embed/value-demo-ziuzcp?fontsize=14&hidenavigation=1&theme=dark&view=preview"
      className='csb'
      title="value-demo"
      allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
      sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>   
  </details>

### defaultValue `number | string`

**default** : `undefined`

Value to be used as default value if value is not provided.

```js
import { NumericFormat } from 'react-number-format';

<NumericFormat defaultValue="12312" />;
```

<details>
  <summary>
  Demo
  </summary>
  <iframe src="https://codesandbox.io/embed/defaultvalue-demo-1qc7fk?fontsize=14&hidenavigation=1&theme=dark&view=preview"
     className='csb'
     title="defaultValue-demo"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
</details>

### displayType `text | input`

**default**: `input`

If value is `input`, it renders an input element where formatting happens as you type characters. If value is `text`, it renders formatted text in a span tag.

```js
import { NumericFormat } from 'react-number-format';

<NumericFormat displayType="input" value={110} />;
<NumericFormat displayType="text" value={110} />;
```

<details>
  <summary>
  Demo
  </summary>
   <iframe src="https://codesandbox.io/embed/displaytype-demo-hgcvs9?fontsize=14&hidenavigation=1&theme=dark&view=preview"
     className='csb'
     title="displayType-demo"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
</details>

### getInputRef `elm => void`

**default**: `null`

Method to get reference of input, span (based on displayType prop) or the customInput's reference.

```js
import { NumericFormat } from 'react-number-format';
import { useRef } from 'react';

export default function App() {
  let ref = useRef();
  return <NumericFormat getInputRef={ref} />;
}
```

### isAllowed `(values) => boolean`

**default**: `undefined`

A checker function to validate the input value. If this function returns false, the onChange method will not get triggered and the input value will not change.

```js
import { NumericFormat } from 'react-number-format';

const MAX_LIMIT = 1000;

<NumericFormat
  value={11}
  isAllowed={(values) => {
    const { floatValue } = values;
    return floatValue < MAX_LIMIT;
  }}
/>;
```

<details>
  <summary>
  Demo
  </summary>
  <iframe src="https://codesandbox.io/embed/isallowed-demo-3hrw7z?fontsize=14&hidenavigation=1&theme=dark&view=preview"
     className='csb'
     title="isAllowed-demo"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

</details>

### valueIsNumericString `boolean`

**default**: false

If value is passed as string representation of numbers (unformatted) then this should be passed as `true`.

```js
import { NumericFormat } from 'react-number-format';

<NumericFormat
  type="text"
  value="123456789"
  valueIsNumericString={true}
  decimalSeparator=","
  displayType="input"
/>;
```

<details>
  <summary>
  Demo
  </summary>
  <iframe src="https://codesandbox.io/embed/valueIsNumericString-demo-gjdqgr?fontsize=14&hidenavigation=1&theme=dark&view=preview"
     className='csb'
     title="valueIsNumericString-demo"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

</details>

### onValueChange `(values, sourceInfo) => {}`

**default**: undefined

This handler provides access to any values changes in the input field and is triggered only when a prop changes or the user input changes. It provides two arguments namely the [valueObject](quirks#values-object) as the first and the [sourceInfo](quirks#sourceInfo) as the second. The [valueObject](quirks#values-object) parameter contains the `formattedValue`, `value` and the `floatValue` of the given input field. The [sourceInfo](quirks#sourceInfo) contains the `event` Object and a `source` key which indicates whether the triggered change is due to an event or a prop change. This is particularly useful in identify whether the change is user driven or is an uncontrolled change due to any prop value being updated.

:::info
If you are using `values.value` which is non formatted value as numeric string. Make sure to pass valueIsNumericString to be true.
:::

```js
import { NumericFormat } from 'react-number-format';

<NumericFormat
  value={1234}
  prefix="$"
  onValueChange={(values, sourceInfo) => {
    console.log(values, sourceInfo);
  }}
/>;
```

<details>
  <summary>
  Demo
  </summary>
   <iframe src="https://codesandbox.io/embed/onvaluechange-demo-c5nl2f?fontsize=14&hidenavigation=1&theme=dark&view=editor"
      className='csb'
      title="onvaluechange-demo"
      allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
      sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
</details>

### renderText `(formattedValue, customProps) => React Element`

**default**: `undefined`

A renderText method useful if you want to render formattedValue in different element other than span. It also returns the custom props that are added to the component which can allow passing down props to the rendered element.

```js
import { NumericFormat } from 'react-number-format';

<NumericFormat
  value={1231231}
  thousandsGroupStyle="lakh"
  thousandSeparator=","
  displayType="text"
  renderText={(value) => <b>{value}</b>}
/>;
```

<details>
  <summary>
  Demo
  </summary>
  <iframe src="https://codesandbox.io/embed/rendertext-demo-lg3dml?fontsize=14&hidenavigation=1&theme=dark&view=preview"
      className='csb'
      title="renderText-demo"
      allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
      sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe></details>

### type `string`

**default**: `text`

This allows passing the input type attribute value, Supported types include `text` | `tel` | `password`

```js
import { NumericFormat } from 'react-number-format';

<NumericFormat value={123} type="text" />;
```

<details>
  <summary>
  Demo
  </summary>
  <iframe src="https://codesandbox.io/embed/type-demo-4qwwjk?fontsize=14&hidenavigation=1&theme=dark&view=preview"
      className='csb'
      title="type-demo"
      allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>  
</details>

### Other Props

- [Numeric Format Props](/docs/numeric_format)
- [Pattern Format Props](/docs/pattern_format)

**Other than this it accepts all the props which can be given to a input or span based on displayType you selected.**
