function email(value) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(value).toLowerCase());
}

function required(value) {
  if (value) return true;
  return false;
}

function minLength(length) {
  return value => {
    if (value.length >= length) {
      return true;
    }
    return false;
  };
}

function maxLength(length) {
  return value => {
    if (value.length <= length) {
      return true;
    }
    return false;
  };
}

module.exports = {
  email,
  required,
  minLength,
  maxLength
};
