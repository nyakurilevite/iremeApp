
const query = require('../db/db-connection');
const { multipleColumnSet } = require('../utils/common.utils');
const Role = require('../utils/userRoles.utils');
const Helper = require('../utils/helper.utils');
const HttpException = require('../utils/HttpException.utils');


class TokenModel {
    tableName = 'tokens';
    secondsSinceEpoch = Math.round(Date.now() / 1000);

    findOne = async ({ token: token }) => {

        const sql = `SELECT * FROM ${this.tableName}
        WHERE token=?`;

        const result = await query(sql,[token]);

        // return back the first row (user)
        return result[0];
    }

    create = async ({account_id:account_id,duration:duration}) => {
        const sql = `INSERT INTO ${this.tableName}
       (account_id,token,token_expiry,created_at,updated_at) VALUES (?,?,?,?,?)`;
        const result = await query(sql, [account_id,Helper.token,this.generate_token_expiry({duration:duration}),Helper.now,Helper.now]);
        const affectedRows = result ? result.affectedRows : 0;

        return Helper.token;
    }

    delete = async ({token:token}) => {
        const sql = `DELETE FROM ${this.tableName}
        WHERE token = ?`;
        const result = await query(sql, [token]);
        const affectedRows = result ? result.affectedRows : 0;

        return affectedRows;
    }

    //token valid checking
    is_token_valid= async ({token : token}) => {
        if(token)
        {
          const check_token = await this.findOne({ token: token });
          if (!check_token) {
            throw new HttpException(404, 'TOKEN_NOT_FOUND');
          }
          
          if (check_token.token_expiry > this.secondsSinceEpoch) {
                // Token is valid
                return true;
            } else {
                // Token is not valid
                return false;
            }  
        }    
        
    }

    generate_token_expiry ({duration:duration})
    {
        return this.secondsSinceEpoch + duration; 
    }
}

module.exports = new TokenModel;