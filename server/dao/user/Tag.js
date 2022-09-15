const Utils = require("../../utils");
const Tips = require("../../utils/tip");
const { number } = require("is");

module.exports = class Blog_dao extends require("../../model/common/curd") {
  //查询所有标签
  static async queryByType(req, res) {
    try {
      const list = await this.queryAllOfField(
        "t_tag",
        ["name", "tag_id"],
        ["create_time"],
        ["is_delete", "publish"],
        0,
        1
      );
      // let handleList = Utils.unique(list, 'name')
      res.send({
        ...Tips[0],
        data: list,
      });
    } catch (err) {
      console.log(err);
      res.send(Tips[1008]);
    }
  }
};
