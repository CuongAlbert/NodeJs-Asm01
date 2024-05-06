const paging = (array, limit, page = 1) => {
  return array.slice((page - 1) * limit, page * limit);
};

module.exports = paging;
