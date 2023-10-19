import { getCaretBoundary } from '../../../src/numeric_format';
import { getCaretPosInBoundary } from '../../../src/utils';
import { TestCases } from './common';

type Expected = number;

type Arguments = {
  value: string;
  caretPos: number;
  boundary: boolean[];
  direction?: 'forward' | 'backward' | 'none';
};

const testCases: TestCases<Arguments, Expected>[] = [
  {
    label: 'round down positive floats',
    cases: [
      {
        arguments: {
          value: '1000',
          caretPos: 4,
          boundary: getCaretBoundary('1000', { prefix: '', suffix: '' }),
          direction: 'forward',
        },
        expected: 4,
      },
      {
        arguments: {
          value: '1000',
          caretPos: 2,
          boundary: getCaretBoundary('1000', { prefix: '', suffix: '' }),
          direction: 'backward',
        },
        expected: 2,
      },
      {
        arguments: {
          value: '$1000',
          caretPos: 5,
          boundary: getCaretBoundary('$1000', { prefix: '$', suffix: '' }),
          direction: 'forward',
        },
        expected: 5,
      },
      {
        arguments: {
          value: '100-10000 USD',
          caretPos: 6,
          boundary: getCaretBoundary('100-10000 USD', { prefix: '100-', suffix: ' USD' }),
          direction: 'backward',
        },
        expected: 6,
      },
      {
        arguments: {
          value: '100-10000 USD',
          caretPos: 6,
          boundary: getCaretBoundary('100-10000 USD', { prefix: '100-', suffix: ' USD' }),
        },
        expected: 6,
      },
      {
        arguments: {
          value: '',
          caretPos: 4,
          boundary: getCaretBoundary('', { prefix: '100-', suffix: ' USD' }),
          direction: 'forward',
        },
        expected: 0,
      },
    ],
  },
];

for (const testCase of testCases) {
  describe(testCase.label, () => {
    test.each(testCase.cases)(
      '$arguments.value',
      ({ arguments: { value, caretPos, boundary, direction }, expected }) => {
        expect(getCaretPosInBoundary(value, caretPos, boundary, direction)).toBe(expected);
      },
    );
  });
}
