import Enzyme, {shallow, mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

const noop = function(){};

export function getCustomEvent(value) {
  let event =  new Event('custom');
  const el = document.createElement('input');
  event = Object.assign({}, event, {target: el, persist: noop});
  event.target = el;
  el.value = value;
  return event;
}

function getEvent(eventProps, targetProps) {
  let event =  new Event('custom');
  const el = document.createElement('input');

  Object.keys(targetProps).forEach((key) => {
    el[key] = targetProps[key];
  })

  event = Object.assign({}, event, eventProps, {target: el});

  return event;
}

export function setCaretPosition(event, caretPos) {
  const {target} = event;
  target.focus();
  target.setSelectionRange(caretPos, caretPos);
}


export function simulateKeyInput(input, key, selectionStart, selectionEnd, setSelectionRange) {
  if (selectionEnd === undefined) {
    selectionEnd = selectionStart;
  }

  const currentValue = input.prop('value');
  let defaultPrevented = false;

  const keydownEvent = getEvent({
    preventDefault: function() {
      defaultPrevented = true;
    },
    key,
    isUnitTestRun: true
  }, {
    value: currentValue,
    selectionStart,
    selectionEnd,
    setSelectionRange: setSelectionRange || noop,
    focus: noop
  })

  //fire key down event
  input.simulate('keydown', keydownEvent);

  //fire change event
  if (!defaultPrevented && key !== 'ArrowLeft' && key !== 'ArrowRight') {

    //get changed caret positon
    let newCaretPosition, newValue;

    if (key === 'Backspace') {
      newCaretPosition = selectionStart !== selectionEnd ? selectionStart : selectionStart - 1;
      newValue = selectionStart !== selectionEnd ?
        currentValue.substring(0, selectionStart) + currentValue.substring(selectionEnd, currentValue.length) :
        currentValue.substring(0, newCaretPosition) + currentValue.substring(selectionStart, currentValue.length);
    } else if (key === 'Delete') {
      newCaretPosition = selectionStart;
      newValue = selectionStart !== selectionEnd ?
        currentValue.substring(0, selectionStart) + currentValue.substring(selectionEnd, currentValue.length) :
        currentValue.substring(0, selectionStart) + currentValue.substring(selectionStart + 1, currentValue.length);
    } else {
      newCaretPosition = selectionStart + key.length;
      newValue = selectionStart !== selectionEnd ?
        currentValue.substring(0, selectionStart) + key + currentValue.substring(selectionEnd, currentValue.length) :
        currentValue.substring(0, selectionStart) + key + currentValue.substring(selectionStart, currentValue.length);
    }

    const changeEvent = getEvent({
      persist: noop,
      key
    }, {
      value: newValue,
      selectionStart: newCaretPosition,
      selectionEnd: newCaretPosition,
      setSelectionRange: setSelectionRange || noop,
      focus: noop
    })
    input.simulate('change', changeEvent);
  }
}

export function simulateMousUpEvent(input, selectionStart, setSelectionRange) {
  const selectionEnd = selectionStart;

  const currentValue = input.prop('value');

  const mouseUpEvent = getEvent({}, {
    value: currentValue,
    selectionStart,
    selectionEnd,
    setSelectionRange: setSelectionRange || noop,
    focus: noop
  });

  input.simulate('mouseup', mouseUpEvent);

}

export function simulateFocusEvent(input, selectionStart, setSelectionRange) {
  const selectionEnd = selectionStart;

  const currentValue = input.prop('value');

  const focusEvent = getEvent({
    persist: noop,
  }, {
    value: currentValue,
    selectionStart,
    selectionEnd,
    setSelectionRange: setSelectionRange || noop,
    focus: noop
  });

  input.simulate('focus', focusEvent);

}

export function simulateBlurEvent(input) {
  const currentValue = input.prop('value');

  const blurEvent = getEvent({
    persist: noop
  }, {
    value: currentValue,
  });

  input.simulate('blur', blurEvent);
}


export {Enzyme, shallow, mount};
