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

export async function simulateKeyInput(user, input, key, selectionStart, selectionEnd, options) {
  if (!selectionStart && selectionStart !== 0) {
    input.focus();
    await user.keyboard(key);
    return;
  }

  const v = input.value;

  let start = selectionStart ?? 0;
  let end = selectionEnd ?? start;

  if (start > v.length) {
    start = v.length;
  }
  if (end > v.length) {
    end = v.length;
  }

  if (key.length === 0) {
    return;
  }

  const specialKeys = ['{Backspace}', '{Delete}', '{ArrowLeft}', '{ArrowRight}'];

  input.focus();
  input.setSelectionRange(start, end);

  if (specialKeys.includes(key)) {
    if (start === end) {
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
        await user.keyboard(key);
      } else {
        await user.type(input, key, { initialSelectionStart: start, initialSelectionEnd: end });
      }
    } else {
      const newValue = v.slice(0, start) + v.slice(end, v.length);
      fireEvent.change(input, { target: { value: newValue } });

      input.setSelectionRange(start, start);
      await user.keyboard(key);
    }
  }
}

export function simulateMouseUpEvent(user, input, selectionStart) {
  const selectionEnd = selectionStart;

  fireEvent.mouseUp(input, {
    target: { selectionStart, selectionEnd },
  });
}

export function simulateFocus(input) {
  input.focus();
}

export async function simulateClickToFocus(user, input) {
  await user.click(input);
}

export async function clearInput(user, input) {
  await user.clear(input);
}

export function simulateBlurEvent(input) {
  fireEvent.blur(input);
}

export async function simulatePaste(user, input, data, selectionStart = 0, selectionEnd) {
  if (!selectionEnd) selectionEnd = selectionStart;

  await simulateClickToFocus(user, input);
  await simulateDragMouseToSelect(user, input, selectionStart, selectionEnd);
  await user.paste(data);
}

export async function simulateDblClick(user, target, offset) {
  await user.pointer([{ target: target, offset: offset, keys: '[MouseLeft][MouseLeft]' }]);
}

export async function simulateTripleClick(user, target, offset) {
  await user.pointer([
    { target: target, offset: offset, keys: '[MouseLeft][MouseLeft][MouseLeft]' },
  ]);
}

export async function simulateDragMouseToSelect(user, target, from, to) {
  await user.pointer([{ target: target, offset: from, keys: '[MouseLeft>]' }, { offset: to }]);
}
