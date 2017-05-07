# react-number-format
React component to format number in an input or as a text

### Features
1. Allow prefix, suffix and thousand separator.
2. Allow format pattern.
3. Allow masking.
4. Allow custom formatting handler.
5. Allow formatting a input or a simple text

### Install
Through npm
`npm install react-number-format --save`

Or get compiled development and production version from ./dist

### Props
| Props        | Options           | Default  | Description |
| ------------- |-------------| -----| -------- |
| thousandSeparator | mixed: single character string or true/false (boolean) | false | Add thousand separators on number |
| decimalSeparator | mixed: single character string or true/false (boolean)| . | Support decimal point on a number |
| decimalPrecision | mixed: number or boolean | false (2 if true)| If false it does not limit decimal place, if true default precision is 2 or else limits to provided decimal place |
| allowNegative      | boolean     |   true | allow negative numbers (Only when format option is not provided) |
| prefix      | String (ex : $)     |   none | Add a prefix before the number |
| suffix | String (ex : /-)      |    none | Add a prefix after the number |
| value | Number | null | Value to number format |
| displayType | String: text / input | input | If input it renders a input element where formatting happens as you input characters. If text it renders it as a normal text in a span formatting the given value |
| format | String : Hash based ex (#### #### #### ####) <br/> Or Function| none | If format given as hash string allow number input inplace of hash. If format given as function, component calls the function with unformatted number and expects formatted number.
| mask | String (ex : _) | none | If mask defined, component will show non entered placed with masked value.  
| customInput | Component Reference | input | This allow supporting custom inputs with number format.
| onChange | (e, value) => {} | none | onChange handler accepts event object through which you can get formattedValue (e.targe.value # $2,223)  and second parameter non formatted value (ie: 2223)

**Other than this it accepts all the props which can be given to a input or span based on displayType you selected.**

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
  function formatExpiryChange(val){
    if(val && Number(val[0]) > 1){
      val = '0'+val;
    }
    if(val && val.length >1 && Number(val[0]+val[1]) > 12){
      val = '12'+val.substring(2,val.length);
    }
    val = val.substring(0,2)+ (val.length > 2 ? '/'+val.substring(2,4) : '');
    return val;
  }

<NumberFormat format={formatExpiryChange}/>
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
