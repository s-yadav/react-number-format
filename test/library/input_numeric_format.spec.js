import React from 'react';
import { shallow, mount } from 'enzyme';
import NumberFormat from '../../src/number_format';

import {getCustomEvent} from '../test_util';


/**
 * This suit is to test NumberFormat when normal numeric values are provided without any formatting options
 * Use cases:
 * currency
 * Number
 * units
 */
describe('Test NumberFormat as input with numeric format options', () => {
  it('show the initial value as $0 when number 0 is passed', () => {
    const wrapper = shallow(<NumberFormat value={0} thousandSeparator={true} prefix={'$'} />);
    expect(wrapper.state().value).toEqual('$0');
  });

  it('show the initial value as empty string when empty string is passed and decimalPrecision is set', () => {
    const wrapper = mount(<NumberFormat value="" thousandSeparator={true} decimalPrecision={2} />);
    expect(wrapper.state().value).toEqual('');
    expect(wrapper.find('input').get(0).value).toEqual('');
  });

  it('show the initial value as empty string when empty string is passed and decimalPrecision is not set', () => {
    const wrapper = mount(<NumberFormat value="" thousandSeparator={true} />);
    expect(wrapper.state().value).toEqual('');
    expect(wrapper.find('input').get(0).value).toEqual('');
  });

  it('should maintain decimal points', () => {
    const wrapper = shallow(<NumberFormat thousandSeparator={true} prefix={'$'} />);

    wrapper.find('input').simulate('change', getCustomEvent('2456981.89'));

    expect(wrapper.state().value).toEqual('$2,456,981.89');
  });

  it('supports negative numbers', () => {
    const wrapper = shallow(<NumberFormat thousandSeparator={true} prefix={'$'} />);

    wrapper.find('input').simulate('change', getCustomEvent('-2456981.89'));

    expect(wrapper.state().value).toEqual('-$2,456,981.89');

    wrapper.find('input').simulate('change', getCustomEvent('-'));
    expect(wrapper.state().value).toEqual('-');
  });


  it('removes negation when double negation is done', () => {
    const wrapper = shallow(<NumberFormat thousandSeparator={true} prefix={'$'} />);

    wrapper.find('input').simulate('change', getCustomEvent('--2456981.89'));

    expect(wrapper.state().value).toEqual('$2,456,981.89');

    wrapper.find('input').simulate('change', getCustomEvent('--'));
    expect(wrapper.state().value).toEqual('');
  });

  it('allows negation and double negation any cursor position in the input', () => {
    const wrapper = shallow(<NumberFormat thousandSeparator={true} prefix={'$'}/>);

    wrapper.find('input').simulate('change', getCustomEvent('24569-81.89'));

    expect(wrapper.state().value).toEqual('-$2,456,981.89');

    wrapper.find('input').simulate('change', getCustomEvent('24569--81.89'));

    expect(wrapper.state().value).toEqual('$2,456,981.89');
  });


  it('should support custom thousand seperator', () => {
    const wrapper = shallow(<NumberFormat thousandSeparator={'.'} decimalSeparator={','} prefix={'$'} />);
    const input = wrapper.find('input');

    input.simulate('change', getCustomEvent('2456981,89'));

    expect(wrapper.state().value).toEqual('$2.456.981,89');

    wrapper.setProps({thousandSeparator: "'"});

    /** TODO : Failing testcases, changing thousand seperator, decimal seperator on the fly fails **/
    //expect(wrapper.state().value).toEqual("$2'456'981,89");

    input.simulate('change', getCustomEvent('2456981,89'));
    expect(wrapper.state().value).toEqual("$2'456'981,89");

    wrapper.setProps({thousandSeparator: " ", decimalSeparator:"'" });
    input.simulate('change', getCustomEvent("2456981'89"));
    expect(wrapper.state().value).toEqual("$2 456 981'89");

    wrapper.setProps({thousandSeparator: ",", decimalSeparator: "."});
    input.simulate('change', getCustomEvent("2456981.89"));
    expect(wrapper.state().value).toEqual("$2,456,981.89");
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
    const wrapper = shallow(<NumberFormat value={12345.67} />, { lifecycleExperimental: true });
    expect(wrapper.state().value).toEqual('12345.67');

    wrapper.setProps({thousandSeparator: true});
    expect(wrapper.state().value).toEqual('12,345.67');

    wrapper.setProps({thousandSeparator: '.', decimalSeparator: ','});
    expect(wrapper.state().value).toEqual('12.345,67');


    wrapper.setProps({thousandSeparator: '.', decimalSeparator: ',', decimalPrecision: 0});
    expect(wrapper.state().value).toEqual('12.346');
  });

  it('should update formatted value if any of the props changes', () => {
    const wrapper = shallow(<NumberFormat value={12345.67} />, { lifecycleExperimental: true });
    expect(wrapper.state().value).toEqual('12345.67');

    wrapper.setProps({thousandSeparator: true});
    expect(wrapper.state().value).toEqual('12,345.67');

    wrapper.setProps({thousandSeparator: '.', decimalSeparator: ','});
    expect(wrapper.state().value).toEqual('12.345,67');

    wrapper.setProps({thousandSeparator: '.', decimalSeparator: ',', decimalPrecision: 0});
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


  it('should support decimal precision with custom decimal separator', () => {
    const wrapper = shallow(<NumberFormat thousandSeparator={'.'} decimalSeparator={','} decimalPrecision={2} />);
    const input = wrapper.find('input');

    input.simulate('change', getCustomEvent('2456981,89'));
    expect(wrapper.state().value).toEqual('2.456.981,89');
  });

  it('should limit to passed decimal precision', () => {
    const wrapper = shallow(<NumberFormat decimalPrecision={4}/>);
    const input = wrapper.find('input');

    //case 1st - already exactly precision 4 should stay that way
    input.simulate('change', getCustomEvent('4111.1111'));
    expect(wrapper.state().value).toEqual('4111.1111');

    //case 2nd - longer precision should round
    input.simulate('change', getCustomEvent('4111.11111'));
    expect(wrapper.state().value).toEqual('4111.1111');

    /** Only initial value should round off not while input **/
    input.simulate('change', getCustomEvent('4111.11118'));
    expect(wrapper.state().value).not.toEqual('4111.1112');


    //case 3rd - shorter precision adds 0
    input.simulate('change', getCustomEvent('4111.111'));
    expect(wrapper.state().value).toEqual('4111.1110');

    //case 4th - no decimal should round with 4 zeros
    input.simulate('change', getCustomEvent('4111'));
    expect(wrapper.state().value).toEqual('4111.0000');

    //case 5 - round with two decimal precision
    wrapper.setProps({decimalPrecision: 2});
    input.simulate('change', getCustomEvent('4111.111'));
    expect(wrapper.state().value).toEqual('4111.11');
  });

  it('should not round the initial if decimalPrecision is not provided', () => {
    const wrapper = shallow(<NumberFormat value={123213.7535}/>, {lifecycleExperimental: true});
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

  it('should round the initial value to given decimalPrecision', () => {
    const wrapper = shallow(<NumberFormat value={123213.7536} decimalPrecision={1}/>, {lifecycleExperimental: true});
    expect(wrapper.state().value).toEqual('123213.8');

    wrapper.setProps({
      thousandSeparator: true
    });
    expect(wrapper.state().value).toEqual('123,213.8');


    wrapper.setProps({
      thousandSeparator: '.',
      decimalSeparator: ',',
      decimalPrecision: 3
    });

    expect(wrapper.state().value).toEqual('123.213,754');

    wrapper.setProps({
      value: 36790.876,
      decimalPrecision: 0
    })

    expect(wrapper.state().value).toEqual('36.791');
    wrapper.setProps({
      decimalPrecision: 2
    })

    expect(wrapper.state().value).toEqual('36.790,88');


    wrapper.setProps({
      value: '56.790,876'
    })
    expect(wrapper.state().value).toEqual('56.790,88');

    wrapper.setProps({
      value: '981273724234817383478127,678'
    });

    expect(wrapper.state().value).toEqual('981.273.724.234.817.383.478.127,68');

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

  it('sould not allow decimal numbers if decimal precision is set to 0', () => {
    const wrapper = shallow(<NumberFormat thousandSeparator={true} decimalPrecision={0}/>, {lifecycleExperimental: true});
    const input = wrapper.find('input');

    //case 1 - decimal precision set to 0
    input.simulate('change', getCustomEvent('4111.'));
    expect(wrapper.state().value).toEqual('4,111');

    //case 2 - It should round to integer if passed value props as decimal values
    wrapper.setProps({value: 1234.78});
    expect(wrapper.state().value).toEqual('1,235');
  });

  it('should allow decimal seperator and thousand separator on suffix prefix', () => {
    const wrapper = shallow(<NumberFormat value={1231237.56} thousandSeparator={','} decimalSeparator={'.'} prefix={'$'} suffix={' per sq. ft.'}/> , {lifecycleExperimental: true});
    expect(wrapper.state().value).toEqual('$1,231,237.56 per sq. ft.');

    wrapper.setProps({suffix: '', prefix: '$ per, sq. ft. '});
    expect(wrapper.state().value).toEqual('$ per, sq. ft. 1,231,237.56');
  });

});
