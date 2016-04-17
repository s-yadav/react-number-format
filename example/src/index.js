const React = require('react');
const ReactDOM = require('react-dom');
const FormatNumberInput = require('../../src/number_format');

const App = React.createClass({
  getInitialState : function(){
    return {};
  },
  formatExpiryChange: function(val){
    if(val && Number(val[0]) > 1){
      val = '0'+val;
    }
    if(val && val.length >1 && Number(val[0]+val[1]) > 12){
      val = '12'+val.substring(2,val.length);
    }
    val = val.substring(0,2)+ (val.length > 2 ? '/'+val.substring(2,4) : '');
    return val;
  },
  render : function(){
    return (
      <div>
        <div className="example">
          <h3>
            Prefix and thousand seperator : Format currency as text
          </h3>
          <FormatNumberInput value={2456981} displayType={'text'} thousandSeperator={true} prefix={'$'} />
        </div>

        <div className="example">
          <h3>
            Format with pattern : Format credit card as text
          </h3>
          <FormatNumberInput value={4111111111111111} displayType={'text'} format="#### #### #### ####" />
        </div>

        <div className="example">
          <h3>
            Prefix and thousand seperator : Format currency in input
          </h3>
          <FormatNumberInput thousandSeperator={true} prefix={'$'} />
        </div>

        <div className="example">
          <h3>
            Format with pattern : Format credit card in an input
          </h3>
          <FormatNumberInput format="#### #### #### ####" />
        </div>

        <div className="example">
          <h3>
            Format with mask : Format credit card in an input
          </h3>
          <FormatNumberInput format="#### #### #### ####" mask="_"/>
        </div>

        <div className="example">
          <h3>
            Custom format method  : Format credit card expiry time
          </h3>
          <FormatNumberInput format={this.formatExpiryChange}/>
        </div>
      </div>
    )
  }
});

ReactDOM.render(<App />, document.getElementById('app'));
