import Enzyme, { shallow, mount } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import userEvent from '@testing-library/user-event';
import { render as testRender } from '@testing-library/react';

Enzyme.configure({ adapter: new Adapter() });

const noop = function () {};

export const persist = jasmine.createSpy();

//keep input element singleton
const target = document.createElement('input');

export function getCustomEvent(value, selectionStart, selectionEnd) {
  let event = new Event('custom');
  const el = document.createElement('input');
  event = { ...event, target: el, persist };
  event.target = el;
  el.value = value;
  el.selectionStart = selectionStart;
  el.selectionEnd = selectionEnd;
  return event;
}

function getEvent(eventProps, targetProps) {
  let event = new Event('custom');

  Object.keys(targetProps).forEach((key) => {
    target[key] = targetProps[key];
  });

  event = { ...event, ...eventProps, target };

  return event;
}

export function setCaretPosition(event, caretPos) {
  const { target } = event;
  target.focus();
  target.setSelectionRange(caretPos, caretPos);
}

export function simulateKeyInput(input, key, selectionStart, selectionEnd, setSelectionRange) {
  if (selectionEnd === undefined) {
    selectionEnd = selectionStart;
  }

  const currentValue = input.prop('value');
  let defaultPrevented = false;

  const keydownEvent = getEvent(
    {
      preventDefault: function () {
        defaultPrevented = true;
      },
      key,
      isUnitTestRun: true,
      persist: persist.bind(null, 'keydown'),
    },
    {
      value: currentValue,
      selectionStart,
      selectionEnd,
      setSelectionRange: setSelectionRange || noop,
      focus: noop,
    },
  );

  //fire key down event
  input.simulate('keydown', keydownEvent);

  //fire change event
  if (!defaultPrevented && key !== 'ArrowLeft' && key !== 'ArrowRight') {
    //get changed caret positon
    let newCaretPosition, newValue;

    if (key === 'Backspace') {
      newCaretPosition = selectionStart !== selectionEnd ? selectionStart : selectionStart - 1;
      newValue =
        selectionStart !== selectionEnd
          ? currentValue.substring(0, selectionStart) +
            currentValue.substring(selectionEnd, currentValue.length)
          : currentValue.substring(0, newCaretPosition) +
            currentValue.substring(selectionStart, currentValue.length);
    } else if (key === 'Delete') {
      newCaretPosition = selectionStart;
      newValue =
        selectionStart !== selectionEnd
          ? currentValue.substring(0, selectionStart) +
            currentValue.substring(selectionEnd, currentValue.length)
          : currentValue.substring(0, selectionStart) +
            currentValue.substring(selectionStart + 1, currentValue.length);
    } else {
      newCaretPosition = selectionStart + key.length;
      newValue =
        selectionStart !== selectionEnd
          ? currentValue.substring(0, selectionStart) +
            key +
            currentValue.substring(selectionEnd, currentValue.length)
          : currentValue.substring(0, selectionStart) +
            key +
            currentValue.substring(selectionStart, currentValue.length);
    }

    const changeEvent = getEvent(
      {
        persist: persist.bind(null, 'change'),
        key,
      },
      {
        value: newValue,
        selectionStart: newCaretPosition,
        selectionEnd: newCaretPosition,
        setSelectionRange: setSelectionRange || noop,
        focus: noop,
      },
    );
    input.simulate('change', changeEvent);
  }
}

export async function render(elm) {
  const view = testRender(elm);
  const input = await view.getByRole('textbox');
  return { ...view, view: view, input };
}

export function simulateNativeKeyInput(input, key, selectionStart = 0, selectionEnd = 0) {
  input.setSelectionRange(selectionStart, selectionEnd);
  userEvent.type(input, key);
}

export function simulatePaste(input, test, selectionStart = 0, selectionEnd = 0) {
  input.setSelectionRange(selectionStart, selectionEnd);
  userEvent.paste(input, test);
}

export function simulateNativeMouseUpEvent(input, selectionStart) {
  input.setSelectionRange(selectionStart, selectionStart);
  userEvent.click(input);
}

export function simulateMousUpEvent(input, selectionStart, setSelectionRange) {
  const selectionEnd = selectionStart;

  const currentValue = input.prop('value');

  const mouseUpEvent = getEvent(
    {},
    {
      value: currentValue,
      selectionStart,
      selectionEnd,
      setSelectionRange: setSelectionRange || noop,
      focus: noop,
    },
  );

  input.simulate('mouseup', mouseUpEvent);
}

export function simulateFocusEvent(input, selectionStart = 0, selectionEnd, setSelectionRange) {
  if (selectionEnd === undefined) {
    selectionEnd = selectionStart;
  }

  const currentValue = input.prop('value');

  const focusEvent = getEvent(
    {
      persist: persist.bind(null, 'focus'),
    },
    {
      value: currentValue,
      selectionStart,
      selectionEnd,
      setSelectionRange: setSelectionRange || noop,
      focus: noop,
    },
  );

  input.simulate('focus', focusEvent);
}

export function simulateBlurEvent(input) {
  const currentValue = input.prop('value');

  const blurEvent = getEvent(
    {
      persist: persist.bind(null, 'blur'),
    },
    {
      value: currentValue,
    },
  );

  input.simulate('blur', blurEvent);
}

export { Enzyme, shallow, mount };

export function getInputValue(wrapper) {
  return wrapper.find('input').instance().value;
}

export async function wait(delay) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, delay);
  });
}
