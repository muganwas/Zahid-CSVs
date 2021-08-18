const db = require('./db');
// const helper = require('../helper');
// const config = require('../config');
const { validateTableCreate, validateInsertCSV } = require('../services/validation');


async function saveCSV(info) {
  validateInsertCSV(info);

  info.table_rows.forEach(async (mainRow) => {
    const newEntryNames = [];
    const newEntryValues = [];
    let newEntryNamesString = '';
    let valuesStringArr = [];
    let valuesString = '';
    await mainRow.forEach(r => newEntryNames.push(r.name));
    await mainRow.forEach((r, i) => valuesStringArr.push('$' + (i + 1)));
    await mainRow.forEach(r => newEntryValues.push(r.value));
    valuesString = valuesStringArr.join(',');
    newEntryNamesString = newEntryNames.join(',');
    let queryString = 'INSERT INTO ' + info.table_name + ' (' + newEntryNamesString + ') VALUES (' + valuesString + ') RETURNING *';
    let message = 'Error in creating ' + info.table_name;
    const result = await db.query(`${queryString}`, newEntryValues);
    if (typeof result === 'object') {
      message = info.table_name + ' created successfully';
    }
    return { message, result };
  });
}

async function retrieveData(info) {
}

async function createTable(info) {
  validateTableCreate(info);
  let queryString = 'CREATE TABLE ' + info.table_name + ' (id serial PRIMARY KEY,';
  await info.table_rows.map(row => {
    if (row.type === 'timestamp') {
      const rowString = row.name + ' TIMESTAMP NOT NULL,';
      queryString = queryString + rowString;
    } else {
      const rowString = row.name + ' VARCHAR(255) NOT NULL,';
      queryString = queryString + rowString;
    }
  });
  const lastStringArr = queryString.split('');
  lastStringArr.pop();
  const newQueryString = lastStringArr.join('');
  queryString = newQueryString + ')';
  let message = 'Error in creating ' + info.table_name;
  const result = await db.query(`${queryString}`);
  if (typeof result === 'object') {
    message = info.table_name + ' created successfully';
  }
  return { message, result };
}

asy;

module.exports = {
  retrieveData,
  saveCSV,
  createTable
};