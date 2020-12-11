/// <reference types="react" />

declare module "react-number-format" {

  //exclude types from the InputHTMLAttributes
  const {defaultValue, value, ...inputAttributes}: React.InputHTMLAttributes<HTMLInputElement>;
  type InputAttributes = typeof inputAttributes;

  export interface NumberFormatState {
    value?: string;
    numAsString?: string;
  }

  export interface NumberFormatValues {
    floatValue: number | undefined;
    formattedValue: string;
    value: string;
  }

  export type FormatInputValueFunction = (inputValue: string) => string;

  export interface SyntheticInputEvent
    extends React.SyntheticEvent<HTMLInputElement> {
    readonly target: HTMLInputElement;
    data: any;
  }

  export interface NumberFormatProps
    extends InputAttributes {
    thousandSeparator?: boolean | string;
    decimalSeparator?: boolean | string;
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
    customInput?: React.ComponentType<any>;
    allowNegative?: boolean;
    allowEmptyFormatting?: boolean;
    allowLeadingZeros?: boolean;
    onValueChange?: (values: NumberFormatValues) => void;
    /**
     * these are already included in React.HTMLAttributes<HTMLInputElement>
     * onKeyDown: Function;
     * onMouseUp: Function;
     * onChange: Function;
     * onFocus: Function;
     * onBlur: Function;
     */
    type?: 'text' | 'tel'  | 'password';
    isAllowed?: (values: NumberFormatValues) => boolean;
    renderText?: (formattedValue: string) => React.ReactNode;
    getInputRef?: ((el: HTMLInputElement) => void) | React.Ref<any>;
    allowedDecimalSeparators?: Array<string>;
    [key: string]: any;
  }

  class NumberFormat extends React.Component<NumberFormatProps, any> {}
  export default NumberFormat;
}
