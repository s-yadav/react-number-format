---
sidebar_position: 5
title: Notes & Quirks
---

# Notes & Quirks

## Values object

values object is on following format

```js
{
  formattedValue: '$23,234,235.56', //value after applying formatting
  value: '23234235.56', //non formatted value as numeric string 23234235.56, if you are setting this value to state make sure to pass isNumericString prop to true
  floatValue: 23234235.56 //floating point representation. For big numbers it can have exponential syntax
}
```

Its recommended to use formattedValue / value / floatValue based on the initial state (it should be same as the initial state format) which you are passing as value prop. If you are saving the `value` key on state make sure to pass isNumericString prop to true.
