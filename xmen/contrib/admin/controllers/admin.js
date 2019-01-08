const { AdminSite } = require("../site");

const models = AdminSite.registry;

exports.home = (req, res) => {
  // Get all admin models.
  const links = Object.keys(models);

  res.render("contrib/admin/views/home", {
    models: links
  });
};

exports.modelListPage = (req, res) => {
  // Check parameters
  const model = req.params.model;
  const limit = req.query.limit || 25;
  const page = req.query.page || 0;
  const sort = req.query.sort || null;
  const sortPredicate = req.query.direction || "asc";
  const search = req.query.search || null;
  const adminModel = models[model];

  let query = {};
  let sortQuery = null;
  let textSearch = {};

  if (search) {
    adminModel.searchFields.map(searchField => {
      textSearch[searchField] = {
        $text: {
          $search: search,
          $caseSensitive: false
        }
      };
    });

    query = {
      ...query,
      textSearch
    };
  }

  if (sort) {
    sortQuery = {
      [sort]: sortPredicate
    };
  }

  // Find records related to query.
  let queryset = adminModel.model.find(query);

  if (sortQuery) {
    queryset = queryset.sort(sortQuery);
  }

  queryset = queryset.limit(limit).skip(page * limit);

  queryset.exec((err, docs) => {
    res.render("contrib/admin/views/list", {
      query: req.query,
      adminModel: adminModel,
      modelName: adminModel.model.modelName,
      docs: docs
    });
  });
};

exports.modelCreatePage = (req, res) => {
  // Find the model.
  const model = req.params.model;
  const adminModel = models[model];

  res.render("contrib/admin/views/record", {
    modelName: adminModel.model.modelName,
    adminModel: adminModel,
    fields: Object.keys(adminModel.model.schema.paths),
    fieldControls: adminModel.model.schema.paths,
    action: "/admin/" + adminModel.model.modelName + "/create"
  });
};

exports.modelEditPage = (req, res) => {
  // Find the model.
  const model = req.params.model;
  const adminModel = models[model];

  adminModel.model.findById(req.params.id).exec((err, doc) => {
    res.render("contrib/admin/views/record", {
      modelName: adminModel.model.modelName,
      adminModel: adminModel,
      doc: doc,
      fields: Object.keys(adminModel.model.schema.paths),
      fieldControls: adminModel.model.schema.paths,
      action: "/admin/" + adminModel.model.modelName + "/" + req.params.id
    });
  });
};

exports.modelCreate = (req, res) => {
  res.send(req.body);
};

exports.modelEdit = (req, res) => {
  res.send(req.body);
};
