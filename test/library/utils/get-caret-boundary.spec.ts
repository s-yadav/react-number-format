import { getCaretBoundary } from '../../../src/numeric_format';

type ReturnType = boolean[];

type CaseType = {
  formattedValue: string;
  props: { prefix?: string; suffix?: string };
  expected: ReturnType;
};

type TestType = { label: string; cases: CaseType[] };

const testCases: TestType[] = [
  {
    label: 'No prefix or suffix',
    cases: [
      {
        formattedValue: '1000',
        props: { prefix: '', suffix: '' },
        expected: [true, true, true, true, true],
      },
    ],
  },
  {
    label: 'Only prefix',
    cases: [
      {
        formattedValue: '$1000',
        props: { prefix: '$', suffix: '' },
        expected: [false, true, true, true, true, true],
      },
    ],
  },
  {
    label: 'Only suffix',
    cases: [
      {
        formattedValue: '1000 USD',
        props: { prefix: '', suffix: ' USD' },
        expected: [true, true, true, true, true, false, false, false, false],
      },
      {
        formattedValue: '-1000 USD',
        props: { prefix: '', suffix: ' USD' },
        expected: [false, true, true, true, true, true, false, false, false, false],
      },
    ],
  },
  {
    label: 'With prefix and suffix',
    cases: [
      {
        formattedValue: '100-10000 USD',
        props: { prefix: '100-', suffix: ' USD' },
        expected: [
          false,
          false,
          false,
          false,
          true,
          true,
          true,
          true,
          true,
          true,
          false,
          false,
          false,
          false,
        ],
      },
      {
        formattedValue: '100-10000 USD',
        props: { prefix: '100-', suffix: '000 USD' },
        expected: [
          false,
          false,
          false,
          false,
          true,
          true,
          true,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
        ],
      },
    ],
  },
];

for (const testCase of testCases) {
  describe(testCase.label, () => {
    test.each(testCase.cases)('$formattedValue', ({ formattedValue, props, expected }) => {
      expect(getCaretBoundary(formattedValue, props)).toStrictEqual(expected);
    });
  });
}
