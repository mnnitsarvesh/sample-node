import config from '../config';
import { readdirSync } from 'fs';
import Sequelize from 'sequelize';
import { basename as _basename, join } from 'path';

const basename = _basename(__filename);
const db = {};

let sequelize = new Sequelize(config.db.database, config.db.username, config.db.password, {
	host : config.db.host,
	port : config.db.port,
	dialect : config.db.connection,
    logging: false,
    pool: {
        max: 500,
        min: 1,
        idle: 20000,
        acquire: 1000000
    }
});

readdirSync(__dirname)
	.filter(file => {
		return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
	})
	.forEach(file => {
		const model = sequelize['import'](join(__dirname, file));
		db[model.name] = model;
	});

Object.keys(db).forEach(modelName => {
	if (db[modelName].associate) {
		db[modelName].associate(db);
	}
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export { db };