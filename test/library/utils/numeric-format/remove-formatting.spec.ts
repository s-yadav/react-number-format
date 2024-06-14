import { removeFormatting } from '../../../../src/numeric_format';
import { ChangeMeta, InputAttributes, NumericFormatProps } from '../../../../src/types';
import { TestCases } from '../common';

type Expected = string;

type Arguments = {
  value: string;
  changeMeta: ChangeMeta;
  props: NumericFormatProps<InputAttributes>;
};

describe('removeFormatting', () => {
  const defaultProps = { allowNegative: true, decimalScale: 2, thousandSeparator: ',' };

  const testCases: TestCases<Arguments, Expected>[] = [
    {
      label: 'with prefix and suffix',
      cases: [
        {
          arguments: {
            value: '100-1000 USD',
            changeMeta: { from: { start: 0, end: 0 }, to: { start: 0, end: 12 }, lastValue: '' },
            props: { ...defaultProps, prefix: '100-', suffix: '000 USD' },
          },
          expected: '1',
        },
        {
          arguments: {
            value: '100-10000 USD',
            changeMeta: {
              from: { start: 8, end: 8 },
              to: { start: 8, end: 9 },
              lastValue: '100-10000 USD',
            },
            props: { ...defaultProps, prefix: '100-', suffix: '000 USD' },
          },
          expected: '10',
        },
      ],
    },
  ];

  for (const testCase of testCases) {
    describe(testCase.label, () => {
      test.each(testCase.cases)(
        '%arguments.value',
        ({ arguments: { value, changeMeta, props }, expected }) => {
          expect(removeFormatting(value, changeMeta, props)).toBe(expected);
        },
      );
    });
  }
});
