import React from 'react';
import { shallow, mount } from 'enzyme';
import NumberFormat from '../../src/number_format';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TextField from 'material-ui/TextField';

import {getCustomEvent} from '../test_util';
import {cardExpiry} from '../../custom_formatters/card_expiry';

/*** format_number input as input ****/
describe('NumberFormat as input', () => {
  it('should render input as type text by default', () => {
    const wrapper = mount(<NumberFormat />);
    expect(wrapper.find('input').get(0).getAttribute('type')).toEqual('text');
  });

  it('should render input as type tel', () => {
    const wrapper = mount(<NumberFormat type="tel" />);
    expect(wrapper.find('input').get(0).getAttribute('type')).toEqual('tel');
  });

  it('should have initial value', () => {
    const wrapper = mount(<NumberFormat value={2456981} thousandSeparator={true} prefix={'$'} />);
    expect(wrapper.state().value).toEqual('$2,456,981');
    expect(wrapper.find('input').get(0).value).toEqual('$2,456,981');
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

  it('should listen on change event and formmat properly', () => {
    const wrapper = shallow(<NumberFormat thousandSeparator={true} prefix={'$'} />);

    wrapper.find('input').simulate('change', getCustomEvent('2456981'));

    expect(wrapper.state().value).toEqual('$2,456,981');
  });

  it('removes negation when format props is provided', () => {
    const wrapper = shallow(<NumberFormat format="#### #### #### ####" />);

    wrapper.find('input').simulate('change', getCustomEvent('-2456981'));

    expect(wrapper.state().value).toEqual('2456 981');
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


  it('should block inputs based on isAllowed callback', () => {
    const wrapper = shallow(<NumberFormat isAllowed={(values) => {
      const {floatValue} = values;
      return floatValue <= 10000;
    }}/>, {lifecycleExperimental: true});

    const input = wrapper.find('input');

    input.simulate('change', getCustomEvent('9999'));
    expect(wrapper.state().value).toEqual('9999');

    input.simulate('change', getCustomEvent('99992'));
    expect(wrapper.state().value).toEqual('9999');
  })


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

    wrapper.setProps({format: '#### #### #### ####', mask: '_'});
    input.simulate('change', getCustomEvent('41111 1'));
    expect(input.get(0).value).toEqual('4111 11__ ____ ____');
  });
});

describe('Test caret position manipulation', () => {
  it('caret should move to typing area if user click between prefix or suffix', () => {
    const wrapper = shallow(<NumberFormat thousandSeparator={true} prefix={'$'} suffix={' per sqr. mt.'} />);
    const instance = wrapper.instance();
    expect(instance.getCaretPosition('$123,124,234.56 per sqr. mt.', '$123,124,234.56 per sqr. mt.', 0)).toEqual(1);

    expect(instance.getCaretPosition('$123 per sqr. mt.', '$123 per sqr. mt.', 7)).toEqual(4);
  });

  it('should update cursor position if formmatted value is different than input value', () => {
    const wrapper = shallow(<NumberFormat thousandSeparator={true} prefix={'$'} />);
    const instance = wrapper.instance();

    //case when nonNumeric characters are removed
    expect(instance.getCaretPosition('$123,a124,234.56', '$123,124,234.56', 6)).toEqual(5);

    //case when formatting is changed
    expect(instance.getCaretPosition('$12312', '$12,312', 5)).toEqual(6);

    //case if isAllowed is blocking new input say minimum value is 9
    expect(instance.getCaretPosition('$1.234', '$10.456', 2)).toEqual(2);

    //case when rounding off
    expect(instance.getCaretPosition('$1.235600', '$1.246', 9)).toEqual(6);
  });

  it('maintains the cursor position when removing leading zero', () => {
    const wrapper = shallow(<NumberFormat thousandSeparator={true} prefix={'$'}/>);
    const instance = wrapper.instance();
    expect(instance.getCaretPosition('$000123', '$123', 4)).toEqual(1);
    expect(instance.getCaretPosition('$00.123', '$0.123', 3)).toEqual(2);
  });

//  Failing testcase not a critical one
  it('corrects the cursor position if custom format is applied', () => {
    const wrapper = shallow(<NumberFormat format={cardExpiry} />);
    const instance = wrapper.instance();
    expect(instance.getCaretPosition('00/12', '01/12', 2)).toEqual(2);
    expect(instance.getCaretPosition('001/1', '01/11', 2)).toEqual(2);
  })

});
