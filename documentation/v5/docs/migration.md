---
sidebar_position: 6
title: Migration guide
---

# Migration guide

### customNumerals `Array<string>`

:::caution Removed
This is removed in v5.
:::

An array of 10 single-character strings with represent numerals in different locales. ranging from 0 - 9. the result will be converted to english numeral and treated as number

---

### getInputRef `elm => void`

```warning Deprecated
This is deprecated in favour of passing ref directly instead of using getInputRef.
```

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

w
