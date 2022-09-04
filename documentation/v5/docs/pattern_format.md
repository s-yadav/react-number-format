---
title: Pattern Format
sidebar_position: 3
---

# Props

### allowEmptyFormatting `boolean`

**default**: `false`

By default PatternFormat component does not apply formatting when value is empty (_null, undefined or ‘’_). If you want to apply formatting on empty values set `allowEmptyFormatting` to `true`.

```js
import { PatternFormat } from 'react-number-format';

<PatternFormat format="+1 (###) #### ###" allowEmptyFormatting mask="_" />;
```

<details>
  <summary>
  Demo
  </summary>
  <iframe src="https://codesandbox.io/embed/allow-empty-formatting-demo-kjs0lz?fontsize=16&hidenavigation=1&theme=dark&view=preview"
      className="csb"
     title="allow-empty-formatting-demo"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
</details>

### format `string`

**default**: `undefined`

It defines the format pattern using the `#` (or a [`patternChar`](#patternchar-string) ) character. `#` is the placeholder character for numbers.

```js
import { PatternFormat } from 'react-number-format';

<PatternFormat value={123123} format="### ###" />;
```

<details>
  <summary>
  Demo
  </summary>
  <iframe src="https://codesandbox.io/embed/format-demo-m3km9n?fontsize=14&hidenavigation=1&theme=dark&view=preview"
     className='csb'
     title="format-demo"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
</details>

### mask `string | Array<string>`

**default**: `undefined`

Used as mask character for numeric places, until any numeric character is provided for that position. You can provide different mask characters for every numeric positions by passing array of mask characters. **Note**: The length of mask characters should match the numbers of `#` [patternChar](#patternchar-string).

```js
import { PatternFormat } from 'react-number-format';

<PatternFormat value="411111" valueIsNumericString format="#### #### #### ####" mask="_" />;
```

<details>
  <summary>
  Demo
  </summary>
  <iframe src="https://codesandbox.io/embed/mask-demo-o06dsx?fontsize=14&hidenavigation=1&theme=dark&view=preview"
      className='csb'
      title="mask-demo"
      allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
      sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
    ></iframe>
</details>

### patternChar `string`

**default**: `#`

This helps define the [`format`](#format-string) pattern character.

```js
import { PatternFormat } from 'react-number-format';

<PatternFormat format="%% (%%%)" patternChar="%" value={23456} />;
```

<details>
<summary>
Demo
</summary>
<iframe src="https://codesandbox.io/embed/patternchar-demo-syfu42?fontsize=14&hidenavigation=1&theme=dark&view=preview"
     className='csb'
     title="patternchar-demo"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
</details>

### Common Props

- [See Common Props](/docs/props)

**Other than this it accepts all the props which can be given to a input or span based on displayType you selected.**
