import { roundToPrecision } from '../../../src/utils';
import { TestCases } from './common';

type Expected = string;

type Arguments = {
  numStr: string;
  scale: number;
  fixedDecimalScale: boolean;
};

describe('When fixedDecimalScale = false', () => {
  const testCases: TestCases<Arguments, Expected>[] = [
    {
      label: 'positive floats',
      cases: [
        {
          arguments: { numStr: '0.0304000', scale: 3, fixedDecimalScale: false },
          expected: '0.030',
        },
        {
          arguments: { numStr: '0.03049993', scale: 7, fixedDecimalScale: false },
          expected: '0.0304999',
        },
        {
          arguments: { numStr: '0.03049998', scale: 7, fixedDecimalScale: false },
          expected: '0.0305000',
        },
        {
          arguments: { numStr: '0.03049998', scale: 1, fixedDecimalScale: false },
          expected: '0.0',
        },
        { arguments: { numStr: '0.03', scale: 3, fixedDecimalScale: false }, expected: '0.03' },
        { arguments: { numStr: '0.09', scale: 0, fixedDecimalScale: false }, expected: '0' },
        { arguments: { numStr: '0.9', scale: 0, fixedDecimalScale: false }, expected: '1' },
      ],
    },
    {
      label: 'negative floats',
      cases: [
        {
          arguments: { numStr: '-0.0304000', scale: 3, fixedDecimalScale: false },
          expected: '-0.030',
        },
        { arguments: { numStr: '-0.03', scale: 5, fixedDecimalScale: false }, expected: '-0.03' },
      ],
    },
    {
      label: 'integers',
      cases: [
        { arguments: { numStr: '102', scale: 3, fixedDecimalScale: false }, expected: '102' },
        { arguments: { numStr: '-102', scale: 3, fixedDecimalScale: false }, expected: '-102' },
      ],
    },
    // TODO
    // [
    //   'exponents',
    //   [
    //     ['1e2', 3, false, '102'],
    //   ],
    // ],
  ];

  for (const testCase of testCases) {
    describe(testCase.label, () => {
      test.each(testCase.cases)(
        '%arguments.floatStr',
        ({ arguments: { numStr, scale, fixedDecimalScale }, expected }) => {
          expect(roundToPrecision(numStr, scale, fixedDecimalScale)).toBe(expected);
        },
      );
    });
  }
});

describe('When fixedDecimalScale = true', () => {
  const testCases: TestCases<Arguments, Expected>[] = [
    {
      label: 'positive floats',
      cases: [
        {
          arguments: { numStr: '0.0304000', scale: 3, fixedDecimalScale: true },
          expected: '0.030',
        },
        {
          arguments: { numStr: '0.03049993', scale: 7, fixedDecimalScale: true },
          expected: '0.0304999',
        },
        {
          arguments: { numStr: '0.03049998', scale: 7, fixedDecimalScale: true },
          expected: '0.0305000',
        },
        {
          arguments: { numStr: '0.03049998', scale: 5, fixedDecimalScale: true },
          expected: '0.03050',
        },
        {
          arguments: { numStr: '0.03049998', scale: 7, fixedDecimalScale: true },
          expected: '0.0305000',
        },
        { arguments: { numStr: '0.03049998', scale: 1, fixedDecimalScale: true }, expected: '0.0' },
        { arguments: { numStr: '0.09', scale: 0, fixedDecimalScale: true }, expected: '0' },
        { arguments: { numStr: '0.9', scale: 0, fixedDecimalScale: true }, expected: '1' },
      ],
    },
    {
      label: 'negative floats',
      cases: [
        {
          arguments: { numStr: '-0.0304000', scale: 3, fixedDecimalScale: true },
          expected: '-0.030',
        },
        { arguments: { numStr: '-0.03', scale: 5, fixedDecimalScale: true }, expected: '-0.03000' },
      ],
    },
    {
      label: 'integers',
      cases: [
        { arguments: { numStr: '102', scale: 3, fixedDecimalScale: true }, expected: '102.000' },
        { arguments: { numStr: '102.00', scale: 3, fixedDecimalScale: true }, expected: '102.000' },
        { arguments: { numStr: '-102', scale: 3, fixedDecimalScale: true }, expected: '-102.000' },
      ],
    },
  ];

  for (const testCase of testCases) {
    describe(testCase.label, () => {
      test.each(testCase.cases)(
        '%arguments.numStr',
        ({ arguments: { numStr, scale, fixedDecimalScale }, expected }) => {
          expect(roundToPrecision(numStr, scale, fixedDecimalScale)).toBe(expected);
        },
      );
    });
  }
});
