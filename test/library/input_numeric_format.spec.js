import React from 'react';
import ReactDOM from 'react-dom';

import NumberFormat from '../../src/number_format';
import {getCustomEvent, simulateKeyInput, simulateBlurEvent, shallow, mount} from '../test_util';


/**
 * This suit is to test NumberFormat when normal numeric values are provided without any formatting options
 * Use cases:
 * currency
 * Number
 * units
 */
describe('Test NumberFormat as input with numeric format options', () => {
  it('should show the initial value as $0 when number 0 is passed', () => {
    const wrapper = shallow(<NumberFormat value={0} thousandSeparator={true} prefix={'$'} />);
    expect(wrapper.state().value).toEqual('$0');
  });

  it('should show the initial value as empty string when empty string is passed and decimalScale is set', () => {
    const wrapper = mount(<NumberFormat value="" thousandSeparator={true} decimalScale={2} />);
    expect(wrapper.state().value).toEqual('');
  });

  it('should show the initial value as empty string when empty string is passed and decimalScale is not set', () => {
    const wrapper = mount(<NumberFormat value="" thousandSeparator={true} />);
    expect(wrapper.state().value).toEqual('');
  });

  it('should maintain decimal points', () => {
    const wrapper = shallow(<NumberFormat thousandSeparator={true} prefix={'$'} />);

    simulateKeyInput(wrapper.find('input'), '2456981.89', 0);

    expect(wrapper.state().value).toEqual('$2,456,981.89');
  });

  it('supports negative numbers', () => {
    const wrapper = shallow(<NumberFormat thousandSeparator={true} prefix={'$'} />);

    simulateKeyInput(wrapper.find('input'), '-', 0);

    expect(wrapper.state().value).toEqual('-');

    simulateKeyInput(wrapper.find('input'), '123.55', 1);

    expect(wrapper.state().value).toEqual('-$123.55');
  });


  it('removes negation when double negation is done', () => {
    const wrapper = shallow(<NumberFormat thousandSeparator={true} prefix={'$'} value={-2456981.89} />);

    expect(wrapper.state().value).toEqual('-$2,456,981.89');

    simulateKeyInput(wrapper.find('input'), '-', 1);

    expect(wrapper.state().value).toEqual('$2,456,981.89');

    wrapper.setProps({value: ''});
    wrapper.update();
    simulateKeyInput(wrapper.find('input'), '--', 0);
    expect(wrapper.state().value).toEqual('');
  });

  it('allows negation and double negation any cursor position in the input', () => {
    const wrapper = shallow(<NumberFormat thousandSeparator={true} prefix={'$'} value={2456981.89}/>);

    simulateKeyInput(wrapper.find('input'), '-', 5);

    expect(wrapper.state().value).toEqual('-$2,456,981.89');

    //restore negation back
    simulateKeyInput(wrapper.find('input'), '-', 7);

    expect(wrapper.state().value).toEqual('$2,456,981.89');
  });


  it('should support custom thousand seperator', () => {
    const wrapper = shallow(<NumberFormat thousandSeparator={'.'} decimalSeparator={','} prefix={'$'} />);
    simulateKeyInput(wrapper.find('input'), '2456981,89', 0);

    expect(wrapper.state().value).toEqual('$2.456.981,89');

    wrapper.setProps({thousandSeparator: "'"});
    wrapper.update();

    expect(wrapper.state().value).toEqual("$2'456'981,89");

    //changing decimal separator in the fly should work
    wrapper.setProps({decimalSeparator: '.'});
    wrapper.update();
    expect(wrapper.state().value).toEqual("$2'456'981.89");

    wrapper.setProps({thousandSeparator: " ", decimalSeparator:"'", value:'' });
    wrapper.update();

    simulateKeyInput(wrapper.find('input'), "2456981'89", 0);
    expect(wrapper.state().value).toEqual("$2 456 981'89");
  });

  it('should throw error when decimal separator and thousand separator are same', () => {
    expect(() => {
      shallow(<NumberFormat thousandSeparator={'.'} prefix={'$'} />);
    }).toThrow()

    expect(() => {
      shallow(<NumberFormat thousandSeparator={','} decimalSeparator={','} prefix={'$'} />);
    }).toThrow()
  });

  it('should allow floating/integer numbers as values and do proper formatting', () => {
    const wrapper = shallow(<NumberFormat value={12345.67} />);
    expect(wrapper.state().value).toEqual('12345.67');

    wrapper.setProps({thousandSeparator: true});
    expect(wrapper.state().value).toEqual('12,345.67');

    wrapper.setProps({thousandSeparator: '.', decimalSeparator: ','});
    expect(wrapper.state().value).toEqual('12.345,67');


    wrapper.setProps({thousandSeparator: '.', decimalSeparator: ',', decimalScale: 0});
    expect(wrapper.state().value).toEqual('12.346');
  });

  it('should update formatted value if any of the props changes', () => {
    const wrapper = shallow(<NumberFormat value={12345.67} />);
    expect(wrapper.state().value).toEqual('12345.67');

    wrapper.setProps({thousandSeparator: true});
    expect(wrapper.state().value).toEqual('12,345.67');

    wrapper.setProps({thousandSeparator: '.', decimalSeparator: ','});
    expect(wrapper.state().value).toEqual('12.345,67');

    wrapper.setProps({thousandSeparator: '.', decimalSeparator: ',', decimalScale: 0});
    expect(wrapper.state().value).toEqual('12.346');
  });

  it('should allow bigger number than 2^53 and do proper formatting', () => {
    const wrapper = shallow(<NumberFormat thousandSeparator="." decimalSeparator="," />);
    const input = wrapper.find('input');
    input.simulate('change', getCustomEvent('981273724234817383478127'));
    expect(wrapper.state().value).toEqual('981.273.724.234.817.383.478.127');

    input.simulate('change', getCustomEvent('981273724234817383478,127'));
    expect(wrapper.state().value).toEqual('981.273.724.234.817.383.478,127');
  });


  it('should support decimal scale with custom decimal separator', () => {
    const wrapper = shallow(<NumberFormat thousandSeparator={'.'} decimalSeparator={','} decimalScale={2} />);
    const input = wrapper.find('input');

    input.simulate('change', getCustomEvent('2456981,89'));
    expect(wrapper.state().value).toEqual('2.456.981,89');
  });

  it('should limit to passed decimal scale', () => {
    const wrapper = shallow(<NumberFormat decimalScale={4} fixedDecimalScale={true}/>);
    const input = wrapper.find('input');

    //case 1st - already exactly scale 4 should stay that way
    input.simulate('change', getCustomEvent('4111.1111'));
    expect(wrapper.state().value).toEqual('4111.1111');

    //case 2nd - longer scale should round
    input.simulate('change', getCustomEvent('4111.11111'));
    expect(wrapper.state().value).toEqual('4111.1111');

    /** Only initial value should round off not while input **/
    input.simulate('change', getCustomEvent('4111.11118'));
    expect(wrapper.state().value).not.toEqual('4111.1112');


    //case 3rd - shorter scale adds 0
    input.simulate('change', getCustomEvent('4111.111'));
    expect(wrapper.state().value).toEqual('4111.1110');

    //case 4th - no decimal should round with 4 zeros
    input.simulate('change', getCustomEvent(''));
    input.simulate('change', getCustomEvent('4111'));
    expect(wrapper.state().value).toEqual('4111.0000');

    //case 5 - round with two decimal scale
    wrapper.setProps({decimalScale: 2});
    input.simulate('change', getCustomEvent('4111.111'));
    expect(wrapper.state().value).toEqual('4111.11');
  });

  it('should not add zeros to fixedDecimalScale is not set', () => {
    const wrapper = shallow(<NumberFormat decimalScale={4} value={24.45}/>);
    expect(wrapper.state().value).toEqual('24.45');

    wrapper.setProps({
      value: 24.45678
    });
    wrapper.update();
    expect(wrapper.state().value).toEqual('24.4568');
  });

  it('should not round the initial if decimalScale is not provided', () => {
    const wrapper = shallow(<NumberFormat value={123213.7535}/>);
    expect(wrapper.state().value).toEqual('123213.7535');

    wrapper.setProps({
      thousandSeparator: true
    });
    expect(wrapper.state().value).toEqual('123,213.7535');


    wrapper.setProps({
      thousandSeparator: '.',
      decimalSeparator: ','
    });

    expect(wrapper.state().value).toEqual('123.213,7535');

    wrapper.setProps({
      value: 36790.876
    })
    expect(wrapper.state().value).toEqual('36.790,876');

    wrapper.setProps({
      value: '56.790,876'
    })
    expect(wrapper.state().value).toEqual('56.790,876');
  });

  it('should round the initial value to given decimalScale', () => {
    const wrapper = shallow(<NumberFormat value={123213.7536} isNumericString={true} decimalScale={1}/>);
    expect(wrapper.state().value).toEqual('123213.8');

    wrapper.setProps({
      thousandSeparator: true
    });
    expect(wrapper.state().value).toEqual('123,213.8');


    wrapper.setProps({
      thousandSeparator: '.',
      decimalSeparator: ',',
      decimalScale: 3
    });

    expect(wrapper.state().value).toEqual('123.213,754');

    wrapper.setProps({
      value: 36790.876,
      decimalScale: 0
    })

    expect(wrapper.state().value).toEqual('36.791');
    wrapper.setProps({
      decimalScale: 2
    })

    expect(wrapper.state().value).toEqual('36.790,88');


    wrapper.setProps({
      value: '56790.876'
    })
    expect(wrapper.state().value).toEqual('56.790,88');

    wrapper.setProps({
      value: '981273724234817383478127.678'
    });

    expect(wrapper.state().value).toEqual('981.273.724.234.817.383.478.127,68');

  });

  it('should allow deleting all numbers when decimalScale and fixedDecimalScale is defined', () => {
    const wrapper = shallow(<NumberFormat prefix="$" decimalScale={3} value="$1.000" fixedDecimalScale={true}/>);
    simulateKeyInput(wrapper.find('input'), 'Backspace', 2);
    expect(wrapper.state().value).toEqual('')
  });

  it('should not allow to remove decimalSeparator if decimalScale and fixedDecimalScale is defined', () => {
    const wrapper = shallow(<NumberFormat prefix="$" thousandSeparator={true} decimalScale={3} fixedDecimalScale={true} value="$1,234.000"/>);
    simulateKeyInput(wrapper.find('input'), 'Backspace', 7);
    expect(wrapper.state().value).toEqual('$1,234.000');

    wrapper.setProps({decimalScale: undefined})
    wrapper.update();
    simulateKeyInput(wrapper.find('input'), 'Backspace', 7);
    expect(wrapper.state().value).toEqual('$1,234,000');
  });

  it('should not round by default', () => {
    const wrapper = shallow(<NumberFormat/>);
    const input = wrapper.find('input');

    //case 1st - no rounding with long decimal
    input.simulate('change', getCustomEvent('4111.111111'));
    expect(wrapper.state().value).toEqual('4111.111111');

    //case 2nd - no rounding with whole numbers
    input.simulate('change', getCustomEvent('4111'));
    expect(wrapper.state().value).toEqual('4111');

    //case 3rd - no rounding on single place decimals
    input.simulate('change', getCustomEvent('4111.1'));
    expect(wrapper.state().value).toEqual('4111.1');
  });

  it('sould not allow decimal numbers if decimal scale is set to 0', () => {
    const wrapper = shallow(<NumberFormat thousandSeparator={true} decimalScale={0}/>);
    const input = wrapper.find('input');

    //case 1 - decimal scale set to 0
    input.simulate('change', getCustomEvent('4111.'));
    expect(wrapper.state().value).toEqual('4,111');

    //case 2 - It should round to integer if passed value props as decimal values
    wrapper.setProps({value: 1234.78});
    wrapper.update();
    expect(wrapper.state().value).toEqual('1,235');
  });

  it('should allow decimal seperator and thousand separator on suffix prefix', () => {
    const wrapper = shallow(<NumberFormat value={1231237.56} thousandSeparator={','} decimalSeparator={'.'} prefix={'$'} suffix={' per sq. ft.'}/> );
    expect(wrapper.state().value).toEqual('$1,231,237.56 per sq. ft.');

    wrapper.setProps({suffix: '', prefix: '$ per, sq. ft. '});
    wrapper.update();
    expect(wrapper.state().value).toEqual('$ per, sq. ft. 1,231,237.56');
  });

  it('should not remove leading 0s while user is in focus', () => {
    const wrapper = shallow(<NumberFormat value={23456.78} thousandSeparator={','} decimalSeparator={'.'} prefix={'$'}/> );
    simulateKeyInput(wrapper.find('input'), '0', 1);

    expect(wrapper.state().value).toEqual('$023,456.78');

    wrapper.setProps({value: 10000.25});
    wrapper.update();

    simulateKeyInput(wrapper.find('input'), 'Backspace', 2);

    expect(wrapper.state().value).toEqual('$0,000.25');

    simulateKeyInput(wrapper.find('input'), '2', 1);
    expect(wrapper.state().value).toEqual('$20,000.25');
  });

  it('should remove leading 0s while user go out of focus', () => {
    const wrapper = shallow(<NumberFormat value={23456.78} thousandSeparator={','} decimalSeparator={'.'} prefix={'$'}/> );

    simulateKeyInput(wrapper.find('input'), '0', 1);
    simulateBlurEvent(wrapper.find('input'));

    expect(wrapper.state().value).toEqual('$23,456.78');

    wrapper.setProps({value: 10000.25});
    wrapper.update();

    simulateKeyInput(wrapper.find('input'), 'Backspace', 2);
    simulateBlurEvent(wrapper.find('input'));
    expect(wrapper.state().value).toEqual('$0.25');
  });

  it('should add 0 before decimal if user is in focus', () => {
    const wrapper = shallow(<NumberFormat value={0.78} thousandSeparator={','} decimalSeparator={'.'} prefix={'$'}/> );

    simulateKeyInput(wrapper.find('input'), 'Backspace', 2);

    expect(wrapper.state().value).toEqual('$.78');

    simulateKeyInput(wrapper.find('input'), '2', 1);
    expect(wrapper.state().value).toEqual('$2.78');
  });

  it('should not add 0 before decimal if user go out of focus', () => {
    const wrapper = shallow(<NumberFormat value={0.78} thousandSeparator={','} decimalSeparator={'.'} prefix={'$'}/> );
    simulateKeyInput(wrapper.find('input'), 'Backspace', 2);

    expect(wrapper.state().value).toEqual('$.78');

    simulateBlurEvent(wrapper.find('input'));
    expect(wrapper.state().value).toEqual('$0.78');
  });

  it('should allow typing decimalSeparator if input is empty', () => {
    const wrapper = shallow(<NumberFormat thousandSeparator={','} decimalSeparator={'.'} prefix={'$'}/> );
    simulateKeyInput(wrapper.find('input'), '.', 0);

    expect(wrapper.state().value).toEqual('$.');
  })

  it('should delete all characters if nothing is after decimalSeparator and before decimalSeparator is deleted', () => {
    const wrapper = shallow(<NumberFormat decimalSeparator={'.'} prefix={'$'} value="$0."/> );
    expect(wrapper.state().value).toEqual('$0.');

    simulateKeyInput(wrapper.find('input'), 'Backspace', 2);
    expect(wrapper.state().value).toEqual('');
  });

  it('should should not clear input if after decimal is deleted and nothing is before decimal', () => {
    const wrapper = shallow(<NumberFormat decimalSeparator={'.'} prefix={'$'} value="$.3"/> );
    simulateKeyInput(wrapper.find('input'), 'Backspace', 3);
    expect(wrapper.state().value).toEqual('$.');
  });

  it('should should allow ctrl + a -> decimalSeparator', () => {
    const wrapper = shallow(<NumberFormat decimalSeparator={'.'} prefix={'$'} value="$34.35"/> );
    wrapper.find('input').simulate('change', getCustomEvent('.', 1, 1));
    expect(wrapper.state().value).toEqual('$.');
  });

  //Issue #137 isNumericString=true breaks decimal places
  it('should not break decimal palces when isNumericString is set to true and decimal scale is provided. Issue #137', () => {
    class IssueExample extends React.Component {
      constructor() {
        super();
        this.state = {
          value: '3456'
        }
      }
      render() {
        const {value} = this.state;
        return (
          <NumberFormat isNumericString={true} decimalScale={2} prefix={'$'} value={value} onValueChange={({value}) => {
            this.setState({value})
            console.log('value');
          }}/>
        )
      }
    }
    const wrapper = mount(<IssueExample/> );
    simulateKeyInput(wrapper.find('input'), '.', 5);
    shallow(wrapper.get(0)).update();
    expect(ReactDOM.findDOMNode(wrapper.instance()).value).toEqual('$3456.');
  });

  //Issue #140
  it('should not give NaN zeros, when decimalScale is 0 and roundedValue will be multiple of 10s, Issue #140', () => {
    const wrapper = shallow(<NumberFormat value={-9.5} decimalScale={0}/> );
    expect(wrapper.state().value).toEqual('-10');

    wrapper.setProps({value: -99.5});
    expect(wrapper.state().value).toEqual('-100');
  });
});
