module.exports = class User_mod extends require("./index") {
  static loginMod(username, password) {
    return new Promise((resolve, reject) => {
      const sql =
        "select uid from t_user where binary name= ? and password= ? and is_delete = 0";
      this.query(sql, this.formatParams(username, password))
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  static getUserInfoMod(uid) {
    return new Promise((resolve, reject) => {
      const sql = "select * from t_user where binary uid=? and is_delete = 0";
      this.query(sql, this.formatParams(uid))
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
};
