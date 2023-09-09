import { applyThousandSeparator } from '../../../src/utils';

type ReturnType = string;

type CaseType = {
  str: string;
  thousandSeparator: string;
  thousandsGroupStyle: string;
  expected: ReturnType;
};

type TestType = { label: string; cases: CaseType[] };

const testCases: TestType[] = [
  {
    label: 'thousandGroupStyle = thousand',
    cases: [
      {
        str: '10040',
        thousandSeparator: ',',
        thousandsGroupStyle: 'thousand',
        expected: '10,040',
      },
      {
        str: '-1000.40',
        thousandSeparator: ',',
        thousandsGroupStyle: 'thousand',
        expected: '-1,000.40',
      },
      {
        str: '-100.40',
        thousandSeparator: ',',
        thousandsGroupStyle: 'thousand',
        expected: '-100.40',
      },
    ],
  },
  {
    label: 'thousandGroupStyle = lakh',
    cases: [
      {
        str: '1004000',
        thousandSeparator: ',',
        thousandsGroupStyle: 'lakh',
        expected: '10,04,000',
      },
      {
        str: '100400.5',
        thousandSeparator: ',',
        thousandsGroupStyle: 'lakh',
        expected: '1,00,400.5',
      },
      {
        str: '-100400.5',
        thousandSeparator: ',',
        thousandsGroupStyle: 'lakh',
        expected: '-1,00,400.5',
      },
      {
        str: '-100.40',
        thousandSeparator: ',',
        thousandsGroupStyle: 'lakh',
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
        str: '123456789',
        thousandSeparator: ',',
        thousandsGroupStyle: 'wan',
        expected: '1,2345,6789',
      },
      {
        str: '-12345.67',
        thousandSeparator: ',',
        thousandsGroupStyle: 'wan',
        expected: '-1,2345.67',
      },
    ],
  },
  {
    label: 'thousandGroupStyle = none',
    cases: [
      {
        str: '1000',
        thousandSeparator: ',',
        thousandsGroupStyle: 'none',
        expected: '1,000',
      },
      {
        str: '-12345678.90',
        thousandSeparator: ',',
        thousandsGroupStyle: 'none',
        expected: '-12,345,678.90',
      },
    ],
  },
];

for (const testCase of testCases) {
  describe(testCase.label, () => {
    test.each(testCase.cases)(
      '$str',
      ({ str, thousandSeparator, thousandsGroupStyle, expected }) => {
        expect(applyThousandSeparator(str, thousandSeparator, thousandsGroupStyle)).toBe(expected);
      },
    );
  });
}
