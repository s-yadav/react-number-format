declare type FormatInputValueFunction = (inputValue: string) => string;
export declare function noop(): void;
export declare function returnTrue(): boolean;
export declare function charIsNumber(char?: string): boolean;
export declare function isNil(val: any): boolean;
export declare function escapeRegExp(str: string): string;
export declare function getThousandsGroupRegex(thousandsGroupStyle: string): RegExp;
export declare function applyThousandSeparator(
  str: string,
  thousandSeparator: string,
  thousandsGroupStyle: string,
): string;
export declare function splitDecimal(
  numStr: string,
  allowNegative?: boolean,
): {
  beforeDecimal: string;
  afterDecimal: string;
  hasNagation: boolean;
  addNegation: boolean;
};
export declare function fixLeadingZero(numStr?: string): string;
/**
 * limit decimal numbers to given scale
 * Not used .fixedTo because that will break with big numbers
 */
export declare function limitToScale(
  numStr: string,
  scale: number,
  fixedDecimalScale: boolean,
): string;
export declare function toNumericString(num: any): string;
/**
 * This method is required to round prop value to given scale.
 * Not used .round or .fixedTo because that will break with big numbers
 */
export declare function roundToPrecision(
  numStr: string,
  scale: number,
  fixedDecimalScale: boolean,
): string;
/** set the caret positon in an input field **/
export declare function setCaretPosition(el: HTMLInputElement, caretPos: number): boolean;
/**
  Given previous value and newValue it returns the index
  start - end to which values have changed.
  This function makes assumption about only consecutive
  characters are changed which is correct assumption for caret input.
*/
export declare function findChangedIndex(
  prevValue: string,
  newValue: string,
): {
  start: number;
  end: number;
};
export declare function clamp(num: number, min: number, max: number): number;
export declare function getCurrentCaretPosition(el: HTMLInputElement): number;
export declare function addInputMode(
  format: string | FormatInputValueFunction,
): string | boolean | FormatInputValueFunction;
export {};
