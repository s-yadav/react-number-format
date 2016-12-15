import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import FormatNumberInput from '../src/number_format';

/*** format_number input as input ****/
describe('FormatNumberInput as input', () => {
  it('should have initial value', () => {
    const component = ReactTestUtils.renderIntoDocument(<FormatNumberInput value={2456981} thousandSeparator={true} prefix={'$'} />);
    const input = ReactTestUtils.findRenderedDOMComponentWithTag(
       component, 'input'
    );
    expect(input.value).toEqual("$2,456,981");
  });

  it('show the initial value as $0 when number 0 is passed', () => {
    const component = ReactTestUtils.renderIntoDocument(<FormatNumberInput value={0} thousandSeparator={true} prefix={'$'} />);
    const input = ReactTestUtils.findRenderedDOMComponentWithTag(
       component, 'input'
    );
    expect(input.value).toEqual("$0");
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
        return (<FormatNumberInput thousandSeparator={true} prefix={'$'}/>)
      }
    }

    const component = ReactTestUtils.renderIntoDocument(<WrapperComponent />);
    const input = ReactTestUtils.findRenderedDOMComponentWithTag(
       component, 'input'
    );

    input.value = "2456981";

    ReactTestUtils.Simulate.input(input);

    expect(input.value).toEqual("$2,456,981");

    component.setState({testState: true});

    expect(input.value).toEqual("$2,456,981");
    
  });

  it('should listen input event and formmat currency properly', () => {
    const component = ReactTestUtils.renderIntoDocument(<FormatNumberInput thousandSeparator={true} prefix={'$'} />);
    const input = ReactTestUtils.findRenderedDOMComponentWithTag(
       component, 'input'
    );

    input.value = "2456981";

    ReactTestUtils.Simulate.input(input);

    expect(input.value).toEqual("$2,456,981");
  });


  it('should listen change event and format currency properly', () => {
    const component = ReactTestUtils.renderIntoDocument(<FormatNumberInput thousandSeparator={true} prefix={'$'} />);
    const input = ReactTestUtils.findRenderedDOMComponentWithTag(
       component, 'input'
    );

    input.value = "2456981";

    ReactTestUtils.Simulate.change(input);

    expect(input.value).toEqual("$2,456,981");
  });

  it('should maintain decimal points', () => {
    const component = ReactTestUtils.renderIntoDocument(<FormatNumberInput thousandSeparator={true} prefix={'$'} />);
    const input = ReactTestUtils.findRenderedDOMComponentWithTag(
       component, 'input'
    );

    input.value = "2456981.89";

    ReactTestUtils.Simulate.input(input);

    expect(input.value).toEqual("$2,456,981.89");
  });

  it('should support custom thousand seperator', () => {
    const component = ReactTestUtils.renderIntoDocument(<FormatNumberInput thousandSeparator={'.'} decimalSeparator={','} prefix={'$'} />);
    const input = ReactTestUtils.findRenderedDOMComponentWithTag(
       component, 'input'
    );

    input.value = "2456981,89";

    ReactTestUtils.Simulate.input(input);

    expect(input.value).toEqual("$2.456.981,89");
  });


  it('should have proper intermediate formatting', () => {
    const component = ReactTestUtils.renderIntoDocument(<FormatNumberInput format="#### #### #### ####" />);
    const input = ReactTestUtils.findRenderedDOMComponentWithTag(
       component, 'input'
    );

    //case 1st - if entered a number where formatting should happen
    input.value = "41111";
    ReactTestUtils.Simulate.change(input);
    expect(input.value).toEqual("4111 1");

    //case 2st - if pressed backspace at formatting point
    input.value = "411 1";
    ReactTestUtils.Simulate.change(input);
    expect(input.value).toEqual("4111");

    //case 3rd - if something entered before formatting point
    input.value = "41111 1";
    ReactTestUtils.Simulate.change(input);
    expect(input.value).toEqual("4111 11");

    //case 4th - if something entered when maximum numbers are input
    input.value = "41112 1111 1111 1111";
    ReactTestUtils.Simulate.change(input);
    expect(input.value).toEqual("4111 2111 1111 1111");


    //case 5th - if something removed after empty space
    input.value = "4111 2111 211 1111";
    ReactTestUtils.Simulate.change(input);
    expect(input.value).toEqual("4111 2111 2111 111");

    //case 6th - if space is removed
    input.value = "41112111 1211 1111";
    ReactTestUtils.Simulate.change(input);
    expect(input.value).toEqual("4111 2111 1211 1111");
  });

  it('should have proper intermediate masking', () => {
    const component = ReactTestUtils.renderIntoDocument(<FormatNumberInput format="#### #### #### ####" mask="_"/>);
    const input = ReactTestUtils.findRenderedDOMComponentWithTag(
       component, 'input'
    );

    //case 1st - if entered a number where formatting should happen
    input.value = "41111";
    ReactTestUtils.Simulate.change(input);
    expect(input.value).toEqual("4111 1___ ____ ____");

    //case 2st - if pressed backspace at formatting point
    input.value = "411 1";
    ReactTestUtils.Simulate.change(input);
    expect(input.value).toEqual("4111 ____ ____ ____");

    //case 3rd - if something entered before formatting point
    input.value = "41111 1";
    ReactTestUtils.Simulate.change(input);
    expect(input.value).toEqual("4111 11__ ____ ____");

    //case 4th - if something entered when maximum numbers are input
    input.value = "41112 1111 1111 1111";
    ReactTestUtils.Simulate.change(input);
    expect(input.value).toEqual("4111 2111 1111 1111");


    //case 5th - if something removed after empty space
    input.value = "4111 2111 211 1111";
    ReactTestUtils.Simulate.change(input);
    expect(input.value).toEqual("4111 2111 2111 111_");

    //case 6th - if space is removed
    input.value = "41112111 1211 1111";
    ReactTestUtils.Simulate.change(input);
    expect(input.value).toEqual("4111 2111 1211 1111");
  });

  it('should round to passed decimal precision', () => {
    const component = ReactTestUtils.renderIntoDocument(<FormatNumberInput decimalPrecision={4}/>);
    const input = ReactTestUtils.findRenderedDOMComponentWithTag(
        component, 'input'
    );

    //case 1st - already exactly precision 4 should stay that way
    input.value = "4111.1111";
    ReactTestUtils.Simulate.change(input);
    expect(input.value).toEqual("4111.1111");

    //case 2nd - longer precision should round
    input.value = "4111.11111";
    ReactTestUtils.Simulate.change(input);
    expect(input.value).toEqual("4111.1111");

    //case 3rd - shorter precision adds 0
    input.value = "4111.111";
    ReactTestUtils.Simulate.change(input);
    expect(input.value).toEqual("4111.1110");

    //case 4th - no decimal should round with 4 zeros
    input.value = "4111";
    ReactTestUtils.Simulate.change(input);
    expect(input.value).toEqual("4111.0000");

  });


  it('should not round by default', () => {
    const component = ReactTestUtils.renderIntoDocument(<FormatNumberInput />);
    const input = ReactTestUtils.findRenderedDOMComponentWithTag(
        component, 'input'
    );

    //case 1st - no rounding with long decimal
    input.value = "4111.111111";
    ReactTestUtils.Simulate.change(input);
    expect(input.value).toEqual("4111.111111");

    //case 2nd - no rounding with whole numbers
    input.value = "4111";
    ReactTestUtils.Simulate.change(input);
    expect(input.value).toEqual("4111");

    //case 3rd - no rounding on single place decimals
    input.value = "4111.1";
    ReactTestUtils.Simulate.change(input);
    expect(input.value).toEqual("4111.1");
  });

  it('should round default 2 places', () => {
    const component = ReactTestUtils.renderIntoDocument(<FormatNumberInput decimalPrecision={true} />);
    const input = ReactTestUtils.findRenderedDOMComponentWithTag(
        component, 'input'
    );

    //case 1st - auto round to 2 places
    input.value = "4111.1111";
    ReactTestUtils.Simulate.change(input);
    expect(input.value).toEqual("4111.11");

    //case 2nd - auto round whole integers
    input.value = "4111";
    ReactTestUtils.Simulate.change(input);
    expect(input.value).toEqual("4111.00");
  });
});

