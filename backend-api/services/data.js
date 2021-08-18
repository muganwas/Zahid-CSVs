const db = require('./db');
const helper = require('../helper');
const config = require('../config');
const { validateTableCreate } = require('../services/validation');

async function getMultiple(page = 1) {
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    'SELECT id, quote, author FROM quote OFFSET $1 LIMIT $2',
    [offset, config.listPerPage]
  );
  const data = helper.emptyOrRows(rows);
  const meta = { page };

  return {
    data,
    meta
  };
}

async function getById(id) {
  console.log('id', id);
}

async function getByAuthor(author) {
  //const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    'SELECT id, quote, author FROM quote WHERE author= $1 LIMIT $2',
    [author, config.listPerPage]
  );
  const data = helper.emptyOrRows(rows);
  const meta = { author };

  return {
    data,
    meta
  };
}

async function saveCSV(quote) {
  const result = await db.query(
    'INSERT INTO quote(quote, author) VALUES ($1, $2) RETURNING *',
    [quote.quote, quote.author]
  );
  let message = 'Error in creating quote';

  if (result.length) {
    message = 'Quote created successfully';
  }

  return { message, result };
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
  console.log(queryString);
  const result = await db.query(`${queryString}`);
  if (result.length) {
    message = 'Quote created successfully';
  }
  return { message, result };
}

module.exports = {
  getMultiple,
  getById,
  getByAuthor,
  saveCSV,
  createTable
};