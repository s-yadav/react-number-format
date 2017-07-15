# react-number-format
React component to format number in an input or as a text

### Features
1. Prefix, suffix and thousand separator.
2. Custom format pattern.
3. Masking.
4. Custom formatting handler.
5. Formatting a input or a simple text.

### Install
Through npm
`npm install react-number-format --save`

Or get compiled development and production version from ./dist

### Props
| Props        | Options           | Default  | Description |
| ------------- |-------------| -----| -------- |
| thousandSeparator | mixed: single character string or boolean true (true is default to ,) |none| Add thousand separators on number |
| decimalSeparator | single character string| . | Support decimal point on a number |
| decimalPrecision | number| none| If defined it limits to given decimal precision |
| allowNegative      | boolean     |   true | allow negative numbers (Only when format option is not provided) |
| prefix      | String (ex : $)     |   none | Add a prefix before the number |
| suffix | String (ex : /-)      |    none | Add a prefix after the number |
| value | Number | null | Value to number format |
| displayType | String: text / input | input | If input it renders a input element where formatting happens as you input characters. If text it renders it as a normal text in a span formatting the given value |
| type | One of ['text', 'tel'] | text | Input type attribute
| format | String : Hash based ex (#### #### #### ####) <br/> Or Function| none | If format given as hash string allow number input inplace of hash. If format given as function, component calls the function with unformatted number and expects formatted number.
| mask | String (ex : _) | none | If mask defined, component will show non entered placed with masked value.  
| customInput | Component Reference | input | This allow supporting custom inputs with number format.
| onChange | (e, values) => {} | none | onChange handler accepts event object and [values object](#values-object)
| isAllowed | ([values](#values-object)) => true or false | none | A checker function to check if input value is valid or not

**Other than this it accepts all the props which can be given to a input or span based on displayType you selected.**

#### values object
values object is on following format
```js
{
  formattedValue: '$23,234,235.56', //value after applying formatting
  value: '23234235.56', //non formatted value as string, but it maintains the decimalSeparator provided, so if , is decimal separator then value will be 23234235,56
  floatValue: 23234235.56 //floating point representation. For big numbers it can have exponential syntax
}
```

### Examples
#### Prefix and thousand separator : Format currency as text
```jsx
var NumberFormat = require('react-number-format');

<NumberFormat value={2456981} displayType={'text'} thousandSeparator={true} prefix={'$'} />
```
Output : $2,456,981

#### Format with pattern : Format credit card as text
```jsx
<NumberFormat value={4111111111111111} displayType={'text'} format="#### #### #### ####" />
```
Output : 4111 1111 1111 1111

#### Prefix and thousand separator : Format currency in input
```jsx
<NumberFormat thousandSeparator={true} prefix={'$'} />
```
![Screencast example](https://i.imgur.com/d0P2Db1.gif)

#### Maintaining change value on state
```jsx
<NumberFormat value={this.state.profit} thousandSeparator={true} prefix={'$'} onChange={(e, value) => {
    const formattedValue = e.target.value; // $222,3
    //value will be non formatted value ie, 2223
    this.setState({profit: value})
  }}/>
```

#### Format with pattern : Format credit card in an input
```jsx
<NumberFormat format="#### #### #### ####" />
```
![Screencast example](https://i.imgur.com/KEiYp4o.gif)

#### Format with mask : Format credit card in an input
```jsx
<NumberFormat format="#### #### #### ####" mask="_"/>
```
![Screencast example](https://i.imgur.com/qvmydpH.gif)

#### Custom format method  : Format credit card expiry time
```jsx
function limit(val, max) {
  if (val.length === 1 && val[0] > max[0]) {
    val = '0' + val;
  }

  if (val.length === 2) {
    if (Number(val) === 0) {
      val = '01';

    //this can happen when user paste number
  } else if (val > max) {
      val = max;
    }
  }

  return val;
}

function cardExpiry(val) {
  let month = limit(val.substring(0, 2), '12');
  let date = limit(val.substring(2, 4), '31');

  return month + (date.length ? '/' + date : '');
}

<NumberFormat format={cardExpiry}/>
```
![Screencast example](https://i.imgur.com/9wwdyFF.gif)

### Custom Inputs
You can easily extend your custom input with number format. But custom input should have all input props.
```jsx
  import TextField from 'material-ui/TextField';
```

```jsx
  <NumberFormat customInput={TextField} format="#### #### #### ####"/>
```

**Passing custom input props**
All custom input props and number input props are passed together.
```jsx
  <NumberFormat hintText="Some placeholder" value={this.state.card} customInput={TextField} format="#### #### #### ####"/>
```


### Live Demo
[http://codepen.io/s-yadav/pen/bpKNMa](http://codepen.io/s-yadav/pen/bpKNMa)

### Major Updates
### v1.2.0
- Support negative numbers

### v1.1.0
- Support custom input
- Support custom decimal / thousandSeparator
- Support providing decimal precision
- Bug fixes ([See release notes](https://github.com/s-yadav/react-number-format/releases))

### v1.0.0
- Support decimals
- Support changing thousandSeparator to ','
- Updated complete code to ES6
- Added propTypes validation
- Fixed #1, #7, #8, #9

### Development
- Download the zip
- `npm install`
- `npm start` to run example server
- `npm run test` to test changes
- `npm run bundle` to bundle files

#### Testing
Test cases are written in jasmine and run by karma
Test file : /test/test_input.js
To run test : `npm run test`
