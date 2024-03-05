// @ts-check
import { expect, afterEach } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';
import userEvent from '@testing-library/user-event';
import { cleanup, render as testRender, fireEvent } from '@testing-library/react';

expect.extend(matchers);

afterEach(() => {
  cleanup();
});

export async function render(elm) {
  const view = testRender(elm);

  // /** @type {HTMLInputElement} */
  const input = view.getByRole('textbox');

  const user = userEvent.setup();

  return { ...view, view: view, input, user };
}

export async function simulateKeyInput(
  user,
  input,
  key,
  selectionStart = 0,
  selectionEnd,
  options,
) {
  const v = input.value;

  let [start, end] = [selectionStart, selectionEnd ?? selectionStart];
  if (selectionStart > v.length) {
    start = v.length;
  }
  if (end > v.length) {
    end = v.length;
  }

  if (key.length === 0) {
    return;
  }

  const specialKeys = ['{Backspace}', '{Delete}', '{ArrowLeft}', '{ArrowRight}'];

  if (specialKeys.includes(key)) {
    if (start === end) {
      await input.focus();
      await input.setSelectionRange(start, end);

      await user.keyboard(key);
    } else {
      let newValue;

      if (key === '{Backspace}') {
        newValue = v.slice(0, start) + v.slice(end, v.length);
      } else if (key === '{Delete}') {
        newValue = v.slice(0, start) + v.slice(end, v.length);
      }

      fireEvent.change(input, { target: { value: newValue } });
    }
  } else {
    if (start === end) {
      if (options?.eventType === 'keyboard') {
        input.focus();
        input.selectionStart = start;
        input.selectionEnd = end;

        await user.keyboard(key);
      } else {
        await user.type(input, key, { initialSelectionStart: start, initialSelectionEnd: end });
      }
    } else {
      let newValue;

      newValue = v.slice(0, start) + key + v.slice(end, v.length);
      fireEvent.change(input, { target: { value: newValue } });
      end = start;
    }
  }
}

export function simulateMouseUpEvent(user, input, selectionStart) {
  const selectionEnd = selectionStart;

  fireEvent.mouseUp(input, {
    target: { selectionStart, selectionEnd },
  });
}

export function simulateFocusEvent(input) {
  input.focus();
}

export async function clearInput(user, input) {
  await user.clear(input);
}

export function simulateBlurEvent(input) {
  fireEvent.blur(input);
}
