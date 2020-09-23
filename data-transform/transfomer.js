const dataTypeParser = {
  Money: (n) => Number(n),
  Number: (n) => Number(n),
  Percent: (n) => Number(n)
};

const convertSortable = (items, parsers) => {
  return items.reduce((p, {title, description, type, saveIn, importField, sortable, order}) => {
    p[importField] = {title, description, type, saveIn, importField, sortable, order, parser: parsers[type]};
    return p;
  }, {});
  /*
   {
   "franchiseId": 2814606,
   "title": "Rank",
   "description": "Companies are ranked by total revenues for their respective fiscal years.",
   "type": "Number",
   "saveIn": "ranking",
   "importField": "rank",
   "sortable": "sortable",
   "order": "asc"
   }
   */
};

const convertFilterable = (items) => {
  return items.reduce((p, {title, type, saveIn, importField, filterable, options}) => {
    p[importField] = {title, type, saveIn, importField, filterable, options};
    return p;
  }, {});
  /*{
   "title": "Company",
   "type": "Text",
   "saveIn": "post_title",
   "importField": "name",
   "filterable": "filterable",
   "options": ["A", "B"]
   }*/
};

const columnTempalte = {
  id: 0,
  dataField: undefined,
  label: '',
  dataType: 'text'
}
const generateTemplate = (data) => {
  return {
    ...columnTempalte,
    ...data
  }
};

const aggregateColumns = (filterable, sortable, item) => {
  const columns = {};
  const typeMap = {
    'string': 'text',
    'number': 'number',
    default: 'text'
  };
  Object.keys(item).reduce((p, k) => {
    const label = k;
    const dataField = k;
    const dataType = typeMap[typeof item[k]] || typeMap.default;
    p[dataField] = generateTemplate({
      id: k,
      dataField,
      label,
      dataType
    });
    return p;
  }, columns);
  Object.keys(filterable).reduce((p, k) => {
    const {filterable: hasFilter, options, title: label, type: dataType} = filterable[k];
    p[k] = generateTemplate({
      ...(p[k] || {}),
      filterable: !!hasFilter,
      options,
      label,
      dataType: dataType.toLowerCase()
    });
    return p;
  }, columns);
  Object.keys(sortable).reduce((p, k) => {
    const {description, order: sortDirection, sortable: hasSort, title: label, type: dataType} = sortable[k];
    p[k] = generateTemplate({
      ...(p[k] || {}),
      description,
      sortDirection,
      sortable: !!hasSort,
      label,
      dataType: dataType.toLowerCase()
    });
    return p;
  }, columns);
  return columns;
};

const convertItem = (items, cols) => {
  return items.map(({fields, permalink: link}) => {
    return fields.reduce((p, {key, value}) => {
      const parser = (cols[key] || {}).parser;
      p[key] = parser ? parser(value) : value;
      return p;
    }, {link})
  });

};

const convertData = (data) => {
  const [{sortable: sortableMetaData, filterable: filterableMetaData}, {items: itemMetaData}] = data;
  const sortable = convertSortable(sortableMetaData, dataTypeParser);
  const filterable = convertFilterable(filterableMetaData);
  const items = convertItem(itemMetaData, sortable);
  const columns = aggregateColumns(filterable, sortable, items[0]);
  return {columns, filterable, items, sortable};
};

module.exports = {convertData};
