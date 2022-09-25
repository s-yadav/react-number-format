import React from 'react';
import NumericFormat from '../../src/numeric_format';
import PatternFormat from '../../src/pattern_format';
import NumberFormatBase from '../../src/number_format_base';
import ReactDOM from 'react-dom';
import { cleanup } from '@testing-library/react';

import {
  simulateKeyInput,
  simulateMousUpEvent,
  simulateFocusEvent,
  mount,
  persist,
  getInputValue,
  render,
  simulateNativeKeyInput,
  wait,
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

  it('should maintain caret position if suffix/prefix is updated while typing #249', () => {
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

    const wrapper = mount(<TestComp />);
    simulateFocusEvent(wrapper.find('input'), 0, 0, setSelectionRange);
    simulateKeyInput(wrapper.find('input'), '4', 2, 2, setSelectionRange);
    expect(ReactDOM.findDOMNode(wrapper.instance()).value).toEqual('$$1423');
    expect(caretPos).toEqual(4);

    simulateKeyInput(wrapper.find('input'), 'Backspace', 4, 4, setSelectionRange);
    expect(ReactDOM.findDOMNode(wrapper.instance()).value).toEqual('$123');
    expect(caretPos).toEqual(2);
  });

  describe('Test character insertion', () => {
    it('should add any number properly when input is empty without format prop passed', () => {
      const wrapper = mount(<NumericFormat thousandSeparator={true} prefix={'$'} />);

      simulateKeyInput(wrapper.find('input'), '1', 0);

      expect(getInputValue(wrapper)).toEqual('$1');

      wrapper.setProps({ value: '' });
      wrapper.update();

      simulateKeyInput(wrapper.find('input'), '2456789', 0);

      expect(getInputValue(wrapper)).toEqual('$2,456,789');
    });

    it('should add any number properly when input is empty with format prop passed', () => {
      //case 1: Enter first number
      const wrapper = mount(<PatternFormat format="#### #### #### ####" mask="_" />);
      simulateKeyInput(wrapper.find('input'), '1', 0);
      expect(getInputValue(wrapper)).toEqual('1___ ____ ____ ____');

      //case 2: if nun numeric character got added
      wrapper.setProps({ value: '' });
      wrapper.update();
      simulateKeyInput(wrapper.find('input'), 'b', 0);
      expect(getInputValue(wrapper)).toEqual('');

      //case 3: Enter first multiple number
      wrapper.setProps({ value: undefined });
      wrapper.setProps({ value: '' });
      wrapper.update();
      simulateKeyInput(wrapper.find('input'), '2456789', 0);
      expect(getInputValue(wrapper)).toEqual('2456 789_ ____ ____');

      //case 4: When alpha numeric character got added
      wrapper.setProps({ value: undefined });
      wrapper.setProps({ value: '' });
      wrapper.update();
      simulateKeyInput(wrapper.find('input'), '245sf6789', 0);
      expect(getInputValue(wrapper)).toEqual('2456 789_ ____ ____');

      //case 5: Similiar to case 4 but a formatted value got added
      wrapper.setProps({ value: undefined });
      wrapper.setProps({ value: '' });
      wrapper.update();
      simulateKeyInput(wrapper.find('input'), '1234 56', 0);
      expect(getInputValue(wrapper)).toEqual('1234 56__ ____ ____');

      //case 6: If format has numbers
      wrapper.setProps({ value: undefined });
      wrapper.setProps({ value: '', format: '+1 (###) ### # ##' });
      wrapper.update();
      simulateKeyInput(wrapper.find('input'), '123456', 0);
      expect(getInputValue(wrapper)).toEqual('+1 (123) 456 _ __');

      //case 7: If format has numbers and and formatted value is inserted
      wrapper.setProps({ value: undefined });
      wrapper.setProps({ value: '' });
      wrapper.update();
      simulateKeyInput(wrapper.find('input'), '+1 (965) 432 1 19', 0);
      expect(getInputValue(wrapper)).toEqual('+1 (965) 432 1 19');
    });

    it('should handle addition of characters at a cursor position', () => {
      let wrapper = mount(<NumericFormat thousandSeparator={true} prefix={'$'} value="$12,345" />);

      simulateKeyInput(wrapper.find('input'), '8', 2, 2, setSelectionRange);
      expect(getInputValue(wrapper)).toEqual('$182,345');
      expect(caretPos).toEqual(3);

      simulateKeyInput(wrapper.find('input'), '67', 3, 3, setSelectionRange);
      expect(getInputValue(wrapper)).toEqual('$18,672,345');
      expect(caretPos).toEqual(6);

      wrapper = mount(<PatternFormat format={'### ### ###'} value="$12,345" />);
      wrapper.setProps({ format: '### ### ###', value: '123 456 789' });
      wrapper.update();
      simulateKeyInput(wrapper.find('input'), '8', 3, 3, setSelectionRange);
      expect(getInputValue(wrapper)).toEqual('123 845 678');
      expect(caretPos).toEqual(5);

      simulateKeyInput(wrapper.find('input'), '999', 4, 4, setSelectionRange);
      expect(getInputValue(wrapper)).toEqual('123 999 845');
      expect(caretPos).toEqual(7);
    });

    it('after typing decimal cursor position should go after the . when suffix is provided. #673', () => {
      let caretPos;
      const setSelectionRange = (pos) => {
        caretPos = pos;
      };

      const wrapper = mount(
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
      simulateKeyInput(wrapper.find('input'), '.', 3, 3, setSelectionRange);

      expect(caretPos).toEqual(4);
    });
  });

  describe('Test delete/backspace with format pattern', async () => {
    it('caret position should not change if its on starting of input area', async () => {
      const { input } = await render(
        <PatternFormat format="+1 (###) ### # ## US" value="+1 (123) 456 7 89 US" />,
      );

      simulateNativeKeyInput(input, '{backspace}', 4, 4);
      await wait(1);
      expect(input.value).toEqual('+1 (123) 456 7 89 US');
      expect(input.selectionStart).toEqual(4);
    });

    it('caret position should not change if its on end of input area', async () => {
      const { input } = await render(
        <PatternFormat format="+1 (###) ### # ## US" value="+1 (123) 456 7 89 US" />,
      );
      simulateNativeKeyInput(input, '{delete}', 17, 17);
      await wait(1);
      expect(input.value).toEqual('+1 (123) 456 7 89 US');
      expect(input.selectionStart).toEqual(17);
    });

    it('should remove the numeric part irrespective of the cursor position', async () => {
      const { input } = await render(
        <PatternFormat format="+1 (###) ### # ## US" mask="_" value="+1 (123) 456 7 89 US" />,
      );
      simulateNativeKeyInput(input, '{backspace}', 10, 10);
      await wait(1);
      expect(input.value).toEqual('+1 (123) 567 8 9_ US');
      expect(input.selectionStart).toEqual(9);

      simulateNativeKeyInput(input, '{backspace}', 9, 9);
      await wait(1);
      expect(input.value).toEqual('+1 (125) 678 9 __ US');
      expect(input.selectionStart).toEqual(6);

      simulateNativeKeyInput(input, '{delete}', 7, 7);
      await wait(1);
      expect(input.value).toEqual('+1 (125) 789 _ __ US');
      expect(input.selectionStart).toEqual(9);

      simulateNativeKeyInput(input, '{delete}', 9, 9);
      await wait(1);
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
      await wait(1);
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
      await wait();
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
      await wait();
      expect(input.value).toEqual('Rs. 1,345.50 /sq.feet');
      expect(input.selectionStart).toEqual(5);

      // delete before thousand separator separator
      simulateNativeKeyInput(input, '{delete}', 5, 5);
      await wait();
      expect(input.value).toEqual('Rs. 145.50 /sq.feet');
      expect(input.selectionStart).toEqual(5);

      // backspace after decimal separator
      simulateNativeKeyInput(input, '{backspace}', 8, 8);
      await wait();
      expect(input.value).toEqual('Rs. 14,550 /sq.feet');
      expect(input.selectionStart).toEqual(8);

      // delete before decimal separator
      simulateNativeKeyInput(input, '.', 8, 8);
      await wait();
      simulateNativeKeyInput(input, '{delete}', 7, 7);
      await wait();
      expect(input.value).toEqual('Rs. 14,550 /sq.feet');
      expect(input.selectionStart).toEqual(8);
    });

    it('should maintain correct caret positon while removing the last character and suffix is not defined. Issue #105', async () => {
      const { input } = await render(
        <NumericFormat thousandSeparator="," prefix="$" suffix="" value="$2,342,343" />,
      );

      simulateNativeKeyInput(input, '{backspace}', 10, 10);
      await wait();
      expect(input.value).toEqual('$234,234');
      expect(input.selectionStart).toEqual(8);
    });

    it('should maintain correct caret position while removing the second last character and suffix is not defined, Issue #116', async () => {
      const { input } = await render(
        <NumericFormat thousandSeparator="," prefix="" suffix="" value="1,000" />,
      );

      simulateNativeKeyInput(input, '{backspace}', 4, 4);
      await wait();
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
      await wait();

      expect(input.value).toEqual('$1,000');
      expect(input.selectionStart).toEqual(1);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('Test arrow keys', () => {
    it('should keep caret position between the prefix and suffix', () => {
      const wrapper = mount(
        <NumericFormat
          thousandSeparator=","
          prefix="Rs. "
          suffix=" /sq.feet"
          value="Rs. 12,345.50 /sq.feet"
        />,
      );
      simulateKeyInput(wrapper.find('input'), 'ArrowLeft', 4, 4, setSelectionRange);
      expect(caretPos).toEqual(4);

      simulateKeyInput(wrapper.find('input'), 'ArrowRight', 13, 13, setSelectionRange);
      expect(caretPos).toEqual(13);
    });

    it('should keep caret position within typable area', () => {
      const wrapper = mount(
        <PatternFormat format="+1 (###) ### # ## US" value="+1 (123) 456 7 89 US" />,
      );
      simulateKeyInput(wrapper.find('input'), 'ArrowLeft', 4, 4, setSelectionRange);
      expect(caretPos).toEqual(4);

      simulateKeyInput(wrapper.find('input'), 'ArrowRight', 17, 17, setSelectionRange);
      expect(caretPos).toEqual(17);

      simulateKeyInput(wrapper.find('input'), 'ArrowRight', 7, 7, setSelectionRange);
      expect(caretPos).toEqual(9);

      simulateKeyInput(wrapper.find('input'), 'ArrowLeft', 9, 9, setSelectionRange);
      expect(caretPos).toEqual(7);

      caretPos = undefined;
      simulateKeyInput(wrapper.find('input'), 'ArrowRight', 12, 12, setSelectionRange);
      expect(caretPos).toEqual(13);

      caretPos = undefined;
      simulateKeyInput(wrapper.find('input'), 'ArrowLeft', 13, 13, setSelectionRange);
      expect(caretPos).toEqual(12);
    });

    it('should not move caret positon from left most to right most if left key pressed. #154', () => {
      const wrapper = mount(<NumberFormatBase format={cardExpiry} value="11/11" />);
      caretPos = undefined;
      simulateKeyInput(wrapper.find('input'), 'ArrowLeft', 0, 0, setSelectionRange);
      expect(caretPos).toEqual(0);
    });
  });

  describe('Test click / focus on input', () => {
    afterEach(() => {
      jasmine.clock().uninstall();
    });

    it('should always keep caret on typable area when we click on the input', () => {
      const wrapper = mount(
        <PatternFormat format="+1 (###) ### # ## US" value="+1 (123) 456 7 89 US" />,
      );

      simulateMousUpEvent(wrapper.find('input'), 0, setSelectionRange);
      expect(caretPos).toEqual(4);

      simulateMousUpEvent(wrapper.find('input'), 8, setSelectionRange);
      expect([7, 9]).toContain(caretPos);

      simulateMousUpEvent(wrapper.find('input'), 19, setSelectionRange);
      expect(caretPos).toEqual(17);
    });

    it('should limit the caret position to the next position of the typed number', () => {
      const wrapper = mount(<PatternFormat format="##/##/####" />);

      simulateKeyInput(wrapper.find('input'), '1', 0);
      expect(getInputValue(wrapper)).toEqual('1 /  /    ');

      simulateMousUpEvent(wrapper.find('input'), 4, setSelectionRange);
      expect(caretPos).toEqual(1);

      wrapper.setProps({
        mask: ['D', 'D', 'M', 'M', 'Y', 'Y', 'Y', 'Y'],
      });
      wrapper.update();

      expect(getInputValue(wrapper)).toEqual('1D/MM/YYYY');
      simulateMousUpEvent(wrapper.find('input'), 4, setSelectionRange);
      expect(caretPos).toEqual(1);
    });

    it('should always keep caret position between suffix and prefix', () => {
      const wrapper = mount(
        <NumericFormat
          thousandSeparator=","
          prefix="Rs. "
          suffix=" /sq.feet"
          value="Rs. 12,345.50 /sq.feet"
        />,
      );

      simulateMousUpEvent(wrapper.find('input'), 0, setSelectionRange);
      expect(caretPos).toEqual(4);

      simulateMousUpEvent(wrapper.find('input'), 17, setSelectionRange);
      expect(caretPos).toEqual(13);
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

    it('should correct wrong caret positon on focus when allowEmptyFormatting is set', () => {
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
