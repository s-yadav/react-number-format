import {toNumericString} from '../../src/utils';

describe('Test toNumericString', () => {
  it('should handle positive exponents numbers', () => {
    expect(toNumericString(0.1e20)).toEqual('10000000000000000000');
    expect(toNumericString(1e24)).toEqual('1000000000000000000000000');
    expect(toNumericString(1.2344e20)).toEqual('123440000000000000000');
  });

  it('should handle negative exponents numbers', () => {
    expect(toNumericString(1e-20)).toEqual('0.00000000000000000001');
    expect(toNumericString(1.2344e-20)).toEqual('0.000000000000000000012344');
  });

  it('should handle smaller exponents numbers', () => {
    expect(toNumericString(1e4)).toEqual('10000');
    expect(toNumericString(1e-4)).toEqual('0.0001');
  });

  it('should handle negative numbers', () => {
    expect(toNumericString(-1e4)).toEqual('-10000');
    expect(toNumericString(-1e-4)).toEqual('-0.0001');
  });
});
