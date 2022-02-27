/// <reference types="node" />
import React from 'react';
import { NumberFormatProps, NumberFormatState } from './types';
declare class NumberFormat extends React.Component<NumberFormatProps, NumberFormatState> {
    state: {
        value?: string;
        numAsString?: string;
        mounted: boolean;
    };
    focusTimeout: NodeJS.Timeout;
    caretPositionTimeout: NodeJS.Timeout;
    focusedElm: HTMLInputElement;
    selectionBeforeInput: {
        selectionStart: number;
        selectionEnd: number;
    };
    static defaultProps: Object;
    static propTypes: {
        thousandSeparator: any;
        decimalSeparator: any;
        allowedDecimalSeparators: any;
        thousandsGroupStyle: any;
        decimalScale: any;
        fixedDecimalScale: any;
        displayType: any;
        prefix: any;
        suffix: any;
        format: any;
        removeFormatting: any;
        mask: any;
        value: any;
        defaultValue: any;
        isNumericString: any;
        customInput: any;
        allowNegative: any;
        allowEmptyFormatting: any;
        allowLeadingZeros: any;
        onValueChange: any;
        onKeyDown: any;
        onMouseUp: any;
        onChange: any;
        onFocus: any;
        onBlur: any;
        type: any;
        isAllowed: any;
        renderText: any;
        getInputRef: any;
        customNumerals: (props: any, propName: any, componentName: any) => Error;
    };
    constructor(props: NumberFormatProps);
    componentDidMount(): void;
    componentDidUpdate(prevProps: Object): void;
    componentWillUnmount(): void;
    updateValueIfRequired(prevProps: Object): void;
    /** Misc methods **/
    getFloatString(num?: string): string;
    getNumberRegex(g: boolean, ignoreDecimalSeparator?: boolean): RegExp;
    getSeparators(): {
        decimalSeparator: string;
        thousandSeparator: string | false;
        allowedDecimalSeparators: string[];
    };
    getMaskAtIndex(index: number): string;
    getValueObject(formattedValue: string, numAsString: string): {
        formattedValue: string;
        value: string;
        floatValue: number;
    };
    validateProps(): void;
    /** Misc methods end **/
    /** caret specific methods **/
    setPatchedCaretPosition(el: HTMLInputElement, caretPos: number, currentValue: string): void;
    correctCaretPosition(value: string, caretPos: number, direction?: string): number;
    getCaretPosition(inputValue: string, formattedValue: string, caretPos: number): any;
    /** caret specific methods ends **/
    /** methods to remove formattting **/
    removePrefixAndSuffix(val: string): string;
    removePatternFormatting(val: string): string;
    removeFormatting(val: string): string;
    /** methods to remove formattting end **/
    /*** format specific methods start ***/
    /**
     * Format when # based string is provided
     * @param  {string} numStr Numeric String
     * @return {string}        formatted Value
     */
    formatWithPattern(numStr: string): string;
    /**
     * @param  {string} numStr Numeric string/floatString] It always have decimalSeparator as .
     * @return {string} formatted Value
     */
    formatAsNumber(numStr: string): string;
    formatNumString(numStr?: string): string;
    formatValueProp(defaultValue?: string | number): string;
    formatNegation(value?: string): string;
    formatInput(value?: string): string;
    /*** format specific methods end ***/
    isCharacterAFormat(caretPos: number, value: string): boolean;
    /**
     * This will check if any formatting got removed by the delete or backspace and reset the value
     * It will also work as fallback if android chome keyDown handler does not work
     **/
    correctInputValue(caretPos: number, lastValue: string, value: string): string;
    /** Update value and caret position */
    updateValue(params: {
        formattedValue?: string;
        numAsString?: string;
        inputValue?: string;
        input: HTMLInputElement;
        event: React.ChangeEvent<HTMLInputElement> | React.FocusEvent<HTMLInputElement> | React.KeyboardEvent<HTMLInputElement>;
        source?: string;
        caretPos?: number;
        setCaretPosition?: Boolean;
    }): void;
    onChange(e: React.ChangeEvent<HTMLInputElement>): void;
    onBlur(e: React.FocusEvent<HTMLInputElement>): void;
    onKeyDown(e: React.KeyboardEvent<HTMLInputElement>): void;
    /** required to handle the caret position when click anywhere within the input **/
    onMouseUp(e: React.MouseEvent<HTMLInputElement>): void;
    onFocus(e: React.FocusEvent<HTMLInputElement>): void;
    render(): {};
}
export default NumberFormat;
