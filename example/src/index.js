import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import NumberFormat from '../../src/number_format';
import TextField from 'material-ui/TextField';

class App extends React.Component {
  constructor() {
    super();
    this.state = {};
    this.formatExpiryChange = this.formatExpiryChange.bind(this);
  }

  formatExpiryChange(val) {
    if(val && Number(val[0]) > 1){
      val = '0'+val;
    }
    if(val && val.length >1 && Number(val[0]+val[1]) > 12){
      val = '12'+val.substring(2,val.length);
    }
    val = val.substring(0,2)+ (val.length > 2 ? '/'+val.substring(2,4) : '');
    return val;
  }

  render() {
    return (
      <div>
        <div className="example">
          <h3>
            Prefix and thousand separator : Format currency as text
          </h3>
          <NumberFormat value={2456981} displayType={'text'} thousandSeparator={true} prefix={'$'} />
        </div>

        <div className="example">
          <h3>
            Format with pattern : Format credit card as text
          </h3>
          <NumberFormat value={4111111111111111} displayType={'text'} format="#### #### #### ####" />
        </div>

        <div className="example">
          <h3>
            Prefix and thousand separator : Format currency in input
          </h3>
          <NumberFormat thousandSeparator={true} value={this.state.test} prefix={'$'} onChange={(e, val) => this.setState({test: val})} />
        </div>

        <div className="example">
          <h3>
            Decimal precision : Format currency in input with decimal precision
          </h3>
          <NumberFormat thousandSeparator={true} decimalPrecision={true} prefix={'$'}/>
        </div>


        <div className="example">
          <h3>
            Custom thousand separator : Format currency in input
          </h3>
          <div>
            ThousandSeperator: '.', decimalSeparator=','
          </div>
          <div>
            <NumberFormat thousandSeparator={"."} decimalSeparator={","} prefix={"$"} />
          </div>
          <br/>
          <div>
            ThousandSeperator: ' ', decimalSeparator='.'
          </div>
          <div>
            <NumberFormat thousandSeparator={" "} decimalSeparator={"."} prefix={"$"} />
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
            <NumberFormat thousandSeparator={","}  decimalSeparator={"."} decimalPrecision={2} />
          </div>
          <br/>
          <div>
            ThousandSeperator: '.', decimalSeparator=',', decimalPrecision:2
          </div>
          <div>
            <NumberFormat thousandSeparator={"."}  decimalSeparator={","}  decimalPrecision={2} />
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
          <NumberFormat format="#### #### #### ####" mask="_"/>
        </div>

        <div className="example">
          <h3>
            Custom format method  : Format credit card expiry time
          </h3>
          <NumberFormat format={this.formatExpiryChange}/>
        </div>

        <div className="example">
          <h3>
            Custom input : Format credit card number
          </h3>
          <NumberFormat customInput={TextField} format="#### #### #### ####"/>
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
