/// <reference types="react" />

declare module "react-number-format" {
  export interface NumberFormatState {
    value?: string;
    numAsString?: string;
  }

  export interface NumberFormatValues {
    floatValue: number;
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
    extends React.InputHTMLAttributes<HTMLInputElement> {
    thousandSeparator?: boolean | string;
    decimalSeparator?: boolean | string;
    decimalScale?: number;
    fixedDecimalScale?: boolean;
    displayType?: "input" | "text";
    prefix?: string;
    suffix?: string;
    format?: string | FormatInputValueFunction;
    removeFormatting?: (formattedValue: string) => string;
    mask?: string | string[];
    value?: number | string;
    isNumericString?: boolean;
    customInput?: React.ComponentType<any>;
    allowNegative?: boolean;
    allowEmptyFormatting?: boolean;
    onValueChange?: (
      values: NumberFormatValues,
      e: SyntheticInputEvent
    ) => void;
    /**
     * these are already included in React.HTMLAttributes<HTMLInputElement>
     * onKeyDown: Function;
     * onMouseUp: Function;
     * onChange: Function;
     * onFocus: Function;
     * onBlur: Function;
     */
    type?: "text" | "tel";
    isAllowed?: (values: NumberFormatValues) => boolean;
    renderText?: (formattedValue: string) => React.ReactNode;
    getInputRef?: ((el: HTMLInputElement) => void) | React.Ref<any>;
  }

  class NumberFormat extends React.Component<NumberFormatProps, any> {}
  export default NumberFormat;
}
