exports.formatDates = (list) => {
  return list.map((article) => {
    const newArticle = { ...article };
    const date = new Date(article.created_at);
    newArticle.created_at = date.toJSON();
    return newArticle;
  });
};

exports.makeRefObj = (list, key, value) => {
  const refObj = {};

  list.forEach((item) => {
    refObj[item[key]] = item[value];
  });
  return refObj;
};

exports.formatComments = (comments, articleRef) => {
  // returns a new array of comment objects
  // rename author key
  // rename belongs_to to article_id and make the value match
  // reformat date
  return [];
};
