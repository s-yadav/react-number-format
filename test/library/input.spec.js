import React from 'react';

import TextField from 'material-ui/TextField';

import NumberFormat from '../../src/number_format';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {simulateKeyInput, shallow, mount} from '../test_util';

/*** format_number input as input ****/
describe('NumberFormat as input', () => {
  it('should render input as type text by default', () => {
    const wrapper = mount(<NumberFormat />);
    expect(wrapper.find('input').instance().getAttribute('type')).toEqual('text');
  });

  it('should render input as type tel', () => {
    const wrapper = mount(<NumberFormat type="tel" />);
    expect(wrapper.find('input').instance().getAttribute('type')).toEqual('tel');
  });

  it('should have initial value', () => {
    const wrapper = mount(<NumberFormat value={2456981} thousandSeparator={true} prefix={'$'} />);
    expect(wrapper.state().value).toEqual('$2,456,981');
    expect(wrapper.find('input').instance().value).toEqual('$2,456,981');
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
    }} value={9999}/>, {lifecycleExperimental: true});

    const input = wrapper.find('input');

    expect(wrapper.state().value).toEqual('9999');

    simulateKeyInput(input, '9', 4);

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

    simulateKeyInput(input, '2456981,89', 0);
    expect(input.instance().value).toEqual('2.456.981,89');

    wrapper.setProps({format: '#### #### #### ####', mask: '_', value: ''});

    simulateKeyInput(input, '411111', 0);
    expect(input.instance().value).toEqual('4111 11__ ____ ____');
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
