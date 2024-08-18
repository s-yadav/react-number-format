import { splitDecimal } from '../../../src/utils';
import { TestCases } from './common';

type Expected = {
  beforeDecimal: string;
  afterDecimal: string;
  hasNegation: boolean;
  addNegation: boolean;
};

type Arguments = {
  numStr: string;
  allowNegative: boolean;
};

const testCases: TestCases<Arguments, Expected>[] = [
  {
    label: 'allowNegative = true',
    cases: [
      {
        arguments: {
          numStr: '100.40',
          allowNegative: true,
        },
        expected: {
          beforeDecimal: '100',
          afterDecimal: '40',
          hasNegation: false,
          addNegation: false,
        },
      },
      {
        arguments: {
          numStr: '-100.40',
          allowNegative: true,
        },
        expected: {
          beforeDecimal: '100',
          afterDecimal: '40',
          hasNegation: true,
          addNegation: true,
        },
      },
    ],
  },
  {
    label: 'allowNegative = false',
    cases: [
      {
        arguments: {
          numStr: '100.40',
          allowNegative: false,
        },
        expected: {
          beforeDecimal: '100',
          afterDecimal: '40',
          hasNegation: false,
          addNegation: false,
        },
      },
      {
        arguments: {
          numStr: '-100.40',
          allowNegative: false,
        },
        expected: {
          beforeDecimal: '100',
          afterDecimal: '40',
          hasNegation: true,
          addNegation: false,
        },
      },
    ],
  },
  {
    label: 'Non-float values',
    cases: [
      {
        arguments: {
          numStr: '-100',
          allowNegative: false,
        },
        expected: {
          beforeDecimal: '100',
          afterDecimal: '',
          hasNegation: true,
          addNegation: false,
        },
      },
      {
        arguments: {
          numStr: '-100',
          allowNegative: true,
        },
        expected: {
          beforeDecimal: '100',
          afterDecimal: '',
          hasNegation: true,
          addNegation: true,
        },
      },
    ],
  },
];

for (const testCase of testCases) {
  describe(testCase.label, () => {
    test.each(testCase.cases)(
      '$arguments.numStr',
      ({ arguments: { numStr, allowNegative }, expected }) => {
        expect(splitDecimal(numStr, allowNegative)).toStrictEqual(expected);
      },
    );
  });
}
