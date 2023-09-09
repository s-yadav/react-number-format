import { getCaretBoundary } from '../../../src/numeric_format';
import { getCaretPosInBoundary } from '../../../src/utils';

type ReturnType = number;

type CaseType = {
  value: string;
  caretPos: number;
  boundary: boolean[];
  direction?: 'forward' | 'backward' | 'none';
  expected: ReturnType;
};

type TestType = { label: string; cases: CaseType[] };

const testCases: TestType[] = [
  {
    label: 'round down positive floats',
    cases: [
      {
        value: '1000',
        caretPos: 4,
        boundary: getCaretBoundary('1000', { prefix: '', suffix: '' }),
        direction: 'forward',
        expected: 4,
      },
      {
        value: '1000',
        caretPos: 2,
        boundary: getCaretBoundary('1000', { prefix: '', suffix: '' }),
        direction: 'backward',
        expected: 2,
      },
      {
        value: '$1000',
        caretPos: 5,
        boundary: getCaretBoundary('$1000', { prefix: '$', suffix: '' }),
        direction: 'forward',
        expected: 5,
      },
      {
        value: '100-10000 USD',
        caretPos: 6,
        boundary: getCaretBoundary('100-10000 USD', { prefix: '100-', suffix: ' USD' }),
        direction: 'backward',
        expected: 6,
      },
      {
        value: '100-10000 USD',
        caretPos: 6,
        boundary: getCaretBoundary('100-10000 USD', { prefix: '100-', suffix: ' USD' }),
        expected: 6,
      },
      {
        value: '',
        caretPos: 4,
        boundary: getCaretBoundary('', { prefix: '100-', suffix: ' USD' }),
        direction: 'forward',
        expected: 0,
      },
    ],
  },
];

for (const testCase of testCases) {
  describe(testCase.label, () => {
    test.each(testCase.cases)('$value', ({ value, caretPos, boundary, direction, expected }) => {
      expect(getCaretPosInBoundary(value, caretPos, boundary, direction)).toBe(expected);
    });
  });
}
