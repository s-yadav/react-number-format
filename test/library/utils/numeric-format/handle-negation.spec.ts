import { handleNegation } from '../../../../src/numeric_format';
import { TestCases } from '../common';

type Expected = string;

type Arguments = {
  value: string;
  allowNegative: boolean;
};

describe('handleNegation', () => {
  const testCases: TestCases<Arguments, Expected>[] = [
    {
      label: 'negative integers',
      cases: [
        { arguments: { value: '-10-1000', allowNegative: true }, expected: '-10' },
        { arguments: { value: '-110', allowNegative: false }, expected: '110' },
      ],
    },
    {
      label: 'negative floats',
      cases: [
        { arguments: { value: '-10.1', allowNegative: true }, expected: '-10.1' },
        { arguments: { value: '-110.100', allowNegative: false }, expected: '110.100' },
      ],
    },
  ];

  for (const testCase of testCases) {
    describe.only(testCase.label, () => {
      test.each(testCase.cases)(
        '%arguments.value',
        ({ arguments: { value, allowNegative }, expected }) => {
          expect(handleNegation(value, allowNegative)).toEqual(expected);
        },
      );
    });
  }
});
