
const query = require('../db/db-connection');
const { multipleColumnSet } = require('../utils/common.utils');
const Role = require('../utils/userRoles.utils');
const Helper = require('../utils/helper.utils');
const HttpException = require('../utils/HttpException.utils');


class StudentsModel {
    tableName = 'students';
    find = async (params = {}) => {
        let sql = `SELECT * FROM ${this.tableName}`;

        if (!Object.keys(params).length) {
            return await query(sql);
        }

        const { columnSet, values } = multipleColumnSet(params)
        sql += ` WHERE ${columnSet}`;

        return await query(sql, [...values]);
    }

    findOne = async ({ token: token }) => {

        const sql = `SELECT * FROM ${this.tableName}
        WHERE student_id=?`;

        const result = await query(sql,[token]);

        // return back the first row (user)
        return result[0];
    }

    create = async ({parent_id:parent_id,student_name:student_name,education_program:education_program,school_level:school_level,classroom:classroom,school_name:school_name,favorite_course:favorite_course,fallback_course:fallback_course}) => {
        const sql = `INSERT INTO ${this.tableName}
       (parent_id,student_id,student_name,education_program,school_level,classroom,school_name,favorite_course,fallback_course,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?)`;
        const result = await query(sql, [parent_id,Helper.account_id,student_name,education_program,school_level,classroom,school_name,favorite_course,fallback_course,Helper.now,Helper.now]);
        const affectedRows = result ? result.affectedRows : 0;

        return Helper.token;
    }

    update = async (params, account_id) => {
        const { columnSet, values } = multipleColumnSet(params)

        const sql = `UPDATE ${this.tableName} SET ${columnSet},updated_at = '${Helper.now}' WHERE student_id = ?`;
        const result = await query(sql, [...values,account_id]);

        return result;
    }

    delete = async ({student_id:student_id}) => {
        const sql = `DELETE FROM ${this.tableName}
        WHERE student_id = ?`;
        const result = await query(sql, [student_id]);
        const affectedRows = result ? result.affectedRows : 0;

        return affectedRows;
    }

    
}


module.exports = new StudentsModel;