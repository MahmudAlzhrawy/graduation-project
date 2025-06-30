// ✅ فقط الحروف الأبجدية والمسافة
export function onlyAlphabetical(event: React.KeyboardEvent<HTMLInputElement>) {
  const code = event.key.codePointAt(0);
  if (!code) return;

  const isUpperCase = code >= 65 && code <= 90; // A-Z
  const isLowerCase = code >= 97 && code <= 122; // a-z
  const isSpace = code === 32;

  if (!isUpperCase && !isLowerCase && !isSpace) {
    event.preventDefault();
  }
}

// ✅ فقط الأرقام وبعض المفاتيح المفيدة
export function onlyNumbers(event: React.KeyboardEvent<HTMLInputElement>) {
  const code = event.key.codePointAt(0);
  const isNumber = code !== undefined && code >= 48 && code <= 57;

  const allowedKeys = [
    "Backspace",
    "ArrowLeft",
    "ArrowRight",
    "Tab",
    "Delete",
    "Enter",
  ];

  const isCtrlCombo = event.ctrlKey && ["a", "c", "v", "x"].includes(event.key.toLowerCase());

  if (!isNumber && !allowedKeys.includes(event.key) && !isCtrlCombo) {
    event.preventDefault();
  }
}
