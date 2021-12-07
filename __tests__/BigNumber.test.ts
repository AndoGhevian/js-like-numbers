import BigNumber from 'BigNumber'

describe('BigNumber constructor', () => {
  describe('Can be instantiated with string and BigNumber arguments', () => {
    it('Should work for string arguments', () => {
      expect(new BigNumber('1').valueOf()).toBe('1')
      expect(String(new BigNumber('1'))).toBe('1')

      expect(new BigNumber('-0').valueOf()).toBe('-0')
      expect(String(new BigNumber('-0'))).toBe('0')

      expect(new BigNumber('0').valueOf()).toBe('0')
      expect(String(new BigNumber('0'))).toBe('0')
    })
    it('Should work for BigNumber arguments', () => {
      const bigNumber = new BigNumber('1')
      const derivedBigNumber = new BigNumber(bigNumber)
      expect(
        derivedBigNumber.valueOf()
      ).toEqual(
        bigNumber.valueOf()
      )
    })
  })
})

describe('BigNumber instance', () => {
  describe('Comparison methods', () => {
    it('eq returns true if numbers are equal, false otherwise', () => {
      const num1 = new BigNumber('1')
      const num2 = new BigNumber('1')
      expect(num1.eq(num2)).toBe(true)
      expect(num1.eq('1')).toBe(true)

      const num3 = new BigNumber('1.000000000000000000000000000000000001')
      expect(num1.eq(num3)).toBe(false)
    })

    it('gt returns true if first number greater than second one, false otherwise', () => {
      const num1 = new BigNumber('2')
      const num2 = new BigNumber('1')
      expect(num1.gt(num2)).toBe(true)
      expect(num1.gt('1')).toBe(true)

      const num3 = new BigNumber('2.000000000000000000000000000000000001')
      expect(num1.gt(num3)).toBe(false)
    })

    it('gte returns true if first number greater or equal than second one, false otherwise', () => {
      const num1 = new BigNumber('2')
      const num2 = new BigNumber('2')
      expect(num1.gte(num2)).toBe(true)
      expect(num1.gte('2')).toBe(true)

      const num3 = new BigNumber('2.000000000000000000000000000000000001')
      expect(num1.gte(num3)).toBe(false)
    })

    it('lt returns true if first number less than second one, false otherwise', () => {
      const num1 = new BigNumber('2')
      const num2 = new BigNumber('2.000000000000000000000000000000000001')
      expect(num1.lt(num2)).toBe(true)
      expect(num1.lt('2.000000000000000000000000000000000001')).toBe(true)

      const num3 = new BigNumber('2')
      expect(num1.lt(num3)).toBe(false)
    })

    it('lte returns true if first number less or equal than second one, false otherwise', () => {
      const num1 = new BigNumber('2')
      const num2 = new BigNumber('2')
      expect(num1.lte(num2)).toBe(true)
      expect(num1.lte('2')).toBe(true)

      const num3 = new BigNumber('1.999999999999999999999999999999999999')
      expect(num1.lte(num3)).toBe(false)
    })
  })

  describe('Number representation methods', () => {
    const num = new BigNumber('1.5451')
    describe('toFixed (note: Rounds towards nearest neighbour. If equidistant, rounds away from zero)', () => {
      it(`Returns a string representation of BigNumber in normal notation to a fixed number of decimal places`, () => {
        expect(num.toFixed()).toBe(num.valueOf())
        expect(num.toFixed(0)).toBe('2')
        expect(num.toFixed(1)).toBe('1.5')
        expect(num.toFixed(2)).toBe('1.55')
        expect(num.toFixed(3)).toBe('1.545')
        expect(num.toFixed(4)).toBe('1.5451')
        expect(num.toFixed(5)).toBe('1.54510')
        expect(num.toFixed(6)).toBe('1.545100')
      })
      it('Expect integer argument in between 0 to 1e+6 inclusive', () => {
        expect(num.toFixed(0)).toBe('2')
        expect(num.toFixed(1e+6)).toBe('1.5451' + '0'.repeat(1e+6 - 4))

        expect(() => num.toFixed(-1)).toThrow()
        expect(() => num.toFixed(1.1)).toThrow()
        expect(() => num.toFixed(1e+6 + 1)).toThrow()
      })
    })
    describe('toPrecision (note: Rounds towards nearest neighbour. If equidistant, rounds away from zero)', () => {
      it('Returns a string representation of BigNumber to the specified number of significant digits.', () => {
        expect(num.toPrecision()).toBe(num.valueOf())
        expect(num.toPrecision(1)).toBe('2')
        expect(num.toPrecision(2)).toBe('1.5')
        expect(num.toPrecision(3)).toBe('1.55')
        expect(num.toPrecision(4)).toBe('1.545')
        expect(num.toPrecision(5)).toBe('1.5451')
        expect(num.toPrecision(6)).toBe('1.54510')
      })

      it('Expect integer argument in between 1 to 1e+6 inclusive', () => {
        expect(num.toPrecision(1)).toBe('2')
        expect(num.toPrecision(1e+6)).toBe('1.5451' + '0'.repeat(1e+6 - 5))

        expect(() => num.toPrecision(0)).toThrow()
        expect(() => num.toPrecision(1.1)).toThrow()
        expect(() => num.toPrecision(1e+6 + 1)).toThrow()
      })
    })
  })
})