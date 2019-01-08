/**
 * User admin
 */
const User = require("./models/user");
const { AdminSite } = require("../admin/site");

class UserAdmin {
  constructor(model, site) {
    this.model = model;
    this.site = site;
    this.listDisplay = ["username", "first_name", "last_name", "email"];
    this.searchFields = ["username", "email", "first_name", "last_name"];
  }

  fullName(obj) {
    return obj.first_name + " " + obj.last_name;
  }
}

AdminSite.register(User, UserAdmin);
