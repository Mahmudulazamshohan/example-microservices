import * as mysql from 'mysql2';

const checkConnection = () => {
  return new Promise((resolve, reject) => {
    const connection = mysql.createConnection({
      host: process?.env?.MYSQL_HOST,
      port: Number(process?.env?.MYSQL_PORT),
      user: process?.env?.MYSQL_USER,
      password: process?.env?.MYSQL_PASS,
      database: process?.env?.MYSQL_NAME,
      connectTimeout: 3000,
    });
    console.log('====>', {
      host: process?.env?.MYSQL_HOST,
      port: Number(process?.env?.MYSQL_PORT),
      user: process?.env?.MYSQL_USER,
      password: process?.env?.MYSQL_PASS,
      database: process?.env?.MYSQL_NAME,
      connectTimeout: 3000,
    });
    connection.connect((err) => {
      console.error(err);
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
};

let i = 0;

const testConnection = async () => {
  try {
    await checkConnection();
    console.log('Connection established.');
    process.exit(0);
  } catch (e) {
    console.error(e);
    console.log(
      `Connection not available. Attempted ${++i} time${i !== 1 ? 's' : ''}.`,
    );
  }
};

(async () => {
  await testConnection();
  setInterval(testConnection, 3000);
  setTimeout(() => process.exit(1), 120000);
})();
