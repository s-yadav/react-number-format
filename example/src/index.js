import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import NumberFormat from '../../src/number_format';
import TextField from 'material-ui/TextField';
import {cardExpiry} from '../../custom_formatters/card_expiry';



class App extends React.Component {
  constructor() {
    super();
    this.state = {test: 1232323.780023};
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
            Prefix and thousand separator : Format currency in input
          </h3>
          <NumberFormat
            thousandSeparator="."
            decimalSeparator=","
            isAllowed={(values) => values.floatValue > 5}
            value={this.state.test}
            prefix="$"
            decimalPrecision={3}
            onChange={(e) => this.setState({test: e.target.value})}
          />
        </div>

        <div className="example">
          <h3>
            Decimal precision : Format currency in input with decimal precision
          </h3>
          <NumberFormat thousandSeparator={true} decimalPrecision={3} prefix="$" />
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
          <br/>
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
            ThousandSeperator: ',', decimalSeparator='.', decimalPrecision:2
          </div>
          <div>
            <NumberFormat thousandSeparator=","  decimalSeparator="." decimalPrecision={2} />
          </div>
          <br/>
          <div>
            ThousandSeperator: '.', decimalSeparator=',', decimalPrecision:2
          </div>
          <div>
            <NumberFormat thousandSeparator="."  decimalSeparator=","  decimalPrecision={2} />
          </div>
        </div>

        <div className="example">
          <h3>
            Format with pattern : Format credit card in an input
          </h3>
          <NumberFormat format="#### #### #### ####" />
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
            Custom input : Format credit card number
          </h3>
          <NumberFormat customInput={TextField} format="#### #### #### ####" />
        </div>

        <div className="example">
          <h3>
            Suffix containing numbers and signs
          </h3>
          <br/>
          <div>
              suffix: 'e-005 m/s²', decimalSeparator=',', decimalPrecision:1
          </div>
          <NumberFormat value={2.5} suffix="e-005 m/s²" decimalSeparator=","  decimalPrecision={1} />
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
