
const query = require('../db/db-connection');
const { multipleColumnSet } = require('../utils/common.utils');
const Role = require('../utils/userRoles.utils');
const Helper = require('../utils/helper.utils');

class UserModel {
    tableName = 'users';

    find = async (params = {}) => {
        let sql = `SELECT * FROM ${this.tableName}`;

        if (!Object.keys(params).length) {
            return await query(sql);
        }

        const { columnSet, values } = multipleColumnSet(params)
        sql += ` WHERE ${columnSet}`;

        return await query(sql, [...values]);
    }

    findOne = async (params) => {
        const { columnSet, values } = multipleColumnSet(params)

        const sql = `SELECT * FROM ${this.tableName}
        WHERE ${columnSet}`;

        const result = await query(sql, [...values]);

        // return back the first row (user)
        return result[0];
    }

    create = async ({ username, password, first_name, last_name, email, role = Role.SuperUser}) => {
        const sql = `INSERT INTO ${this.tableName}
        (username, password, first_name, last_name, email, role,account_id,enabled,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?)`;
        const result = await query(sql, [username, password, first_name, last_name, email, role,Helper.account_id,'0',Helper.now,Helper.now]);
        const affectedRows = result ? result.affectedRows : 0;

        return Helper.account_id;
    }

    update = async (params, account_id) => {
        const { columnSet, values } = multipleColumnSet(params)

        const sql = `UPDATE ${this.tableName} SET ${columnSet},updated_at = '${Helper.now}' WHERE account_id = ?`;
        const result = await query(sql, [...values,account_id]);

        return result;
    }

    delete = async ({account_id:account_id}) => {
        const sql = `DELETE FROM ${this.tableName}
        WHERE account_id = ?`;
        const result = await query(sql, [account_id]);
        const affectedRows = result ? result.affectedRows : 0;

        return affectedRows;
    }
}


module.exports = new UserModel;