import { fixLeadingZero } from '../../../src/utils';

type ReturnType = string;

type CaseType = {
  numStr: string;
  expected: ReturnType;
};

type TestType = { label: string; cases: CaseType[] };

const testCases: TestType[] = [
  {
    label: 'fixedDecimalScale = true',
    cases: [
      {
        numStr: '-0100',
        expected: '-100',
      },
      {
        numStr: '00100200',
        expected: '100200',
      },
      {
        numStr: '00000000100200',
        expected: '100200',
      },
      {
        numStr: '00100200.000',
        expected: '100200.000',
      },
      {
        numStr: '00100200.345',
        expected: '100200.345',
      },
      {
        numStr: '-00100200.345',
        expected: '-100200.345',
      },
      {
        numStr: '10002000',
        expected: '10002000',
      },
      {
        numStr: '-10002000',
        expected: '-10002000',
      },
      // TODO
      {
        numStr: '--10002000',
        expected: '-10002000',
      },
      {
        numStr: '--0010002000',
        expected: '-10002000',
      },
      {
        numStr: '--00100200.345',
        expected: '-100200.345',
      },
    ],
  },
];

for (const testCase of testCases) {
  describe.only(testCase.label, () => {
    test.each(testCase.cases)('$numStr -> $expected', ({ numStr, expected }) => {
      expect(fixLeadingZero(numStr)).toBe(expected);
    });
  });
}
