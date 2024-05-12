type TestCase<T, U> = {
  arguments: T;
  expected: U;
};

export type TestCases<T, U> = { label: string; cases: TestCase<T, U>[] };
