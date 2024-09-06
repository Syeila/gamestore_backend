import {Sequelize} from "sequelize";

const db = new Sequelize('helpdesk_db', 'root', '', {
    host: "localhost",
    dialect: "mysql"
});

export default db;