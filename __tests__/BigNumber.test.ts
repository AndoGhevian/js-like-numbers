import BigNumber from 'BigNumber'

describe('BigInt constructor', () => {
  it('Should work for string and BigNumber arguments', () => {
    expect(String(new BigNumber('1')['value'])).toBe('1')
    expect(String(new BigNumber('-0')['value'])).toBe('-0')
    expect(String(new BigNumber('0')['value'])).toBe('0')
  })
})