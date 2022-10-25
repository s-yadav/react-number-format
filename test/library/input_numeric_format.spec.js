import React from 'react';
import ReactDOM from 'react-dom';

import NumericFormat from '../../src/numeric_format';

import {
  getCustomEvent,
  simulateKeyInput,
  simulateBlurEvent,
  mount,
  shallow,
  getInputValue,
} from '../test_util';

/**
 * This suit is to test NumberFormat when normal numeric values are provided without any formatting options
 * Use cases:
 * currency
 * Number
 * units
 */
describe('Test NumberFormat as input with numeric format options', () => {
  it('should show the initial value as $0 when number 0 is passed', () => {
    const wrapper = mount(<NumericFormat value={0} thousandSeparator={true} prefix={'$'} />);
    expect(getInputValue(wrapper)).toEqual('$0');
  });

  it('should show the initial value as empty string when empty string is passed and decimalScale is set', () => {
    const wrapper = mount(<NumericFormat value="" thousandSeparator={true} decimalScale={2} />);
    expect(getInputValue(wrapper)).toEqual('');
  });

  it('should show the initial value as empty string when empty string is passed and decimalScale is not set', () => {
    const wrapper = mount(<NumericFormat value="" thousandSeparator={true} />);
    expect(getInputValue(wrapper)).toEqual('');
  });

  it('should maintain decimal points', () => {
    const wrapper = mount(<NumericFormat thousandSeparator={true} prefix={'$'} />);

    simulateKeyInput(wrapper.find('input'), '2456981.89', 0);

    expect(getInputValue(wrapper)).toEqual('$2,456,981.89');
  });

  it('supports negative numbers', () => {
    const wrapper = mount(<NumericFormat thousandSeparator={true} prefix={'$'} />);

    simulateKeyInput(wrapper.find('input'), '-', 0);

    expect(getInputValue(wrapper)).toEqual('-');

    simulateKeyInput(wrapper.find('input'), '123.55', 1);

    expect(getInputValue(wrapper)).toEqual('-$123.55');
  });

  it('removes negation when double negation is done', () => {
    const wrapper = mount(
      <NumericFormat thousandSeparator={true} prefix={'$'} value={-2456981.89} />,
    );

    expect(getInputValue(wrapper)).toEqual('-$2,456,981.89');

    simulateKeyInput(wrapper.find('input'), '-', 1);

    expect(getInputValue(wrapper)).toEqual('$2,456,981.89');

    wrapper.setProps({ value: '' });
    wrapper.update();
    simulateKeyInput(wrapper.find('input'), '--', 0);
    expect(getInputValue(wrapper)).toEqual('');
  });

  it('allows negation and double negation any cursor position in the input', () => {
    const wrapper = mount(
      <NumericFormat thousandSeparator={true} prefix={'$'} value={2456981.89} />,
    );

    simulateKeyInput(wrapper.find('input'), '-', 5);

    expect(getInputValue(wrapper)).toEqual('-$2,456,981.89');

    //restore negation back
    simulateKeyInput(wrapper.find('input'), '-', 7);

    expect(getInputValue(wrapper)).toEqual('$2,456,981.89');
  });

  it('should support custom thousand separator', () => {
    const wrapper = mount(
      <NumericFormat thousandSeparator={'.'} decimalSeparator={','} prefix={'$'} />,
    );
    simulateKeyInput(wrapper.find('input'), '2456981,89', 0);

    expect(getInputValue(wrapper)).toEqual('$2.456.981,89');

    wrapper.setProps({ thousandSeparator: "'" });
    wrapper.update();

    expect(getInputValue(wrapper)).toEqual("$2'456'981,89");

    //changing decimal separator in the fly should work
    wrapper.setProps({ decimalSeparator: '.' });
    wrapper.update();
    expect(getInputValue(wrapper)).toEqual("$2'456'981.89");

    wrapper.setProps({
      thousandSeparator: ' ',
      decimalSeparator: "'",
      value: '',
    });
    wrapper.update();

    simulateKeyInput(wrapper.find('input'), "2456981'89", 0);
    expect(getInputValue(wrapper)).toEqual("$2 456 981'89");
  });

  it('should throw error when decimal separator and thousand separator are same', () => {
    expect(() => {
      shallow(<NumericFormat thousandSeparator={'.'} prefix={'$'} />);
    }).toThrow();

    expect(() => {
      shallow(<NumericFormat thousandSeparator={','} decimalSeparator={','} prefix={'$'} />);
    }).toThrow();
  });

  it('should allow floating/integer numbers as values and do proper formatting', () => {
    const wrapper = mount(<NumericFormat value={12345.67} />);
    expect(getInputValue(wrapper)).toEqual('12345.67');

    wrapper.setProps({ thousandSeparator: true });
    expect(getInputValue(wrapper)).toEqual('12,345.67');

    wrapper.setProps({ thousandSeparator: '.', decimalSeparator: ',' });
    expect(getInputValue(wrapper)).toEqual('12.345,67');

    wrapper.setProps({
      thousandSeparator: '.',
      decimalSeparator: ',',
      decimalScale: 0,
    });
    expect(getInputValue(wrapper)).toEqual('12.346');
  });

  it('should update formatted value if any of the props changes', () => {
    const wrapper = mount(<NumericFormat value={12345.67} />);
    expect(getInputValue(wrapper)).toEqual('12345.67');

    wrapper.setProps({ thousandSeparator: true });
    expect(getInputValue(wrapper)).toEqual('12,345.67');

    wrapper.setProps({ thousandSeparator: '.', decimalSeparator: ',' });
    expect(getInputValue(wrapper)).toEqual('12.345,67');

    wrapper.setProps({
      thousandSeparator: '.',
      decimalSeparator: ',',
      decimalScale: 0,
    });
    expect(getInputValue(wrapper)).toEqual('12.346');
  });

  it('should allow bigger number than 2^53 and do proper formatting', () => {
    const wrapper = mount(<NumericFormat thousandSeparator="." decimalSeparator="," />);
    const input = wrapper.find('input');
    input.simulate('change', getCustomEvent('981273724234817383478127'));
    expect(getInputValue(wrapper)).toEqual('981.273.724.234.817.383.478.127');

    input.simulate('change', getCustomEvent('981273724234817383478,127'));
    expect(getInputValue(wrapper)).toEqual('981.273.724.234.817.383.478,127');
  });

  it('should support decimal scale with custom decimal separator', () => {
    const wrapper = mount(
      <NumericFormat thousandSeparator={'.'} decimalSeparator={','} decimalScale={2} />,
    );
    const input = wrapper.find('input');

    input.simulate('change', getCustomEvent('2456981,89'));
    expect(getInputValue(wrapper)).toEqual('2.456.981,89');
  });

  it('should limit to passed decimal scale', () => {
    const wrapper = mount(<NumericFormat decimalScale={4} fixedDecimalScale={true} />);
    const input = wrapper.find('input');

    //case 1st - already exactly scale 4 should stay that way
    input.simulate('change', getCustomEvent('4111.1111'));
    expect(getInputValue(wrapper)).toEqual('4111.1111');

    //case 2nd - longer scale should round
    input.simulate('change', getCustomEvent('4111.11111'));
    expect(getInputValue(wrapper)).toEqual('4111.1111');

    /** Only initial value should round off not while input **/
    input.simulate('change', getCustomEvent('4111.11118'));
    expect(getInputValue(wrapper)).not.toEqual('4111.1112');

    //case 3rd - shorter scale adds 0
    input.simulate('change', getCustomEvent('4111.111'));
    expect(getInputValue(wrapper)).toEqual('4111.1110');

    //case 4th - no decimal should round with 4 zeros
    input.simulate('change', getCustomEvent(''));
    input.simulate('change', getCustomEvent('4111'));
    expect(getInputValue(wrapper)).toEqual('4111.0000');

    //case 5 - round with two decimal scale
    wrapper.setProps({ decimalScale: 2 });
    input.simulate('change', getCustomEvent('4111.111'));
    expect(getInputValue(wrapper)).toEqual('4111.11');
  });

  it('should not add zeros to fixedDecimalScale is not set', () => {
    const wrapper = mount(<NumericFormat decimalScale={4} value={24.45} />);
    expect(getInputValue(wrapper)).toEqual('24.45');

    wrapper.setProps({
      value: 24.45678,
    });
    wrapper.update();
    expect(getInputValue(wrapper)).toEqual('24.4568');
  });

  it('should handle fixedDecimalScale correctly #670', () => {
    const wrapper = mount(
      <NumericFormat thousandSeparator value={12} decimalScale={2} fixedDecimalScale />,
    );
    expect(getInputValue(wrapper)).toEqual('12.00');
  });

  it('should not round the initial if decimalScale is not provided', () => {
    const wrapper = mount(<NumericFormat value={123213.7535} />);
    expect(getInputValue(wrapper)).toEqual('123213.7535');

    wrapper.setProps({
      thousandSeparator: true,
    });
    expect(getInputValue(wrapper)).toEqual('123,213.7535');

    wrapper.setProps({
      thousandSeparator: '.',
      decimalSeparator: ',',
    });

    expect(getInputValue(wrapper)).toEqual('123.213,7535');

    wrapper.setProps({
      value: 36790.876,
    });
    expect(getInputValue(wrapper)).toEqual('36.790,876');

    wrapper.setProps({
      value: '56.790,876',
    });
    expect(getInputValue(wrapper)).toEqual('56.790,876');
  });

  it('should round the initial value to given decimalScale', () => {
    const wrapper = mount(
      <NumericFormat value={123213.7536} valueIsNumericString={true} decimalScale={1} />,
    );
    expect(getInputValue(wrapper)).toEqual('123213.8');

    wrapper.setProps({
      thousandSeparator: true,
    });
    expect(getInputValue(wrapper)).toEqual('123,213.8');

    wrapper.setProps({
      thousandSeparator: '.',
      decimalSeparator: ',',
      decimalScale: 3,
    });

    expect(getInputValue(wrapper)).toEqual('123.213,754');

    wrapper.setProps({
      value: 36790.876,
      decimalScale: 0,
    });

    expect(getInputValue(wrapper)).toEqual('36.791');
    wrapper.setProps({
      decimalScale: 2,
    });

    expect(getInputValue(wrapper)).toEqual('36.790,88');

    wrapper.setProps({
      value: '56790.876',
    });
    expect(getInputValue(wrapper)).toEqual('56.790,88');

    wrapper.setProps({
      value: '981273724234817383478127.678',
    });

    expect(getInputValue(wrapper)).toEqual('981.273.724.234.817.383.478.127,68');
  });

  it('should allow deleting all numbers when decimalScale and fixedDecimalScale is defined', () => {
    jasmine.clock().install();

    const wrapper = mount(
      <NumericFormat prefix="$" decimalScale={3} value="$1.000" fixedDecimalScale={true} />,
    );
    simulateKeyInput(wrapper.find('input'), 'Backspace', 2);

    jasmine.clock().tick(1);

    expect(getInputValue(wrapper)).toEqual('');
  });

  it('should not allow to remove decimalSeparator if decimalScale and fixedDecimalScale is defined', () => {
    const wrapper = mount(
      <NumericFormat
        prefix="$"
        thousandSeparator={true}
        decimalScale={3}
        fixedDecimalScale={true}
        value="$1,234.000"
      />,
    );
    simulateKeyInput(wrapper.find('input'), 'Backspace', 7);
    expect(getInputValue(wrapper)).toEqual('$1,234.000');

    wrapper.setProps({ decimalScale: undefined });
    wrapper.update();
    simulateKeyInput(wrapper.find('input'), 'Backspace', 7);
    expect(getInputValue(wrapper)).toEqual('$1,234,000');
  });

  it(`should allow replacing all digits (without prefix and/or suffix) with input
    digit(s) when decimalScale and fixedDecimalScale is defined. Issue #159`, () => {
    const wrapper = mount(
      <NumericFormat
        prefix="$"
        thousandSeparator={true}
        decimalScale={2}
        fixedDecimalScale={true}
        value="$1,234.00"
      />,
    );
    simulateKeyInput(wrapper.find('input'), '56', 1, 9);
    expect(getInputValue(wrapper)).toEqual('$56.00');

    wrapper.setProps({ prefix: '', suffix: '%', value: '98.76%' });
    wrapper.update();
    simulateKeyInput(wrapper.find('input'), '1', 0, 5);
    expect(getInputValue(wrapper)).toEqual('1.00%');

    wrapper.setProps({ prefix: '$', value: '$23.00%' });
    wrapper.update();
    simulateKeyInput(wrapper.find('input'), '15', 1, 6);
    expect(getInputValue(wrapper)).toEqual('$15.00%');
  });

  it('should not round by default', () => {
    const wrapper = mount(<NumericFormat />);
    const input = wrapper.find('input');

    //case 1st - no rounding with long decimal
    input.simulate('change', getCustomEvent('4111.111111'));
    expect(getInputValue(wrapper)).toEqual('4111.111111');

    //case 2nd - no rounding with whole numbers
    input.simulate('change', getCustomEvent('4111'));
    expect(getInputValue(wrapper)).toEqual('4111');

    //case 3rd - no rounding on single place decimals
    input.simulate('change', getCustomEvent('4111.1'));
    expect(getInputValue(wrapper)).toEqual('4111.1');
  });

  it('sould not allow decimal numbers if decimal scale is set to 0', () => {
    const wrapper = mount(<NumericFormat thousandSeparator={true} decimalScale={0} />);
    const input = wrapper.find('input');

    //case 1 - decimal scale set to 0
    input.simulate('change', getCustomEvent('4111.'));
    expect(getInputValue(wrapper)).toEqual('4,111');

    //case 2 - It should round to integer if passed value props as decimal values
    wrapper.setProps({ value: 1234.78 });
    wrapper.update();
    expect(getInputValue(wrapper)).toEqual('1,235');
  });

  it('should allow decimal separator and thousand separator on suffix prefix', () => {
    const wrapper = mount(
      <NumericFormat
        value={1231237.56}
        thousandSeparator={','}
        decimalSeparator={'.'}
        prefix={'$'}
        suffix={' per sq. ft.'}
      />,
    );
    expect(getInputValue(wrapper)).toEqual('$1,231,237.56 per sq. ft.');

    wrapper.setProps({ suffix: '', prefix: '$ per, sq. ft. ' });
    wrapper.update();
    expect(getInputValue(wrapper)).toEqual('$ per, sq. ft. 1,231,237.56');
  });

  it('should not remove leading 0s while user is in focus', () => {
    const wrapper = mount(
      <NumericFormat
        value={23456.78}
        thousandSeparator={','}
        decimalSeparator={'.'}
        prefix={'$'}
      />,
    );
    simulateKeyInput(wrapper.find('input'), '0', 1);

    expect(getInputValue(wrapper)).toEqual('$023,456.78');

    wrapper.setProps({ value: 10000.25 });
    wrapper.update();

    simulateKeyInput(wrapper.find('input'), 'Backspace', 2);

    expect(getInputValue(wrapper)).toEqual('$0000.25');

    simulateKeyInput(wrapper.find('input'), '2', 1);
    expect(getInputValue(wrapper)).toEqual('$20,000.25');
  });

  it('should remove leading 0s while user go out of focus and allowLeadingZeros is false', () => {
    const wrapper = mount(
      <NumericFormat
        value={23456.78}
        thousandSeparator={','}
        decimalSeparator={'.'}
        prefix={'$'}
      />,
    );

    simulateKeyInput(wrapper.find('input'), '0', 1);
    simulateBlurEvent(wrapper.find('input'));

    expect(getInputValue(wrapper)).toEqual('$23,456.78');

    wrapper.setProps({ value: 10000.25 });
    wrapper.update();

    simulateKeyInput(wrapper.find('input'), 'Backspace', 2);
    simulateBlurEvent(wrapper.find('input'));
    expect(getInputValue(wrapper)).toEqual('$0.25');
  });

  it('should not remove leading 0s while user go out of focus and allowLeadingZeros is true', () => {
    const wrapper = mount(
      <NumericFormat
        value={23456.78}
        thousandSeparator={','}
        decimalSeparator={'.'}
        prefix={'$'}
        allowLeadingZeros={true}
      />,
    );

    simulateKeyInput(wrapper.find('input'), '0', 1);
    simulateBlurEvent(wrapper.find('input'));

    expect(getInputValue(wrapper)).toEqual('$023,456.78');

    wrapper.setProps({ value: 10000.25 });
    wrapper.update();

    simulateKeyInput(wrapper.find('input'), 'Backspace', 2);
    simulateBlurEvent(wrapper.find('input'));
    expect(getInputValue(wrapper)).toEqual('$0000.25');
  });

  it('should make input empty when there is only non numeric values (ie just -) on blur', () => {
    const wrapper = mount(<NumericFormat decimalScale={2} />);
    simulateKeyInput(wrapper.find('input'), '-', 0);
    simulateBlurEvent(wrapper.find('input'));

    expect(getInputValue(wrapper)).toEqual('');
  });

  it('should add 0 before decimal if user is in focus', () => {
    const wrapper = mount(
      <NumericFormat value={0.78} thousandSeparator={','} decimalSeparator={'.'} prefix={'$'} />,
    );

    simulateKeyInput(wrapper.find('input'), 'Backspace', 2);

    expect(getInputValue(wrapper)).toEqual('$.78');

    simulateKeyInput(wrapper.find('input'), '2', 1);
    expect(getInputValue(wrapper)).toEqual('$2.78');
  });

  it('should not add 0 before decimal if user go out of focus', () => {
    const wrapper = mount(
      <NumericFormat value={0.78} thousandSeparator={','} decimalSeparator={'.'} prefix={'$'} />,
    );
    simulateKeyInput(wrapper.find('input'), 'Backspace', 2);

    expect(getInputValue(wrapper)).toEqual('$.78');

    simulateBlurEvent(wrapper.find('input'));
    expect(getInputValue(wrapper)).toEqual('$0.78');
  });

  it('should allow typing decimalSeparator if input is empty', () => {
    const wrapper = mount(
      <NumericFormat thousandSeparator={','} decimalSeparator={'.'} prefix={'$'} />,
    );
    simulateKeyInput(wrapper.find('input'), '.', 0);

    expect(getInputValue(wrapper)).toEqual('$.');
  });

  it('should delete all characters if nothing is after decimalSeparator and before decimalSeparator is deleted', () => {
    const wrapper = mount(<NumericFormat decimalSeparator={'.'} prefix={'$'} value="$0." />);
    expect(getInputValue(wrapper)).toEqual('$0.');

    simulateKeyInput(wrapper.find('input'), 'Backspace', 2);
    expect(getInputValue(wrapper)).toEqual('');
  });

  it('should not clear input if after decimal is deleted and nothing is before decimal', () => {
    const wrapper = mount(<NumericFormat decimalSeparator={'.'} prefix={'$'} value="$.3" />);
    simulateKeyInput(wrapper.find('input'), 'Backspace', 3);
    expect(getInputValue(wrapper)).toEqual('$.');
  });

  it('should allow ctrl + a -> decimalSeparator', () => {
    const wrapper = mount(<NumericFormat decimalSeparator={'.'} prefix={'$'} value="$34.35" />);
    simulateKeyInput(wrapper.find('input'), '.', 0, 6);
    expect(getInputValue(wrapper)).toEqual('$.');
  });

  //Issue #137 valueIsNumericString=true breaks decimal places
  it('should not break decimal palces when valueIsNumericString is set to true and decimal scale is provided. Issue #137', () => {
    class IssueExample extends React.Component {
      constructor() {
        super();
        this.state = {
          value: '3456',
        };
      }
      render() {
        const { value } = this.state;
        return (
          <NumericFormat
            valueIsNumericString={true}
            decimalScale={2}
            prefix={'$'}
            value={value}
            onValueChange={({ value }) => {
              this.setState({ value });
            }}
          />
        );
      }
    }
    const wrapper = mount(<IssueExample />);
    simulateKeyInput(wrapper.find('input'), '.', 5);
    mount(wrapper.get(0)).update();
    expect(ReactDOM.findDOMNode(wrapper.instance()).value).toEqual('$3456.');
  });

  //Issue #140
  it('should not give NaN zeros, when decimalScale is 0 and roundedValue will be multiple of 10s, Issue #140', () => {
    const wrapper = mount(<NumericFormat value={-9.5} decimalScale={0} />);
    expect(getInputValue(wrapper)).toEqual('-10');

    wrapper.setProps({ value: -99.5 });
    expect(getInputValue(wrapper)).toEqual('-100');
  });

  //Issue #145
  it('should give correct formatted value when pasting a number with decimal and decimal scale is set to zero, issue #145', () => {
    const wrapper = mount(<NumericFormat decimalScale={0} />);
    simulateKeyInput(wrapper.find('input'), '9.55');
    expect(getInputValue(wrapper)).toEqual('9');
  });

  it('should format the number correctly when thousandSeparator is true and decimal scale is 0. Issue #178', () => {
    const wrapper = mount(<NumericFormat decimalScale={0} thousandSeparator={true} />);
    simulateKeyInput(wrapper.find('input'), '10000');
    expect(getInputValue(wrapper)).toEqual('10,000');
    simulateKeyInput(wrapper.find('input'), '0', 6);
    expect(getInputValue(wrapper)).toEqual('100,000');
  });

  it(`should give correct formatted value when decimal value is passed as prop and
    decimal scale is set to zero and fixedDecimalScale is true, issue #183`, () => {
    const wrapper = mount(
      <NumericFormat decimalScale={0} fixedDecimalScale={true} value={1.333333333} />,
    );
    expect(getInputValue(wrapper)).toEqual('1');
  });

  it(`should not add 0 after minus immediately after minus is entered in case valueIsNumericString and
    decimalScale props are passed #198`, () => {
    const wrapper = mount(<NumericFormat valueIsNumericString decimalScale={2} />);
    simulateKeyInput(wrapper.find('input'), '-', 0, 0);
    expect(getInputValue(wrapper)).toEqual('-');
  });

  it('should allow typing . as decimal separator when some other decimal separator is given', () => {
    let caretPos;
    const setSelectionRange = (pos) => {
      caretPos = pos;
    };

    const wrapper = mount(
      <NumericFormat
        decimalSeparator=","
        thousandSeparator="."
        value="234.456 Sq. ft"
        suffix=" Sq. ft"
      />,
    );
    simulateKeyInput(wrapper.find('input'), '.', 5, 5, setSelectionRange);
    expect(getInputValue(wrapper)).toEqual('2.344,56 Sq. ft');
    //check if caret position is maintained
    expect(caretPos).toEqual(6);

    //it should allow typing actual separator
    simulateKeyInput(wrapper.find('input'), ',', 3, 3);
    expect(getInputValue(wrapper)).toEqual('23,4456 Sq. ft');
  });

  it('should not break if suffix/prefix has negation sign. Issue #245', () => {
    const wrapper = mount(<NumericFormat suffix="-" />);

    simulateKeyInput(wrapper.find('input'), '2', 0);
    expect(getInputValue(wrapper)).toEqual('2-');

    simulateKeyInput(wrapper.find('input'), '1', 1);
    expect(getInputValue(wrapper)).toEqual('21-');

    simulateKeyInput(wrapper.find('input'), '-', 2);
    expect(getInputValue(wrapper)).toEqual('-21-');
  });

  it('should not apply thousand separator on the leading zeros #289', () => {
    const wrapper = mount(<NumericFormat prefix="$" thousandSeparator="," />);

    simulateKeyInput(wrapper.find('input'), '000012345678', 0);
    expect(getInputValue(wrapper)).toEqual('$000012,345,678');
  });

  //Issue #375
  it('should give correct formatted value when pasting the dot symbol with decimal scale is set to zero, issue #375', () => {
    const wrapper = mount(<NumericFormat value={4200} thousandSeparator={true} decimalScale={0} />);
    simulateKeyInput(wrapper.find('input'), '.', 2, 2);
    expect(getInputValue(wrapper)).toEqual('4,200');
  });

  it('should handle decimal numbers correctly #519', () => {
    function Test() {
      const [value, setValue] = React.useState('1.000001');

      return (
        <NumericFormat
          value={value}
          onValueChange={(values) => {
            setValue(values.value);
          }}
          valueIsNumericString
          decimalScale={8}
        />
      );
    }

    const wrapper = mount(<Test />);
    simulateKeyInput(wrapper.find('input'), '0', 4, 4);
    expect(wrapper.find('input').prop('value')).toEqual('1.0000001');
  });

  it('should handle exponential value as prop correctly #506', () => {
    const wrapper = mount(<NumericFormat value={0.00000001} />);
    expect(wrapper.find('input').prop('value')).toEqual('0.00000001');
  });

  describe('should handle if only partial prefix or suffix is removed using double click select and the remove. #694', () => {
    it('while changing suffix', () => {
      const wrapper = mount(<NumericFormat prefix="100-" value={1} suffix="000 USD" />);

      simulateKeyInput(wrapper.find('input'), '2', 9, 12);
      expect(wrapper.find('input').prop('value')).toEqual('100-1000 USD');
    });

    it('while changing prefix', () => {
      const wrapper = mount(<NumericFormat prefix="100-" value={1} suffix="000 USD" />);

      simulateKeyInput(wrapper.find('input'), '2', 0, 2);
      expect(wrapper.find('input').prop('value')).toEqual('100-1000 USD');
    });

    it('while deleting suffix', () => {
      const wrapper = mount(<NumericFormat prefix="100-" value={1} suffix="000 USD" />);

      simulateKeyInput(wrapper.find('input'), 'Backspace', 9, 12);
      expect(wrapper.find('input').prop('value')).toEqual('100-1000 USD');
    });

    fit('while deleting prefix', () => {
      const wrapper = mount(<NumericFormat prefix="100-" value={1} suffix="000 USD" />);

      simulateKeyInput(wrapper.find('input'), 'Backspace', 0, 3);
      expect(wrapper.find('input').prop('value')).toEqual('100-1000 USD');
    });
  });

  describe('Test thousand group style', () => {
    it('should format on english style thousand grouping', () => {
      const wrapper = mount(<NumericFormat thousandSeparator={true} value={12345678} />);
      expect(getInputValue(wrapper)).toEqual('12,345,678');
      simulateKeyInput(wrapper.find('input'), '9', 10, 10);
      expect(getInputValue(wrapper)).toEqual('123,456,789');
    });

    it('should format on indian (lakh) style thousand grouping', () => {
      const wrapper = mount(
        <NumericFormat thousandSeparator={true} thousandsGroupStyle="lakh" value={12345678} />,
      );
      expect(getInputValue(wrapper)).toEqual('1,23,45,678');
      simulateKeyInput(wrapper.find('input'), '9', 11, 11);
      expect(getInputValue(wrapper)).toEqual('12,34,56,789');
    });

    it('should format on chinese (wan) style thousand grouping', () => {
      const wrapper = mount(
        <NumericFormat thousandSeparator={true} thousandsGroupStyle="wan" value={12345678} />,
      );
      expect(getInputValue(wrapper)).toEqual('1234,5678');
      simulateKeyInput(wrapper.find('input'), '9', 9, 9);
      expect(getInputValue(wrapper)).toEqual('1,2345,6789');
    });
  });
});
