import { findChangeRange } from '../../../src/utils';

type Range = { start: number; end: number };

type ReturnType = {
  from: Range;
  to: Range;
};

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
        {
          prevValue: '0.0345',
          newValue: '0.034',
          expected: {
            from: { start: 5, end: 6 },
            to: { start: 5, end: 5 },
          },
        },
        {
          prevValue: '0.0345',
          newValue: '0.03456789',
          expected: {
            from: { start: 6, end: 6 },
            to: { start: 6, end: 10 },
          },
        },
        {
          prevValue: '',
          newValue: '100-1000 USD',
          expected: {
            from: { start: 0, end: 0 },
            to: { start: 0, end: 12 },
          },
        },
        {
          prevValue: '100-1000 USD',
          newValue: '100-10000 USD',
          expected: {
            from: { start: 8, end: 8 },
            to: { start: 8, end: 9 },
          },
        },
      ],
    },
  ];

  for (const testCase of testCases) {
    describe(testCase.label, () => {
      test.each(testCase.cases)('$prevValue', ({ prevValue, newValue, expected }) => {
        expect(findChangeRange(prevValue, newValue)).toEqual(expected);
      });
    });
  }
});
