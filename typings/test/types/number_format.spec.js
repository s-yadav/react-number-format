"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var React = __importStar(require("react"));
var numeric_format_1 = __importDefault(require("../../src/numeric_format"));
var pattern_format_1 = __importDefault(require("../../src/pattern_format"));
var number_format_base_1 = __importDefault(require("../../src/number_format_base"));
function NumberFormatBaseTest() {
    var _a = __read(React.useState('123'), 2), state = _a[0], setState = _a[1];
    return (React.createElement(React.Fragment, null,
        React.createElement(number_format_base_1["default"], { defaultValue: "123", format: function (value) { return value; }, removeFormatting: function (value, changeMeta) { return value; }, getCaretBoundary: function (value) { return value.split('').map(function () { return true; }); } }),
        React.createElement(number_format_base_1["default"], { value: state, isNumericString: true, onValueChange: function (values) {
                setState(values.value);
            }, format: function (value) { return value; }, removeFormatting: function (value, changeMeta) { return value; }, getCaretBoundary: function (value) { return value.split('').map(function () { return true; }); } }),
        React.createElement(number_format_base_1["default"], { value: state, isNumericString: true, onValueChange: function (values) {
                setState(values.value);
            }, format: function (value) { return value; }, removeFormatting: function (value, changeMeta) { return value; }, getCaretBoundary: function (value) { return value.split('').map(function () { return true; }); }, customInput: function (props) { return React.createElement(React.Fragment, null); }, type: "tel", size: "small", style: { color: '#222' } })));
}
var CustomNumericFormat = function (props) { return React.createElement(numeric_format_1["default"], __assign({}, props)); };
var CustomNumericFormat2 = function (props) { return (React.createElement(numeric_format_1["default"], __assign({}, props))); };
function NumericFormatTest() {
    return (React.createElement(React.Fragment, null,
        React.createElement(numeric_format_1["default"], { value: "" }),
        React.createElement(numeric_format_1["default"], { type: "tel" }),
        React.createElement(CustomNumericFormat, { type: "tel", readOnly: false, size: 1, thousandSeparator: "." }),
        React.createElement(CustomNumericFormat2, { type: "tel", size: 1 }),
        React.createElement(numeric_format_1["default"], { customInput: function (props) { return React.createElement(React.Fragment, null); }, type: "tel", size: "small", thousandSeparator: ".", style: { color: '#222' } })));
}
var CustomPatternFormat = function (props) { return React.createElement(pattern_format_1["default"], __assign({}, props)); };
var CustomPatternFormat2 = function (props) { return (React.createElement(pattern_format_1["default"], __assign({}, props))); };
function PatternFormatTest() {
    return (React.createElement(React.Fragment, null,
        React.createElement(pattern_format_1["default"], { format: "##-##", value: "" }),
        React.createElement(pattern_format_1["default"], { format: "####-##", type: "tel" }),
        React.createElement(CustomPatternFormat, { type: "tel", format: "%%-%%", readOnly: false, size: 1, patternChar: "%" }),
        React.createElement(CustomPatternFormat2, { format: "####-##", type: "tel", size: 1 }),
        React.createElement(pattern_format_1["default"], { customInput: function (props) { return React.createElement(React.Fragment, null); }, type: "tel", size: "small", format: "####-##", style: { color: '#222' } })));
}
