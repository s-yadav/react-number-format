import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import NumericFormat from '../../src/numeric_format';
import PatternFormat from '../../src/pattern_format';
import NumberFormatBase from '../../src/number_format_base';
import TextField from 'material-ui/TextField';
import { cardExpiry } from '../../custom_formatters/card_expiry';

export default function Test() {
  const localInputRef = React.useRef();
  // Simulates both eager typing and waiting for an arbitratry amount of time
  React.useEffect(() => {
    // If we call select too early, the `NumericFormat`'s
    // `setPatchedCaretPosition` function will reset the selection. To avoid
    // this, we need to wait for 3 task cycles (empirically determined)
    // before calling it.
    //
    // cf. https://github.com/s-yadav/react-number-format/blob/3443f1adf3a904c19a9fca1183cf3af08a0bf714/src/number_format_base.tsx#L127-L133
    console.log('inside Test', localInputRef.current);
    localInputRef.current?.select();
    console.log(
      '--------',
      localInputRef.current?.selectionStart,
      localInputRef.current?.selectionEnd,
    );
  }, []);

  return (
    <div>
      <label>
        <div>NumericFormat</div>
        <NumericFormat
          value="12345"
          getInputRef={(elm) => (localInputRef.current = elm)}
          suffix="$"
        />
      </label>
      <label>
        <div>Native input</div>
        <input value="12345" />
      </label>
    </div>
  );
}

class App extends React.Component {
  constructor() {
    super();
    this.state = { test: 1232323.780023, thousandSeparator: '.' };

    setTimeout(() => {
      this.setState({ thousandSeparator: ' ' });
    }, 5000);
  }

  render() {
    return (
      <div>
        <Test />
        {/* <div className="example">
          <h3>Prefix and thousand separator : Format currency as text</h3>
          <NumericFormat value={2456981} displayType="text" thousandSeparator={true} prefix="$" />
        </div>

        <div className="example">
          <h3>Format with pattern : Format credit card as text</h3>
          <PatternFormat value={4111111111111111} displayType="text" format="#### #### #### ####" />
        </div>

        <div className="example">
          <h3>Custom renderText method</h3>
          <PatternFormat
            value={4111111111111111}
            displayType="text"
            format="#### #### #### ####"
            renderText={(value) => <i>{value}</i>}
          />
        </div>

        <div className="example">
          <h3>Prefix and thousand separator : Format currency in input</h3>
          <NumericFormat
            thousandSeparator={this.state.thousandSeparator}
            decimalSeparator=","
            value={this.state.test}
            valueIsNumericString
            prefix="$"
            onValueChange={(values) => this.setState({ test: values.value })}
            onChange={(e) => console.log(e.target.value)}
            onBlur={(e) => console.log(e.target.value)}
          />
          <button onClick={() => this.setState({ thousandSeparator: ' ' })}>Ok</button>
        </div>

        <div className="example">
          <h3>Allow Leading Zeros: Will retain leading zeros onBlur</h3>
          <NumericFormat allowLeadingZeros={true} />
        </div>

        <div className="example">
          <h3>Indian (lakh) style number grouping</h3>
          <NumericFormat thousandSeparator={true} prefix="₹" thousandsGroupStyle="lakh" />
        </div>

        <div className="example">
          <h3>Chinese (wan) style number grouping</h3>
          <NumericFormat thousandSeparator={true} prefix="¥" thousandsGroupStyle="wan" />
        </div>

        <div className="example">
          <h3>Decimal scale : Format currency in input with decimal scale</h3>
          <NumericFormat
            thousandSeparator={true}
            decimalScale={3}
            fixedDecimalScale={true}
            prefix="$"
          />
        </div>

        <div className="example">
          <h3>Custom thousand separator : Format currency in input</h3>
          <div>ThousandSeparator: '.', decimalSeparator=','</div>
          <div>
            <NumericFormat thousandSeparator="." decimalSeparator="," prefix="$" />
          </div>
          <br />
          <div>ThousandSeparator: ' ', decimalSeparator='.'</div>
          <div>
            <NumericFormat thousandSeparator=" " decimalSeparator="." prefix="$" />
          </div>
        </div>

        <div className="example">
          <h3>Custom thousand separator with decimal precision</h3>
          <div>ThousandSeparator: ',', decimalSeparator='.', decimalScale:2</div>
          <div>
            <NumericFormat thousandSeparator="," decimalSeparator="." decimalScale={2} />
          </div>
          <br />
          <div>ThousandSeparator: '.', decimalSeparator=',', decimalScale:2</div>
          <div>
            <NumericFormat thousandSeparator="." decimalSeparator="," decimalScale={2} />
          </div>
        </div>

        <div className="example">
          <h3>Custom allowed decimal separators</h3>
          <NumericFormat
            thousandSeparator=" "
            decimalSeparator="."
            allowedDecimalSeparators={['.', ',']}
          />
        </div>

        <div className="example">
          <h3>Format with pattern : Format credit card in an input</h3>
          <PatternFormat format="#### #### #### ####" mask="_" />
        </div>

        <div className="example">
          <h3>Format with mask as array</h3>
          <PatternFormat format="##/##" placeholder="MM/YY" mask={['M', 'M', 'Y', 'Y']} />
        </div>

        <div className="example">
          <h3>Format with mask : Format credit card in an input</h3>
          <PatternFormat format="#### #### #### ####" mask="_" />
        </div>

        <div className="example">
          <h3>Custom format method : Format credit card expiry time</h3>
          <NumberFormatBase format={cardExpiry} />
        </div>

        <div className="example">
          <h3>Format phone number</h3>
          <PatternFormat format="+1 (###) ###-####" mask="_" />
        </div>

        <div className="example">
          <h3>Show mask on empty input</h3>
          <PatternFormat format="+1 (###) ###-####" mask="_" allowEmptyFormatting />
        </div>

        <div className="example">
          <h3>Custom input : Format credit card number</h3>
          <PatternFormat customInput={TextField} format="#### #### #### ####" />
        </div>

        <div className="example">
          <h3>Custom Numeral: add support for custom languages </h3>
          <NumericFormat customNumerals={['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']} />
        </div> */}
      </div>
    );
  }
}

const ThemedApp = () => {
  return (
    <MuiThemeProvider>
      <App />
    </MuiThemeProvider>
  );
};

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<ThemedApp />);
