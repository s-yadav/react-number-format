import { findChangeRange, findChangedIndex } from '../../../src/utils';

type ReturnType = { start: number; end: number };

type CaseType = {
  prevValue: string;
  newValue: string;
  expected: ReturnType;
};

type TestType = { label: string; cases: CaseType[] };

describe('findChangeIndex', () => {
  const testCases: TestType[] = [
    {
      label: 'negative floats',
      cases: [
        { prevValue: '0.0345', newValue: '0.034', expected: { start: 5, end: 6 } },
        { prevValue: '0.0345', newValue: '0.03456789', expected: { start: 6, end: 6 } },
        { prevValue: '', newValue: '100-1000 USD', expected: { start: 0, end: 0 } },
        { prevValue: '100-1000 USD', newValue: '100-10000 USD', expected: { start: 8, end: 8 } },
      ],
    },
  ];

  for (const testCase of testCases) {
    describe(testCase.label, () => {
      test.each(testCase.cases)('%prevValue', ({ prevValue, newValue, expected }) => {
        expect(findChangedIndex(prevValue, newValue)).toEqual(expected);
      });
    });
  }
});
