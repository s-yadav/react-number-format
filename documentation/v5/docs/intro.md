---
sidebar_position: 1
---

# Getting started

React component to format number in an input or as a text

### Features

1. Prefix, suffix and thousand separator.
2. Custom format pattern.
3. Masking.
4. Custom formatting handler.
5. Format number in an input or format as a simple text.

### Live demo example

[Jinno live demo](https://jinno.io/app/24?source=react-number-format)

### Install

[![npm](https://img.shields.io/npm/dm/react-number-format.svg)](https://www.npmjs.com/package/react-number-format)

Through npm
`npm install react-number-format --save`

Or get compiled development and production version from ./dist

### Usage

#### ES6

```js
import NumberFormat from 'react-number-format';
```

#### ES5

```js
const NumberFormat = require('react-number-format');
```

Typescript

```js
import NumberFormat from 'react-number-format';
//or
import { default as NumberFormat } from 'react-number-format';
```

In typescript you also have to enable `"esModuleInterop": true` in your tsconfig.json (https://www.typescriptlang.org/docs/handbook/compiler-options.html).
