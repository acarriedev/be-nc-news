const formatDates = (list) => {
  return list.map((listItem) => {
    const newListItem = { ...listItem };
    const date = new Date(listItem.created_at);
    newListItem.created_at = date.toJSON();
    return newListItem;
  });
};

const makeRefObj = (list, key, value) => {
  const refObj = {};

  list.forEach((item) => {
    refObj[item[key]] = item[value];
  });
  return refObj;
};

const formatComments = (comments, articleRef) => {
  const dateCorrected = formatDates(comments);

  const formattedComments = dateCorrected.map((comment) => {
    const { belongs_to: key1, created_by: key2, ...restOfKeys } = comment;
    return { article_id: articleRef[key1], author: key2, ...restOfKeys };
  });

  return formattedComments;
};

module.exports = { formatDates, makeRefObj, formatComments };
