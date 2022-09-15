module.exports = (app) => {
  var express = require('express');
  var assert = require('http-assert');
  var inflection = require('inflection');
  var userRouter = require('./login');
  var router = express.Router({
    mergeParams: true,
  });
  //增加
  router.post('/', function (req, res, next) {
    req.Model.add(req, res);
  });
  //删除
  router.delete('/', function (req, res, next) {
    req.Model.delete(req, res);
  });
  //修改
  router.put('/', function (req, res, next) {
    req.Model.edit(req, res);
  });
  //发布
  router.put('/publish', function (req, res, next) {
    switch (req.modelName) {
      case 'Blog':
        req.Model.changeBlogPublicStatus(req, res);
        break;
      case 'Note':
        req.Model.changeNotePublicStatus(req, res);
        break;
    }
  });
  router.put('/doUp', function (req, res, next) {
    switch (req.modelName) {
      case 'Blog':
        req.Model.changeBlogTopStatus(req, res);
        break;
    }
  });
  //查询详细信息
  router.get('/query', function (req, res, next) {
    req.Model.queryOne(req, res);
  });
  //查询所有列表
  router.get('/queryAll', function (req, res, next) {
    req.Model.queryByType(req, res);
  });
  const multer = require('multer');
  const upload = multer({
    dest: __dirname + '/../../static',
  });
  //文件上传
  app.use('/admin/api/upload', upload.single('file'), function (req, res) {
    require('../../dao/admin/Img').imgUpload(req, res);
  });
  app.use(
    '/admin/api/:resource',
    function (req, res, next) {
      //将路由名规范化为模块名称
      let resource = req.params.resource;
      let i = resource.indexOf('/');
      resource = i !== -1 ? resource.slice(0, i) : resource;
      const modelName = inflection.classify(resource);
      console.log(modelName);
      //引入对应模块
      const model = require(`../../dao/admin/${modelName}`);
      //将模块挂在到req中
      req.Model = model;
      req.modelName = modelName;
      next();
    },
    router
  );
  app.use('/admin/user', userRouter);
};
