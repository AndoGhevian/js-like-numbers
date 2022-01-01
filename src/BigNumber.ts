import Big from 'big.js'

Big.NE = -1e+6
Big.PE = 1e+6
Big.DP = 1e+6

export default class BigNumber {
    protected static opArray: Big[][] = []
    protected static bigNumberIndexesArray: number[] = []
    protected static createFromBig(number: Big) {
      const emptyBigNumber = new BigNumber('0')
      emptyBigNumber.value = number
      return emptyBigNumber
    }

    protected value: Big;
    constructor(init: string | BigNumber) {
      try {
        this.value = init instanceof BigNumber ? init.value :  Big(init)
      } catch {
        throw new Error('Invalid initialization value provided to BigNumber constructor')
      }
    }

    /**
     * Cast **BigNumber** to primitive.
     * 
     * **WARNING:**
     * - In **op** functions you **MUST** use this method to case **BigNumber** to primitive (string/number).
     * - **DO NOT** peform any operations that lead to **to primitive (string/number)** castings of **BigNumbers** in **op** without this method.
     * @param to 'string' or 'number'
     * @defualt 'string'
     * @returns string or number respectively
     */
    cast<T extends 'string' | 'number'>(to?: T) : T extends 'string' 
      ? string
      : number {
        switch(to) {
          case 'number':
            return this.value.valueOf() as string & number
          case 'string':
          case undefined:
            return this.value.toString() as string & number
        }
        throw new Error('Invalid casting target provided')
    }
    
    /**
     * **WARNING:**
     * - **DO NOT** use this method (implicitly/explicitly) to cast **BigNumbers** to strings in **op** functions.
     * - Instead in **op** functions you **MUST** use **BigNumber.cast** method.
     */
    toString() {
      const opsCount = BigNumber.opArray.length
      if(opsCount) BigNumber.opArray[opsCount - 1].push(this.value)
      return this.value.toString()
    }

    /**
     * **WARNING:**
     * - **DO NOT** use this method (implicitly/explicitly) to cast **BigNumbers** to numbers in **op** functions.
     * - Instead in **op** functions you **MUST** use **BigNumber.cast** method.
     */
    valueOf() {
      const opsCount = BigNumber.opArray.length
      if(opsCount) BigNumber.opArray[opsCount - 1].push(this.value)
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
            throw new Error('Invalid decimalPlaces argument provided')
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
            throw new Error('Invalid precision argument provided')
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
