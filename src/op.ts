import Big from 'big.js'
import {
  getReturnStatementAst,
  performMath,
} from './utils'
import { BinaryOperator, UnaryOperator } from './enum'
import BigNumber from './BigNumber'
import { TFunction } from 'types'

function op(mathOp: TFunction): any {
  try {
    BigNumber['opArray'].push([])
    String(mathOp())

    BigNumber['bigNumberIndexesArray'].push(-1)
    const ast = getReturnStatementAst(mathOp)

    const resultBig = recursiveTraverse(ast)
    return BigNumber['createFromBig'](resultBig)
  } finally {
    BigNumber['opArray'].pop()
    BigNumber['bigNumberIndexesArray'].pop()
  }
}

function recursiveTraverse(ast: any): Big {
  switch (ast.type) {
    case 'Literal': {
      return Big(ast.raw)
    }
    case 'Identifier': {
      const bigNumbersArray = BigNumber['opArray'][BigNumber['opArray'].length - 1]
      const bigNumberIndexesArray = BigNumber['bigNumberIndexesArray']
      const index = ++bigNumberIndexesArray[bigNumberIndexesArray.length - 1]
      if (index > bigNumbersArray.length - 1) throw new Error(`You can use in return statement only variables initialized with BigNumber values`)
      return bigNumbersArray[index]
    }
    case 'BinaryExpression': {
      const { left, right } = ast;
      const binaryOperator: BinaryOperator = ast.operator
      const isValidOperator = Object.values(BinaryOperator).includes(binaryOperator)
      if (!isValidOperator) break
      return performMath(
        recursiveTraverse(left),
        recursiveTraverse(right),
        binaryOperator
      )
    }
    case 'UnaryExpression': {
      const right = ast.argument
      const unaryOperator: UnaryOperator = ast.operator
      const isValidOperator = Object.values(UnaryOperator).includes(unaryOperator)
      if (!isValidOperator) break
      switch (unaryOperator) {
        case UnaryOperator.Minus:
          return performMath(unaryOperator, recursiveTraverse(right))
        case UnaryOperator.Plus:
          return performMath(unaryOperator, recursiveTraverse(right))
        default:
          break
      }
      break
    }
    case 'CallExpression': {
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
      const [left, right] = ast.arguments;
      return performMath(
        recursiveTraverse(left),
        recursiveTraverse(right),
        BinaryOperator.Pow
      )
    }
    default: {
      break
    }
  }
  throw new Error('not supproted operation')
}

export default op
