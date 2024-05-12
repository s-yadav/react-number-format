// @ts-check
import { expect, afterEach } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';
import userEvent from '@testing-library/user-event';
import { cleanup, render as testRender, fireEvent } from '@testing-library/react';

expect.extend(matchers);

afterEach(() => {
  cleanup();
});

function waitForFrame() {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      resolve(undefined);
    });
  });
}

export async function render(elm) {
  const view = testRender(elm);

  // /** @type {HTMLInputElement} */
  const input = view.getByRole('textbox');

  const user = userEvent.setup();

  return { ...view, view: view, input, user };
}

export async function simulateKeyInput(user, input, key, selectionStart, selectionEnd) {
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
    await user.keyboard(key);
  } else {
    // Unfortunately jsdom do not handle react-testing-library user.type event correctly
    // So we have to simulate keyDown and change events manually, this is not ideal but it works (and assume some implementation details)
    fireEvent.keyDown(input, { key: key[0] });
    // update start and end, and keydown can change caret position
    start = input.selectionStart;
    end = input.selectionEnd;
    const newValue = v.slice(0, start) + key + v.slice(end, v.length);
    const caretPosition = start + key.length;
    fireEvent.change(input, {
      target: {
        value: newValue,
        selectionStart: caretPosition,
        selectionEnd: caretPosition,
      },
    });
    // wait for a frame so changes are reflected
    await waitForFrame();
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
  await simulateDragMouseToSelect(input, selectionStart, selectionEnd);
  await user.paste(data, {});
}

export async function simulateDblClick(user, target, offset) {
  await user.pointer([{ target: target, offset: offset, keys: '[MouseLeft][MouseLeft]' }]);
}

export async function simulateTripleClick(user, target, offset) {
  await user.pointer([
    { target: target, offset: offset, keys: '[MouseLeft][MouseLeft][MouseLeft]' },
  ]);
}

export async function simulateDragMouseToSelect(target, from, to) {
  fireEvent.mouseDown(target, {
    target: { selectionStart: from, selectionEnd: from },
  });
  fireEvent.mouseUp(target, {
    target: { selectionStart: from, selectionEnd: to },
  });
}
