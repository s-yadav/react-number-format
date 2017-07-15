import React from 'react';
import { shallow } from 'enzyme';
import NumberFormat from '../../src/number_format';

/*** format_number input as text ****/
describe('NumberFormat as text', () => {
  it('should format numbers to currency', () => {
    const wrapper = shallow(<NumberFormat value={2456981} displayType={'text'} thousandSeparator={true} prefix={'$'} />);
    expect(wrapper.find('span').text()).toEqual('$2,456,981');
  });

  it('should format as given format', () => {
    const wrapper = shallow(<NumberFormat value={4111111111111111} displayType={'text'} format="#### #### #### ####" />);
    expect(wrapper.find('span').text()).toEqual('4111 1111 1111 1111');
  });

  it('should format as given format when input is string', () => {
    const wrapper = shallow(<NumberFormat value="4111111111111111" displayType={'text'} format="#### #### #### ####" />);
    expect(wrapper.find('span').text()).toEqual('4111 1111 1111 1111');
  });

  it('should format as given format when input length is less than format length', () => {
    const wrapper = shallow(<NumberFormat value="41111111111111" displayType={'text'} format="#### #### #### ####" />);
    expect(wrapper.find('span').text()).toEqual('4111 1111 1111 11');
  });

  it('should format as given format with mask', () => {
    const wrapper = shallow(<NumberFormat value="41111111111111" displayType={'text'} format="#### #### #### ####" mask="_" />);
    expect(wrapper.find('span').text()).toEqual('4111 1111 1111 11__');
  });

  it('should not round decimals by defualt', () => {
    const wrapper = shallow(<NumberFormat value="4111" displayType={'text'} />);
    expect(wrapper.find('span').text()).toEqual('4111');
  });

  it('should round to 2 decimals if passed true', () => {
    const wrapper = shallow(<NumberFormat value="4111" displayType={'text'} decimalPrecision={2} />);
    expect(wrapper.find('span').text()).toEqual('4111.00');
  });

  it('should round to 4 decimals if passed 4', () => {
    const wrapper = shallow(<NumberFormat value="4111.11" displayType={'text'} decimalPrecision={4} />);
    expect(wrapper.find('span').text()).toEqual('4111.1100');
  });
});
