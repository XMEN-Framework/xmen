const FormGroup = require("./form-group");
const FormControl = require("./form-control");

class FormBuilder {
  constructor() {}

  group(controlsConfig, extra) {
    const controls = this._reduceControls(controlsConfig);
    const validator = extra != null ? extra["validator"] : null;
    return new FormGroup(controls, validator);
  }

  _reduceControls(controlsConfig) {
    const controls = {};
    Object.keys(controlsConfig).forEach(controlName => {
      let value = controlsConfig[controlName][0];
      let validators =
        controlsConfig[controlName].length > 1
          ? controlsConfig[controlName][1]
          : [];
      controls[controlName] = new FormControl(value, validators);
    });
    return controls;
  }
}

module.exports = FormBuilder;
