import React from 'react';
import NumericFormat from '../../src/numeric_format';
import PatternFormat from '../../src/pattern_format';
// import NumberFormatBase from '../../src/number_format_base';
import ReactDOM from 'react-dom';
import { cleanup } from '@testing-library/react';

import {
  simulateBlurEvent,
  simulateMousUpEvent,
  simulateFocusEvent,
  render,
  simulateNativeKeyInput,
} from '../test_util';
// import { cardExpiry } from '../../custom_formatters/card_expiry';

describe('Test keypress and caret position changes', () => {
  // let caretPos;
  // const setSelectionRange = (pos) => {
  //   caretPos = pos;
  // };

  // beforeEach(() => {
  //   caretPos = 0;
  // });

  // afterEach(() => {
  //   jest.useRealTimers();
  //   cleanup();
  // });

  // TODO: replace test
  it.skip('should maintain caret position if suffix/prefix is updated while typing #249', async () => {
    class TestComp extends React.Component {
      constructor() {
        super();
        this.state = {
          prefix: '$',
          value: '123',
        };
      }
      render() {
        const { value, prefix } = this.state;
        return (
          <NumericFormat
            valueIsNumericString={true}
            prefix={prefix}
            value={value}
            onValueChange={({ value }) => {
              this.setState({ value, prefix: value.length > 3 ? '$$' : '$' });
            }}
          />
        );
      }
    }

    const { input } = await render(<TestComp />);
    simulateFocusEvent(input.value, 0, 0, setSelectionRange);
    simulateNativeKeyInput(input, '4', 2, 2, setSelectionRange);
    expect(ReactDOM.findDOMNode(wrapper.instance()).value).toEqual('$$1423');
    expect(caretPos).toEqual(4);

    simulateNativeKeyInput(input, 'Backspace', 4, 4, setSelectionRange);
    expect(ReactDOM.findDOMNode(wrapper.instance()).value).toEqual('$123');
    expect(caretPos).toEqual(2);
  });

  it.only('should maintain caret position when isAllowed returns false', async () => {
    const { input, rerender, user } = await render(
      <NumericFormat
        isAllowed={({ floatValue }) => {
          return floatValue < 100;
        }}
        value={100.222}
      />,
    );

    await simulateNativeKeyInput(user, input, '1', 2, 2);

    expect(input).toHaveValue('100.222');

    expect(input.selectionStart).toEqual(2);
  });

  it.only('should update caret position when any of the decimal separator is pressed just before the decimal separator #711', async () => {
    const { input, rerender, user } = await render(
      <NumericFormat
        value={12}
        allowedDecimalSeparators={[',', '.']}
        decimalSeparator=","
        thousandSeparator="."
        decimalScale={3}
        fixedDecimalScale
      />,
    );

    await simulateNativeKeyInput(user, input, ',', 2, 2);
    expect(input).toHaveValue('12,000');
    expect(input.selectionStart).toEqual(3);

    await simulateNativeKeyInput(user, input, '.', 2, 2);
    expect(input).toHaveValue('12,000');
    expect(input.selectionStart).toEqual(3);
  });

  describe('Test character insertion', () => {
    it.only('should add any number properly when input is empty without format prop passed', async () => {
      const { input, rerender, user } = await render(
        <NumericFormat thousandSeparator={true} prefix={'$'} />,
      );

      await simulateNativeKeyInput(user, input, '1', 0);

      expect(input).toHaveValue('$1');

      rerender(<NumericFormat thousandSeparator={true} prefix={'$'} value="" />);

      await simulateNativeKeyInput(user, input, '2456789', 0);

      expect(input).toHaveValue('$2,456,789');
    });

    it('should add any number properly when input is empty with format prop passed', async () => {
      //case 1: Enter first number
      const { input, rerender, user } = await render(
        <PatternFormat format="#### #### #### ####" mask="_" />,
      );
      await simulateNativeKeyInput(user, input, '1', 0);
      expect(input).toHaveValue('1___ ____ ____ ____');

      //case 2: if nun numeric character got added
      wrapper.setProps({ value: '' });
      wrapper.update();
      await simulateNativeKeyInput(user, input, 'b', 0);
      expect(input).toHaveValue('');

      //case 3: Enter first multiple number
      wrapper.setProps({ value: undefined });
      wrapper.setProps({ value: '' });
      wrapper.update();
      await simulateNativeKeyInput(user, input, '2456789', 0);
      expect(input).toHaveValue('2456 789_ ____ ____');

      //case 4: When alpha numeric character got added
      wrapper.setProps({ value: undefined });
      wrapper.setProps({ value: '' });
      wrapper.update();
      await simulateNativeKeyInput(user, input, '245sf6789', 0);
      expect(input).toHaveValue('2456 789_ ____ ____');

      //case 5: Similiar to case 4 but a formatted value got added
      wrapper.setProps({ value: undefined });
      wrapper.setProps({ value: '' });
      wrapper.update();
      await simulateNativeKeyInput(user, input, '1234 56', 0);
      expect(input).toHaveValue('1234 56__ ____ ____');

      //case 6: If format has numbers
      wrapper.setProps({ value: undefined });
      wrapper.setProps({ value: '', format: '+1 (###) ### # ##' });
      wrapper.update();
      await simulateNativeKeyInput(user, input, '123456', 0);
      expect(input).toHaveValue('+1 (123) 456 _ __');

      //case 7: If format has numbers and and formatted value is inserted
      wrapper.setProps({ value: undefined });
      wrapper.setProps({ value: '' });
      wrapper.update();
      await simulateNativeKeyInput(user, input, '+1 (965) 432 1 19', 0);
      expect(input).toHaveValue('+1 (965) 432 1 19');
    });

    it.only('should handle addition of characters at a cursor position', async () => {
      const { input, rerender, user } = await render(
        <NumericFormat thousandSeparator={true} prefix={'$'} value="$12,345" />,
      );

      await simulateNativeKeyInput(user, input, '8', 2, 2);
      expect(input).toHaveValue('$182,345');
      expect(input.selectionStart).toEqual(3);

      await simulateNativeKeyInput(user, input, '67', 3, 3);
      expect(input).toHaveValue('$18,672,345');
      expect(input.selectionStart).toEqual(6);
    });

    it.only('should handle addition of characters at a cursor position', async () => {
      const { input, rerender, user } = await render(
        <PatternFormat format={'### ### ###'} value="$12,345" />,
      );
      rerender(<PatternFormat format={'### ### ###'} value="123 456 789" />);
      await simulateNativeKeyInput(user, input, '8', 3, 3);
      expect(input).toHaveValue('123 845 678');
      expect(input.selectionStart).toEqual(5);

      await simulateNativeKeyInput(user, input, '999', 4, 4);
      expect(input).toHaveValue('123 999 845');
      expect(input.selectionStart).toEqual(7);
    });

    it.only('after typing decimal cursor position should go after the . when suffix is provided. #673', async () => {
      const { input, rerender, user } = await render(
        <NumericFormat
          type="text"
          allowNegative={false}
          valueIsNumericString={true}
          decimalScale={8}
          placeholder="Enter Amount"
          defaultValue="123"
          suffix=" USD"
        />,
      );
      await simulateNativeKeyInput(user, input, '.', 3, 3);
      expect(input.selectionStart).toEqual(4);
    });

    it.only('should bring caret to correct position if user types same number used in format pattern', async () => {
      const { input, rerender, user } = await render(
        <PatternFormat format="+1 (###) 2##-####" mask="_" />,
      );

      await simulateNativeKeyInput(user, input, '1', 0, 0);
      expect(input.selectionStart).toEqual(5);

      await simulateNativeKeyInput(user, input, '23', 5, 5);
      await simulateNativeKeyInput(user, input, '2', 7, 7);

      expect(input.selectionStart).toEqual(11);
    });
  });

  describe.only('Test delete/backspace with format pattern', () => {
    it('caret position should not change if its on starting of input area', async () => {
      const { input, rerender, user } = await render(
        <PatternFormat format="+1 (###) ### # ## US" value="+1 (123) 456 7 89 US" />,
      );

      await simulateNativeKeyInput(user, input, '{Backspace}', 4, 4);
      expect(input).toHaveValue('+1 (123) 456 7 89 US');
      expect(input.selectionStart).toEqual(4);
    });

    it('caret position should not change if its on end of input area', async () => {
      const { input, rerender, user } = await render(
        <PatternFormat format="+1 (###) ### # ## US" value="+1 (123) 456 7 89 US" />,
      );
      await simulateNativeKeyInput(user, input, '{Delete}', 17, 17);
      expect(input).toHaveValue('+1 (123) 456 7 89 US');
      expect(input.selectionStart).toEqual(17);
    });

    it('should remove the numeric part irrespective of the cursor position', async () => {
      const { input, rerender, user } = await render(
        <PatternFormat format="+1 (###) ### # ## US" mask="_" value="+1 (123) 456 7 89 US" />,
      );
      await simulateNativeKeyInput(user, input, '{Backspace}', 10, 10);
      expect(input).toHaveValue('+1 (123) 567 8 9_ US');
      expect(input.selectionStart).toEqual(9);

      await simulateNativeKeyInput(user, input, '{Backspace}', 9, 9);
      expect(input).toHaveValue('+1 (125) 678 9 __ US');
      expect(input.selectionStart).toEqual(6);

      await simulateNativeKeyInput(user, input, '{Delete}', 7, 7);
      expect(input).toHaveValue('+1 (125) 789 _ __ US');
      expect(input.selectionStart).toEqual(9);

      await simulateNativeKeyInput(user, input, '{Delete}', 9, 9);
      expect(input).toHaveValue('+1 (125) 89_ _ __ US');
      expect(input.selectionStart).toEqual(9);
    });
  });

  describe.only('Test delete/backspace with numeric format', () => {
    it('should not remove prefix', async () => {
      const { input, rerender, user } = await render(
        <NumericFormat
          thousandSeparator=","
          prefix="Rs. "
          suffix=" /sq.feet"
          value="Rs. 12,345.50 /sq.feet"
        />,
      );
      await simulateNativeKeyInput(user, input, '{Backspace}', 4, 4);
      expect(input).toHaveValue('Rs. 12,345.50 /sq.feet');
      expect(input.selectionStart).toEqual(4);
    });

    it('should not remove suffix', async () => {
      const { input, rerender, user } = await render(
        <NumericFormat
          thousandSeparator=","
          prefix="Rs. "
          suffix=" /sq.feet"
          value="Rs. 12,345.50 /sq.feet"
        />,
      );
      await simulateNativeKeyInput(user, input, '{Delete}', 13, 13);
      expect(input).toHaveValue('Rs. 12,345.50 /sq.feet');
      expect(input.selectionStart).toEqual(13);
    });

    it('should remove number, irrespective of the cursor position', async () => {
      const { input, rerender, user } = await render(
        <NumericFormat
          thousandSeparator=","
          prefix="Rs. "
          suffix=" /sq.feet"
          value="Rs. 12,345.50 /sq.feet"
        />,
      );

      // backspace after thousand separator separator
      await simulateNativeKeyInput(user, input, '{Backspace}', 7, 7);
      expect(input).toHaveValue('Rs. 1,345.50 /sq.feet');
      expect(input.selectionStart).toEqual(5);

      // delete before thousand separator separator
      await simulateNativeKeyInput(user, input, '{Delete}', 5, 5);
      expect(input).toHaveValue('Rs. 145.50 /sq.feet');
      expect(input.selectionStart).toEqual(5);

      // backspace after decimal separator
      await simulateNativeKeyInput(user, input, '{Backspace}', 8, 8);
      expect(input).toHaveValue('Rs. 14,550 /sq.feet');
      expect(input.selectionStart).toEqual(8);

      // delete before decimal separator
      await simulateNativeKeyInput(user, input, '.', 8, 8);
      await simulateNativeKeyInput(user, input, '{Delete}', 7, 7);
      expect(input).toHaveValue('Rs. 14,550 /sq.feet');
      expect(input.selectionStart).toEqual(8);
    });

    it('should maintain correct caret positon while removing the last character and suffix is not defined. Issue #105', async () => {
      const { input, rerender, user } = await render(
        <NumericFormat thousandSeparator="," prefix="$" suffix="" value="$2,342,343" />,
      );

      await simulateNativeKeyInput(user, input, '{Backspace}', 10, 10);
      expect(input).toHaveValue('$234,234');
      expect(input.selectionStart).toEqual(8);
    });

    it('should maintain correct caret position while removing the second last character and suffix is not defined, Issue #116', async () => {
      const { input, rerender, user } = await render(
        <NumericFormat thousandSeparator="," prefix="" suffix="" value="1,000" />,
      );

      await simulateNativeKeyInput(user, input, '{Backspace}', 4, 4);
      expect(input).toHaveValue('100');
      expect(input.selectionStart).toEqual(2);
    });

    it('should allow removing negation(-), even if its before prefix', async () => {
      const spy = vi.fn();

      const { input, rerender, user } = await render(
        <NumericFormat
          thousandSeparator=","
          suffix=""
          prefix="$"
          value="-$1,000"
          onValueChange={spy}
        />,
      );

      await simulateNativeKeyInput(user, input, '{Backspace}', 2, 2);

      expect(input).toHaveValue('$1,000');
      expect(input.selectionStart).toEqual(1);
      expect(spy).toHaveBeenCalled();
    });

    it('should maintain correct caret position if one of thousand separator is removed due to backspace. #695', async () => {
      const { input, rerender, user } = await render(
        <NumericFormat value={1234567.8901} thousandSeparator="." decimalSeparator="," />,
      );

      await simulateNativeKeyInput(user, input, '{Backspace}', 9, 9);
      expect(input).toHaveValue('123.456,8901');
      expect(input.selectionStart).toEqual(7);
    });
  });

  describe('Test arrow keys', () => {
    it('should keep caret position between the prefix and suffix', async () => {
      const { input, rerender, user } = await render(
        <NumericFormat
          thousandSeparator=","
          prefix="Rs. "
          suffix=" /sq.feet"
          value="Rs. 12,345.50 /sq.feet"
        />,
      );
      await simulateNativeKeyInput(user, input, 'ArrowLeft', 4, 4, setSelectionRange);
      expect(caretPos).toEqual(4);

      await simulateNativeKeyInput(user, input, 'ArrowRight', 13, 13, setSelectionRange);
      expect(caretPos).toEqual(13);
    });

    it('should keep caret position within typable area', async () => {
      const { input, rerender, user } = await render(
        <PatternFormat format="+1 (###) ### # ## US" value="+1 (123) 456 7 89 US" />,
      );
      await simulateNativeKeyInput(user, input, 'ArrowLeft', 4, 4, setSelectionRange);
      expect(caretPos).toEqual(4);

      await simulateNativeKeyInput(user, input, 'ArrowRight', 17, 17, setSelectionRange);
      expect(caretPos).toEqual(17);

      await simulateNativeKeyInput(user, input, 'ArrowRight', 7, 7, setSelectionRange);
      expect(caretPos).toEqual(9);

      await simulateNativeKeyInput(user, input, 'ArrowLeft', 9, 9, setSelectionRange);
      expect(caretPos).toEqual(7);

      caretPos = undefined;
      await simulateNativeKeyInput(user, input, 'ArrowRight', 12, 12, setSelectionRange);
      expect(caretPos).toEqual(13);

      caretPos = undefined;
      await simulateNativeKeyInput(user, input, 'ArrowLeft', 13, 13, setSelectionRange);
      expect(caretPos).toEqual(12);
    });

    // it('should not move caret positon from left most to right most if left key pressed. #154', async () => {
    //   const { input, rerender, user } = await render(<NumberFormatBase format={cardExpiry} value="11/11" />);
    //   caretPos = undefined;
    //   await simulateNativeKeyInput(user, input, 'ArrowLeft', 0, 0, setSelectionRange);
    //   expect(caretPos).toEqual(0);
    // });
  });

  describe('Test click / focus on input', () => {
    afterEach(async () => {
      jest.useRealTimers();
    });

    it('should always keep caret on typable area when we click on the input', async () => {
      const { input, rerender, user } = await render(
        <PatternFormat format="+1 (###) ### # ## US" value="+1 (123) 456 7 89 US" />,
      );

      simulateMousUpEvent(input, 0, setSelectionRange);
      expect(caretPos).toEqual(4);

      simulateMousUpEvent(input, 8, setSelectionRange);
      expect([7, 9]).toContain(caretPos);

      simulateMousUpEvent(input, 19, setSelectionRange);
      expect(caretPos).toEqual(17);
    });

    it('should limit the caret position to the next position of the typed number', async () => {
      const { input, rerender, user } = await render(<PatternFormat format="##/##/####" />);

      await simulateNativeKeyInput(user, input, '1', 0);
      expect(input).toHaveValue('1 /  /    ');

      simulateMousUpEvent(user, input, 4);
      expect(input.selectionStart).toEqual(1);
    });

    // TODO: Add test to check the position of the caret immediately after typing
    it('should limit the caret position to the next position of the typed number', async () => {
      const { input, rerender, user } = await render(
        <PatternFormat format="##/##/####" mask={['D', 'D', 'M', 'M', 'Y', 'Y', 'Y', 'Y']} />,
      );

      await simulateNativeKeyInput(user, input, '1212', 0);
      expect(input).toHaveValue('12/12/YYYY');
      simulateMousUpEvent(user, input, 8);
      expect(input.selectionStart).toEqual(6);
    });

    it('should always keep caret position between suffix and prefix', async () => {
      const { input, rerender, user } = await render(
        <NumericFormat
          thousandSeparator=","
          prefix="Rs. "
          suffix=" /sq.feet"
          value="Rs. 12,345.50 /sq.feet"
        />,
      );

      simulateMousUpEvent(user, input, 0);
      expect(input.selectionStart).toEqual(4);

      simulateMousUpEvent(user, input, 17);
      expect(input.selectionStart).toEqual(13);
    });

    it('should correct wrong caret position on focus', async () => {
      jest.useFakeTimers();
      const { input, rerender, user } = await render(
        <NumericFormat
          thousandSeparator=","
          prefix="Rs. "
          suffix=" /sq.feet"
          value="Rs. 12,345.50 /sq.feet"
        />,
      );

      simulateFocusEvent(input, 0, 0, setSelectionRange);
      jest.advanceTimersByTime(1);
      expect(caretPos).toEqual(4);
      jest.useRealTimers();
    });

    it('should clear active timers', async () => {
      jest.useFakeTimers();
      const onFocus = jest.fn();
      const { input, rerender, user } = await render(<NumericFormat onFocus={onFocus} />);

      simulateFocusEvent(input, 0, 0, setSelectionRange);

      wrapper.unrender();
      jest.advanceTimersByTime(1);

      expect(onFocus).toHaveBeenCalledTimes(0);
    });

    it('should correct wrong caret positon on focus when allowEmptyFormatting is set', async () => {
      jest.useFakeTimers();
      const { input, rerender, user } = await render(
        <PatternFormat
          format="+1 (###) ### # ## US"
          allowEmptyFormatting={true}
          value=""
          mask="_"
        />,
      );

      simulateFocusEvent(input, 1, 1, setSelectionRange);
      jest.advanceTimersByTime(1);
      expect(caretPos).toEqual(4);
      jest.useRealTimers();
    });

    it('should not reset correct caret position on focus', async () => {
      jest.useFakeTimers();
      const { input, rerender, user } = await render(
        <NumericFormat
          thousandSeparator=","
          prefix="Rs. "
          suffix=" /sq.feet"
          value="Rs. 12,345.50 /sq.feet"
        />,
      );

      // Note: init caretPos to `6`. Focus to `6`. In case of bug, selectionStart is `0` and the caret will move to `4`.
      //   otherwise (correct behaviour) the value will not change, and stay `6`
      caretPos = 6;
      simulateFocusEvent(input, 6, 6, setSelectionRange);
      jest.advanceTimersByTime(1);
      expect(caretPos).toEqual(6);
      jest.useRealTimers();
    });

    it('should not reset caret position on focus when full value is selected', async () => {
      jest.useFakeTimers();
      const value = 'Rs. 12,345.50 /sq.feet';
      const { input, rerender, user } = await render(
        <NumericFormat thousandSeparator="," prefix="Rs. " suffix=" /sq.feet" value={value} />,
      );

      simulateFocusEvent(input, 0, value.length, setSelectionRange);
      jest.advanceTimersByTime(1);
      expect(caretPos).toEqual(0);
    });
  });
});
