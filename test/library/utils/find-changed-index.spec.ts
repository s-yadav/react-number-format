import { findChangeRange, findChangedIndex } from '../../../src/utils';
import { TestCases } from './common';

type Expected = { start: number; end: number };

type Arguments = {
  prevValue: string;
  newValue: string;
};

describe('findChangeIndex', () => {
  const testCases: TestCases<Arguments, Expected>[] = [
    {
      label: 'negative floats',
      cases: [
        { arguments: { prevValue: '0.0345', newValue: '0.034' }, expected: { start: 5, end: 6 } },
        {
          arguments: { prevValue: '0.0345', newValue: '0.03456789' },
          expected: { start: 6, end: 6 },
        },
        { arguments: { prevValue: '', newValue: '100-1000 USD' }, expected: { start: 0, end: 0 } },
        {
          arguments: { prevValue: '100-1000 USD', newValue: '100-10000 USD' },
          expected: { start: 8, end: 8 },
        },
      ],
    },
  ];

  for (const testCase of testCases) {
    describe(testCase.label, () => {
      test.each(testCase.cases)(
        '%arguments.prevValue',
        ({ arguments: { prevValue, newValue }, expected }) => {
          expect(findChangedIndex(prevValue, newValue)).toEqual(expected);
        },
      );
    });
  }
});
