const fs = require('fs-extra');
const year = 2017;
const data = require(`./raw/${year}.json`);
const {convertData} = require('./transfomer');
const {columns, items} = convertData(data);
console.log(columns, items);

const outputFolder = `./output/${year}`;
fs.emptyDir(outputFolder).then(() => {
  fs.writeJson(`${outputFolder}/columns.json`, columns);
  fs.writeJson(`${outputFolder}/${year}.json`, items);
});

