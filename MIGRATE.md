### v2 to v3

#### onValueChange -
onChange prop no longer receives values object. You should use onValueChange prop instead.

```jsx
//v2
<NumberFormat prefix="$" value={this.state.price} onChange={(e, values) => {
  this.setState({price: values.formattedValue})
}}/>
```

```jsx
//v3
<NumberFormat prefix="$" value={this.state.price} onValueChange={(values) => {
  this.setState({price: values.formattedValue})
}}/>
```

#### value prop -
value prop is more restrictive now, in v2 you were allowed to pass formatted value, numeric string (while maintaining decimal separator same as the prop) or a float value.


```jsx
//v2
<NumberFormat prefix="$" thousandSeparator="." decimalSeparator="," value={this.state.price}/>
/*
  this.state.price can be
  - $12.345,56 // formatted value
  - 12345,56 // numeric string while maintaining decimal separator
  - 12345.56 //floating point number
*/  
```

In v3 you can pass it as formattedValue (string), float value, or numeric string (which requires additional prop isNumericString to be set true).

```jsx
//v3
<NumberFormat prefix="$" thousandSeparator="." decimalSeparator=","  value={this.state.price}/>
/*
  this.state.price can be
  - $12.345,56 // formatted value
  - 12345.56 //floating point number

  It can also be
  - 12345.56 // a numeric string
  But you need to pass isNumericString = {true} . Also note decimal separator will always be . here.
*/  
```

#### values object -
on v2 values object contained three values, formattedValue, value (numeric string) and floatValue

```js
//v2
//considering thousandSeparator = '.' , decimalSeparator = ','
{
  formattedValue: '$12.345,56', // formatted value,
  value: '12345,56', //numeric string while maintaining decimal separator
  floatValue: 12345.56 //float number
}
```

in v3 its same except value will always have . as decimal separator.
```js
//v3
//considering thousandSeparator = '.' , decimalSeparator = ','
{
  formattedValue: '$12.345,56', // formatted value,
  value: '12345.56', //numeric string
  floatValue: 12345.56 //float number
}
```

#### decimal scale -
decimalPrecision was incorrectly named before, which has been changed to decimalScale now. (Precision is the number of digits in a number. Scale is the number of digits to the right of the decimal point in a number.)

in v2 decimalPrecision convert number into fixed scale provided as decimalPrecision

```jsx
//v2
<NumberFormat prefix="$" decimalPrecision={3} value={34.4}/>
// will be displayed as 34.400
// value 34.4584 will be displayed as 34.458
```

in v3 decimalScale limits to the scale provided. To fix the decimals to provided scale you have to pass fixedDecimalScale={true}

```jsx
//v3
<NumberFormat prefix="$" decimalScale={3} value={34.4}/>
// will be displayed as 34.4
// value 34.4584 will be displayed as 34.458

<NumberFormat prefix="$" decimalScale={3} value={34.4} fixedDecimalScale={true}/>
// will be displayed as 34.400
// value 34.4584 will be displayed as 34.458
```
