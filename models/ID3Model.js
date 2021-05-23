const xlsx = require("node-xlsx").default;
const _ = require("lodash");

const getData = () => {
  const excelFile = xlsx.parse(`${__dirname}/../heart_disease_male.xls`);
  const data = excelFile[0].data;
  let newFormatData = [];
  for (let i = 2; i < data.length; i++) {
    let getData = {};
    for (let j = 0; j < data[i].length; j++) {
      getData = { ...getData, [data[0][j]]: data[i][j] };
    }
    newFormatData.push(getData);
  }
  const examples = _(newFormatData);

  var features = [];
  for (let i = 0; i < data[0].length - 1; i++) features.push(data[0][i]);

  var target = data[0][data[0].length - 1];

  var samples = [];
  for (let i = 0; i < 30; i++) samples.push(newFormatData[i]);
  return { examples, samples, features, target };
};

const data = getData();

module.exports = data;
