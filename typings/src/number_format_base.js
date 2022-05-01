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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
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
exports.__esModule = true;
var react_1 = __importStar(require("react"));
var types_1 = require("./types");
var utils_1 = require("./utils");
function defaultRemoveFormatting(value) {
    return value.replace(/[^0-9]/g, '');
}
function defaultFormat(value) {
    return value;
}
function NumberFormatBase(props) {
    var _a = props.type, type = _a === void 0 ? 'text' : _a, _b = props.displayType, displayType = _b === void 0 ? 'input' : _b, customInput = props.customInput, renderText = props.renderText, getInputRef = props.getInputRef, _c = props.format, format = _c === void 0 ? defaultFormat : _c, 
    /* eslint-disable no-unused-vars */
    _d = props.removeFormatting, 
    /* eslint-disable no-unused-vars */
    removeFormatting = _d === void 0 ? defaultRemoveFormatting : _d, defaultValue = props.defaultValue, isNumericString = props.isNumericString, onValueChange = props.onValueChange, isAllowed = props.isAllowed, _e = props.onChange, onChange = _e === void 0 ? utils_1.noop : _e, _f = props.onKeyDown, onKeyDown = _f === void 0 ? utils_1.noop : _f, _g = props.onMouseUp, onMouseUp = _g === void 0 ? utils_1.noop : _g, _h = props.onFocus, onFocus = _h === void 0 ? utils_1.noop : _h, _j = props.onBlur, onBlur = _j === void 0 ? utils_1.noop : _j, propValue = props.value, _k = props.getCaretBoundary, getCaretBoundary = _k === void 0 ? utils_1.caretUnknownFormatBoundary : _k, 
    /* eslint-enable no-unused-vars */
    otherProps = __rest(props, ["type", "displayType", "customInput", "renderText", "getInputRef", "format", "removeFormatting", "defaultValue", "isNumericString", "onValueChange", "isAllowed", "onChange", "onKeyDown", "onMouseUp", "onFocus", "onBlur", "value", "getCaretBoundary"]);
    var _l = __read((0, utils_1.useInternalValues)(propValue, defaultValue, isNumericString, format, removeFormatting, onValueChange), 2), _m = _l[0], formattedValue = _m.formattedValue, numAsString = _m.numAsString, onFormattedValueChange = _l[1];
    var lastUpdatedValue = (0, react_1.useRef)();
    var _onValueChange = function (values, source) {
        lastUpdatedValue.current = values.formattedValue;
        onFormattedValueChange(values, source);
    };
    // check if there is any change in the value due to props change
    (0, react_1.useEffect)(function () {
        var newFormattedValue = format(numAsString);
        // if the formatted value is not synced to parent, or if the formatted value is different
        if (lastUpdatedValue.current === undefined || newFormattedValue !== lastUpdatedValue.current) {
            var input = focusedElm.current;
            updateValue({
                formattedValue: newFormattedValue,
                numAsString: numAsString,
                input: input,
                setCaretPosition: true,
                source: types_1.SourceType.props,
                event: null
            });
        }
    });
    var _o = __read((0, react_1.useState)(false), 2), mounted = _o[0], setMounted = _o[1];
    var focusedElm = (0, react_1.useRef)(null);
    var timeout = (0, react_1.useRef)({
        setCaretTimeout: null,
        focusTimeout: null
    });
    (0, react_1.useEffect)(function () {
        setMounted(true);
        return function () {
            clearTimeout(timeout.current.setCaretTimeout);
            clearTimeout(timeout.current.focusTimeout);
        };
    }, []);
    var _format = format;
    var getValueObject = function (formattedValue, numAsString) {
        var floatValue = parseFloat(numAsString);
        return {
            formattedValue: formattedValue,
            value: numAsString,
            floatValue: isNaN(floatValue) ? undefined : floatValue
        };
    };
    var setPatchedCaretPosition = function (el, caretPos, currentValue) {
        /* setting caret position within timeout of 0ms is required for mobile chrome,
        otherwise browser resets the caret position after we set it
        We are also setting it without timeout so that in normal browser we don't see the flickering */
        (0, utils_1.setCaretPosition)(el, caretPos);
        timeout.current.setCaretTimeout = setTimeout(function () {
            if (el.value === currentValue)
                (0, utils_1.setCaretPosition)(el, caretPos);
        }, 0);
    };
    /* This keeps the caret within typing area so people can't type in between prefix or suffix */
    var correctCaretPosition = function (value, caretPos, direction) {
        var valLn = value.length;
        // clamp caret position to [0, value.length]
        caretPos = (0, utils_1.clamp)(caretPos, 0, valLn);
        var boundary = getCaretBoundary(value);
        if (direction === 'left') {
            while (caretPos >= 0 && !boundary[caretPos])
                caretPos--;
            // if we don't find any suitable caret position on left, set it on first allowed position
            if (caretPos === -1)
                caretPos = boundary.indexOf(true);
        }
        else {
            while (caretPos <= valLn && !boundary[caretPos])
                caretPos++;
            // if we don't find any suitable caret position on right, set it on last allowed position
            if (caretPos > valLn)
                caretPos = boundary.lastIndexOf(true);
        }
        // if we still don't find caret position, set it at the end of value
        if (caretPos === -1)
            caretPos = valLn;
        return caretPos;
    };
    var getNewCaretPosition = function (inputValue, formattedValue, caretPos) {
        var updatedCaretPos = (0, utils_1.getCaretPosition)(formattedValue, inputValue, caretPos);
        //correct caret position if its outside of editable area
        updatedCaretPos = correctCaretPosition(formattedValue, updatedCaretPos);
        return updatedCaretPos;
    };
    var updateValue = function (params) {
        var newFormattedValue = params.formattedValue, input = params.input, _a = params.setCaretPosition, setCaretPosition = _a === void 0 ? true : _a, source = params.source, event = params.event, numAsString = params.numAsString;
        var caretPos = params.caretPos;
        if (input) {
            //calculate caret position if not defined
            if (caretPos === undefined && setCaretPosition) {
                var inputValue = params.inputValue || input.value;
                var currentCaretPosition = (0, utils_1.geInputCaretPosition)(input);
                /**
                 * set the value imperatively, this is required for IE fix
                 * This is also required as if new caret position is beyond the previous value.
                 * Caret position will not be set correctly
                 */
                input.value = newFormattedValue;
                //get the caret position
                caretPos = getNewCaretPosition(inputValue, newFormattedValue, currentCaretPosition);
            }
            /**
             * set the value imperatively, as we set the caret position as well imperatively.
             * This is to keep value and caret position in sync
             */
            input.value = newFormattedValue;
            //set caret position, and value imperatively when element is provided
            if (setCaretPosition) {
                //set caret position
                setPatchedCaretPosition(input, caretPos, newFormattedValue);
            }
        }
        if (newFormattedValue !== formattedValue) {
            // trigger onValueChange synchronously, so parent is updated along with the number format. Fix for #277, #287
            _onValueChange(getValueObject(newFormattedValue, numAsString), { event: event, source: source });
        }
    };
    var formatInputValue = function (inputValue, event, source) {
        var changeRange = (0, utils_1.findChangeRange)(formattedValue, inputValue);
        var changeMeta = __assign(__assign({}, changeRange), { lastValue: formattedValue });
        var _numAsString = removeFormatting(inputValue, changeMeta);
        var _formattedValue = _format(_numAsString);
        if (isAllowed && !isAllowed(getValueObject(_formattedValue, _numAsString))) {
            return false;
        }
        updateValue({
            formattedValue: _formattedValue,
            numAsString: _numAsString,
            inputValue: inputValue,
            event: event,
            source: source,
            setCaretPosition: true,
            input: event.target
        });
    };
    var _onChange = function (e) {
        var el = e.target;
        var inputValue = el.value;
        var changed = formatInputValue(inputValue, e, types_1.SourceType.event);
        if (changed)
            onChange(e);
    };
    var _onKeyDown = function (e) {
        var el = e.target;
        var key = e.key;
        var selectionStart = el.selectionStart, selectionEnd = el.selectionEnd, _a = el.value, value = _a === void 0 ? '' : _a;
        var expectedCaretPosition;
        //Handle backspace and delete against non numerical/decimal characters or arrow keys
        if (key === 'ArrowLeft' || key === 'Backspace') {
            expectedCaretPosition = Math.max(selectionStart - 1, 0);
        }
        else if (key === 'ArrowRight') {
            expectedCaretPosition = Math.min(selectionStart + 1, value.length);
        }
        else if (key === 'Delete') {
            expectedCaretPosition = selectionStart;
        }
        //if expectedCaretPosition is not set it means we don't want to Handle keyDown
        // also if multiple characters are selected don't handle
        if (expectedCaretPosition === undefined || selectionStart !== selectionEnd) {
            onKeyDown(e);
            return;
        }
        var newCaretPosition = expectedCaretPosition;
        if (key === 'ArrowLeft' || key === 'ArrowRight') {
            var direction = key === 'ArrowLeft' ? 'left' : 'right';
            newCaretPosition = correctCaretPosition(value, expectedCaretPosition, direction);
        }
        else if (key === 'Delete' && !(0, utils_1.charIsNumber)(value[expectedCaretPosition])) {
            // in case of delete go to closest caret boundary on the right side
            newCaretPosition = correctCaretPosition(value, expectedCaretPosition, 'right');
        }
        else if (key === 'Backspace' && !(0, utils_1.charIsNumber)(value[expectedCaretPosition])) {
            // in case of backspace go to closest caret boundary on the left side
            newCaretPosition = correctCaretPosition(value, expectedCaretPosition, 'left');
        }
        if (newCaretPosition !== expectedCaretPosition) {
            setPatchedCaretPosition(el, newCaretPosition, value);
        }
        /* NOTE: this is just required for unit test as we need to get the newCaretPosition,
                Remove this when you find different solution */
        /* @ts-ignore */
        if (e.isUnitTestRun) {
            setPatchedCaretPosition(el, newCaretPosition, value);
        }
        onKeyDown(e);
    };
    /** required to handle the caret position when click anywhere within the input **/
    var _onMouseUp = function (e) {
        var el = e.target;
        /**
         * NOTE: we have to give default value for value as in case when custom input is provided
         * value can come as undefined when nothing is provided on value prop.
         */
        var selectionStart = el.selectionStart, selectionEnd = el.selectionEnd, _a = el.value, value = _a === void 0 ? '' : _a;
        if (selectionStart === selectionEnd) {
            var caretPosition = correctCaretPosition(value, selectionStart);
            if (caretPosition !== selectionStart) {
                setPatchedCaretPosition(el, caretPosition, value);
            }
        }
        onMouseUp(e);
    };
    var _onFocus = function (e) {
        // Workaround Chrome and Safari bug https://bugs.chromium.org/p/chromium/issues/detail?id=779328
        // (onFocus event target selectionStart is always 0 before setTimeout)
        e.persist();
        var el = e.target;
        focusedElm.current = el;
        timeout.current.focusTimeout = setTimeout(function () {
            var selectionStart = el.selectionStart, selectionEnd = el.selectionEnd, _a = el.value, value = _a === void 0 ? '' : _a;
            var caretPosition = correctCaretPosition(value, selectionStart);
            //setPatchedCaretPosition only when everything is not selected on focus (while tabbing into the field)
            if (caretPosition !== selectionStart &&
                !(selectionStart === 0 && selectionEnd === value.length)) {
                setPatchedCaretPosition(el, caretPosition, value);
            }
            onFocus(e);
        }, 0);
    };
    var _onBlur = function (e) {
        focusedElm.current = null;
        clearTimeout(timeout.current.focusTimeout);
        clearTimeout(timeout.current.setCaretTimeout);
        onBlur(e);
    };
    // add input mode on element based on format prop and device once the component is mounted
    var inputMode = mounted && (0, utils_1.addInputMode)() ? 'numeric' : undefined;
    var inputProps = Object.assign({ inputMode: inputMode }, otherProps, {
        type: type,
        value: formattedValue,
        onChange: _onChange,
        onKeyDown: _onKeyDown,
        onMouseUp: _onMouseUp,
        onFocus: _onFocus,
        onBlur: _onBlur
    });
    if (displayType === 'text') {
        return renderText ? (react_1["default"].createElement(react_1["default"].Fragment, null, renderText(formattedValue, otherProps) || null)) : (react_1["default"].createElement("span", __assign({}, otherProps, { ref: getInputRef }), formattedValue));
    }
    else if (customInput) {
        var CustomInput = customInput;
        /* @ts-ignore */
        return react_1["default"].createElement(CustomInput, __assign({}, inputProps, { ref: getInputRef }));
    }
    return react_1["default"].createElement("input", __assign({}, inputProps, { ref: getInputRef }));
}
exports["default"] = NumberFormatBase;
