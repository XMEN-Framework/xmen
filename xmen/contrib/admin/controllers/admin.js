const { AdminSite } = require("../site");
const Pagination = require("../pagination");

const models = AdminSite.registry;

exports.home = (req, res) => {
  // Get all admin models.
  const links = Object.keys(models);
  res.render("contrib/admin/views/home", {
    models: links
  });
};

exports.modelListPage = async (req, res) => {
  // Check parameters
  const model = req.params.model;
  const limit = parseInt(req.query.limit) || 25;
  const page = parseInt(req.query.page) || 1;
  const offset = limit * (page - 1);
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

  const queryCount = await adminModel.model.count(query);

  if (sortQuery) {
    queryset = queryset.sort(sortQuery);
  }

  queryset = queryset.limit(limit).skip(offset);

  const docs = await queryset.exec();

  const pagination = new Pagination(queryCount, limit, page, 5);
  const url = `/admin/${model}?limit=${limit}`;

  if (search) {
    url += `&search=${search}`;
  }

  res.render("contrib/admin/views/list", {
    query: req.query,
    adminModel: adminModel,
    modelName: adminModel.model.modelName,
    docs: docs,
    url,
    pagination
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
