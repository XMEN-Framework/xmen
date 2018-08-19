class FormControl {
  constructor(state, validators) {
    this.validators = validators ? validators : [];
    this.setValue(state);
  }

  setValue(value) {
    this.value = value;
    this.updateValidity(value);
  }

  getValue() {
    return this.value;
  }

  updateValidity(value) {
    // Run against validators
    let isValid = true;
    this.validators.map(validator => {
      if (!validator(value)) {
        isValid = false;
      }
    });

    this.isValid = isValid;
    return isValid;
  }
}

module.exports = FormControl;
