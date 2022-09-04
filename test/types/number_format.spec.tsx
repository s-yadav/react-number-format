import * as React from 'react';
import NumericFormat from '../../src/numeric_format';
import PatternFormat from '../../src/pattern_format';
import NumberFormatBase from '../../src/number_format_base';
import { NumericFormatProps, InputAttributes, PatternFormatProps } from '../../src/types';

function NumberFormatBaseTest() {
  const [state, setState] = React.useState('123');
  return (
    <>
      <NumberFormatBase
        defaultValue="123"
        format={(value) => value}
        removeFormatting={(value, changeMeta) => value}
        getCaretBoundary={(value) => value.split('').map(() => true)}
      />
      <NumberFormatBase
        value={state}
        valueIsNumericString
        onValueChange={(values) => {
          setState(values.value);
        }}
        format={(value) => value}
        removeFormatting={(value, changeMeta) => value}
        getCaretBoundary={(value) => value.split('').map(() => true)}
      />
      <NumberFormatBase
        value={state}
        valueIsNumericString
        onValueChange={(values) => {
          setState(values.value);
        }}
        format={(value) => value}
        removeFormatting={(value, changeMeta) => value}
        getCaretBoundary={(value) => value.split('').map(() => true)}
        customInput={(props: { size: 'small' | 'large' }) => <></>}
        type="tel"
        size="small"
        style={{ color: '#222' }}
      />
    </>
  );
}

const CustomNumericFormat = (props: NumericFormatProps) => <NumericFormat {...props} />;
const CustomNumericFormat2 = (props: NumericFormatProps<InputAttributes>) => (
  <NumericFormat {...props} />
);

function NumericFormatTest() {
  return (
    <>
      <NumericFormat value="" />
      <NumericFormat type="tel" />
      <CustomNumericFormat type="tel" readOnly={false} size={1} thousandSeparator="." />
      <CustomNumericFormat2 type="tel" size={1} />
      <NumericFormat
        customInput={(props: { size: 'small' | 'large' }) => <></>}
        type="tel"
        size="small"
        thousandSeparator="."
        style={{ color: '#222' }}
      />
    </>
  );
}

const CustomPatternFormat = (props: PatternFormatProps) => <PatternFormat {...props} />;
const CustomPatternFormat2 = (props: PatternFormatProps<InputAttributes>) => (
  <PatternFormat {...props} />
);

function PatternFormatTest() {
  return (
    <>
      <PatternFormat format="##-##" value="" />
      <PatternFormat format="####-##" type="tel" />
      <CustomPatternFormat type="tel" format="%%-%%" readOnly={false} size={1} patternChar="%" />
      <CustomPatternFormat2 format="####-##" type="tel" size={1} />
      <PatternFormat
        customInput={(props: { size: 'small' | 'large' }) => <></>}
        type="tel"
        size="small"
        format="####-##"
        style={{ color: '#222' }}
      />
    </>
  );
}
