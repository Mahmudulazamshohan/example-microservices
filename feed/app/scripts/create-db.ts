import * as mysql from 'mysql2';

(async (): Promise<void> => {
  try {
    const connection = mysql.createConnection({
      host: process?.env?.MYSQL_HOST,
      port: Number(process?.env?.MYSQL_PORT),
      user: process?.env?.MYSQL_USER,
      password: process?.env?.MYSQL_PASS,
      connectTimeout: 3000,
    });
    const name: string = process?.env?.MYSQL_NAME || '';
    connection.connect((connectError: mysql.QueryError) => {
      if (connectError) {
        throw new Error(connectError?.message || 'connectError');
      }
      connection.query(
        `CREATE DATABASE IF NOT EXISTS \`${name}\`;`,
        (err: Error) => {
          if (err) console.error(err);
          console.log('DB created');
          connection.end();
        },
      );
    });
  } catch (error) {
    /* silently fail*/
  }
})();
