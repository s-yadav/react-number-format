import * as React from 'react';
import { default as NumberFormat } from 'react-number-format';

<NumberFormat value="" />;

<NumberFormat type="tel" />;

<NumberFormat type="tel" readOnly={false} size={1} />;

<NumberFormat
  customInput={(props: { size: 'small' | 'large' }) => <></>}
  type="tel"
  size="small"
/>;
