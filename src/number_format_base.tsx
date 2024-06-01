import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import {
  FormatInputValueFunction,
  NumberFormatBaseProps,
  InputAttributes,
  SourceType,
  Timeout,
} from './types';
import {
  addInputMode,
  findChangeRange,
  geInputCaretPosition,
  setCaretPosition,
  getCaretPosition,
  charIsNumber,
  useInternalValues,
  noop,
  caretUnknownFormatBoundary,
  getCaretPosInBoundary,
  findChangedRangeFromCaretPositions,
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
    isValidInputCharacter = charIsNumber,
    isCharacterSame,
    ...otherProps
  } = props;

  const [{ formattedValue, numAsString }, onFormattedValueChange] = useInternalValues(
    propValue,
    defaultValue,
    Boolean(valueIsNumericString),
    format as FormatInputValueFunction,
    removeFormatting,
    onValueChange,
  );

  const caretPositionBeforeChange = useRef<{ selectionStart: number; selectionEnd: number }>();

  const lastUpdatedValue = useRef({ formattedValue, numAsString });

  const _onValueChange: NumberFormatBaseProps['onValueChange'] = (values, source) => {
    lastUpdatedValue.current = { formattedValue: values.formattedValue, numAsString: values.value };
    onFormattedValueChange(values, source);
  };

  const [mounted, setMounted] = useState(false);
  const focusedElm = useRef<HTMLInputElement | null>(null);

  const timeout = useRef<{
    setCaretTimeout: Timeout | null;
    focusTimeout: Timeout | null;
  }>({
    setCaretTimeout: null,
    focusTimeout: null,
  });

  useEffect(() => {
    setMounted(true);

    return () => {
      clearTimeout(timeout.current.setCaretTimeout as unknown as Timeout);
      clearTimeout(timeout.current.focusTimeout as unknown as Timeout);
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
    // don't reset the caret position when the whole input content is selected
    if (el.selectionStart === 0 && el.selectionEnd === el.value.length) return;

    /* setting caret position within timeout of 0ms is required for mobile chrome,
    otherwise browser resets the caret position after we set it
    We are also setting it without timeout so that in normal browser we don't see the flickering */
    setCaretPosition(el, caretPos);

    timeout.current.setCaretTimeout = setTimeout(() => {
      if (el.value === currentValue && el.selectionStart !== caretPos) {
        setCaretPosition(el, caretPos);
      }
    }, 0);
  };

  /* This keeps the caret within typing area so people can't type in between prefix or suffix */
  const correctCaretPosition = (value: string, caretPos: number, direction?: string) => {
    return getCaretPosInBoundary(value, caretPos, getCaretBoundary(value), direction);
  };

  const getNewCaretPosition = (inputValue: string, newFormattedValue: string, caretPos: number) => {
    const caretBoundary = getCaretBoundary(newFormattedValue);
    let updatedCaretPos = getCaretPosition(
      newFormattedValue,
      formattedValue,
      inputValue,
      caretPos,
      caretBoundary,
      isValidInputCharacter,
      isCharacterSame,
    );

    //correct caret position if its outside of editable area
    updatedCaretPos = getCaretPosInBoundary(newFormattedValue, updatedCaretPos, caretBoundary);

    return updatedCaretPos;
  };

  const updateValueAndCaretPosition = (params: {
    formattedValue?: string;
    numAsString: string;
    inputValue?: string;
    input?: HTMLInputElement | null;
    event?:
      | React.ChangeEvent<HTMLInputElement>
      | React.FocusEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLInputElement>;
    source: SourceType;
  }) => {
    const { formattedValue: newFormattedValue = '', input, source, event, numAsString } = params;
    let caretPos;

    if (input) {
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

      //set caret position imperatively
      if (caretPos !== undefined) {
        setPatchedCaretPosition(input, caretPos, newFormattedValue);
      }
    }

    if (newFormattedValue !== formattedValue) {
      // trigger onValueChange synchronously, so parent is updated along with the number format. Fix for #277, #287
      _onValueChange(getValueObject(newFormattedValue, numAsString), { event, source });
    }
  };

  /**
   * if the formatted value is not synced to parent, or if the formatted value is different from last synced value sync it
   * if the formatting props is removed, in which case last formatted value will be different from the numeric string value
   * in such case we need to inform the parent.
   */
  useEffect(() => {
    const { formattedValue: lastFormattedValue, numAsString: lastNumAsString } =
      lastUpdatedValue.current;

    if (formattedValue !== lastFormattedValue || numAsString !== lastNumAsString) {
      _onValueChange(getValueObject(formattedValue, numAsString), {
        event: undefined,
        source: SourceType.props,
      });
    }
  }, [formattedValue, numAsString]);

  // also if formatted value is changed from the props, we need to update the caret position
  // keep the last caret position if element is focused
  const currentCaretPosition = focusedElm.current
    ? geInputCaretPosition(focusedElm.current)
    : undefined;

  // needed to prevent warning with useLayoutEffect on server
  const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

  useIsomorphicLayoutEffect(() => {
    const input = focusedElm.current;
    if (formattedValue !== lastUpdatedValue.current.formattedValue && input) {
      const caretPos = getNewCaretPosition(
        lastUpdatedValue.current.formattedValue,
        formattedValue,
        currentCaretPosition,
      );
      /**
       * set the value imperatively, as we set the caret position as well imperatively.
       * This is to keep value and caret position in sync
       */
      input.value = formattedValue;
      setPatchedCaretPosition(input, caretPos, formattedValue);
    }
  }, [formattedValue]);

  const formatInputValue = (
    inputValue: string,
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.FocusEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLInputElement>,
    source: SourceType,
  ) => {
    const input = event.target as HTMLInputElement;

    const changeRange = caretPositionBeforeChange.current
      ? findChangedRangeFromCaretPositions(caretPositionBeforeChange.current, input.selectionEnd)
      : findChangeRange(formattedValue, inputValue);

    const changeMeta = {
      ...changeRange,
      lastValue: formattedValue,
    };
    let _numAsString = removeFormatting(inputValue, changeMeta);
    const _formattedValue = _format(_numAsString);

    // formatting can remove some of the number chars, so we need to fine number string again
    _numAsString = removeFormatting(_formattedValue, undefined);

    if (isAllowed && !isAllowed(getValueObject(_formattedValue, _numAsString))) {
      //reset the caret position
      const input = event.target as HTMLInputElement;
      const currentCaretPosition = geInputCaretPosition(input);

      const caretPos = getNewCaretPosition(inputValue, formattedValue, currentCaretPosition);
      input.value = formattedValue;
      setPatchedCaretPosition(input, caretPos, formattedValue);
      return false;
    }

    updateValueAndCaretPosition({
      formattedValue: _formattedValue,
      numAsString: _numAsString,
      inputValue,
      event,
      source,
      input: event.target as HTMLInputElement,
    });

    return true;
  };

  const setCaretPositionInfoBeforeChange = (el: HTMLInputElement, endOffset: number = 0) => {
    const { selectionStart, selectionEnd } = el;
    caretPositionBeforeChange.current = { selectionStart, selectionEnd: selectionEnd + endOffset };
  };

  const _onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const el = e.target;
    const inputValue = el.value;

    const changed = formatInputValue(inputValue, e, SourceType.event);

    if (changed) onChange(e);

    // reset the position, as we have already handled the caret position
    caretPositionBeforeChange.current = undefined;
  };

  const _onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const el = e.target as HTMLInputElement;
    const { key } = e;
    const { selectionStart, selectionEnd, value = '' } = el;

    let expectedCaretPosition;

    //Handle backspace and delete against non numerical/decimal characters or arrow keys
    if (key === 'ArrowLeft' || key === 'Backspace') {
      expectedCaretPosition = Math.max((selectionStart as number) - 1, 0);
    } else if (key === 'ArrowRight') {
      expectedCaretPosition = Math.min((selectionStart as number) + 1, value.length);
    } else if (key === 'Delete') {
      expectedCaretPosition = selectionStart;
    }

    // if key is delete and text is not selected keep the end offset to 1, as it deletes one character
    // this is required as selection is not changed on delete case, which changes the change range calculation
    let endOffset = 0;
    if (key === 'Delete' && selectionStart === selectionEnd) {
      endOffset = 1;
    }

    const isArrowKey = key === 'ArrowLeft' || key === 'ArrowRight';

    //if expectedCaretPosition is not set it means we don't want to Handle keyDown
    // also if multiple characters are selected don't handle
    if (expectedCaretPosition === undefined || (selectionStart !== selectionEnd && !isArrowKey)) {
      onKeyDown(e);
      // keep information of what was the caret position before keyDown
      // set it after onKeyDown, in case parent updates the position manually
      setCaretPositionInfoBeforeChange(el, endOffset);
      return;
    }

    let newCaretPosition = expectedCaretPosition;

    if (isArrowKey) {
      const direction = key === 'ArrowLeft' ? 'left' : 'right';
      newCaretPosition = correctCaretPosition(value, expectedCaretPosition, direction);
      // arrow left or right only moves the caret, so no need to handle the event, if we are handling it manually
      if (newCaretPosition !== expectedCaretPosition) {
        e.preventDefault();
      }
    } else if (key === 'Delete' && !isValidInputCharacter(value[expectedCaretPosition])) {
      // in case of delete go to closest caret boundary on the right side
      newCaretPosition = correctCaretPosition(value, expectedCaretPosition, 'right');
    } else if (key === 'Backspace' && !isValidInputCharacter(value[expectedCaretPosition])) {
      // in case of backspace go to closest caret boundary on the left side
      newCaretPosition = correctCaretPosition(value, expectedCaretPosition, 'left');
    }

    if (newCaretPosition !== expectedCaretPosition) {
      setPatchedCaretPosition(el, newCaretPosition, value);
    }

    onKeyDown(e);

    setCaretPositionInfoBeforeChange(el, endOffset);
  };

  /** required to handle the caret position when click anywhere within the input **/
  const _onMouseUp = (e: React.MouseEvent<HTMLInputElement>) => {
    const el = e.target as HTMLInputElement;

    /**
     * NOTE: we have to give default value for value as in case when custom input is provided
     * value can come as undefined when nothing is provided on value prop.
     */

    const correctCaretPositionIfRequired = () => {
      const { selectionStart, selectionEnd, value = '' } = el;
      if (selectionStart === selectionEnd) {
        const caretPosition = correctCaretPosition(value, selectionStart as number);
        if (caretPosition !== selectionStart) {
          setPatchedCaretPosition(el, caretPosition, value);
        }
      }
    };

    correctCaretPositionIfRequired();

    // try to correct after selection has updated by browser
    // this case is required when user clicks on some position while a text is selected on input
    requestAnimationFrame(() => {
      correctCaretPositionIfRequired();
    });

    onMouseUp(e);
    setCaretPositionInfoBeforeChange(el);
  };

  const _onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // Workaround Chrome and Safari bug https://bugs.chromium.org/p/chromium/issues/detail?id=779328
    // (onFocus event target selectionStart is always 0 before setTimeout)
    if (e.persist) e.persist();

    const el = e.target;
    const currentTarget = e.currentTarget;
    focusedElm.current = el;

    timeout.current.focusTimeout = setTimeout(() => {
      const { selectionStart, selectionEnd, value = '' } = el;

      const caretPosition = correctCaretPosition(value, selectionStart as number);

      //setPatchedCaretPosition only when everything is not selected on focus (while tabbing into the field)
      if (
        caretPosition !== selectionStart &&
        !(selectionStart === 0 && selectionEnd === value.length)
      ) {
        setPatchedCaretPosition(el, caretPosition, value);
      }

      onFocus({ ...e, currentTarget });
    }, 0);
  };

  const _onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    focusedElm.current = null;
    clearTimeout(timeout.current.focusTimeout as unknown as Timeout);
    clearTimeout(timeout.current.setCaretTimeout as unknown as Timeout);
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
