const mariadb = require('mariadb');
const mqtt = require('mqtt');

const pool = mariadb.createPool({ database: 'hien_do_an', host: '18.138.252.122', user: 'hien_do_an', password: 'hien_do_an', connectionLimit: 5 });
const client = mqtt.connect({ host: 'mqtt.solavo.net', port: 1883, username: 'FWpfOR6wyKZIoYj', password: '135308641' })

client.on('connect', function () {
    client.subscribe('FWpfOR6wyKZIoYj/fb', function (err) {
        if (!err) {
            //client.publish('android_test_dev_uid', 'Hello mqtt')
        }
    })
})

client.on('message', function (topic, message) {
    const jsonBuffer = message.toString();
    const data = JSON.parse(jsonBuffer);

    data.hasOwnProperty('ec') ? insertDatabase({ type: 'ec', value: data.ec }) : null;
    data.hasOwnProperty('ph') ? insertDatabase({ type: 'ph', value: data.ph }) : null;
    data.hasOwnProperty('temp') ? insertDatabase({ type: 'temp', value: data.temp }) : null;
    data.hasOwnProperty('water') ? insertDatabase({ type: 'water', value: data.water }) : null;
})


const insertDatabase = ({ type, value }) => {
    pool.getConnection().then(conn => {
        conn.query(`INSERT INTO ${type}(name, value, updated_time) VALUES ('?',?,NOW())`, [type, value])
            .then((result) => {
                conn.end();
                console.log(result);
            })
            .catch(err => {
                console.log(err);
                conn.end();
            })
    }).catch(err => {
        console.log(err)
    });
}
