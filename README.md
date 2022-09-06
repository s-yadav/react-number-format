[![Actions Status](https://github.com/s-yadav/react-number-format/workflows/CI/badge.svg)](https://github.com/s-yadav/react-number-format/actions)

# react-number-format

React Number format is a input formatter library with a sohpisticated and light weight caret engine.

### Features

1. Prefix, suffix and thousand separator.
2. Custom pattern formatting.
3. Masking.
4. Custom formatting handler.
5. Format number in an input or format as a simple text.
6. Fully customizable

### Install

[![npm](https://img.shields.io/npm/dm/react-number-format.svg)](https://www.npmjs.com/package/react-number-format)

Using `npm`

```
npm install react-number-format
```

Using `yarn`

```
yarn add react-number-format
```

#### ES6

Numeric Format

```js
import { NumericFormat } from 'react-number-format';
```

Pattern Format

```js
import { PatternFormat } from 'react-number-format';
```

Read the full documentation here

[https://s-yadav.github.io/react-number-format/docs/intro](https://s-yadav.github.io/react-number-format/docs/intro)

### Migrate from v4 to v5

[https://s-yadav.github.io/react-number-format/docs/migration](https://s-yadav.github.io/react-number-format/docs/migration)

### v4 doc

[v4 Docs](https://github.com/s-yadav/react-number-format/blob/master/documentation/v4.md)

### Development

- Clone the repository or download the zip
- `npm i -g yarn` to download Yarn
- `yarn` to install dependencies
- `yarn start` to run example server (<http://localhost:8084/>)
- `yarn test` to test changes
- `yarn build` to bundle files

#### Testing

Test cases are written in jasmine and run by karma

Test files : /test/\*\*/\*.spec.js

To run test : `yarn test`
