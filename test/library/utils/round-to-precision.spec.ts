import { roundToPrecision } from '../../../src/utils';

describe('When fixedDecimalScale = false', () => {
  const testCases = [
    [
      'positive floats',
      [
        ['0.0304000', 3, false, '0.030'],
        ['0.03049993', 7, false, '0.0304999'],
        ['0.03049998', 7, false, '0.0305000'],
        ['0.03049998', 1, false, '0.0'],
        ['0.03', 3, false, '0.03'],
        ['0.09', 0, false, '0'],
        ['0.9', 0, false, '1'],
      ],
    ],
    [
      'negative floats',
      [
        ['-0.0304000', 3, false, '-0.030'],
        ['-0.03', 5, false, '-0.03'],
      ],
    ],
    [
      'integers',
      [
        ['102', 3, false, '102'],
        ['-102', 3, false, '-102'],
      ],
    ],
    // TODO
    // [
    //   'exponents',
    //   [
    //     ['1e2', 3, false, '102'],
    //   ],
    // ],
  ];

  for (const testCase of testCases) {
    describe(testCase[0], () => {
      test.each(testCase[1])('%s', (floatStr, decimalScale, fixedDecimalScale, expected) => {
        expect(roundToPrecision(floatStr, decimalScale, fixedDecimalScale)).toBe(expected);
      });
    });
  }
});

describe('When fixedDecimalScale = true', () => {
  const testCases = [
    [
      'positive floats',
      [
        ['0.0304000', 3, true, '0.030'],
        ['0.03049993', 7, true, '0.0304999'],
        ['0.03049998', 7, true, '0.0305000'],
        ['0.03049998', 5, true, '0.03050'],
        ['0.03049998', 7, true, '0.0305000'],
        ['0.03049998', 1, true, '0.0'],
        ['0.09', 0, true, '0'],
        ['0.9', 0, true, '1'],
      ],
    ],
    [
      'negative floats',
      [
        ['-0.0304000', 3, true, '-0.030'],
        ['-0.03', 5, true, '-0.03000'],
      ],
    ],
    [
      'integers',
      [
        ['102', 3, true, '102.000'],
        ['102.00', 3, true, '102.000'],
        ['-102', 3, true, '-102.000'],
      ],
    ],
  ];

  for (const testCase of testCases) {
    describe(testCase[0], () => {
      test.each(testCase[1])('%s', (floatStr, decimalScale, fixedDecimalScale, expected) => {
        expect(roundToPrecision(floatStr, decimalScale, fixedDecimalScale)).toBe(expected);
      });
    });
  }
});
