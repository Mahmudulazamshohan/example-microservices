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

const testConnection = async () => {
  try {
    const isConnected = await checkConnection();
    console.log('Connection established.', isConnected);
  } catch (e) {
    console.error(e);
  }
};

process.on('SIGINT', () => process.exit(0));

(async () => {
  await testConnection();
})();
