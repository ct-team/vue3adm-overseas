const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');
const config = require('./config.js');
const list = config.list;

// const src = path.join(__dirname, '../dist/dest');
const root = path.resolve(__dirname, '../dist');

const clearEnv = function (result, env) {
  const s = '<div[^>]*data-hide-env="?(' + env + ')"?.*?[^>]*>(.*?)</div>';
  const s2 = '<div[^>]*data-hide-env=.*?[^>]*>(.*?)</div>';
  const re = new RegExp(s, 'g');
  const re2 = new RegExp(s2, 'g');
  const rs1 = result.replace(re, '');
  return rs1.replace(re2, '$1');
};

const clearOtherEnv = function (result, env) {
  const envList = [];
  let ruleEnv = '';

  list.forEach(function (item) {
    if (item.env != env) {
      envList.push(item.env);
    }
  });

  ruleEnv = envList.join('|');

  const s = '<div[^>]*data-env="?(' + ruleEnv + ')"?.*?[^>]*>(.*?)</div>';
  const s2 = '<div[^>]*data-env=.*?[^>]*>(.*?)</div>';
  const re = new RegExp(s, 'g');
  const re2 = new RegExp(s2, 'g');
  const rs1 = result.replace(re, '');
  return rs1.replace(re2, '$1');
};
//端口替换
const portReplace = function (obj) {
  //list.forEach(obj => {
  const entryHtml = glob.sync(root + '/' + obj.title + '/**/*.html');
  const publicUrl = obj.url + config.appUrl;
  const baseUrl = publicUrl + 'assets';
  const env = obj.env;

  entryHtml.forEach((f) => {
    fs.readFile(f, 'utf8', function (err, data) {
      if (err) {
        throw err;
      }

      let result = data.replace(
        /(={1}(\")?(\')?)((\.)?\/assets\/)/gi,
        '$1' + baseUrl + '/'
      );
      result = result.replace(/\.\/assets\//gi, baseUrl + '/');
      result = result.replace(/<ctEnv>/gi, env);
      result = result.replace(/<ctVersion>/gi, config.appVersion);
      result = result.replace(
        /(={1}(\")?(\')?)((\.)?\/static\/)/gi,
        '$1' + baseUrl + '/'
      );

      result = result.replace(/<ctAppPublic>/g, publicUrl);
      result = clearEnv(result, env);
      result = clearOtherEnv(result, env);

      fs.writeFile(f, result, 'utf8', function (err) {
        if (err) {
          throw err;
        }
      });
    });
  });
  //});
};

//替换项目
const replaceHtml = function (env) {
  let newList = [];

  list.find((item) => {
    if (item.mode === env) {
      newList.push(item);
    }
  });
  if (!newList.length) {
    console.error('替换地址失败');
    return false;
  }

  newList.forEach((obj) => {
    portReplace(obj);
    console.log(obj.title + ' replace success!');
  });
};

module.exports.init = function (env) {
  replaceHtml(env);
};
