export function shortText(longText, maxLength, postfix) {
  const pos = longText.indexOf(' ', maxLength);
  return pos === -1 ? longText : longText.substr(0, pos) + postfix;
}

export function debounce(func, debounceTime) {
  let timeOut;
  const args = [];
  return function () {
    const funcCall = () => func.apply(this, ...args);
    clearTimeout(timeOut);
    timeOut = setTimeout(funcCall, debounceTime);
  };
}
