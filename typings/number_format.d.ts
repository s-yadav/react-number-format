/// <reference types="react" />

declare module 'react-number-format' {
  type Modify<T, R> = Pick<T, Exclude<keyof T, keyof R>> & R;

  //exclude types from the InputHTMLAttributes
  export type InputAttributes = Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'defaultValue' | 'value' | 'children'
  >;

  export interface NumberFormatState {
    value?: string;
    numAsString?: string;
  }

  export interface NumberFormatValues {
    floatValue: number | undefined;
    formattedValue: string;
    value: string;
  }

  export interface SourceInfo {
    event: SyntheticInputEvent;
    source: 'prop' | 'event';
  }

  export type FormatInputValueFunction = (inputValue: string) => string;

  export interface SyntheticInputEvent extends React.SyntheticEvent<HTMLInputElement> {
    readonly target: HTMLInputElement;
    data: any;
  }

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
    renderText?: (formattedValue: string) => React.ReactNode;
    getInputRef?: ((el: HTMLInputElement) => void) | React.Ref<any>;
    allowedDecimalSeparators?: Array<string>;
    customNumerals?: [
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
    ];
  };

  export type NumberFormatProps<T = InputAttributes> = NumberFormatPropsBase<T> &
    Omit<InputAttributes, keyof T> &
    Omit<T, keyof NumberFormatPropsBase<unknown> | 'ref'>;

  class NumberFormat<T> extends React.Component<NumberFormatProps<T>, any> {}
  export default NumberFormat;
}
