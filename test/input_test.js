import React from 'react';
import { shallow, mount } from 'enzyme';
import NumberFormat from '../src/number_format';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TextField from 'material-ui/TextField';

function getCustomEvent(value) {
  return {
    persist: function(){},
    preventDefault: function(){},
    target: {
      value,
      focus: function(){}
    }
  }
}

/*** format_number input as input ****/
describe('NumberFormat as input', () => {
  it('should have initial value', () => {
    const wrapper = mount(<NumberFormat value={2456981} thousandSeparator={true} prefix={'$'} />);
    expect(wrapper.state().value).toEqual('$2,456,981');
    expect(wrapper.find('input').get(0).value).toEqual('$2,456,981');
  });

  it('show the initial value as $0 when number 0 is passed', () => {
    const wrapper = shallow(<NumberFormat value={0} thousandSeparator={true} prefix={'$'} />);
    expect(wrapper.state().value).toEqual('$0');
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
    const domInput = input.get(0);

    input.simulate('change', getCustomEvent('2456981'));

    expect(domInput.value).toEqual('$2,456,981');

    wrapper.setState({testState: true});

    expect(domInput.value).toEqual('$2,456,981');
  });

  it('should listen change event and formmat currency properly', () => {
    const wrapper = shallow(<NumberFormat thousandSeparator={true} prefix={'$'} />);

    wrapper.find('input').simulate('change', getCustomEvent('2456981'));

    expect(wrapper.state().value).toEqual('$2,456,981');
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

  it('removes negation when format props is provided', () => {
    const wrapper = shallow(<NumberFormat format="#### #### #### ####" />);
    
    wrapper.find('input').simulate('change', getCustomEvent('-2456981'));

    expect(wrapper.state().value).toEqual('2456 981');
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

  it('should support decimal precision with custom decimal separator', () => {
    const wrapper = shallow(<NumberFormat thousandSeparator={'.'} decimalSeparator={','} decimalPrecision={2} />);
    const input = wrapper.find('input');

    input.simulate('change', getCustomEvent('2456981,89'));
    expect(wrapper.state().value).toEqual('2.456.981,89');
  });

  it('should have proper intermediate formatting', () => {
    const wrapper = shallow(<NumberFormat format="#### #### #### ####" />);
    const input = wrapper.find('input');

    //case 1st - if entered a number where formatting should happen
    input.simulate('change', getCustomEvent('41111'));
    expect(wrapper.state().value).toEqual('4111 1');

    //case 2st - if pressed backspace at formatting point
    input.simulate('change', getCustomEvent('411 1'));
    expect(wrapper.state().value).toEqual('4111');

    //case 3rd - if something entered before formatting point
    input.simulate('change', getCustomEvent('41111 1'));
    expect(wrapper.state().value).toEqual('4111 11');

    //case 4th - if something entered when maximum numbers are input
    input.simulate('change', getCustomEvent('41112 1111 1111 1111'));
    expect(wrapper.state().value).toEqual('4111 2111 1111 1111');


    //case 5th - if something removed after empty space
    input.simulate('change', getCustomEvent('4111 2111 211 1111'));
    expect(wrapper.state().value).toEqual('4111 2111 2111 111');

    //case 6th - if space is removed
    input.simulate('change', getCustomEvent('41112111 1211 1111'));
    expect(wrapper.state().value).toEqual('4111 2111 1211 1111');
  });

  it('should have proper intermediate masking', () => {
    const wrapper = shallow(<NumberFormat format="#### #### #### ####"  mask="_"/>);
    const input = wrapper.find('input');

    //case 1st - if entered a number where formatting should happen
    input.simulate('change', getCustomEvent('41111'));
    expect(wrapper.state().value).toEqual('4111 1___ ____ ____');

    //case 2st - if pressed backspace at formatting point
    input.simulate('change', getCustomEvent('411 1'));
    expect(wrapper.state().value).toEqual('4111 ____ ____ ____');


    //case 3rd - if something entered before formatting point
    input.simulate('change', getCustomEvent('41111 1'));
    expect(wrapper.state().value).toEqual('4111 11__ ____ ____');

    //case 4th - if something entered when maximum numbers are input
    input.simulate('change', getCustomEvent('41112 1111 1111 1111'));
    expect(wrapper.state().value).toEqual('4111 2111 1111 1111');

    //case 5th - if something removed after empty space
    input.simulate('change', getCustomEvent('4111 2111 211 1111'));
    expect(wrapper.state().value).toEqual('4111 2111 2111 111_');

    //case 6th - if space is removed
    input.simulate('change', getCustomEvent('41112111 1211 1111'));
    expect(wrapper.state().value).toEqual('4111 2111 1211 1111');
  });

  it('should round to passed decimal precision', () => {
    const wrapper = shallow(<NumberFormat decimalPrecision={4}/>);
    const input = wrapper.find('input');

    //case 1st - already exactly precision 4 should stay that way
    input.simulate('change', getCustomEvent('4111.1111'));
    expect(wrapper.state().value).toEqual('4111.1111');

    //case 2nd - longer precision should round
    input.simulate('change', getCustomEvent('4111.11111'));
    expect(wrapper.state().value).toEqual('4111.1111');

    /** TODO: Failing test case **/
    /** Only initial value should round off not while input **/
    // input.simulate('change', getCustomEvent('4111.11118'));
    // expect(wrapper.state().value).toEqual('4111.1112');


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

    input.simulate('change', getCustomEvent('2456981,89'));
    expect(input.get(0).value).toEqual('2.456.981,89');

    wrapper.setProps({format: '#### #### #### ####', mask: '_', thousandSeparator: false, decimalSeparator: false});
    input.simulate('change', getCustomEvent('41111 1'));
    expect(input.get(0).value).toEqual('4111 11__ ____ ____');

  });


});

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
    const wrapper = shallow(<NumberFormat value="4111" displayType={'text'} decimalPrecision={true} />);
    expect(wrapper.find('span').text()).toEqual('4111.00');
  });

  it('should round to 4 decimals if passed 4', () => {
    const wrapper = shallow(<NumberFormat value="4111.11" displayType={'text'} decimalPrecision={4} />);
    expect(wrapper.find('span').text()).toEqual('4111.1100');
  });
});
