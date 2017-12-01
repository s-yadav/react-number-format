import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import NumberFormat from '../../src/number_format';
import TextField from 'material-ui/TextField';
import { cardExpiry } from '../../custom_formatters/card_expiry';



class App extends React.Component {
  constructor() {
    super();
    this.state = { test: 1232323.780023 };
  }

  render() {
    return (
      <div>
        <div className="example">
          <h3>
            Prefix and thousand separator : Format currency as text
          </h3>
          <NumberFormat value={2456981} displayType="text" thousandSeparator={true} prefix="$" />
        </div>

        <div className="example">
          <h3>
            Format with pattern : Format credit card as text
          </h3>
          <NumberFormat value={4111111111111111} displayType="text" format="#### #### #### ####" />
        </div>

        <div className="example">
          <h3>
            Custom renderText method
          </h3>
          <NumberFormat value={4111111111111111} displayType="text" format="#### #### #### ####" renderText={value => <i>{value}</i>} />
        </div>

        <div className="example">
          <h3>
            Prefix and thousand separator : Format currency in input
          </h3>
          <NumberFormat
            thousandSeparator="."
            decimalSeparator=","
            value={this.state.test}
            prefix="$"
            onValueChange={(values) => this.setState({ test: values.formattedValue })}
          />
        </div>

        <div className="example">
          <h3>
            Decimal scale : Format currency in input with decimal scale
          </h3>
          <NumberFormat thousandSeparator={true} decimalScale={3} fixedDecimalScale={true} prefix="$" />
        </div>


        <div className="example">
          <h3>
            Custom thousand separator : Format currency in input
          </h3>
          <div>
            ThousandSeperator: '.', decimalSeparator=','
          </div>
          <div>
            <NumberFormat thousandSeparator="." decimalSeparator="," prefix="$" />
          </div>
          <br />
          <div>
            ThousandSeperator: ' ', decimalSeparator='.'
          </div>
          <div>
            <NumberFormat thousandSeparator=" " decimalSeparator="." prefix="$" />
          </div>
        </div>

        <div className="example">
          <h3>
            Custom thousand separator with decimal precision
          </h3>
          <div>
            ThousandSeperator: ',', decimalSeparator='.', decimalScale:2
          </div>
          <div>
            <NumberFormat thousandSeparator="," decimalSeparator="." decimalScale={2} />
          </div>
          <br />
          <div>
            ThousandSeperator: '.', decimalSeparator=',', decimalScale:2
          </div>
          <div>
            <NumberFormat thousandSeparator="." decimalSeparator="," decimalScale={2} />
          </div>
        </div>

        <div className="example">
          <h3>
            Custom thousand spacing : Format currency in input
          </h3>
          <div>
            Default ThousandSpacing: '3'
          </div>
          <div>
            <NumberFormat value={2456981} thousandSeparator prefix="$" />
          </div>
          <br />
          <div>
            ThousandSpacing: '2s' (two-scaled)
            Example: 24,56,981 or 2,34,45,56,981
          </div>
          <div>
            <NumberFormat value={2456981} thousandSeparator thousandSpacing="2s" prefix="$" />
          </div>
        </div>

        <div className="example">
          <h3>
            Format with pattern : Format credit card in an input
          </h3>
          <NumberFormat format="#### #### #### ####" mask="_" />
        </div>

        <div className="example">
          <h3>
            Format with mask as array
          </h3>
          <NumberFormat format="##/##" placeholder="MM/YY" mask={['M', 'M', 'Y', 'Y']} />
        </div>

        <div className="example">
          <h3>
            Format with mask : Format credit card in an input
          </h3>
          <NumberFormat format="#### #### #### ####" mask="_" />
        </div>

        <div className="example">
          <h3>
            Custom format method  : Format credit card expiry time
          </h3>
          <NumberFormat format={cardExpiry} />
        </div>

        <div className="example">
          <h3>
            Format phone number
          </h3>
          <NumberFormat format="+1 (###) ###-####" mask="_" />
        </div>

        <div className="example">
          <h3>
            Custom input : Format credit card number
          </h3>
          <NumberFormat customInput={TextField} format="#### #### #### ####" />
        </div>

      </div>
    )
  }
}

const ThemedApp = () => {
  return (<MuiThemeProvider>
    <App />
  </MuiThemeProvider>);
};

ReactDOM.render(<ThemedApp />, document.getElementById('app'));
