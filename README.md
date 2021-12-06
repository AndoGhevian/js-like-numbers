# Simple-Numbers
Currently Supported for **ES6** and **higher**

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

The only requirements is that your return statements consists of arithmetic
operations and include only identifiers (variables) refering to **BigNumbers** as values:
```javascript
const val = op(() => 1)
const result1 = op(() => (1 + val * 10) / val ** (2 + val)) // Is Correct

const incorrectVal = 1
const result2 = op(() => 1 + incorrectVal) // Error: You can use in return statement only variables initialized with BigNumber value
```
Your function body (except return statements) can contain any synchronous logic:
```javascript
const num1 = op(() => 1)
const result = op(function f() {
  const num2 = op(() => (num1 + num1) ** 2)
  
  return num2 + 12 + num1 // 17
})
```
When you use **exponentiation** operation **(\*\*)**, be sure to pass
as a second operand integer number between **-1e+6** to **1e+6** inclusive.
```javascript
const num1 = op(() => 2 ** 2) // 4
const num2 = op(() => 2 ** 2.1) // Error: Invalid exponent: Exponent must be a JavaScript number integer in range - -1e+6 to 1e+6 inclusive
```

For comparison you have 5 methods on **BigNumber** instances:
- **eq:**
  ```javascript
  const num1 = op(() => 1)
  const num2 = op(() => num1)
  console.log(num1.eq(num2)) // true
  console.log(num1.eq(1)) // true
  console.log(num1.eq('1')) // true
  ```
- **gt:**
  ```javascript
  const num1 = op(() => 1)
  const num2 = op(() => num1 - 1)
  console.log(num1.gt(num2)) // true
  console.log(num1.gt(0)) // true
  console.log(num1.gt('0')) // true
  ```
- **gte:**
  ```javascript
  const num1 = op(() => 1)
  console.log(num1.gte(num1)) // true
  console.log(num1.gte(1)) // true
  console.log(num1.gte('1')) // true
  ```
- **lt:**
  ```javascript
  const num1 = op(() => 1)
  const num2 = op(() => num1 - 1)
  console.log(num1.lt(num2)) // false
  console.log(num1.lt(0)) // false
  console.log(num1.lt('0')) // false
  ```
- **lte:**
  ```javascript
  const num1 = op(() => 1)
  const num2 = op(() => num1 - 1)
  console.log(num1.lte(num2)) // false
  console.log(num1.lte(1)) // true
  console.log(num1.lte('2')) // true
  ```

There are 2 additional methods, **toFixed** and **toPrecision**:
### toFixed
Returns a string representing the value of this **BigNumber** in normal notation to a fixed number of decimal places.

Decimal places number must be integer from **0** to **1e+6** inclusive.
```javascript
const num = op(() => 1.5451)
num.toFixed() // 1.5451 - same value in normal notation
num.toFixed(0) // 2 - rounded to closest integer
num.toFixed(1) // 1.5
num.toFixed(2) // 1.55
num.toFixed(3) // 1.545
num.toFixed(4) // 1.5451
num.toFixed(5) // 1.54510
num.toFixed(6) // 1.545100
num.toFixed(-1) // Error: Invalid argument decimalPlaces provided
num.toFixed(1e+6 + 1) // Error: Invalid argument decimalPlaces provided
```
### toPrecision
Returns a string representing the value of this **BigNumber** to the specified number of significant digits.

Precision number must be integer from **1** to **1e+6** inclusive
```javascript
const num = op(() => 1.5451)
num.toPrecision() // 1.5451 - same value in normal notation
num.toPrecision(1) // 2
num.toPrecision(2) // 1.5
num.toPrecision(3) // 1.55
num.toPrecision(4) // 1.545
num.toPrecision(5) // 1.5451
num.toPrecision(6) // 1.54510
num.toPrecision(-1) // Error: Invalid precision provided
num.toPrecision(1e+6 + 1) // Error: Invalid precision provided
num.toPrecision(0) // Error: Invalid precision provided
```

## License
[MIT](LICENSE.md)