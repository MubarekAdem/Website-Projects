// db.js
const sql = require('mssql');

const config = {
  user: 'sa',
  password: '123',
  server: 'localhost',
  database: 'PROJECT1',
  options: {
    trustedConnection: true,
    trustServerCertificate: true
  },
};

const pool = new sql.ConnectionPool(config);

async function connect() {
  try {
    await pool.connect();
    console.log('Connected to SQL Server');
  } catch (err) {
    console.error('Error connecting to SQL Server', err);
  }
}

module.exports = {
  connect,
  pool,
};
