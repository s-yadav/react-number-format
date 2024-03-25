import { toNumericString } from '../../../src/utils';
import { TestCases } from './common';

type Expected = string;

type Arguments = { num: number };

describe('Handle exponential notation', () => {
  const testCases: TestCases<Arguments, Expected>[] = [
    {
      label: 'positive exponents',
      cases: [
        { arguments: { num: 0.1e20 }, expected: '10000000000000000000' },
        { arguments: { num: 1e24 }, expected: '1000000000000000000000000' },
        { arguments: { num: 1.2344e20 }, expected: '123440000000000000000' },
        { arguments: { num: 1e4 }, expected: '10000' },
      ],
    },
    {
      label: 'negative exponents',
      cases: [
        { arguments: { num: 1e-20 }, expected: '0.00000000000000000001' },
        { arguments: { num: 1.2344e-20 }, expected: '0.000000000000000000012344' },
        { arguments: { num: 1e-4 }, expected: '0.0001' },
      ],
    },
    {
      label: 'negative numbers with exponents',
      cases: [
        { arguments: { num: -1e4 }, expected: '-10000' },
        { arguments: { num: -1e-4 }, expected: '-0.0001' },
      ],
    },
  ];

  for (const testCase of testCases) {
    describe(testCase.label, () => {
      test.each(testCase.cases)('%arguments.num', ({ arguments: { num }, expected }) => {
        expect(toNumericString(num)).toBe(expected);
      });
    });
  }
});
