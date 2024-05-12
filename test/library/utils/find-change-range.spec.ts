import { findChangeRange } from '../../../src/utils';
import { TestCases } from './common';

type Range = { start: number; end: number };

type Expected = {
  from: Range;
  to: Range;
};

type Arguments = {
  prevValue: string;
  newValue: string;
};

describe('findChangeIndex', () => {
  const testCases: TestCases<Arguments, Expected>[] = [
    {
      label: 'negative floats',
      cases: [
        {
          arguments: {
            prevValue: '0.0345',
            newValue: '0.034',
          },
          expected: {
            from: { start: 5, end: 6 },
            to: { start: 5, end: 5 },
          },
        },
        {
          arguments: {
            prevValue: '0.0345',
            newValue: '0.03456789',
          },
          expected: {
            from: { start: 6, end: 6 },
            to: { start: 6, end: 10 },
          },
        },
        {
          arguments: {
            prevValue: '',
            newValue: '100-1000 USD',
          },
          expected: {
            from: { start: 0, end: 0 },
            to: { start: 0, end: 12 },
          },
        },
        {
          arguments: {
            prevValue: '100-1000 USD',
            newValue: '100-10000 USD',
          },
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
      test.each(testCase.cases)(
        '$arguments.prevValue',
        ({ arguments: { prevValue, newValue }, expected }) => {
          expect(findChangeRange(prevValue, newValue)).toEqual(expected);
        },
      );
    });
  }
});
