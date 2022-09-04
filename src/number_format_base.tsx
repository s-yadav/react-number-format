import React, { useEffect, useState, useRef } from 'react';
import {
  FormatInputValueFunction,
  NumberFormatBaseProps,
  InputAttributes,
  SourceType,
} from './types';
import {
  addInputMode,
  findChangeRange,
  geInputCaretPosition,
  setCaretPosition,
  getCaretPosition,
  clamp,
  charIsNumber,
  useInternalValues,
  noop,
  caretUnknownFormatBoundary,
} from './utils';

function defaultRemoveFormatting(value: string) {
  return value.replace(/[^0-9]/g, '');
}

function defaultFormat(value: string) {
  return value;
}

export default function NumberFormatBase<BaseType = InputAttributes>(
  props: NumberFormatBaseProps<BaseType>,
): React.ReactElement {
  const {
    type = 'text',
    displayType = 'input',
    customInput,
    renderText,
    getInputRef,
    format = defaultFormat,
    /* eslint-disable no-unused-vars */
    removeFormatting = defaultRemoveFormatting,
    defaultValue,
    valueIsNumericString,
    onValueChange,
    isAllowed,
    onChange = noop,
    onKeyDown = noop,
    onMouseUp = noop,
    onFocus = noop,
    onBlur = noop,
    value: propValue,
    getCaretBoundary = caretUnknownFormatBoundary,
    /* eslint-enable no-unused-vars */
    ...otherProps
  } = props;

  const [{ formattedValue, numAsString }, onFormattedValueChange] = useInternalValues(
    propValue,
    defaultValue,
    valueIsNumericString,
    format as FormatInputValueFunction,
    removeFormatting,
    onValueChange,
  );

  const lastUpdatedValue = useRef<string>();

  const _onValueChange: NumberFormatBaseProps['onValueChange'] = (values, source) => {
    lastUpdatedValue.current = values.formattedValue;
    onFormattedValueChange(values, source);
  };

  // check if there is any change in the value due to props change
  useEffect(() => {
    const newFormattedValue = (format as FormatInputValueFunction)(numAsString);

    // if the formatted value is not synced to parent, or if the formatted value is different
    if (lastUpdatedValue.current === undefined || newFormattedValue !== lastUpdatedValue.current) {
      const input = focusedElm.current;
      updateValue({
        formattedValue: newFormattedValue,
        numAsString: numAsString,
        input,
        setCaretPosition: true,
        source: SourceType.props,
        event: null,
      });
    }
  });

  const [mounted, setMounted] = useState(false);
  const focusedElm = useRef<HTMLInputElement>(null);

  const timeout = useRef({
    setCaretTimeout: null,
    focusTimeout: null,
  });

  useEffect(() => {
    setMounted(true);

    return () => {
      clearTimeout(timeout.current.setCaretTimeout);
      clearTimeout(timeout.current.focusTimeout);
    };
  }, []);

  const _format = format as FormatInputValueFunction;

  const getValueObject = (formattedValue: string, numAsString: string) => {
    const floatValue = parseFloat(numAsString);

    return {
      formattedValue,
      value: numAsString,
      floatValue: isNaN(floatValue) ? undefined : floatValue,
    };
  };

  const setPatchedCaretPosition = (
    el: HTMLInputElement,
    caretPos: number,
    currentValue: string,
  ) => {
    /* setting caret position within timeout of 0ms is required for mobile chrome,
    otherwise browser resets the caret position after we set it
    We are also setting it without timeout so that in normal browser we don't see the flickering */
    setCaretPosition(el, caretPos);
    timeout.current.setCaretTimeout = setTimeout(() => {
      if (el.value === currentValue) setCaretPosition(el, caretPos);
    }, 0);
  };

  /* This keeps the caret within typing area so people can't type in between prefix or suffix */
  const correctCaretPosition = (value: string, caretPos: number, direction?: string) => {
    const valLn = value.length;

    // clamp caret position to [0, value.length]
    caretPos = clamp(caretPos, 0, valLn);

    const boundary = getCaretBoundary(value);

    if (direction === 'left') {
      while (caretPos >= 0 && !boundary[caretPos]) caretPos--;

      // if we don't find any suitable caret position on left, set it on first allowed position
      if (caretPos === -1) caretPos = boundary.indexOf(true);
    } else {
      while (caretPos <= valLn && !boundary[caretPos]) caretPos++;

      // if we don't find any suitable caret position on right, set it on last allowed position
      if (caretPos > valLn) caretPos = boundary.lastIndexOf(true);
    }

    // if we still don't find caret position, set it at the end of value
    if (caretPos === -1) caretPos = valLn;

    return caretPos;
  };

  const getNewCaretPosition = (inputValue: string, formattedValue: string, caretPos: number) => {
    let updatedCaretPos = getCaretPosition(formattedValue, inputValue, caretPos);

    //correct caret position if its outside of editable area
    updatedCaretPos = correctCaretPosition(formattedValue, updatedCaretPos);

    return updatedCaretPos;
  };

  const updateValue = (params: {
    formattedValue?: string;
    numAsString: string;
    inputValue?: string;
    input: HTMLInputElement;
    event?:
      | React.ChangeEvent<HTMLInputElement>
      | React.FocusEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLInputElement>;
    source?: SourceType;
    caretPos?: number;
    setCaretPosition?: Boolean;
  }) => {
    const {
      formattedValue: newFormattedValue,
      input,
      setCaretPosition = true,
      source,
      event,
      numAsString,
    } = params;
    let { caretPos } = params;

    if (input) {
      //calculate caret position if not defined
      if (caretPos === undefined && setCaretPosition) {
        const inputValue = params.inputValue || input.value;

        const currentCaretPosition = geInputCaretPosition(input);

        /**
         * set the value imperatively, this is required for IE fix
         * This is also required as if new caret position is beyond the previous value.
         * Caret position will not be set correctly
         */
        input.value = newFormattedValue;

        //get the caret position
        caretPos = getNewCaretPosition(inputValue, newFormattedValue, currentCaretPosition);
      }

      /**
       * set the value imperatively, as we set the caret position as well imperatively.
       * This is to keep value and caret position in sync
       */
      input.value = newFormattedValue;

      //set caret position, and value imperatively when element is provided
      if (setCaretPosition) {
        //set caret position
        setPatchedCaretPosition(input, caretPos, newFormattedValue);
      }
    }

    if (newFormattedValue !== formattedValue) {
      // trigger onValueChange synchronously, so parent is updated along with the number format. Fix for #277, #287
      _onValueChange(getValueObject(newFormattedValue, numAsString), { event, source });
    }
  };

  const formatInputValue = (
    inputValue: string,
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.FocusEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLInputElement>,
    source: SourceType,
  ) => {
    const changeRange = findChangeRange(formattedValue, inputValue);
    const changeMeta = {
      ...changeRange,
      lastValue: formattedValue,
    };
    const _numAsString = removeFormatting(inputValue, changeMeta);
    const _formattedValue = _format(_numAsString);

    if (isAllowed && !isAllowed(getValueObject(_formattedValue, _numAsString))) {
      return false;
    }

    updateValue({
      formattedValue: _formattedValue,
      numAsString: _numAsString,
      inputValue,
      event,
      source,
      setCaretPosition: true,
      input: event.target as HTMLInputElement,
    });
  };

  const _onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const el = e.target;
    const inputValue = el.value;

    const changed = formatInputValue(inputValue, e, SourceType.event);

    if (changed) onChange(e);
  };

  const _onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const el = e.target as HTMLInputElement;
    const { key } = e;
    const { selectionStart, selectionEnd, value = '' } = el;

    let expectedCaretPosition;

    //Handle backspace and delete against non numerical/decimal characters or arrow keys
    if (key === 'ArrowLeft' || key === 'Backspace') {
      expectedCaretPosition = Math.max(selectionStart - 1, 0);
    } else if (key === 'ArrowRight') {
      expectedCaretPosition = Math.min(selectionStart + 1, value.length);
    } else if (key === 'Delete') {
      expectedCaretPosition = selectionStart;
    }

    //if expectedCaretPosition is not set it means we don't want to Handle keyDown
    // also if multiple characters are selected don't handle
    if (expectedCaretPosition === undefined || selectionStart !== selectionEnd) {
      onKeyDown(e);
      return;
    }

    let newCaretPosition = expectedCaretPosition;

    if (key === 'ArrowLeft' || key === 'ArrowRight') {
      const direction = key === 'ArrowLeft' ? 'left' : 'right';
      newCaretPosition = correctCaretPosition(value, expectedCaretPosition, direction);
    } else if (key === 'Delete' && !charIsNumber(value[expectedCaretPosition])) {
      // in case of delete go to closest caret boundary on the right side
      newCaretPosition = correctCaretPosition(value, expectedCaretPosition, 'right');
    } else if (key === 'Backspace' && !charIsNumber(value[expectedCaretPosition])) {
      // in case of backspace go to closest caret boundary on the left side
      newCaretPosition = correctCaretPosition(value, expectedCaretPosition, 'left');
    }

    if (newCaretPosition !== expectedCaretPosition) {
      setPatchedCaretPosition(el, newCaretPosition, value);
    }

    /* NOTE: this is just required for unit test as we need to get the newCaretPosition,
            Remove this when you find different solution */
    /* @ts-ignore */
    if (e.isUnitTestRun) {
      setPatchedCaretPosition(el, newCaretPosition, value);
    }

    onKeyDown(e);
  };

  /** required to handle the caret position when click anywhere within the input **/
  const _onMouseUp = (e: React.MouseEvent<HTMLInputElement>) => {
    const el = e.target as HTMLInputElement;

    /**
     * NOTE: we have to give default value for value as in case when custom input is provided
     * value can come as undefined when nothing is provided on value prop.
     */
    const { selectionStart, selectionEnd, value = '' } = el;

    if (selectionStart === selectionEnd) {
      const caretPosition = correctCaretPosition(value, selectionStart);
      if (caretPosition !== selectionStart) {
        setPatchedCaretPosition(el, caretPosition, value);
      }
    }

    onMouseUp(e);
  };

  const _onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // Workaround Chrome and Safari bug https://bugs.chromium.org/p/chromium/issues/detail?id=779328
    // (onFocus event target selectionStart is always 0 before setTimeout)
    e.persist();

    const el = e.target;
    focusedElm.current = el;

    timeout.current.focusTimeout = setTimeout(() => {
      const { selectionStart, selectionEnd, value = '' } = el;

      const caretPosition = correctCaretPosition(value, selectionStart);

      //setPatchedCaretPosition only when everything is not selected on focus (while tabbing into the field)
      if (
        caretPosition !== selectionStart &&
        !(selectionStart === 0 && selectionEnd === value.length)
      ) {
        setPatchedCaretPosition(el, caretPosition, value);
      }

      onFocus(e);
    }, 0);
  };

  const _onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    focusedElm.current = null;
    clearTimeout(timeout.current.focusTimeout);
    clearTimeout(timeout.current.setCaretTimeout);
    onBlur(e);
  };

  // add input mode on element based on format prop and device once the component is mounted
  const inputMode: InputAttributes['inputMode'] = mounted && addInputMode() ? 'numeric' : undefined;

  const inputProps = Object.assign({ inputMode }, otherProps, {
    type,
    value: formattedValue,
    onChange: _onChange,
    onKeyDown: _onKeyDown,
    onMouseUp: _onMouseUp,
    onFocus: _onFocus,
    onBlur: _onBlur,
  });

  if (displayType === 'text') {
    return renderText ? (
      <>{renderText(formattedValue, otherProps) || null}</>
    ) : (
      <span {...otherProps} ref={getInputRef}>
        {formattedValue}
      </span>
    );
  } else if (customInput) {
    const CustomInput = customInput;
    /* @ts-ignore */
    return <CustomInput {...inputProps} ref={getInputRef} />;
  }

  return <input {...inputProps} ref={getInputRef} />;
}
