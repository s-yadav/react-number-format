---
sidebar_position: 4
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
<NumericFormat displayType="text" value="110" />;
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

:::caution Deprecated
This is deprecated in favour of passing ref directly instead of using getInputRef.
:::

**default**: `null`

Method to get reference of input, span (based on displayType prop) or the customInput's reference.

```js
import { NumericFormat } from 'react-number-format';
import { useRef } from 'react';

export default function App() {
  let ref = useRef();
  return (
    <NumericFormat
      getInputRef={(inputRef) => {
        ref = inputRef;
        console.log(ref);
      }}
    />
  );
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
  isAllowed={(values, sourceInfo) => {
    const { value } = values;
    return value < MAX_LIMIT;
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

### isNumericString `boolean`

**default**: false

If value is passed as string representation of numbers (unformatted) then this should be passed as `true`.

```js
import { NumericFormat } from 'react-number-format';

<NumericFormat
  value={val}
  type="text"
  value="123456789"
  decimalSeparator=","
  displayType="input"
  type="text"
/>;
```

<details>
  <summary>
  Demo
  </summary>
  <iframe src="https://codesandbox.io/embed/isnumericstring-demo-gjdqgr?fontsize=14&hidenavigation=1&theme=dark&view=preview"
     className='csb'
     title="isNumericString-demo"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

</details>

### onValueChange `(values, sourceInfo) => {}`

**default**: undefined

A handler which recieves any changes on the value, triggered from user input or prop change. It recieves [valueObject](#valueObject) as first param, and [sourceInfo](#sourceInfo) as second param.

```js
import { NumericFormat } from 'react-number-format';

<NumericFormat
  value={123441234123}
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

### prefix `string`

**default**:`undefined`

Adds the prefix character before the input value.

```js
import { NumericFormat } from 'react-number-format';

<NumericFormat value={123441234123} prefix={'$'} />;
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

<NumericFormat value={123441234123} type="text" />;
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

### value `number | string`

**default**: `undefined`

This is the value for the input field. It can be a float number or a formatted string.

:::info
If the value passed is a string representation of the number, the [`isNumericString`](#isNumericString) props should be passed as `true`
:::

```js
import { NumericFormat } from 'react-number-format';

<NumericFormat value={123441234123} />;
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

### Other Props

- [Numeric Format Props](/docs/pattern/props)
- [Pattern Format Props](/docs/numeric/props)

**Other than this it accepts all the props which can be given to a input or span based on displayType you selected.**
