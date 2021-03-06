import BigNumber from 'BigNumber'
import op from 'op'

describe('op - arithmetic calculator', () => {
    it('Return statement can contain identifiers only referring to scope variables initialized with BigNumber`s', () => {
        const numOuter = new BigNumber('1')
        const notBigNumber = '1'
        expect(op(() => {
            const numInner = new BigNumber('1')
            const numInnerOp = op(() => 0)
            return numInner as any + numOuter + numInnerOp
        }).valueOf()).toEqual('2')
        expect(() => op(() => notBigNumber + 1)).toThrow('You can use in return statement only variables initialized with BigNumber values')
    })
    
    it('op call body MUST contain only simple arithmetics (not related to BigNumbers), declarations of BigNumbers, or another op calls', () => {
        const num = op(() => 1)
        expect(op(() => {
            const num1 = op(() => {
                const num2 = op(() => 1)
                return num2
            })

            return num1 + num
        }).valueOf()).toEqual('2')

        expect(op(() => {
            const simpleArithmetics = 2 * 12 % 11
            const bigNumber1 = new BigNumber(simpleArithmetics + '')
            const bigNumber2 = op(() => bigNumber1 as any + 10)

            return bigNumber1 + bigNumber2
        }).valueOf()).toEqual('14')
    })
    describe('operating with js arithmetic operations', () => {
        describe('Unary Operators', () => {
            it('Should operate with unary - operator', () => {
                expect(op(() => -111.111).valueOf()).toEqual('-111.111')
                expect(op(() => -(-111.111)).valueOf()).toEqual('111.111')
                expect(op(() => -(-(-111.111))).valueOf()).toEqual('-111.111')
                expect(op(() => -0).valueOf()).toEqual('-0')
                expect(op(() => -(-0)).valueOf()).toEqual('0')
            })
            it('Should operate with unary + operator', () => {
                expect(op(() => +111.111).valueOf()).toEqual('111.111')
                expect(op(() => +(+111.111)).valueOf()).toEqual('111.111')
                expect(op(() => +(-111.111)).valueOf()).toEqual('-111.111')
                expect(op(() => +(-0)).valueOf()).toEqual('-0')
                expect(op(() => +0).valueOf()).toEqual('0')
            })
        })

        describe('Binary Operators', () => {
            it('Should operate with binary + operator', () => {
                expect(op(() => 111 + 10).valueOf()).toEqual('121')
                expect(op(() => 111 + (-10)).valueOf()).toEqual('101')
                expect(op(() => 111.111 + 10.1).valueOf()).toEqual('121.211')
                expect(op(() => (-111.111) + 10.1).valueOf()).toEqual('-101.011')
            })

            it('Should operate with binary - operator', () => {
                expect(op(() => 111 - 10).valueOf()).toEqual('101')
                expect(op(() => 111 - (-10)).valueOf()).toEqual('121')
                expect(op(() => 111.111 - 10.1).valueOf()).toEqual('101.011')
                expect(op(() => 111 - 120).valueOf()).toEqual('-9')
                expect(op(() => -111 - 120).valueOf()).toEqual('-231')
            })

            it('Should operate with binary * operator', () => {
                expect(op(() => 111 * 10).valueOf()).toEqual('1110')
                expect(op(() => 111 * -10).valueOf()).toEqual('-1110')
                expect(op(() => 111.111 * 10.1).valueOf()).toEqual('1122.2211')
                expect(op(() => -0 * 1).valueOf()).toEqual('-0')
            })

            it('Should operate with binary % operator', () => {
                expect(op(() => 111 % 10).valueOf()).toEqual('1')
                expect(op(() => 111 % -10).valueOf()).toEqual('1')
                expect(op(() => -111 % 10).valueOf()).toEqual('-1')
                expect(op(() => -111 % -10).valueOf()).toEqual('-1')
                expect(op(() => -0 % 11).valueOf()).toEqual('-0')
                expect(op(() => 1 % 0.9).valueOf()).toEqual('0.1')
                expect(op(() => 1 % 0.1).valueOf()).toEqual('0')
            })

            it('Should operate with binary / operator', () => {
                expect(op(() => 111 / 3).valueOf()).toEqual('37')
                expect(op(() => 112 / 3).valueOf()).toEqual(op(() => 37 + 1 / 3).valueOf())
                expect(op(() => -112 / -3).valueOf()).toEqual(op(() => 37 + 1 / 3).valueOf())
                expect(op(() => -112 / 3).valueOf()).toEqual(op(() => -37 - 1 / 3).valueOf())
                expect(op(() => 112 / -3).valueOf()).toEqual(op(() => -37 - 1 / 3).valueOf())
            })

            it('Should operate with binary ** operator', () => {
                expect(op(() => 2 ** 6).valueOf()).toEqual('64')
                expect(op(() => (-2) ** 6).valueOf()).toEqual('64')
                expect(op(() => (-2) ** 5).valueOf()).toEqual('-32')
            })
        })
    })
})