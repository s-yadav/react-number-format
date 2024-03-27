import { stripNegation } from '../../../../src/numeric_format';
import { TestCases } from '../common';

type Expected = {
  value: string;
  start: number;
  end: number;
  hasNegation: boolean;
};

type Arguments = {
  value: string;
  start: number;
  end: number;
  prefix: string;
  suffix: string;
};

describe('stripNegation', () => {
  const testCases: TestCases<Arguments, Expected>[] = [
    {
      label: 'negative floats',
      cases: [
        {
          arguments: { value: '0.0345', start: 0, end: 6, prefix: '100-', suffix: '1000 USD' },
          expected: { value: '0.0345', start: 0, end: 6, hasNegation: false },
        },
        {
          arguments: { value: '-0.0345', start: 0, end: 6, prefix: '100-', suffix: '1000 USD' },
          expected: { value: '0.0345', start: 0, end: 1, hasNegation: true },
        },
        {
          arguments: {
            value: '100-10000 USD',
            start: 8,
            end: 8,
            prefix: '100-',
            suffix: '1000 USD',
          },
          expected: { value: '100-10000 USD', start: 8, end: 8, hasNegation: false },
        },
      ],
    },
  ];

  for (const testCase of testCases) {
    describe(testCase.label, () => {
      test.each(testCase.cases)(
        '%arguments.value',
        ({ arguments: { value, start, end, prefix, suffix }, expected }) => {
          expect(stripNegation(value, start, end, prefix, suffix)).toEqual(expected);
        },
      );
    });
  }
});
