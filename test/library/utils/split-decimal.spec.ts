import { splitDecimal } from '../../../src/utils';

type ReturnType = {
  beforeDecimal: string;
  afterDecimal: string;
  hasNegation: boolean;
  addNegation: boolean;
};

type CaseType = {
  numStr: string;
  allowNegative: boolean;
  expected: ReturnType;
};

type TestType = { label: string; cases: CaseType[] };

const testCases: TestType[] = [
  {
    label: 'allowNegative = true',
    cases: [
      {
        numStr: '100.40',
        allowNegative: true,
        expected: {
          beforeDecimal: '100',
          afterDecimal: '40',
          hasNegation: false,
          addNegation: false,
        },
      },
      {
        numStr: '-100.40',
        allowNegative: true,
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
        numStr: '100.40',
        allowNegative: false,
        expected: {
          beforeDecimal: '100',
          afterDecimal: '40',
          hasNegation: false,
          addNegation: false,
        },
      },
      {
        numStr: '-100.40',
        allowNegative: false,
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
        numStr: '-100',
        allowNegative: false,
        expected: {
          beforeDecimal: '100',
          afterDecimal: '',
          hasNegation: true,
          addNegation: false,
        },
      },
      {
        numStr: '-100',
        allowNegative: true,
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
    test.each(testCase.cases)('$numStr', ({ numStr, allowNegative, expected }) => {
      expect(splitDecimal(numStr, allowNegative)).toStrictEqual(expected);
    });
  });
}
