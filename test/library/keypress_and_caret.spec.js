import React, { useState } from 'react';
import NumericFormat from '../../src/numeric_format';
import PatternFormat from '../../src/pattern_format';
import NumberFormatBase from '../../src/number_format_base';
import { cleanup, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {
  simulateFocusEvent,
  mount,
  persist,
  render,
  simulateNativeKeyInput,
  wait,
  simulatePaste,
  simulateNativeMouseUpEvent,
} from '../test_util';
import { cardExpiry } from '../../custom_formatters/card_expiry';

describe('Test keypress and caret position changes', () => {
  let caretPos;
  const setSelectionRange = (pos) => {
    caretPos = pos;
  };

  beforeEach(() => {
    caretPos = 0;
    persist.calls.reset();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
    cleanup();
  });

  it('should maintain caret position if suffix/prefix is updated while typing #249', async () => {
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
    simulateNativeKeyInput(input, '4', 2, 2);
    expect(input.value).toEqual('$$1423');
    expect(input.selectionStart).toEqual(4);

    simulateNativeKeyInput(input, '{backspace}', 4, 4);

    expect(input.value).toEqual('$123');
    expect(input.selectionStart).toEqual(2);
  });

  it('should maintain caret position when isAllowed returns false', async () => {
    const { input } = await render(
      <NumericFormat
        isAllowed={({ floatValue }) => {
          return floatValue < 100;
        }}
        value={100.222}
      />,
    );

    simulateNativeKeyInput(input, '1', 2, 2);

    expect(input.value).toEqual('100.222');

    await wait(100);
    expect(input.selectionStart).toEqual(2);
  });

  it('should update caret position when any of the decimal separator is pressed just before the decimal separator #711', async () => {
    const { input } = await render(
      <NumericFormat
        value={12}
        allowedDecimalSeparators={[',', '.']}
        decimalSeparator=","
        thousandSeparator="."
        decimalScale={3}
        fixedDecimalScale
      />,
    );

    simulateNativeKeyInput(input, ',', 2, 2);
    expect(input.selectionStart).toEqual(3);

    simulateNativeKeyInput(input, '.', 2, 2);
    expect(input.selectionStart).toEqual(3);
  });

  it('should not break the cursor position when format prop is updated', async () => {
    const Test = () => {
      const [val, setValue] = useState();
      return (
        <NumericFormat
          thousandSeparator=" "
          decimalScale={2}
          placeholder="0,00"
          fixedDecimalScale
          thousandsGroupStyle="thousand"
          decimalSeparator=","
          value={val}
          onValueChange={(v) => {
            setValue(v.floatValue);
          }}
          prefix={val > 0 ? '+' : undefined}
        />
      );
    };

    const { input } = await render(<Test />);
    simulateNativeKeyInput(input, '1', 0, 0);
    expect(input.value).toEqual('+1,00');
    expect(input.selectionStart).toEqual(2);
  });

  it('should put correct position when . is pressed on empty value #817', async () => {
    const Test = () => {
      const [value, setValue] = useState();
      return (
        <NumericFormat
          autoComplete="off"
          fixedDecimalScale
          decimalScale={2}
          onValueChange={(obj) => {
            setValue(obj.value);
          }}
          value={value}
          allowNegative={false}
          allowLeadingZeros={false}
        />
      );
    };

    const { input } = await render(<Test />);
    simulateNativeKeyInput(input, '.5', 0, 0);

    expect(input.selectionStart).toEqual(2);

    input.blur();

    await wait(0);

    expect(input.value).toEqual('0.50');
  });

  it('should handle caret position correctly when suffix starts with space and allowed decimal separator is pressed. #725', async () => {
    const { input } = await render(
      <NumericFormat
        value={2}
        decimalSeparator=","
        thousandSeparator="."
        decimalScale={2}
        prefix="$"
        suffix=" €"
      />,
    );

    simulateNativeKeyInput(input, '.', 2, 2);
    expect(input.selectionStart).toEqual(3);
  });

  it('should handle caret position correctly when suffix starts with space and allowed decimal separator is pressed in empty input. #774', async () => {
    const { input } = await render(
      <NumericFormat
        value={''}
        decimalSeparator=","
        allowedDecimalSeparators={['%', '.']}
        decimalScale={2}
        suffix=" €"
      />,
    );

    simulateNativeKeyInput(input, '.', 0, 0);
    expect(input.selectionStart).toEqual(1);
  });

  it('should handle the caret position when prefix is provided and number is entered on empty input', async () => {
    const { input } = await render(<NumericFormat value={''} prefix="$" />);

    simulateNativeKeyInput(input, '1', 0, 0);
    expect(input.selectionStart).toEqual(2);
  });

  it('should handle the caret position when prefix is provided and allowed decimal separator is entered on empty input', async () => {
    const { input } = await render(
      <NumericFormat
        value={''}
        decimalSeparator=","
        allowedDecimalSeparators={['%', '.']}
        prefix="$"
      />,
    );

    simulateNativeKeyInput(input, '.', 0, 0);
    expect(input.selectionStart).toEqual(2);
  });

  it('should not reset caret position if caret is updated by browser after we set caret position #811', async () => {
    // https://codesandbox.io/p/sandbox/recursing-poitras-rxtjkj?file=%2Fsrc%2Findex.test.js%3A15%2C5-15%2C44
    const { input } = await render(
      <NumericFormat
        allowLeadingZeros={false}
        allowNegative={false}
        decimalSeparator="."
        displayType="input"
        placeholder="people"
        suffix=" people"
        valueIsNumericString={false}
      />,
    );

    await userEvent.type(input, '91');

    expect(input.value).toEqual('91 people');
  });

  describe('Test character insertion', () => {
    it('should add any number properly when input is empty without format prop passed', async () => {
      const { input } = await render(<NumericFormat thousandSeparator={true} prefix={'$'} />);

      simulateNativeKeyInput(input, '1', 0, 0);
      expect(input.value).toEqual('$1');

      input.value = '';

      simulateNativeKeyInput(input, '2456789', 0, 0);
      expect(input.value).toEqual('$2,456,789');
    });

    it('should add any number properly when input is empty with format prop passed', async () => {
      //case 1: Enter first number
      const { input, rerender } = await render(
        <PatternFormat format="#### #### #### ####" mask="_" />,
      );
      simulateNativeKeyInput(input, '1', 0, 0);
      expect(input.value).toEqual('1___ ____ ____ ____');

      //case 2: if nun numeric character got added
      input.value = '';
      simulateNativeKeyInput(input, 'b', 0, 0);
      expect(input.value).toEqual('');

      //case 3: Enter first multiple number
      input.value = '';
      simulatePaste(input, '2456789', 0, 0);
      expect(input.value).toEqual('2456 789_ ____ ____');

      //case 4: When alpha numeric character got added
      input.value = '';
      simulatePaste(input, '245sf6789', 0, 0);
      expect(input.value).toEqual('2456 789_ ____ ____');

      //case 5: Similiar to case 4 but a formatted value got added
      input.value = '';
      simulatePaste(input, '1234 56', 0, 0);
      expect(input.value).toEqual('1234 56__ ____ ____');

      //case 6: If format has numbers
      rerender(<PatternFormat format="+1 (###) ### # ##" mask="_" value={''} />);
      simulatePaste(input, '123456', 0, 0);
      expect(input.value).toEqual('+1 (123) 456 _ __');

      //case 7: If format has numbers and and formatted value is inserted
      input.value = '';
      simulatePaste(input, '+1 (965) 432 1 19', 0, 0);
      expect(input.value).toEqual('+1 (965) 432 1 19');
    });

    it('should handle addition of characters at a cursor position for numeric format', async () => {
      const { input } = await render(
        <NumericFormat thousandSeparator={true} prefix={'$'} value="$12,345" />,
      );

      simulateNativeKeyInput(input, '8', 2, 2);
      expect(input.value).toEqual('$182,345');
      expect(input.selectionStart).toEqual(3);

      simulateNativeKeyInput(input, '67', 3, 3);
      expect(input.value).toEqual('$18,672,345');
      expect(input.selectionStart).toEqual(6);
    });

    it('should handle addition of characters at a cursor position for patter format', async () => {
      const { input, rerender } = await render(
        <PatternFormat format={'### ### ###'} value="$12,345" />,
      );

      rerender(<PatternFormat format={'### ### ###'} value="123 456 789" />);
      simulateNativeKeyInput(input, '8', 3, 3);
      expect(input.value).toEqual('123 845 678');
      expect(input.selectionStart).toEqual(5);

      simulateNativeKeyInput(input, '999', 4, 4);
      expect(input.value).toEqual('123 999 845');
      expect(input.selectionStart).toEqual(7);
    });

    it('after typing decimal cursor position should go after the . when suffix is provided. #673', async () => {
      const { input } = await render(
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
      simulateNativeKeyInput(input, '.', 3, 3);
      expect(input.selectionStart).toEqual(4);
    });

    it('should bring caret to correct position if user types same number used in format pattern', async () => {
      const { input } = await render(<PatternFormat format="+1 (###) 2##-####" mask="_" />);

      simulateNativeKeyInput(input, '1', 0, 0);
      expect(input.selectionStart).toEqual(5);

      simulateNativeKeyInput(input, '23', 5, 5);
      simulateNativeKeyInput(input, '2', 7, 7);

      expect(input.selectionStart).toEqual(11);
    });
  });

  describe('Test delete/backspace with format pattern', async () => {
    it('caret position should not change if its on starting of input area', async () => {
      const { input } = await render(
        <PatternFormat format="+1 (###) ### # ## US" value="+1 (123) 456 7 89 US" />,
      );

      simulateNativeKeyInput(input, '{backspace}', 4, 4);
      expect(input.value).toEqual('+1 (123) 456 7 89 US');
      expect(input.selectionStart).toEqual(4);
    });

    it('caret position should not change if its on end of input area', async () => {
      const { input } = await render(
        <PatternFormat format="+1 (###) ### # ## US" value="+1 (123) 456 7 89 US" />,
      );
      simulateNativeKeyInput(input, '{delete}', 17, 17);
      expect(input.value).toEqual('+1 (123) 456 7 89 US');
      expect(input.selectionStart).toEqual(17);
    });

    it('should remove the numeric part irrespective of the cursor position', async () => {
      const { input } = await render(
        <PatternFormat format="+1 (###) ### # ## US" mask="_" value="+1 (123) 456 7 89 US" />,
      );
      simulateNativeKeyInput(input, '{backspace}', 10, 10);
      expect(input.value).toEqual('+1 (123) 567 8 9_ US');
      expect(input.selectionStart).toEqual(9);

      simulateNativeKeyInput(input, '{backspace}', 9, 9);
      expect(input.value).toEqual('+1 (125) 678 9 __ US');
      expect(input.selectionStart).toEqual(6);

      simulateNativeKeyInput(input, '{delete}', 7, 7);
      expect(input.value).toEqual('+1 (125) 789 _ __ US');
      expect(input.selectionStart).toEqual(9);

      simulateNativeKeyInput(input, '{delete}', 9, 9);
      expect(input.value).toEqual('+1 (125) 89_ _ __ US');
      expect(input.selectionStart).toEqual(9);
    });
  });

  describe('Test delete/backspace with numeric format', () => {
    it('should not remove prefix', async () => {
      const { input } = await render(
        <NumericFormat
          thousandSeparator=","
          prefix="Rs. "
          suffix=" /sq.feet"
          value="Rs. 12,345.50 /sq.feet"
        />,
      );
      simulateNativeKeyInput(input, '{backspace}', 4, 4);
      expect(input.value).toEqual('Rs. 12,345.50 /sq.feet');
      expect(input.selectionStart).toEqual(4);
    });

    it('should not remove suffix', async () => {
      const { input } = await render(
        <NumericFormat
          thousandSeparator=","
          prefix="Rs. "
          suffix=" /sq.feet"
          value="Rs. 12,345.50 /sq.feet"
        />,
      );
      simulateNativeKeyInput(input, '{delete}', 13, 13);
      expect(input.value).toEqual('Rs. 12,345.50 /sq.feet');
      expect(input.selectionStart).toEqual(13);
    });

    it('should remove number, irrespective of the cursor position', async () => {
      const { input } = await render(
        <NumericFormat
          thousandSeparator=","
          prefix="Rs. "
          suffix=" /sq.feet"
          value="Rs. 12,345.50 /sq.feet"
        />,
      );

      // backspace after thousand separator separator
      simulateNativeKeyInput(input, '{backspace}', 7, 7);
      expect(input.value).toEqual('Rs. 1,345.50 /sq.feet');
      expect(input.selectionStart).toEqual(5);

      // delete before thousand separator separator
      simulateNativeKeyInput(input, '{delete}', 5, 5);
      expect(input.value).toEqual('Rs. 145.50 /sq.feet');
      expect(input.selectionStart).toEqual(5);

      // backspace after decimal separator
      simulateNativeKeyInput(input, '{backspace}', 8, 8);
      expect(input.value).toEqual('Rs. 14,550 /sq.feet');
      expect(input.selectionStart).toEqual(8);

      // delete before decimal separator
      simulateNativeKeyInput(input, '.', 8, 8);
      simulateNativeKeyInput(input, '{delete}', 7, 7);
      expect(input.value).toEqual('Rs. 14,550 /sq.feet');
      expect(input.selectionStart).toEqual(8);
    });

    it('should maintain correct caret positon while removing the last character and suffix is not defined. Issue #105', async () => {
      const { input } = await render(
        <NumericFormat thousandSeparator="," prefix="$" suffix="" value="$2,342,343" />,
      );

      simulateNativeKeyInput(input, '{backspace}', 10, 10);
      expect(input.value).toEqual('$234,234');
      expect(input.selectionStart).toEqual(8);
    });

    it('should maintain correct caret position while removing the second last character and suffix is not defined, Issue #116', async () => {
      const { input } = await render(
        <NumericFormat thousandSeparator="," prefix="" suffix="" value="1,000" />,
      );

      simulateNativeKeyInput(input, '{backspace}', 4, 4);
      expect(input.value).toEqual('100');
      expect(input.selectionStart).toEqual(2);
    });

    it('should allow removing negation(-), even if its before prefix', async () => {
      const spy = jasmine.createSpy();

      const { input } = await render(
        <NumericFormat
          thousandSeparator=","
          suffix=""
          prefix="$"
          value="-$1,000"
          onValueChange={spy}
        />,
      );

      simulateNativeKeyInput(input, '{backspace}', 2, 2);

      expect(input.value).toEqual('$1,000');
      expect(input.selectionStart).toEqual(1);
      expect(spy).toHaveBeenCalled();
    });

    it('should maintain correct caret position if one of thousand separator is removed due to backspace. #695', async () => {
      const { input } = await render(
        <NumericFormat value={1234567.8901} thousandSeparator="." decimalSeparator="," />,
      );

      simulateNativeKeyInput(input, '{backspace}', 9, 9);
      expect(input.value).toEqual('123.456,8901');
      expect(input.selectionStart).toEqual(7);
    });
  });

  describe('Test arrow keys', () => {
    it('should keep caret position between the prefix and suffix', async () => {
      const { input } = await render(
        <NumericFormat
          thousandSeparator=","
          prefix="Rs. "
          suffix=" /sq.feet"
          value="Rs. 12,345.50 /sq.feet"
        />,
      );
      simulateNativeKeyInput(input, '{arrowleft}', 4, 4);
      expect(input.selectionStart).toEqual(4);

      simulateNativeKeyInput(input, '{arrowright}', 13, 13);
      expect(input.selectionStart).toEqual(13);
    });

    it('should keep caret position within typable area', async () => {
      const { input } = await render(
        <PatternFormat format="+1 (###) ### # ## US" value="+1 (123) 456 7 89 US" />,
      );
      simulateNativeKeyInput(input, '{arrowleft}', 4, 4);
      expect(input.selectionStart).toEqual(4);

      simulateNativeKeyInput(input, '{arrowright}', 17, 17);
      expect(input.selectionStart).toEqual(17);

      simulateNativeKeyInput(input, '{arrowright}', 7, 7);
      expect(input.selectionStart).toEqual(9);

      simulateNativeKeyInput(input, '{arrowleft}', 9, 9);
      expect(input.selectionStart).toEqual(7);

      simulateNativeKeyInput(input, '{arrowright}', 12, 12);
      expect(input.selectionStart).toEqual(13);

      simulateNativeKeyInput(input, '{arrowleft}', 13, 13);
      expect(input.selectionStart).toEqual(12);
    });

    it('should not move caret positon from left most to right most if left key pressed. #154', async () => {
      const { input } = await render(<NumberFormatBase format={cardExpiry} value="11/11" />);

      input.setSelectionRange(0, 0);
      fireEvent.keyDown(input, { key: 'ArrowLeft' });

      expect(input.selectionStart).toEqual(0);
    });
  });

  describe('Test click / focus on input', () => {
    afterEach(() => {
      jasmine.clock().uninstall();
    });

    it('should always keep caret on typable area when we click on the input', async () => {
      const { input } = await render(
        <PatternFormat format="+1 (###) ### # ## US" value="+1 (123) 456 7 89 US" />,
      );

      simulateNativeMouseUpEvent(input, 0);
      expect(input.selectionStart).toEqual(4);

      simulateNativeMouseUpEvent(input, 8);
      expect(input.selectionStart).toEqual(9);

      simulateNativeMouseUpEvent(input, 19);
      expect(input.selectionStart).toEqual(17);
    });

    it('should limit the caret position to the next position of the typed number', async () => {
      const { input, rerender } = await render(<PatternFormat format="##/##/####" />);

      simulateNativeKeyInput(input, '1', 0, 0);
      expect(input.value).toEqual('1 /  /    ');

      simulateNativeMouseUpEvent(input, 4);
      expect(input.selectionStart).toEqual(1);

      rerender(
        <PatternFormat format="##/##/####" mask={['D', 'D', 'M', 'M', 'Y', 'Y', 'Y', 'Y']} />,
      );

      expect(input.value).toEqual('1D/MM/YYYY');
      simulateNativeMouseUpEvent(input, 4);
      expect(input.selectionStart).toEqual(1);
    });

    it('should always keep caret position between suffix and prefix', async () => {
      const { input } = await render(
        <NumericFormat
          thousandSeparator=","
          prefix="Rs. "
          suffix=" /sq.feet"
          value="Rs. 12,345.50 /sq.feet"
        />,
      );

      simulateNativeMouseUpEvent(input, 0);
      expect(input.selectionStart).toEqual(4);

      simulateNativeMouseUpEvent(input, 17);
      expect(input.selectionStart).toEqual(13);
    });

    it('should correct wrong caret position on focus', () => {
      jasmine.clock().install();
      const wrapper = mount(
        <NumericFormat
          thousandSeparator=","
          prefix="Rs. "
          suffix=" /sq.feet"
          value="Rs. 12,345.50 /sq.feet"
        />,
      );

      simulateFocusEvent(wrapper.find('input'), 0, 0, setSelectionRange);
      jasmine.clock().tick(1);
      expect(caretPos).toEqual(4);
      jasmine.clock().uninstall();
    });

    it('should clear active timers', () => {
      jasmine.clock().install();
      const onFocus = jasmine.createSpy();
      const wrapper = mount(<NumericFormat onFocus={onFocus} />);

      simulateFocusEvent(wrapper.find('input'), 0, 0, setSelectionRange);

      wrapper.unmount();
      jasmine.clock().tick(1);

      expect(onFocus).toHaveBeenCalledTimes(0);
    });

    it('should correct wrong caret position on focus when allowEmptyFormatting is set', () => {
      jasmine.clock().install();
      const wrapper = mount(
        <PatternFormat
          format="+1 (###) ### # ## US"
          allowEmptyFormatting={true}
          value=""
          mask="_"
        />,
      );

      simulateFocusEvent(wrapper.find('input'), 1, 1, setSelectionRange);
      jasmine.clock().tick(1);
      expect(caretPos).toEqual(4);
      jasmine.clock().uninstall();
    });

    it('should not reset correct caret position on focus', () => {
      jasmine.clock().install();
      const wrapper = mount(
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
      simulateFocusEvent(wrapper.find('input'), 6, 6, setSelectionRange);
      jasmine.clock().tick(1);
      expect(caretPos).toEqual(6);
      jasmine.clock().uninstall();
    });

    it('should not reset caret position on focus when full value is selected', () => {
      jasmine.clock().install();
      const value = 'Rs. 12,345.50 /sq.feet';
      const wrapper = mount(
        <NumericFormat thousandSeparator="," prefix="Rs. " suffix=" /sq.feet" value={value} />,
      );

      simulateFocusEvent(wrapper.find('input'), 0, value.length, setSelectionRange);
      jasmine.clock().tick(1);
      expect(caretPos).toEqual(0);
    });
  });
});
