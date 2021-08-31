const advancedResults = (model, populate) => async (req, res, next) => {
  // copy reqquery to reqQuery
  reqQuery = { ...req.query };

  // make array to remove select

  removeField = ["select", "sort", "page", "limit", "skip"];

  console.log(reqQuery);

  removeField.forEach((param) => {
    delete reqQuery[param];
  });
  console.log(reqQuery);

  queryStr = JSON.stringify(reqQuery);

  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );
  //query= await Bootcamp.find(req.query);
  // bootcamps= await query

  //  const bootcamps=await Bootcamp.find( {},{name:Bootcamp.name})

  bootcamps = model.find(JSON.parse(queryStr));
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    bootcamps = bootcamps.select(fields);
  }
  //sort

  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    bootcamps = bootcamps.sort(sortBy);
  } else {
    bootcamps = bootcamps.sort("-createdAt");
  }

  // pagination

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 100;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await model.countDocuments();
  bootcamps = bootcamps.skip(startIndex).limit(limit);

  if (populate) {
    bootcamps = bootcamps.populate(populate);
  }

  results = await bootcamps;

  // pagination result
  let pagination = {};
  if (endIndex < total) {
    pagination.next = { page: page + 1, limit };
  }
  if (startIndex > 0) {
    pagination.prev = { page: page - 1, limit };
  }

  res.advancedResults = {
    sucess: true,
    count: results.length,
    pagination,
    data: results,
  };
  next();
};

module.exports = advancedResults;
