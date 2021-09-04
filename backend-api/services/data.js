const db = require('./db');
// const helper = require('../helper');
// const config = require('../config');
const { validateTableCreate, validateInsertCSV } = require('../services/validation');


async function saveCSV(info) {
  try {
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
      if (result.length > 0) {
        message = 'CSV successfully saved.';
      }
      return { message, result };
    });
  } catch (e) {
    console.log('error ', e);
  }

}

async function retrieveData(info) {
}

async function createTable(info) {
  try {
    validateTableCreate(info);
    let queryString = 'CREATE TABLE ' + info.table_name + ' (id serial PRIMARY KEY,';
    const table_rowsLength = info.table_rows.length;
    await info.table_rows.map((row, i) => {
      const end = table_rowsLength - 1 === i;
      let rowString = '';
      if (row.type === 'timestamp')
        rowString = row.name + ' TIMESTAMP NOT NULL';
      else
        rowString = row.name + ' VARCHAR(255) NOT NULL';
      if (!end) rowString = rowString + ','; // add comma only if the array hasn't come to an end
      queryString = queryString + rowString;
    });

    queryString = queryString + ')';
    let message = 'Error in creating ' + info.table_name;
    const result = await db.query(`${queryString}`);
    if (typeof result === 'object') {
      message = info.table_name + ' created successfully';
    }
    return { message, result };
  } catch (e) {
    console.log('error', e);
  }

}

module.exports = {
  retrieveData,
  saveCSV,
  createTable
};