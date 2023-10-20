import { toNumericString } from '../../../src/utils';

describe('Handle exponential notation', () => {
  const testCases = [
    [
      'positive exponents',
      [
        [0.1e20, '10000000000000000000'],
        [1e24, '1000000000000000000000000'],
        [1.2344e20, '123440000000000000000'],
        [1e4, '10000'],
      ],
    ],
    [
      'negative exponents',
      [
        [1e-20, '0.00000000000000000001'],
        [1.2344e-20, '0.000000000000000000012344'],
        [1e-4, '0.0001'],
      ],
    ],
    [
      'negative numbers with exponents',
      [
        [-1e4, '-10000'],
        [-1e-4, '-0.0001'],
      ],
    ],
  ];

  for (const testCase of testCases) {
    describe(testCase[0], () => {
      test.each(testCase[1])('%d', (num, expected) => {
        expect(toNumericString(num)).toBe(expected);
      });
    });
  }
});
