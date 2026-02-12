import { limitToScale } from '../../../src/utils';
import { TestCases } from './common';

type Expected = string;

type Arguments = {
  numStr: string;
  scale: number;
  fixedDecimalScale: boolean;
  minimumFractionDigits?: number;
};

const testCases: TestCases<Arguments, Expected>[] = [
  {
    label: 'fixedDecimalScale = true',
    cases: [
      {
        arguments: {
          numStr: '',
          scale: 2,
          fixedDecimalScale: true,
        },
        expected: '00',
      },
      {
        arguments: {
          numStr: '1234',
          scale: 0,
          fixedDecimalScale: true,
        },
        expected: '',
      },
      {
        arguments: {
          numStr: '1234',
          scale: 5,
          fixedDecimalScale: true,
        },
        expected: '12340',
      },
      {
        arguments: {
          numStr: '40',
          scale: 2,
          fixedDecimalScale: true,
        },
        expected: '40',
      },
      {
        arguments: {
          numStr: '40',
          scale: 5,
          fixedDecimalScale: true,
        },
        expected: '40000',
      },
    ],
  },
  {
    label: 'fixedDecimalScale = false',
    cases: [
      {
        arguments: {
          numStr: '',
          scale: 2,
          fixedDecimalScale: false,
        },
        expected: '',
      },
      {
        arguments: {
          numStr: '1234',
          scale: 0,
          fixedDecimalScale: false,
        },
        expected: '',
      },
      {
        arguments: {
          numStr: '1234',
          scale: 3,
          fixedDecimalScale: false,
        },
        expected: '123',
      },
      {
        arguments: {
          numStr: '1234',
          scale: 5,
          fixedDecimalScale: false,
        },
        expected: '1234',
      },
    ],
  },
  {
    label: 'minimumFractionDigits',
    cases: [
      {
        arguments: {
          numStr: '',
          scale: 8,
          fixedDecimalScale: false,
          minimumFractionDigits: 2,
        },
        expected: '00',
      },
      {
        arguments: {
          numStr: '1',
          scale: 8,
          fixedDecimalScale: false,
          minimumFractionDigits: 2,
        },
        expected: '10',
      },
      {
        arguments: {
          numStr: '1234',
          scale: 8,
          fixedDecimalScale: false,
          minimumFractionDigits: 2,
        },
        expected: '1234',
      },
      {
        arguments: {
          numStr: '12345678',
          scale: 8,
          fixedDecimalScale: false,
          minimumFractionDigits: 2,
        },
        expected: '12345678',
      },
      {
        arguments: {
          numStr: '123456789',
          scale: 8,
          fixedDecimalScale: false,
          minimumFractionDigits: 2,
        },
        expected: '12345678',
      },
      {
        arguments: {
          numStr: '',
          scale: 4,
          fixedDecimalScale: false,
          minimumFractionDigits: 4,
        },
        expected: '0000',
      },
    ],
  },
];

for (const testCase of testCases) {
  describe(testCase.label, () => {
    test.each(testCase.cases)(
      '$arguments.numStr -> $expected',
      ({ arguments: { numStr, scale, fixedDecimalScale, minimumFractionDigits }, expected }) => {
        expect(limitToScale(numStr, scale, fixedDecimalScale, minimumFractionDigits)).toBe(
          expected,
        );
      },
    );
  });
}
