import { applyThousandSeparator } from '../../../src/utils';
import { TestCases } from './common';

type Expected = string;

type Arguments = {
  str: string;
  thousandSeparator: string;
  thousandsGroupStyle: string;
};

const testCases: TestCases<Arguments, Expected>[] = [
  {
    label: 'thousandGroupStyle = thousand',
    cases: [
      {
        arguments: {
          str: '10040',
          thousandSeparator: ',',
          thousandsGroupStyle: 'thousand',
        },
        expected: '10,040',
      },
      {
        arguments: {
          str: '-1000.40',
          thousandSeparator: ',',
          thousandsGroupStyle: 'thousand',
        },
        expected: '-1,000.40',
      },
      {
        arguments: {
          str: '-100.40',
          thousandSeparator: ',',
          thousandsGroupStyle: 'thousand',
        },
        expected: '-100.40',
      },
    ],
  },
  {
    label: 'thousandGroupStyle = lakh',
    cases: [
      {
        arguments: {
          str: '1004000',
          thousandSeparator: ',',
          thousandsGroupStyle: 'lakh',
        },
        expected: '10,04,000',
      },
      {
        arguments: {
          str: '100400.5',
          thousandSeparator: ',',
          thousandsGroupStyle: 'lakh',
        },
        expected: '1,00,400.5',
      },
      {
        arguments: {
          str: '-100400.5',
          thousandSeparator: ',',
          thousandsGroupStyle: 'lakh',
        },
        expected: '-1,00,400.5',
      },
      {
        arguments: {
          str: '-100.40',
          thousandSeparator: ',',
          thousandsGroupStyle: 'lakh',
        },
        expected: '-100.40',
      },
      // TODO?
      // {
      //   str: '-100,400.5',
      //   thousandSeparator: ',',
      //   thousandsGroupStyle: 'lakh',
      //   expected: '-1,00,400.5',
      // },
    ],
  },
  {
    label: 'thousandGroupStyle = wan',
    cases: [
      {
        arguments: {
          str: '123456789',
          thousandSeparator: ',',
          thousandsGroupStyle: 'wan',
        },
        expected: '1,2345,6789',
      },
      {
        arguments: {
          str: '-12345.67',
          thousandSeparator: ',',
          thousandsGroupStyle: 'wan',
        },
        expected: '-1,2345.67',
      },
    ],
  },
  {
    label: 'thousandGroupStyle = none',
    cases: [
      {
        arguments: {
          str: '1000',
          thousandSeparator: ',',
          thousandsGroupStyle: 'none',
        },
        expected: '1,000',
      },
      {
        arguments: {
          str: '-12345678.90',
          thousandSeparator: ',',
          thousandsGroupStyle: 'none',
        },
        expected: '-12,345,678.90',
      },
    ],
  },
];

for (const testCase of testCases) {
  describe(testCase.label, () => {
    test.each(testCase.cases)(
      '$arguments.str',
      ({ arguments: { str, thousandSeparator, thousandsGroupStyle }, expected }) => {
        expect(applyThousandSeparator(str, thousandSeparator, thousandsGroupStyle)).toBe(expected);
      },
    );
  });
}
