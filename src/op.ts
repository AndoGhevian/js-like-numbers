import jsep from 'jsep'
import jsepAssignment from '@jsep-plugin/assignment'
import jsepComment from '@jsep-plugin/comment'
import Big from 'big.js'
import {
  getReturnStatement,
  performMath,
} from './utils'
import { BinaryOperator, UnaryOperator } from './enum'
import BigNumber from './BigNumber'

jsep.plugins.register(jsepAssignment as any)
jsep.plugins.register(jsepComment as any)

function op(mathOp: Function): any {
  try {
    BigNumber['opArray'].push([])
    String(mathOp())

    BigNumber['rightIndex'] = -1
    const returnStatement = getReturnStatement(mathOp)
    const ast = jsep(returnStatement)

    console.log((BigNumber['opArray'][0] as any).length)
    const resultBig = recursiveTraverse(ast)
    return new BigNumber(resultBig.valueOf())
  } finally {
    BigNumber['opArray'].pop()
  }
}

function recursiveTraverse(ast: any): Big {
  let left: any, right: any
  switch (ast.type) {
    case 'Literal':
      return Big(ast.raw)
    case 'Identifier':
      BigNumber['rightIndex']++
      const bigNumbersArray = BigNumber['opArray'][BigNumber['opArray'].length - 1]
      const index = bigNumbersArray.length - 1 - BigNumber['rightIndex']
      if (index < 0) {
        throw new Error(`You can use in return statement only variables initialized with BigNumber values`)
      }
      return bigNumbersArray[index]
    case 'BinaryExpression':
      ({ left, right } = ast);
      const binaryOperator: BinaryOperator = ast.operator
      const isValidOperator = (Object as any).values(BinaryOperator).includes(binaryOperator)
      if (!isValidOperator) {
        break
      }
      return performMath(
        recursiveTraverse(left),
        recursiveTraverse(right),
        binaryOperator
      )
    case 'UnaryExpression':
      right = ast.argument
      const unaryOperator: UnaryOperator = ast.operator
      switch (unaryOperator) {
        case UnaryOperator.Minus:
          return performMath(unaryOperator, recursiveTraverse(right))
        case UnaryOperator.Plus:
          return performMath(unaryOperator, recursiveTraverse(right))
        default:
          break
      }
      break
    case 'CallExpression':
      const { callee } = ast
      const {
        type: calleeType,
        computed,
      } = callee
      if (calleeType !== 'MemberExpression' || computed) {
        break
      }
      const { name: objectName } = callee.object
      const { name: propertyName } = callee.property
      if (objectName !== 'Math' || propertyName !== 'pow') {
        break
      }
      ([left, right] = ast.arguments);
      return performMath(
        recursiveTraverse(left),
        recursiveTraverse(right),
        BinaryOperator.Pow
      )
    default:
      break
  }
  throw new Error('not supproted operation')
}

export default op

const num1 = op(() => 1)
const num2 = op(() => (num1 + num1) ** 2)
const simpleMath = 16 + 2 / 2
const num3 = new BigNumber(simpleMath + '')
const result = op(function f() {
  // const bigNumberStringCasting = num3.toString() // This is not allowed, it can lead to logical errors.
  return num2 + 12 + num1 - (num3 as any) // 0
})
console.log(String(num1))
console.log(String(num2))
console.log(String(num3))
console.log(String(result))