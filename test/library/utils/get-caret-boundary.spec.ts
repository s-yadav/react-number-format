import { getCaretBoundary } from '../../../src/numeric_format';
import { TestCases } from './common';

type Arguments = {
  formattedValue: string;
  props: { prefix?: string; suffix?: string };
};

type Expected = boolean[];

const testCases: TestCases<Arguments, Expected>[] = [
  {
    label: 'No prefix or suffix',
    cases: [
      {
        arguments: {
          formattedValue: '1000',
          props: { prefix: '', suffix: '' },
        },
        expected: [true, true, true, true, true],
      },
    ],
  },
  {
    label: 'Only prefix',
    cases: [
      {
        arguments: {
          formattedValue: '$1000',
          props: { prefix: '$', suffix: '' },
        },
        expected: [false, true, true, true, true, true],
      },
    ],
  },
  {
    label: 'Only suffix',
    cases: [
      {
        arguments: {
          formattedValue: '1000 USD',
          props: { prefix: '', suffix: ' USD' },
        },
        expected: [true, true, true, true, true, false, false, false, false],
      },
      {
        arguments: {
          formattedValue: '-1000 USD',
          props: { prefix: '', suffix: ' USD' },
        },
        expected: [false, true, true, true, true, true, false, false, false, false],
      },
    ],
  },
  {
    label: 'With prefix and suffix',
    cases: [
      {
        arguments: {
          formattedValue: '100-10000 USD',
          props: { prefix: '100-', suffix: ' USD' },
        },
        expected: [
          false,
          false,
          false,
          false,
          true,
          true,
          true,
          true,
          true,
          true,
          false,
          false,
          false,
          false,
        ],
      },
      {
        arguments: {
          formattedValue: '100-10000 USD',
          props: { prefix: '100-', suffix: '000 USD' },
        },
        expected: [
          false,
          false,
          false,
          false,
          true,
          true,
          true,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
        ],
      },
    ],
  },
];

for (const testCase of testCases) {
  describe(testCase.label, () => {
    test.each(testCase.cases)(
      '$arguments.formattedValue',
      ({ arguments: { formattedValue, props }, expected }) => {
        expect(getCaretBoundary(formattedValue, props)).toStrictEqual(expected);
      },
    );
  });
}
