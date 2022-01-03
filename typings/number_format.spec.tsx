import * as React from 'react';
import { default as NumberFormat, NumberFormatProps, InputAttributes } from 'react-number-format';

const CustomNumberFormat = (props: NumberFormatProps) => <NumberFormat {...props} />;
const CustomNumberFormat2 = (props: NumberFormatProps<InputAttributes>) => (
  <NumberFormat {...props} />
);

function Test() {
  return (
    <>
      <NumberFormat value="" />
      <NumberFormat type="tel" />
      <CustomNumberFormat type="tel" readOnly={false} size={1} thousandSeparator="." />
      <CustomNumberFormat2 type="tel" size={1} />
      <NumberFormat
        customInput={(props: { size: 'small' | 'large' }) => <></>}
        type="tel"
        size="small"
        thousandSeparator="."
        style={{ color: '#222' }}
      />
    </>
  );
}
