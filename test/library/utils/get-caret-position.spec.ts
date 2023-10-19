import { getCaretBoundary } from '../../../src/numeric_format';
import { charIsNumber, getCaretPosition } from '../../../src/utils';
import { TestCases } from './common';

const isValidInputCharacter = (inputChar: string) => {
  if (inputChar === '.') return true;
  return charIsNumber(inputChar);
};

type Expected = number;

type Arguments = {
  newFormattedValue: string;
  lastFormattedValue: string;
  curValue: string;
  curCaretPos: number;
  boundary: boolean[];
  isValidInputCharacter: (char: string) => boolean;
};

const testCases: TestCases<Arguments, Expected>[] = [
  {
    label: 'round down positive floats',
    cases: [
      {
        arguments: {
          newFormattedValue: '1000',
          lastFormattedValue: '10000',
          curValue: '1000',
          curCaretPos: 4,
          // boundary: [true, true, true, true, true],
          boundary: getCaretBoundary('1000', { prefix: '', suffix: '' }),
          isValidInputCharacter: isValidInputCharacter,
        },
        expected: 4,
      },
      {
        arguments: {
          newFormattedValue: '1000',
          lastFormattedValue: '10000',
          curValue: '1000',
          curCaretPos: 2,
          // boundary: [true, true, true, true, true],
          boundary: getCaretBoundary('1000', { prefix: '', suffix: '' }),
          isValidInputCharacter: isValidInputCharacter,
        },
        expected: 2,
      },
      {
        arguments: {
          newFormattedValue: '$1000',
          lastFormattedValue: '$10000',
          curValue: '$10000',
          curCaretPos: 5,
          boundary: getCaretBoundary('$1000', { prefix: '$', suffix: '' }),
          isValidInputCharacter: isValidInputCharacter,
        },
        expected: 5,
      },
      {
        arguments: {
          newFormattedValue: '100-10000 USD',
          lastFormattedValue: '100-1000 USD',
          curValue: '100-10000 USD',
          curCaretPos: 6,
          boundary: getCaretBoundary('100-10000 USD', { prefix: '100-', suffix: ' USD' }),
          isValidInputCharacter: isValidInputCharacter,
        },
        expected: 6,
      },
      {
        arguments: {
          newFormattedValue: '',
          lastFormattedValue: '100-1000 USD',
          curValue: '100-000 USD',
          curCaretPos: 4,
          boundary: getCaretBoundary('100-10000 USD', { prefix: '100-', suffix: ' USD' }),
          isValidInputCharacter: isValidInputCharacter,
        },
        expected: 0,
      },
    ],
  },
];

for (const testCase of testCases) {
  describe(testCase.label, () => {
    test.each(testCase.cases)(
      '$arguments.newFormattedValue',
      ({
        arguments: {
          newFormattedValue,
          lastFormattedValue,
          curValue,
          curCaretPos,
          boundary,
          isValidInputCharacter,
        },
        expected,
      }) => {
        expect(
          getCaretPosition(
            newFormattedValue,
            lastFormattedValue,
            curValue,
            curCaretPos,
            boundary,
            isValidInputCharacter,
          ),
        ).toBe(expected);
      },
    );
  });
}
