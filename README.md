# react-number-format
React component to format number in an input or as a text

### Features
1. Allow prefix, suffix and thousand seperator. 
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
| thousandSeperator | Boolean: true/false | false | Add thousand seperators on number |
| prefix      | String (ex : $)     |   none | Add a prefix before the number |
| suffix | String (ex : /-)      |    none | Add a prefix after the number |
| value | Number | null | Give initial value to number format |
| displayType | String: text / input | input | If input it renders a input element where formatting happens as you input characters. If text it renders it as a normal text in a span formatting the given value |
| format | String : Hash based ex (#### #### #### ####) <br/> Or Function| none | If format given as hash string allow number input inplace of hash. If format given as function, component calls the function with unformatted number and expects formatted number.
| mask | String (ex : _) | none | If mask defined, component will show non entered placed with masked value.  

