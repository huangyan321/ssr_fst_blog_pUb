const mysql = require("mysql");
const userInfo = require("../config/userControl");

const pool = mysql.createPool(userInfo);

module.exports = class Model {
  static query(sql, params) {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          console.log(err);
          //释放连接
          connection.release();
        } else {
          console.log("正在交互..");
          connection.query(sql, params, (err, res) => {
            if (err) {
              reject(err);
            } else {
              resolve(res);
            }
          });
          connection.release();
        }
      });
    });
  }
  //格式化参数
  static formatParams() {
    let arr = [];
    for (let i = 0; i < arguments.length; i++) {
      arr.push(arguments[i]);
    }
    return arr;
  }
};