/*** format_number input as text ****/
describe('FormatNumberInput as text', () => {
  it('should format numbers to currency', () => {
    const component = ReactTestUtils.renderIntoDocument(<FormatNumberInput value={2456981} displayType={'text'} thousandSeparator={true} prefix={'$'} />);
    const span = ReactTestUtils.findRenderedDOMComponentWithTag(
       component, 'span'
    );
    expect(span.textContent).toEqual("$2,456,981");
  });

  it('should format as given format', () => {
    const component = ReactTestUtils.renderIntoDocument(<FormatNumberInput value={4111111111111111} displayType={'text'} format="#### #### #### ####" />);
    const span = ReactTestUtils.findRenderedDOMComponentWithTag(
       component, 'span'
    );
    expect(span.textContent).toEqual("4111 1111 1111 1111");
  });

  it('should format as given format when input is string', () => {
    const component = ReactTestUtils.renderIntoDocument(<FormatNumberInput value="4111111111111111" displayType={'text'} format="#### #### #### ####" />);
    const span = ReactTestUtils.findRenderedDOMComponentWithTag(
       component, 'span'
    );
    expect(span.textContent).toEqual("4111 1111 1111 1111");
  });

  it('should format as given format when input length is less than format length', () => {
    const component = ReactTestUtils.renderIntoDocument(<FormatNumberInput value="41111111111111" displayType={'text'} format="#### #### #### ####" />);
    const span = ReactTestUtils.findRenderedDOMComponentWithTag(
       component, 'span'
    );
    expect(span.textContent).toEqual("4111 1111 1111 11");
  });

  it('should format as given format with mask', () => {
    const component = ReactTestUtils.renderIntoDocument(<FormatNumberInput value="41111111111111" displayType={'text'} format="#### #### #### ####" mask="_" />);
    const span = ReactTestUtils.findRenderedDOMComponentWithTag(
       component, 'span'
    );
    expect(span.textContent).toEqual("4111 1111 1111 11__");
  });

  it('should not round decimals by defualt', () => {
    const component = ReactTestUtils.renderIntoDocument(<FormatNumberInput value="4111" displayType={'text'} />);
    const span = ReactTestUtils.findRenderedDOMComponentWithTag(
        component, 'span'
    );
    expect(span.textContent).toEqual("4111");
  });

  it('should round to 2 decimals if passed true', () => {
    const component = ReactTestUtils.renderIntoDocument(<FormatNumberInput value="4111" displayType={'text'} decimalPrecision={true} />);
    const span = ReactTestUtils.findRenderedDOMComponentWithTag(
        component, 'span'
    );
    expect(span.textContent).toEqual("4111.00");
  });

  it('should round to 4 decimals if passed 4', () => {
    const component = ReactTestUtils.renderIntoDocument(<FormatNumberInput value="4111.11" displayType={'text'} decimalPrecision={4} />);
    const span = ReactTestUtils.findRenderedDOMComponentWithTag(
        component, 'span'
    );
    expect(span.textContent).toEqual("4111.1100");
  });
});
