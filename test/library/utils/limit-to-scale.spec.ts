import { limitToScale } from '../../../src/utils';

type ReturnType = string;

type CaseType = {
  numStr: string;
  scale: number;
  fixedDecimalScale: boolean;
  expected: ReturnType;
};

type TestType = { label: string; cases: CaseType[] };

const testCases: TestType[] = [
  {
    label: 'fixedDecimalScale = true',
    cases: [
      {
        numStr: '',
        scale: 2,
        fixedDecimalScale: true,
        expected: '00',
      },
      {
        numStr: '1234',
        scale: 0,
        fixedDecimalScale: true,
        expected: '',
      },
      {
        numStr: '1234',
        scale: 5,
        fixedDecimalScale: true,
        expected: '12340',
      },
      {
        numStr: '40',
        scale: 2,
        fixedDecimalScale: true,
        expected: '40',
      },
      {
        numStr: '40',
        scale: 5,
        fixedDecimalScale: true,
        expected: '40000',
      },
    ],
  },
  {
    label: 'fixedDecimalScale = false',
    cases: [
      {
        numStr: '',
        scale: 2,
        fixedDecimalScale: false,
        expected: '',
      },
      {
        numStr: '1234',
        scale: 0,
        fixedDecimalScale: false,
        expected: '',
      },
      {
        numStr: '1234',
        scale: 3,
        fixedDecimalScale: false,
        expected: '123',
      },
      {
        numStr: '1234',
        scale: 5,
        fixedDecimalScale: false,
        expected: '1234',
      },
    ],
  },
];

for (const testCase of testCases) {
  describe.only(testCase.label, () => {
    test.each(testCase.cases)(
      '$numStr -> $expected',
      ({ numStr, scale, fixedDecimalScale, expected }) => {
        expect(limitToScale(numStr, scale, fixedDecimalScale)).toBe(expected);
      },
    );
  });
}
