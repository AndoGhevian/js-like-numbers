import jsep from 'jsep'
import jsepAssignment from '@jsep-plugin/assignment'
import jsepComment from '@jsep-plugin/comment'
import Big from 'big.js'
import {
  getReturnStatementAst,
  performMath,
} from './utils'
import { BinaryOperator, UnaryOperator } from './enum'
import BigNumber from './BigNumber'
import { TFunction } from 'types'

jsep.plugins.register(jsepAssignment as any)
jsep.plugins.register(jsepComment as any)

function op(mathOp: TFunction): any {
  try {
    BigNumber['opArray'].push([])
    String(mathOp())

    BigNumber['rightIndexArray'].push(-1)
    const ast = getReturnStatementAst(mathOp)
    console.log(ast)

    const resultBig = recursiveTraverse(ast)
    return new BigNumber(resultBig.valueOf())
  } finally {
    BigNumber['opArray'].pop()
    BigNumber['rightIndexArray'].pop()
  }
}

function recursiveTraverse(ast: any): Big {
  const rightIndexCount = BigNumber['rightIndexArray'].length
  let left: any, right: any
  switch (ast.type) {
    case 'Literal':
      return Big(ast.raw)
    case 'Identifier':
      BigNumber['rightIndexArray'][rightIndexCount - 1]++
      const bigNumbersArray = BigNumber['opArray'][BigNumber['opArray'].length - 1]
      const index = bigNumbersArray.length - 1 - BigNumber['rightIndexArray'][rightIndexCount - 1]
      if (index < 0) throw new Error(`You can use in return statement only variables initialized with BigNumber values`)
      return bigNumbersArray[index]
    case 'BinaryExpression':
      ({ left, right } = ast);
      console.log('left')
      console.log(left)
      console.log()
      const binaryOperator: BinaryOperator = ast.operator
      const isValidOperator = Object.values(BinaryOperator).includes(binaryOperator)
      if (!isValidOperator) break
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
