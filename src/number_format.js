const React = require('react');

const FormatNumberInput =  React.createClass({
  getInitialState : function(){
    return {
      value : this.formatInput(this.props.value).formattedValue
    }
  },
  getDefaultProps : function(){
    return {
      displayType : 'input'
    }
  },
  componentWillReceiveProps: function(newProps){
    this.setState({
      value : this.formatInput(newProps.value).formattedValue
    });
  },
  shouldComponentUpdate:function(newProps){
    return !(newProps!==this.props && newProps.value === this.props.value);
  },
  setCaretPosition : function(caretPos) {
    const el = this.refs.input;
      el.value = el.value;
      // ^ this is used to not only get "focus", but
      // to make sure we don't have it everything -selected-
      // (it causes an issue in chrome, and having it doesn't hurt any other browser)
      if (el !== null) {
          if (el.createTextRange) {
              const range = el.createTextRange();
              range.move('character', caretPos);
              range.select();
              return true;
          }
          // (el.selectionStart === 0 added for Firefox bug)
          if (el.selectionStart || el.selectionStart === 0) {
              el.focus();
              el.setSelectionRange(caretPos, caretPos);
              return true;
          }

          // fail city, fortunately this never happens (as far as I've tested) :)
          el.focus();
          return false;

      }
  },
  formatWithPattern : function(str){
    const {format,mask} = this.props;
    if (!format) return str;
    const hashCount = format.split('#').length - 1;
    let hashIdx = 0;
    let frmtdStr = format;

    for(let i=0, ln=str.length; i<ln; i++ ){
      if(i < hashCount){
        hashIdx = frmtdStr.indexOf('#');
        frmtdStr = frmtdStr.replace('#',str[i]);
      }
    }

    const lastIdx = frmtdStr.lastIndexOf('#');

    if(mask){
      return frmtdStr.replace(/#/g,mask);
    }
    return frmtdStr.substring(0,hashIdx + 1) + (lastIdx!==-1 ? frmtdStr.substring(lastIdx + 1, frmtdStr.length) :'');
  },
  formatInput : function(val){
    const {prefix, thousandSeperator, suffix, mask,format} = this.props;
    const maskPattern = format && typeof format == "string" && !!mask;

    if(!val || !((val+"").match(/\d/g))) return {value :"", formattedValue: (maskPattern ? "" : "")}
    const num = (val+"").match(/\d/g).join("");

    let formattedValue = num;

    if(format){
      if(typeof format == 'string'){
        formattedValue = this.formatWithPattern(formattedValue);
      }
      else if(typeof format == "function"){
        formattedValue = format(formattedValue);
      }
    }
    else{
      if(thousandSeperator) formattedValue = formattedValue.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");

      //add prefix and suffix
      if(prefix) formattedValue = prefix + formattedValue;
      if(suffix) formattedValue = formattedValue + suffix;
    }

    return {
        value : formattedValue.match(/\d/g).join(""),
        formattedValue : formattedValue
    }
  },
  getCursorPosition : function(inputValue,formattedValue,cursorPos){
    let j=0;
    for(let i=0; i<cursorPos; i++){
      if(!inputValue[i].match(/\d/) && inputValue[i] !== formattedValue[j]) continue;
      while(inputValue[i] !== formattedValue[j] && j<formattedValue.length) j++;
      j++;
    }

    //check if there is no number before caret position
    while(j > 0 && formattedValue[j]){
      if(!formattedValue[j-1].match(/\d/)) j--;
      else break;
    }
    return j;
  },
  onChangeHandler : function(e,callback){
    const inputValue = e.target.value;
    const {formattedValue,value} = this.formatInput(inputValue);
    let cursorPos = this.refs.input.selectionStart;

    //change the state
    this.setState({value : formattedValue},()=>{
      cursorPos = this.getCursorPosition(inputValue, formattedValue,cursorPos );
      this.setCaretPosition(cursorPos);
      if(callback) callback(e,value);
    });

    return value;
  },
  onChange : function(e){
    this.onChangeHandler(e,this.props.onChange);
  },
  onInput : function(e){
    this.onChangeHandler(e,this.props.onInput);
  },
  render : function(){
    const {props} = this;
    if(props.displayType === "text"){
      return (<span {...this.props}>{this.state.value}</span>);
    }
    return (
      <input
        {...this.props}
        type='tel'
        value={this.state.value}
        ref="input"
        onInput={this.onChange}
        onChange={this.onChange}
      />
    )
  }
});

module.exports = FormatNumberInput;
