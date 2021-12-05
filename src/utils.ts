import Big from 'big.js'
import { TFunction } from "./types"
import { BinaryOperator, UnaryOperator } from "./enum"

const returnRegex = /[^]*?return ([^]+?)(?:[;\s]|return[^]*?)*\}$/;
const arrowReturnRegex = /[^]* => ([^]*)/;

function getReturnStatement(func: TFunction | Function) {
    if (typeof func !== 'function') return '';
    const funcStr = String(func);
    const hasReturn = funcStr.indexOf('return ') !== -1
    let returnMatch: any;
    if (hasReturn) {
        returnMatch = funcStr.match(returnRegex)
    } else {
        returnMatch = funcStr.match(arrowReturnRegex)
    }

    if (returnMatch) {
        return returnMatch[1]
    }
    return ''
}

function performMath(unaryOperator: UnaryOperator, operand: string | Big): Big
function performMath(operand1: string | Big, operand2: string | Big, binaryOperator: BinaryOperator): Big
function performMath(operand1: any, operand2: any, operator?: any): any {
    let operatorName: string

    if (arguments.length === 2) {
        const unaryOperator: UnaryOperator = operand1;
        const operand: string | Big = operand2;

        let newBig = Big(operand)
        switch (unaryOperator) {
            case UnaryOperator.Minus:
                newBig.s = newBig.s * -1
                return newBig
            case UnaryOperator.Plus:
            default:
                return newBig
        }
    }

    const binaryOperator: BinaryOperator = operator
    switch (binaryOperator) {
        case BinaryOperator.Minus:
            operatorName = 'minus'
            break
        case BinaryOperator.Times:
            operatorName = 'times'
            break
        case BinaryOperator.Div:
            operatorName = 'div'
            break
        case BinaryOperator.Mod:
            operatorName = 'mod'
            break
        case BinaryOperator.Pow:
            operatorName = 'pow'
            break
        case BinaryOperator.Plus:
        default:
            operatorName = 'plus'
            break
    }

    const big1 = typeof operand1 === 'string' ? Big(operand1) : operand1 as any
    const big2 = typeof operand2 === 'string' ? Big(operand2) : operand2 as any
    if (binaryOperator === BinaryOperator.Pow) {
        try {
            return big1[operatorName](big2.toNumber())
        } catch {
            throw new Error('Invalid exponent: Exponent must be a JavaScript number integer in range - -1e+6 to 1e+6 inclusive')
        }
    }
    return big1[operatorName](big2)
}

export {
    getReturnStatement,
    performMath,
};
