# Simple-Numbers
**A small, fast JavaScript library for arbitrary-precision decimal arithmetic in javascript notation.**

[![npm version](https://img.shields.io/npm/v/simple-numbers.svg)](https://www.npmjs.com/package/simple-numbers)
[![npm downloads](https://img.shields.io/npm/dw/simple-numbers)](https://www.npmjs.com/package/simple-numbers)

## Install
`$ npm install simple-numbers`

## Usage

CommonJS:

```javascript
const { op } = require('simple-numbers')
```

ES module:

```javascript
import { op } from 'simple-numbers'
```

You need to pass to **op** a function with returned aritmetic operation or a number
```javascript
const val = op(() => 1)
const val2 = op(() => (
    10000000000000000000000000000000000000000000
    + 55555555555555555555555
    + 111111111111.7891919191919191919191111111111111111
))

console.log(String(val)) // 1
console.log(String(val2)) // 10000000000000000000055555555555666666666666.7891919191919191919191111111111111111
```
As you see You can work with any numbers in javascript notation.

Functions passed to **op** can also be _fat functions_:
```javascript
const val = op(function f() {
    return 128931823123712839213 % 13213212312
})

console.log(String(val)) // 449923381
```

The only requirement is that in return statement you must use only
variables containing **BigNumbers** as values:
```javascript
const val = op(() => 1)
const result1 = op(() => 1 + val) // Is Correct

const incorrectVal = 1
const result2 = op(() => 1 + incorrectVal) // Error: You can use in return statement only variables initialized with BigNumber value
```