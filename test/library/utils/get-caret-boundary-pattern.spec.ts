import { InputAttributes, PatternFormatProps } from '../../../src';
import { getCaretBoundary } from '../../../src/pattern_format';

type ReturnType = boolean[];

type CaseType = {
  arguments: {
    formattedValue: string;
    props: { format: string; mask?: string; patternChar?: string };
  };
  expected: ReturnType;
};

type TestType = { label: string; cases: CaseType[] };

const testCases: TestType[] = [
  {
    label: 'Without prefix or suffix',
    cases: [
      {
        arguments: {
          formattedValue: '10(00) ____',
          props: { format: '##(##) ####', mask: '_', patternChar: '#' },
        },
        expected: [true, true, true, true, true, true, false, true, false, false, false, false],
      },
      {
        arguments: {
          formattedValue: '10-__',
          props: { format: '##-##', mask: '_', patternChar: '#' },
        },
        expected: [true, true, true, true, false, false],
      },
      {
        arguments: {
          formattedValue: '10-  ',
          props: { format: '##-##', patternChar: '#' },
        },
        expected: [true, true, true, true, false, false],
      },
    ],
  },
  {
    label: 'With prefix',
    cases: [
      {
        arguments: {
          formattedValue: '$ 1000 1000 ____',
          props: { format: '$ #### #### ####', mask: '_', patternChar: '#' },
        },
        expected: [
          false,
          false,
          true,
          true,
          true,
          true,
          true,
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
    ],
  },
  {
    label: 'With suffix',
    cases: [
      {
        arguments: {
          formattedValue: '1000 1000 ____ USD',
          props: { format: '#### #### #### USD', mask: '_', patternChar: '#' },
        },
        expected: [
          true,
          true,
          true,
          true,
          true,
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
          false,
          false,
          false,
          false,
        ],
      },
    ],
  },
  {
    label: 'With prefix and suffix',
    cases: [
      {
        arguments: {
          formattedValue: '+1 (999) 999 9 99 US',
          props: { format: '+1 (###) ### # ## US', mask: '_', patternChar: '#' },
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
          false,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
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
      '$formattedValue',
      ({ arguments: { formattedValue, props }, expected }) => {
        expect(
          getCaretBoundary(formattedValue, props as PatternFormatProps<InputAttributes>),
        ).toStrictEqual(expected);
      },
    );
  });
}
