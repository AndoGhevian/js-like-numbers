import Big from 'big.js'

Big.NE = -1e+6
Big.PE = 1e+6
Big.DP = 1e+6

export default class BigNumber {
    protected static opArray: Big[][] = []
    protected static rightIndex: number = -1

    protected value: Big;
    constructor(init: string | BigNumber) {
      try {
        this.value = init instanceof BigNumber ? init.value :  Big(init)
      }catch {
        throw new Error('Invalid initialization value provided to BigNumber constructor')
      }
    }

    toString() {
      const opsCount = BigNumber.opArray.length
      if(opsCount) {
        BigNumber.opArray[opsCount - 1].push(this.value)
      }
      return this.value.toString()
    }
    valueOf() {
      const opsCount = BigNumber.opArray.length
      if(opsCount) {
        BigNumber.opArray[opsCount - 1].push(this.value)
      }
      return this.value.valueOf()
    }

    /**
     * Returns a string representing the value of this BigNumber in normal notation to a fixed number of decimal places.
     * @param decimalPlaces - integer, 0 to 1e+6 inclusive
     */
    toFixed(decimalPlaces?: number) {
        try {
            return this.value.toFixed(decimalPlaces)
        } catch {
            throw new Error('Invalid argument decimalPlaces provided')
        }
    }

    /**
     * Returns a string representing the value of this BigNumber to the specified number of significant digits.
     * @param precision - integer, 1 to 1e+6 inclusive
     */
    toPrecision(precision?: number) {
        try {
            return this.value.toPrecision(precision)
        } catch {
            throw new Error('Invalid precision provided')
        }
    }

    eq(number: number | string | BigNumber) {
        const compareTo = number instanceof BigNumber ? number.value : number
        return this.value.eq(compareTo)
    }

    gt(number: number | string | BigNumber) {
        const compareTo = number instanceof BigNumber ? number.value : number
        return this.value.gt(compareTo)
    }
    
    gte(number: number | string | BigNumber) {
        const compareTo = number instanceof BigNumber ? number.value : number
        return this.value.gte(compareTo)
    }
    
    lt(number: number | string | BigNumber) {
        const compareTo = number instanceof BigNumber ? number.value : number
        return this.value.lt(compareTo)
    }
    
    lte(number: number | string | BigNumber) {
        const compareTo = number instanceof BigNumber ? number.value : number
        return this.value.lte(compareTo)
    }
}
