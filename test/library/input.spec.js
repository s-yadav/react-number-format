import React from 'react';

import TextField from 'material-ui/TextField';

import NumberFormat from '../../src/number_format';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {
  simulateKeyInput,
  simulateFocusEvent,
  simulateBlurEvent,
  shallow,
  mount
} from '../test_util';

/*** format_number input as input ****/
describe('NumberFormat as input', () => {
  beforeAll(() => {
    navigator['__defineGetter__']('platform', () => {
      return 'MacIntel';
    });
  })

  it('should render input as type text by default', () => {
    const wrapper = mount(<NumberFormat />);
    expect(wrapper.find('input').instance().getAttribute('type')).toEqual('text');
  });

  it('should render input as defined type', () => {
    const wrapper = mount(<NumberFormat type="tel" />);
    expect(wrapper.find('input').instance().getAttribute('type')).toEqual('tel');
  });

  it('should add inputMode numeric to non Iphone/IPad device by default to input element', () => {
    const wrapper = mount(<NumberFormat />);
    expect(wrapper.find('input').instance().getAttribute('inputmode')).toEqual('numeric');

    //should allow updating the inputMode value
    wrapper.setProps({inputMode: 'search'});
    expect(wrapper.find('input').instance().getAttribute('inputmode')).toEqual('search');
  });

  it('should add inputMode numeric to Iphone/IPad device to input element only if there is a custom format', () => {
    navigator['__defineGetter__']('platform', () => {
      return 'iPhone';
    });
    const wrapper = mount(<NumberFormat />);
    expect(wrapper.find('input').instance().getAttribute('inputmode')).toEqual(null);

    wrapper.setProps({format: '## ###'});
    expect(wrapper.find('input').instance().getAttribute('inputmode')).toEqual('numeric');
  });

  it('should have initial value', () => {
    const wrapper = mount(<NumberFormat value={2456981} thousandSeparator={true} prefix={'$'} />);
    expect(wrapper.state().value).toEqual('$2,456,981');
    expect(wrapper.find('input').instance().value).toEqual('$2,456,981');
  });

  it('should load the default value when initial value is null', () => {
    const wrapper = mount(<NumberFormat value={null} defaultValue={89} />);
    expect(wrapper.state().value).toEqual('89');
  });

  it('should load the prevous valid value if the state is changed to null', () => {
    class WrapperComponent extends React.Component {
      constructor() {
        super ();
        this.state = {
          testState: 90,
        };
      }
      render() {
        return (<NumberFormat value={this.state.testState} />)
      }
    }

    const wrapper = mount(<WrapperComponent />);
    const input = wrapper.find('input');
    const domInput = input.instance();

    expect(domInput.value).toEqual('90');
    wrapper.setState({testState: null});
    expect(domInput.value).toEqual('90');
  });

  it('should use defaultValue as initial value', () => {
    const wrapper = mount(<NumberFormat defaultValue={2456981} thousandSeparator={true} prefix={'$'} />);
    expect(wrapper.state().value).toEqual('$2,456,981');
  });

  it('should not reset value by default value once it is changed', () => {
    const wrapper = mount(<NumberFormat defaultValue={2456981} thousandSeparator={true} prefix={'$'} />);
    simulateKeyInput(wrapper.find('input'), '2', 9);
    expect(wrapper.state().value).toEqual('$24,569,821');

    wrapper.setProps({
      thousandSeparator: '.',
      decimalSeparator: ',',
    });

    expect(wrapper.state().value).toEqual('$24.569.821');
  });

  it('should not reset number inputs value if number input renders again with same props', () => {
    class WrapperComponent extends React.Component {
      constructor() {
        super ();
        this.state = {
          testState: false
        };
      }
      render() {
        return (<NumberFormat thousandSeparator={true} prefix={'$'}/>)
      }
    }

    const wrapper = mount(<WrapperComponent />);
    const input = wrapper.find('input');
    const domInput = input.instance();

    simulateKeyInput(input, '2456981', 0);

    expect(domInput.value).toEqual('$2,456,981');

    wrapper.setState({testState: true});

    expect(domInput.value).toEqual('$2,456,981');
  });


  it('removes negation when format props is provided', () => {
    const wrapper = shallow(<NumberFormat format="#### #### #### ####" value="2342 2345 2342 2345" />);
    const input = wrapper.find('input');

    //by default space is mask
    simulateKeyInput(input, '-', 0);
    expect(wrapper.state().value).toEqual('2342 2345 2342 2345');

    simulateKeyInput(input, '-', 4);
    expect(wrapper.state().value).toEqual('2342 2345 2342 2345');
  });


  it('should block inputs based on isAllowed callback', () => {
    const wrapper = shallow(<NumberFormat isAllowed={(values) => {
      const {floatValue} = values;
      return floatValue <= 10000;
    }} value={9999}/>);

    const input = wrapper.find('input');

    expect(wrapper.state().value).toEqual('9999');

    simulateKeyInput(input, '9', 4);

    expect(wrapper.state().value).toEqual('9999');
  })


  it('handles multiple different allowed decimal separators', () => {
    const allowedDecimalSeparators = [',', '.', 'm']

    const wrapper = shallow(<NumberFormat decimalSeparator={','} allowedDecimalSeparators={allowedDecimalSeparators} />);

    allowedDecimalSeparators.forEach((separator) => {
      wrapper.setProps({value: '12'});
      simulateKeyInput(wrapper.find('input'), separator, 2);
      expect(wrapper.state().value).toEqual('12,');
    });
  });

  it('accepts dot as even when decimal separator is separate', () => {
    const wrapper = shallow(<NumberFormat decimalSeparator={','} />);
    wrapper.setProps({value: '12'});
    simulateKeyInput(wrapper.find('input'), '.', 2);
    expect(wrapper.state().value).toEqual('12,');
  });

  it('works with custom input', () => {
    const WrapperComponent = (props) => {
      return (
        <MuiThemeProvider>
          <NumberFormat {...props} />
        </MuiThemeProvider>
      )
    }

    const wrapper = mount(<WrapperComponent customInput={TextField} thousandSeparator={'.'} decimalSeparator={','}/>);
    const input = wrapper.find('input');

    simulateKeyInput(input, '2456981,89', 0);
    expect(input.instance().value).toEqual('2.456.981,89');

    wrapper.setProps({format: '#### #### #### ####', mask: '_', value: ''});

    simulateKeyInput(input, '411111', 0);
    expect(input.instance().value).toEqual('4111 11__ ____ ____');
  });

  it('should update value if group of characters got deleted with format', () => {
    const wrapper = shallow(<NumberFormat format="+1 (###) ### # ## US" value="+1 (999) 999 9 99 US"/>);
    simulateKeyInput(wrapper.find('input'), 'Backspace', 6, 10);
    expect(wrapper.state().value).toEqual('+1 (999) 999 9    US');

    //when group of characters (including format character) is replaced with number
    wrapper.setProps({value: '+1 (888) 888 8 88 US'});
    simulateKeyInput(wrapper.find('input'), '8', 6, 10);
    expect(wrapper.state().value).toEqual('+1 (888) 888 8 8  US');
  })

  it('should maintain the format even when the format is numeric', () => {
    const wrapper = shallow(<NumberFormat format="0###0 ###0####" value="01230 45607899"/>);
    simulateKeyInput(wrapper.find('input'), 'Backspace', 6, 10);
    expect(wrapper.state().value).toEqual('01230 78909   ');
  })

  it('should allow replacing all characters with number when formatting is present', () => {
    const format = '+1 (###) ### # ## US';
    const wrapper = shallow(<NumberFormat format={format} value="+1 (123) 456 7 89 US" mask="_"/>);
    simulateKeyInput(wrapper.find('input'), '8', 0, format.length);
    expect(wrapper.state().value).toEqual('+1 (8__) ___ _ __ US');

    //check for numeric input
    const value = '12.000';

    wrapper.setProps({
      format: undefined,
      decimalScale: 3,
      fixedDecimalScale: true,
      value
    });

    simulateKeyInput(wrapper.find('input'), '9', 0, value.length);
    expect(wrapper.state().value).toEqual('9.000')

    //bug #157
    wrapper.setProps({value});
    simulateKeyInput(wrapper.find('input'), '1', 0, value.length);
    expect(wrapper.state().value).toEqual('1.000');
  });

  it('should format value when input value is empty and allowEmptyFormatting is true', () => {
    expect(() => {
      const wrapper = shallow(<NumberFormat format="##/##/####" value="" />);
      expoect(wrapper.state().value).toEqual("  /  /    ");
    })
  });

  it('should format value when input value is not set and allowEmptyFormatting is true', () => {
    expect(() => {
      const wrapper = shallow(<NumberFormat format="##/##/####" />);
      expoect(wrapper.state().value).toEqual("  /  /    ");
    })
  });


  it('should not convert empty string to 0 if isNumericString is true', () => {
    const wrapper = shallow(<NumberFormat isNumericString={true} value={''} decimalScale={2}/>);
    expect(wrapper.state().value).toEqual('');
  });

  it('should not break if null or NaN is provided as value', () => {
    const wrapper = shallow(<NumberFormat value={null} decimalScale={2}/>);
    expect(wrapper.state().value).toEqual('');

    wrapper.setProps({value: NaN});
    expect(wrapper.state().value).toEqual('');
  });

  it('should allow adding decimals and negation when float value is used to set state', () => {
    const wrapper = shallow(<NumberFormat onValueChange={(values) => {
      wrapper.setProps({value: values.floatValue});
    }}/>);

    //check negation
    simulateKeyInput(wrapper.find('input'), '-', 0);
    expect(wrapper.state().value).toEqual('-');

    //check decimal
    simulateKeyInput(wrapper.find('input'), 'Backspace', 1);
    simulateKeyInput(wrapper.find('input'), '.', 0);
    simulateKeyInput(wrapper.find('input'), '2', 1);
    expect(wrapper.state().value).toEqual('.2');

    //check changing format should change the formatted value
    wrapper.setProps({prefix: '$'});
    expect(wrapper.state().value).toEqual('$0.2');

    //check if trailing decimal is supported
    wrapper.setProps({value: 123});
    simulateKeyInput(wrapper.find('input'), '.', 4);
    expect(wrapper.state().value).toEqual('$123.');

    //test in backspace leads correct formatting if it has trailing .
    simulateKeyInput(wrapper.find('input'), '4', 5);
    expect(wrapper.state().value).toEqual('$123.4');
    simulateKeyInput(wrapper.find('input'), 'Backspace', 6);
    expect(wrapper.state().value).toEqual('$123.');
  });

  it('should pass valid floatValue in isAllowed callback', () => {
    const spy = jasmine.createSpy();
    const wrapper = shallow(<NumberFormat isAllowed={spy}/>);
    simulateKeyInput(wrapper.find('input'), '.', 0);
    expect(spy.calls.argsFor(0)[0]).toEqual({formattedValue: ".", value: ".", floatValue: undefined});

    simulateKeyInput(wrapper.find('input'), 'Backspace', 1);
    simulateKeyInput(wrapper.find('input'), '0', 0);
    expect(spy.calls.argsFor(1)[0]).toEqual({formattedValue: "0", value: "0", floatValue: 0});

    simulateKeyInput(wrapper.find('input'), 'Backspace', 1);
    simulateKeyInput(wrapper.find('input'), '123.', 0);
    expect(spy.calls.argsFor(2)[0]).toEqual({formattedValue: "123.", value: "123.", floatValue: 123});
  });

  it('should not call setState again if previous and current floatValue is NaN', () => {
    const wrapper = shallow(<NumberFormat value="" />);
    const instance = wrapper.instance();
    spyOn(instance, 'setState');
    wrapper.setProps({value: ''});
    expect(instance.setState).not.toHaveBeenCalled();
  });

  it('should always call setState when input is not on focus and value formatting is changed from outside', () => {
    const wrapper = shallow(<NumberFormat value="1.1" />);
    simulateFocusEvent(wrapper.find('input'));
    simulateKeyInput(wrapper.find('input'), '0', 3)

    expect(wrapper.state().value).toEqual('1.10');

    simulateBlurEvent(wrapper.find('input'))

    wrapper.setProps({
      value: '1.1'
    });

    expect(wrapper.state().value).toEqual('1.1');
  });

  it('should call onValueChange in change caused by prop change', () => {
    const spy = jasmine.createSpy();
    const wrapper = shallow(<NumberFormat value="1234" onValueChange={spy}/>);
    wrapper.setProps({thousandSeparator: true});
    expect(spy.calls.argsFor(0)[0]).toEqual({formattedValue: "1,234", value: "1234", floatValue: 1234});
  });

  it('should treat Infinity value as empty string', () => {
    const wrapper = shallow(<NumberFormat value={Infinity}/>);
    expect(wrapper.state().value).toEqual('');
  });

  it('should call onFocus prop when focused', (done) => {
    const spy = jasmine.createSpy('onFocus');
    const wrapper = shallow(<NumberFormat onFocus={spy} />);
    const input = wrapper.find('input');

    simulateFocusEvent(input);

    setTimeout(() => {
      expect(spy).toHaveBeenCalled();
      done();
    }, 0);
  });

  it('should not call onFocus prop when focused then blurred in the same event loop', (done) => {
    const spy = jasmine.createSpy('onFocus');
    const wrapper = shallow(<NumberFormat onFocus={spy} />);
    const input = wrapper.find('input');

    simulateFocusEvent(input);
    simulateBlurEvent(input);

    setTimeout(() => {
      expect(spy).not.toHaveBeenCalled();
      done();
    }, 0);
  });

  describe('Test masking', () => {
    it('should allow mask as string', () => {
      const wrapper = shallow(<NumberFormat format="#### #### ####" mask="_"/>);

      simulateKeyInput(wrapper.find('input'), '111', 0);
      expect(wrapper.state().value).toEqual('111_ ____ ____');

      simulateKeyInput(wrapper.find('input'), '1', 3);
      expect(wrapper.state().value).toEqual('1111 ____ ____');
    });

    it('should allow mask as array of strings', () => {
      const wrapper = shallow(<NumberFormat format="##/##/####" mask={['D', 'D', 'M', 'M', 'Y', 'Y', 'Y', 'Y']}/>);

      simulateKeyInput(wrapper.find('input'), '1', 0);
      expect(wrapper.state().value).toEqual('1D/MM/YYYY');

      simulateKeyInput(wrapper.find('input'), '3', 1);
      expect(wrapper.state().value).toEqual('13/MM/YYYY');
    });

    it('should throw an error if mask has numeric character', () => {
      expect(() => {
        shallow(<NumberFormat format="#### #### ####" mask="1"/>)
      }).toThrow()

      expect(() => {
        shallow(<NumberFormat format="#### #### ####" mask={['D', 'D', 'M', '1', '2', 'Y', 'Y', 'Y']}/>)
      }).toThrow()
    })
  })
});
