const IS = require('is');
module.exports = {
  queryTagNameByTagsId(table, params, order, tag_id, where) {
    if (
      IS.string(table) &&
      IS.array(params) &&
      IS.array(order) &&
      IS.array(tag_id) &&
      IS.array(where)
    ) {
      return `SELECT ${params
        .map((i) => i)
        .join(',')} FROM ${table} WHERE tag_id in (${tag_id.join(',')}) AND ${
        where.map((i) => i).join(' = ? AND ') + ' = ?'
        //TODO
      } ORDER BY ${order.join(' DESC,')} DESC`;
    } else {
      return false;
    }
  },
  queryBlogsIdByTagsName(table, params, order, names, where) {
    if (
      IS.string(table) &&
      IS.array(params) &&
      IS.array(order) &&
      IS.array(names) &&
      IS.array(where)
    ) {
      return `SELECT ${params
        .map((i) => i)
        .join(',')} FROM ${table} WHERE name in (${names
        .map((i) => `'${i}'`)
        .join(',')}) AND ${
        where.map((i) => i).join(' = ? AND ') + ' = ?'
        //TODO
      } ORDER BY ${order.join(' DESC,')} DESC `;
    } else {
      return false;
    }
  },
  queryBlogByBlogIds(table, params, order, blogIds, where, offset, pageSize) {
    if (
      IS.string(table) &&
      IS.array(params) &&
      IS.array(order) &&
      IS.array(blogIds) &&
      IS.array(where) &&
      IS.number(offset) &&
      IS.number(pageSize)
    ) {
      return `SELECT ${params
        .map((i) => i)
        .join(
          ','
        )},date_format(update_time,'%Y-%m-%d %H:%i:%s') as update_time,date_format(create_time,'%Y-%m-%d %H:%i:%s') as create_time FROM ${table} WHERE blog_id in (${blogIds.join(
        ','
      )}) AND ${
        where.map((i) => i).join(' = ? AND ') + ' = ?'
        //TODO
      } ORDER BY ${order.join(' DESC,')} DESC LIMIT ${offset},${pageSize};`;
    } else {
      return false;
    }
  },
  querySumOfBlogByBlogIds(table, params, order, blogIds, where) {
    if (
      IS.string(table) &&
      IS.array(params) &&
      IS.array(order) &&
      IS.array(blogIds) &&
      IS.array(where)
    ) {
      return `SELECT ${params
        .map((i) => i)
        .join(',')} FROM ${table} WHERE blog_id in (${blogIds.join(',')}) AND ${
        where.map((i) => i).join(' = ? AND ') + ' = ?'
        //TODO
      };`;
    } else {
      return false;
    }
  },
  /**
   *  模糊查询
   * @param {String} table 表
   * @param {Array} params 查询参数
   * @param {String} like 查询字符
   * @param {string} where 表位置
   * @returns
   */
  QueryBlogByLikeWords(table, params, where, like) {
    if (
      IS.array(where) &&
      IS.string(table) &&
      IS.string(like) &&
      IS.array(params)
    ) {
      console.log(like,'like');
      if (like) like = like.replace(/[\%]/g, '');
      console.log(like,'like');
      return `SELECT ${params
        .map((i) => i)
        .join(
          ','
        )},date_format(update_time,'%Y-%m-%d %H:%i:%s') as update_time,date_format(create_time,'%Y-%m-%d %H:%i:%s') as create_time FROM ${table} WHERE title LIKE '%${like}%' AND ${where.map((i) => i).join(' = ? AND ') + ' = ?'
        };`;
    } else {
      return false;
    }
  },
};
