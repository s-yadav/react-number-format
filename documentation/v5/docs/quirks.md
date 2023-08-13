---
sidebar_position: 7
title: Notes & Quirks
---

# Notes & Quirks

## Values object

values object is on following format

```js
{
  formattedValue: '$23,234,235.56', //value after applying formatting
  value: '23234235.56', //non formatted value as numeric string 23234235.56, if you are setting this value to state make sure to pass valueIsNumericString prop to true
  floatValue: 23234235.56 //floating point representation. For big numbers it can have exponential syntax
}
```

Its recommended to use formattedValue / value / floatValue based on the initial state (it should be same as the initial state format) which you are passing as value prop. If you are saving the `value` key on state and any of the format prop like prefix/suffix contains number make sure to pass valueIsNumericString prop to true.

### Notes and quirks

1. Value can be passed as string or number, but if it is passed as string it should be either formatted value or if it is a numeric string and any of the format prop like prefix/suffix contains number, you have to set valueIsNumericString props to true.

2. Value as prop will be rounded to given decimal scale if format option is not provided.

3. If you want to block floating number set decimalScale to 0.

4. Use type as tel when you are providing format prop. This will change the mobile keyboard layout to have only numbers. In other case use type as text, so user can type decimal separator.

5. onChange no longer gets values object. You need to use onValueChange instead. onChange/onFocus/onBlur and other input events will be directly passed to the input.

6. Its recommended to use formattedValue / value / floatValue based on the initial state (it should be same as the initial state format) which you are passing as value prop. If you are saving the `value` key on state make sure to pass valueIsNumericString prop to true.

7. onValueChange is not same as onChange. It gets called on whenever there is change in value which can be caused by any event like change or blur event or by a prop change. It also provides a second argument which contains the event object and the reason for this function trigger.

8. `minLength` and `maxLength` prop of native input doesn't work as expected, as the formatting happens post the number is added on the input. You can achieve similar result using isAllowed prop.

Related issue: https://github.com/s-yadav/react-number-format/issues/758

## SourceInfo object

The `sourceInfo` object indicates whether the triggered change is due to an event or a prop change. This is particularly useful in identify whether the change is user driven or is an uncontrolled change due to any prop value being updated.

```js
{
  event: SyntheticEvent; // This is the event object of type Synthetic Event
  source: 'event' | 'prop'; // Source information indicating whether it is due to an event or a prop change
}
```
