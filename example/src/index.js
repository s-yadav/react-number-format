import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import NumericFormat, { useNumericFormat } from '../../src/numeric_format';
import PatternFormat from '../../src/pattern_format';
import NumberFormatBase from '../../src/number_format_base';
import TextField from 'material-ui/TextField';
import { cardExpiry } from '../../custom_formatters/card_expiry';

const persianNumeral = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

function CustomNumeralNumericFormat(props) {
  const { format, removeFormatting, isCharacterSame, ...rest } = useNumericFormat(props);

  const _format = (val) => {
    const _val = format(val);
    return _val.replace(/\d/g, ($1) => persianNumeral[Number($1)]);
  };

  const _removeFormatting = (val, ...rest) => {
    const _val = val.replace(new RegExp(persianNumeral.join('|'), 'g'), ($1) =>
      persianNumeral.indexOf($1),
    );

    return removeFormatting(_val, ...rest);
  };

  const _isCharacterSame = (compareMeta) => {
    const isCharSame = isCharacterSame(compareMeta);
    const { formattedValue, currentValue, formattedValueIndex, currentValueIndex } = compareMeta;
    const curChar = currentValue[currentValueIndex];
    const newChar = formattedValue[formattedValueIndex];
    const curPersianChar = persianNumeral[Number(curChar)] ?? curChar;
    const newPersianChar = persianNumeral[Number(newChar)] ?? newChar;

    return isCharSame || curPersianChar || newPersianChar;
  };

  return (
    <NumberFormatBase
      format={_format}
      removeFormatting={_removeFormatting}
      isCharacterSame={_isCharacterSame}
      {...rest}
    />
  );
}

const NEGATION_FORMAT_REGEX = /^\((.*)\)$/;

function extractNegationAndNumber(value) {
  let hasNegation = false;
  if (typeof value === 'number') {
    hasNegation = value < 0;
    value = hasNegation ? value * -1 : value;
  } else if (value?.[0] === '-') {
    hasNegation = true;
    value = value.substring(1);
  } else if (value?.match(NEGATION_FORMAT_REGEX)) {
    hasNegation = true;
    value = value.replace(NEGATION_FORMAT_REGEX, '$1');
  }

  return { hasNegation, value };
}

function CustomNegationNumberFormat({
  prefix = '',
  suffix = '',
  value,
  defaultValue,
  onValueChange,
  ...restProps
}) {
  const [hasNegation, toggleNegation] = useState(
    extractNegationAndNumber(value ?? defaultValue).hasNegation,
  );
  const [internalValue, setInternalValue] = useState(
    extractNegationAndNumber(value ?? defaultValue).value,
  );
  useEffect(() => {
    const { hasNegation, value: internalValue } = extractNegationAndNumber(value);
    setInternalValue(internalValue);
    toggleNegation(hasNegation);
  }, [value]);

  const _onValueChange = (values, sourceInfo) => {
    if (!onValueChange) return;

    const { formattedValue, value, floatValue } = values;
    onValueChange(
      {
        formattedValue,
        value: hasNegation ? `-${value}` : value,
        floatValue: hasNegation && !isNaN(floatValue) ? -floatValue : floatValue,
      },
      sourceInfo,
    );
  };

  const props = {
    prefix: hasNegation ? '(' + prefix : prefix,
    suffix: hasNegation ? suffix + ')' : suffix,
    // as we are controlling the negation logic outside, we don't want numeric format to handle this
    allowNegative: false,
    value: internalValue,
    onValueChange: _onValueChange,
    ...restProps,
  };
  const { format, onKeyDown, ...numberFormatBaseProps } = useNumericFormat(props);

  const _format = (numStr) => {
    const formattedValue = format(numStr, props);
    // if negation is present we need to always show negation with prefix and suffix even if value is empty
    return formattedValue === '' && hasNegation ? props.prefix + props.suffix : formattedValue;
  };

  const _onKeyDown = (e) => {
    const el = e.target;
    const { key } = e;
    const { selectionStart, selectionEnd, value = '' } = el;

    // if every thing is selected and deleted remove the negation as well
    if (selectionStart !== selectionEnd) {
      // if multiple characters are selected and user hits backspace, no need to handle anything manually
      onKeyDown(e);
      return;
    }

    // if user is pressing '-' we want to change it to '()', so mark there is negation in the number
    if (key === '-') {
      toggleNegation((hasNegation) => !hasNegation);
      e.preventDefault();
      return;
    }

    if (key === 'Backspace' && value[0] === '(' && selectionStart === props.prefix.length) {
      toggleNegation(false);
      e.preventDefault();
      return;
    }

    onKeyDown(e);
  };

  return <NumberFormatBase {...numberFormatBaseProps} onKeyDown={_onKeyDown} format={_format} />;
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
        <div className="example">
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
            <NumericFormat value={1234567.8901} thousandSeparator="." decimalSeparator="," />,
            <NumericFormat thousandSeparator="." decimalSeparator="," prefix="$" suffix=" /-" />
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
          <CustomNumeralNumericFormat
            prefix="$"
            decimalSeparator=","
            suffix="/-"
            allowedDecimalSeparators={[',', '.']}
          />
        </div>
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
