import mysql from 'mysql';

function getData() {
    return new Promise((resolve, reject) => {
        let connection = mysql.createConnection({
            host: '34.175.145.214',
            user: 'Turiscool',
            password: 'Turiscool',
            database: 'Turiscool'
        });

        connection.connect(function(err) {
            if (err) {
                console.error('error connecting: ' + err.stack);
                reject(err);
                return;
            }
            console.log('connected as id ' + connection.threadId);
        });

        connection.query('SELECT * FROM usuarios', function(err, rows) {
            if (err) {
                reject(err);
                return;
            }
            console.log('Data received from Db:\n');
            console.log(rows);
            //obtener el total de rows
            console.log('Total rows: ' + rows.length);
            resolve(rows);

            connection.end(function(err) {
                if (err) {
                    console.error('error ending the connection: ' + err.stack);
                    return;
                }
                console.log('Connection closed');
            });
        });
    });
}

export default getData;
