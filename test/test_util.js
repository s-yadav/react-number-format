const noop = function(){};

export function getCustomEvent(value) {
  let event =  new Event('custom');
  const el = document.createElement('input');
  event = Object.assign({}, event, {target: el, persist: noop});
  event.target = el;
  el.value = value;
  return event;
}

export function setCaretPosition(event, caretPos) {
  const {target} = event;
  target.focus();
  target.setSelectionRange(caretPos, caretPos);
}
