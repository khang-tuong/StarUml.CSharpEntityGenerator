function getPluralName(name) {
  if (name.length < 2) {
    return name;
  }

  let lastTwoChars = name.substring(name.length - 2, name.length);
  let lastChar = name.substring(name.length - 1, name.length);

  if (
    lastTwoChars === "ch" ||
    lastTwoChars === "sh" ||
    lastChar === "s" ||
    lastChar === "x" ||
    lastChar === "z"
  ) {
    return `${name}es`;
  }

  if (lastChar === "y") {
    return `${name.substring(0, name.length - 1)}ies`;
  }

  if (lastTwoChars === "fe" || lastTwoChars === "ff") {
    return `${name.substring(0, name.length - 2)}ves`;
  }

  if (lastChar === "f") {
    return `${name.substring(0, name.length - 1)}ves`;
  }

  return `${name}s`;
}

exports.getPluralName = getPluralName;
