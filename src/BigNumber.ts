import Big from 'big.js'

export default class BigNumber {
  protected static opArray: Big[][] = []
  protected static bigNumberIndexesArray: number[] = []
  protected static createFromBig(number: Big) {
    const emptyBigNumber = new BigNumber('0')
    emptyBigNumber.value = number
    return emptyBigNumber
  }

  protected value: Big;

  /**
   * integer, -1e+6 to 0 inclusive
   * Default value: -7
   *
   * The negative exponent value at and below which toString returns exponential notation.
   */
  static set NE(value: number) {
    Big.NE = value;
  }

  static get NE() {
    return Big.NE;
  }

  /**
   * 
   * integer, 0, 1, 2 or 3
   * Default value: 1
   * The rounding mode used in operations involving division and by round, toExponential, toFixed and toPrecision.
   * 
   * - **0** : Rounds towards zero. I.e. truncate, no rounding.
   * - **1** : Rounds towards nearest neighbour. If equidistant, rounds away from zero.
   * - **2** : Rounds towards nearest neighbour. If equidistant, rounds towards even neighbour.
   * - **3** : Rounds away from zero.
   */
  static set RM(value: number) {
    Big.RM = value;
  }

  static get RM() {
    return Big.RM;
  }

  /**
   * integer, 0 to 1e+6 inclusive
   * Default value: 21
   *
   *  The positive exponent value at and above which toString returns exponential notation.
   */
  static set PE(value: number) {
    Big.PE = value;
  }

  static get PE() {
    return Big.PE;
  }

  /**
   * integer, 0 to 1e+6 inclusive
   * Default value: 20
   *
   * The maximum number of decimal places of the results of operations involving division.
   * It is relevant only to the div and sqrt methods, and the pow method when the exponent is negative.
   *
   * The value will be checked for validity when one of the above methods is called.
   */
  static set DP(value: number) {
    Big.DP = value;
  }

  static get DP() {
    return Big.DP;
  }

  constructor(init: string | BigNumber) {
    this.value = init instanceof BigNumber ? init.value : Big(init)
  }

  toString() {
    const opsCount = BigNumber.opArray.length
    if (opsCount) BigNumber.opArray[opsCount - 1].push(this.value)
    return this.value.toString()
  }

  valueOf() {
    const opsCount = BigNumber.opArray.length
    if (opsCount) BigNumber.opArray[opsCount - 1].push(this.value)
    return this.value.valueOf()
  }

  /**
   * Returns a string representing the value of this Big number in normal notation to a fixed number of decimal places dp.
   *
   * If the value of this Big number in normal notation has more digits to the right of the decimal point than is specified by dp,
   * the return value will be rounded to dp decimal places using rounding mode Big.RM.
   *
   * If the value of this Big number in normal notation has fewer fraction digits then is specified by dp, the return value will be appended with zeros accordingly.
   *
   * Unlike Number.prototype.toFixed, which returns exponential notation if a number is greater or equal to 1021, this method will always return normal notation.
   *
   * If dp is omitted, or is null or undefined, then the return value is simply the value in normal notation.
   * This is also unlike Number.prototype.toFixed, which returns the value to zero decimal places.
   *
   * @param dp Decimal places, 0 to 1e+6 inclusive
   * @param rm Rounding mode: 0 (down), 1 (half-up), 2 (half-even) or 3 (up).
   * @throws `!toFix!` if dp is invalid.
   */
  toFixed(dp?: number, rm?: number) {
    return this.value.toFixed(dp, rm)
  }

  /**
   * Returns a string representing the value of this Big number to the specified number of significant digits sd.
   *
   * If the value of this Big number has more digits than is specified by sd, the return value will be rounded to sd significant digits using rounding mode Big.RM.
   *
   * If the value of this Big number has fewer digits than is specified by sd, the return value will be appended with zeros accordingly.
   *
   * If sd is less than the number of digits necessary to represent the integer part of the value in normal notation, then exponential notation is used.
   *
   * If sd is omitted, or is null or undefined, then the return value is the same as .toString().
   *
   * @param sd Significant digits, 1 to 1e+6 inclusive
   * @param rm Rounding mode: 0 (down), 1 (half-up), 2 (half-even) or 3 (up).
   * @throws `!toPre!` if sd is invalid.
   */
  toPrecision(sd?: number, rm?: number) {
    return this.value.toPrecision(sd, rm)
  }

  /**
   * Returns a string representing the value of this Big number in exponential notation to a fixed number of decimal places dp.
   *
   * If the value of this Big number in exponential notation has more digits to the right of the decimal point than is specified by dp,
   * the return value will be rounded to dp decimal places using rounding mode Big.RM.
   *
   * If the value of this Big number in exponential notation has fewer digits to the right of the decimal point than is specified by dp, the return value will be appended with zeros accordingly.
   *
   * If dp is omitted, or is null or undefined, the number of digits after the decimal point defaults to the minimum number of digits necessary to represent the value exactly.
   *
   * @param dp Decimal places, 0 to 1e+6 inclusive
   * @param rm Rounding mode: 0 (down), 1 (half-up), 2 (half-even) or 3 (up).
   * @throws `!toFix!` if dp is invalid.
   */
  toExponential(dp: number, rm: number) {
    return this.value.toExponential(dp, rm)
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
