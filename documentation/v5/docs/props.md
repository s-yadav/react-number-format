---
sidebar_position: 4
title: Props
---

# Props

### allowEmptyFormatting

> `Boolean` `optional`

Apply formatting to empty inputs

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

### allowLeadingZeros

> `Boolean` `optional`

Allow leading zeros at beginning of number

### allowNegative

> `Boolean` `optional` `default`

Allow negative numbers (Only when format option is not provided)

### allowedDecimalSeparators

> `Array<string>`, `optional`

Characters which when pressed result in a decimal separator. When missing, decimal separator and '.' are used.

### customInput

> `Ref/Component ref`, `optional`

This allow supporting custom inputs with number format.

---

### customNumerals

> `Array<string>`, `optional`

:::info Deprecated
This is deprecated in v5.
:::

An array of 10 single-character strings with represent numerals in different locales. ranging from 0 - 9. the result will be converted to english numeral and treated as number

---

### decimalScale

> `number`, `optional`

If defined it limits to given decimal scale

### decimalSeparator

> `string`, `optional`

Support decimal point on a number

### defaultValue

> `number | string`, `optional`

Value to be used as default value if value is not provided. The format of defaultValue should be similar as defined for the value

### displayType

> `input[type=text] / input`, `optional`

If input it renders a input element where formatting happens as you input characters. If text it renders it as a normal text in a span formatting the given value

### format

> `string`, `optional`

If format given as hash string allow number input inplace of hash. If format given as function, component calls the function with unformatted number and expects formatted number

### getInputRef

> `(elm) => void`, `optional`

Method to get reference of input, span (based on displayType prop) or the customInput's reference.

### isAllowed

> `(values) => boolean`, `optional`

A checker function to check if input value is valid or not. If this function returns false, the onChange method will not get triggered

### isNumericString

> `boolean`, `optional`

If value is passed as string representation of numbers (unformatted) then this should be passed as true

### mask

> `string`, `optional`

If mask defined, component will show non entered placed with masked value.

### onValueChange

> `(values, sourceInfo) => {}`, `optional`

onValueChange handler accepts

### prefix

> `string`, `optional`

Add a prefix before the number

### removeFormatting

> `(formattedValue) => numericString` , `optional`
> If you are providing custom format method and it add numbers as format you will need to add custom removeFormatting logic

### renderText

> `(formattedValue, customProps) => React Element`

A renderText method useful if you want to render formattedValue in different element other than span. It also returns the custom props that are added to the component which can allow passing down props to the rendered element.

### suffix

> `string`, `optional`

Add a suffix after the number

### thousandsGroupStyle

> `string`, `optional`

Define the thousand grouping style, It support three types. thousand style (thousand) : 123,456,789, indian style (lakh) : 12,34,56,789, chinese style (wan) : 1,2345,6789.

### type

> `string`, `optional`

Input type attribute

### value

> `number | string`, `optional`

Value to the number format. It can be a float number, or formatted string. If value is string representation of number (unformatted), isNumericString props should be passed as true

**Other than this it accepts all the props which can be given to a input or span based on displayType you selected.**

#### values object

values object is on following format

```js
{
  formattedValue: '$23,234,235.56', //value after applying formatting
  value: '23234235.56', //non formatted value as numeric string 23234235.56, if you are setting this value to state make sure to pass isNumericString prop to true
  floatValue: 23234235.56 //floating point representation. For big numbers it can have exponential syntax
}
```

Its recommended to use formattedValue / value / floatValue based on the initial state (it should be same as the initial state format) which you are passing as value prop. If you are saving the `value` key on state make sure to pass isNumericString prop to true.

### Notes and quirks

1. Value can be passed as string or number, but if it is passed as string it should be either formatted value or if it is a numeric string, you have to set isNumericString props to true.

2. Value as prop will be rounded to given decimal scale if format option is not provided.

3. If you want to block floating number set decimalScale to 0.

4. Use type as tel when you are providing format prop. This will change the mobile keyboard layout to have only numbers. In other case use type as text, so user can type decimal separator.

5. onChange no longer gets values object. You need to use onValueChange instead. onChange/onFocus/onBlur and other input events will be directly passed to the input.

6. Its recommended to use formattedValue / value / floatValue based on the initial state (it should be same as the initial state format) which you are passing as value prop. If you are saving the `value` key on state make sure to pass isNumericString prop to true.

7. onValueChange is not same as onChange. It gets called on whenever there is change in value which can be caused by any event like change or blur event or by a prop change. It also provides a second argument which contains the event object and the reason for this function trigger.
