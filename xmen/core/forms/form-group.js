class FormGroup {
  constructor(controls, validators) {
    this.isValid = true;
    this.controls = controls;
    this.validators = validators ? validators : [];
    this.updateValidity();
  }

  control(name) {
    return this.controls[name];
  }

  addControl(name, control) {
    if (this.controls[name]) return this.controls[name];
    this.controls[name] = control;
    return control;
  }

  setValue(value) {
    Object.keys(value).forEach(name => {
      if (this.controls[name]) {
        this.controls[name].setValue(value[name]);
      }
    });

    this.updateValidity();
  }

  getValue() {
    let formValue = {};
    Object.keys(this.controls).forEach(name => {
      formValue[name] = this.controls[name].getValue();
    });

    return formValue;
  }

  updateValidity() {
    let isValid = true;

    // Check each control
    Object.keys(this.controls).forEach(controlName => {
      if (!this.controls[controlName].isValid) isValid = false;
    });

    this.validators.map(validator => {
      if (!validator(value)) {
        isValid = false;
      }
    });

    this.isValid = isValid;
    return isValid;
  }
}

module.exports = FormGroup;
