import { fixLeadingZero } from '../../../src/utils';
import { TestCases } from './common';

type Expected = string;

type Arguments = {
  numStr: string;
};

const testCases: TestCases<Arguments, Expected>[] = [
  {
    label: 'fixedDecimalScale = true',
    cases: [
      {
        arguments: {
          numStr: '-0100',
        },
        expected: '-100',
      },
      {
        arguments: {
          numStr: '00100200',
        },
        expected: '100200',
      },
      {
        arguments: {
          numStr: '00000000100200',
        },
        expected: '100200',
      },
      {
        arguments: {
          numStr: '00100200.000',
        },
        expected: '100200.000',
      },
      {
        arguments: {
          numStr: '00100200.345',
        },
        expected: '100200.345',
      },
      {
        arguments: {
          numStr: '-00100200.345',
        },
        expected: '-100200.345',
      },
      {
        arguments: {
          numStr: '10002000',
        },
        expected: '10002000',
      },
      {
        arguments: {
          numStr: '-10002000',
        },
        expected: '-10002000',
      },
      // TODO
      {
        arguments: {
          numStr: '--10002000',
        },
        expected: '-10002000',
      },
      {
        arguments: {
          numStr: '--0010002000',
        },
        expected: '-10002000',
      },
      {
        arguments: {
          numStr: '--00100200.345',
        },
        expected: '-100200.345',
      },
    ],
  },
];

for (const testCase of testCases) {
  describe.only(testCase.label, () => {
    test.each(testCase.cases)(
      '$arguments.numStr -> $expected',
      ({ arguments: { numStr }, expected }) => {
        expect(fixLeadingZero(numStr)).toBe(expected);
      },
    );
  });
}
