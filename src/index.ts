import jsep from 'jsep'
import jsepAssignment from '@jsep-plugin/assignment';
import Big from 'big.js'
import {
  getReturnStatement,
  performMath,
} from './utils'
import { BinaryOperator, UnaryOperator } from './enum'
import BigNumber from './BigNumber'

jsep.plugins.register(jsepAssignment as any);

function op(mathOp: Function): any {
  BigNumber['resetState']()
  mathOp()

  const returnStatement = getReturnStatement(mathOp)
  const ast = jsep(returnStatement)

  const resultBig = recursiveTraverse(ast)
  BigNumber['resetState']()
  return new BigNumber(resultBig.valueOf())
}

function recursiveTraverse(ast: any): Big {
  let left: any, right: any
  switch (ast.type) {
    case 'Literal':
      return Big(ast.raw)
    case 'Identifier':
      BigNumber['rightIndex']++
      const index = BigNumber['scopeBigIntsReversedArray'].length - 1 - BigNumber['rightIndex']
      if (index < 0) {
        throw new Error(`You can use in return statement only variables initialized with BigNumber value`)
      }
      return BigNumber['scopeBigIntsReversedArray'][index]
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

export {
  op,
  BigNumber,
}
const num1 = op(() => 2 ** 2)
// const num2 = op(() => 2 ** 2.1)
console.log(
  String(num1),

)