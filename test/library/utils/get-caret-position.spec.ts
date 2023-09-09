import { getCaretBoundary } from '../../../src/numeric_format';
import { charIsNumber, getCaretPosition } from '../../../src/utils';

const isValidInputCharacter = (inputChar: string) => {
  if (inputChar === '.') return true;
  return charIsNumber(inputChar);
};

type ReturnType = number;

type CaseType = {
  newFormattedValue: string;
  lastFormattedValue: string;
  curValue: string;
  curCaretPos: number;
  boundary: boolean[];
  isValidInputCharacter: (char: string) => boolean;
  expected: ReturnType;
};

type TestType = { label: string; cases: CaseType[] };

const testCases: TestType[] = [
  {
    label: 'round down positive floats',
    cases: [
      {
        newFormattedValue: '1000',
        lastFormattedValue: '10000',
        curValue: '1000',
        curCaretPos: 4,
        // boundary: [true, true, true, true, true],
        boundary: getCaretBoundary('1000', { prefix: '', suffix: '' }),
        isValidInputCharacter: isValidInputCharacter,
        expected: 4,
      },
      {
        newFormattedValue: '1000',
        lastFormattedValue: '10000',
        curValue: '1000',
        curCaretPos: 2,
        // boundary: [true, true, true, true, true],
        boundary: getCaretBoundary('1000', { prefix: '', suffix: '' }),
        isValidInputCharacter: isValidInputCharacter,
        expected: 2,
      },
      {
        newFormattedValue: '$1000',
        lastFormattedValue: '$10000',
        curValue: '$10000',
        curCaretPos: 5,
        boundary: getCaretBoundary('$1000', { prefix: '$', suffix: '' }),
        isValidInputCharacter: isValidInputCharacter,
        expected: 5,
      },
      {
        newFormattedValue: '100-10000 USD',
        lastFormattedValue: '100-1000 USD',
        curValue: '100-10000 USD',
        curCaretPos: 6,
        boundary: getCaretBoundary('100-10000 USD', { prefix: '100-', suffix: ' USD' }),
        isValidInputCharacter: isValidInputCharacter,
        expected: 6,
      },
      {
        newFormattedValue: '',
        lastFormattedValue: '100-1000 USD',
        curValue: '100-000 USD',
        curCaretPos: 4,
        boundary: getCaretBoundary('100-10000 USD', { prefix: '100-', suffix: ' USD' }),
        isValidInputCharacter: isValidInputCharacter,
        expected: 0,
      },
    ],
  },
];

for (const testCase of testCases) {
  describe(testCase.label, () => {
    test.each(testCase.cases)(
      '$newFormattedValue',
      ({
        newFormattedValue,
        lastFormattedValue,
        curValue,
        curCaretPos,
        boundary,
        isValidInputCharacter,
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
