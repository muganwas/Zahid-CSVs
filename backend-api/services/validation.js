function validateTableCreate(info) {
  let messages = [];

  if (!info) {
    messages.push('No object is provided');
  }

  if (!info.table_name) {
    messages.push('Table name is empty');
  }

  if (!info.table_rows) {
    messages.push('Table rows is empty');
  }

  if (messages.length) {
    let error = new Error(messages.join());
    error.statusCode = 400;

    throw error;
  }
}

function validateInsertCSV(info) {
  let messages = [];

  if (!info) {
    messages.push('No object is provided');
  }

  if (!info.table_name) {
    messages.push('Table name is empty');
  }

  if (!info.table_rows) {
    messages.push('Table rows is empty');
  }

  if (messages.length) {
    let error = new Error(messages.join());
    error.statusCode = 400;

    throw error;
  }
}

module.exports = {
  validateTableCreate,
  validateInsertCSV
};