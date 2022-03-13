import React from 'react';
import { SyntheticEvent } from 'react';

export interface NumberFormatState {
  value?: string;
  numAsString?: string;
  mounted: boolean;
}

export interface NumberFormatValues {
  floatValue: number | undefined;
  formattedValue: string;
  value: string;
}

export interface SourceInfo {
  event: SyntheticEvent;
  source: string;
}

export type FormatInputValueFunction = (inputValue: string) => string;

export interface SyntheticInputEvent extends React.SyntheticEvent<HTMLInputElement> {
  readonly target: HTMLInputElement;
  data: any;
}

export type ChangeMeta = {
  from: {
    start: number;
    end: number;
  };
  to: {
    start: number;
    end: number;
  };
  lastValue: string;
};

export type NumberFormatPropsBase<T> = {
  thousandSeparator?: boolean | string;
  decimalSeparator?: string;
  thousandsGroupStyle?: 'thousand' | 'lakh' | 'wan';
  decimalScale?: number;
  fixedDecimalScale?: boolean;
  displayType?: 'input' | 'text';
  prefix?: string;
  suffix?: string;
  format?: string | FormatInputValueFunction;
  removeFormatting?: (formattedValue: string) => string;
  mask?: string | string[];
  value?: number | string | null;
  defaultValue?: number | string;
  isNumericString?: boolean;
  customInput?: React.ComponentType<T>;
  allowNegative?: boolean;
  allowEmptyFormatting?: boolean;
  allowLeadingZeros?: boolean;
  patternChar?: string;
  onValueChange?: (values: NumberFormatValues, sourceInfo: SourceInfo) => void;
  /**
   * these are already included in React.HTMLAttributes<HTMLInputElement>
   * onKeyDown: Function;
   * onMouseUp: Function;
   * onChange: Function;
   * onFocus: Function;
   * onBlur: Function;
   */
  type?: 'text' | 'tel' | 'password';
  isAllowed?: (values: NumberFormatValues) => boolean;
  renderText?: (formattedValue: string, otherProps: Partial<NumberFormatProps>) => React.ReactNode;
  getInputRef?: ((el: HTMLInputElement) => void) | React.Ref<any>;
  allowedDecimalSeparators?: Array<string>;
  customNumerals?: [string, string, string, string, string, string, string, string, string, string];
};
export type InputAttributes = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'defaultValue' | 'value'
>;
export type NumberFormatProps<T = InputAttributes> = NumberFormatPropsBase<T> &
  Omit<React.InputHTMLAttributes<HTMLInputElement>, keyof T> &
  Omit<T, keyof NumberFormatPropsBase<unknown> | 'ref'>;

class NumberFormat<T> extends React.Component<NumberFormatProps<T>, any> {}
export default NumberFormat;
