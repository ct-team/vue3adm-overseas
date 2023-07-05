import { createApp } from 'vue';
import mitt from 'mitt';
import App from './App.vue';
import router from '../../router';
import store from '../../store';
import ElementPlus, { ElMessage } from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
//import '../../assets/css/skin.scss';
import * as ElementPlusIconsVue from '@/assets/js/icon';
import { clearEmptyData } from '@/utils';
import { apiGetPower } from '@/api/common';
import { alias, isView } from '@/config/permission';
import { isString } from 'lodash-es';
import { ResponseInfo } from '@/types';
import {
  Toolbar,
  Search,
  SearchItem,
  Http,
  Permission,
  ListTemp,
  ListTempItem,
  Table,
  TableColumn,
  Input,
} from 'ct-dart3';

const app = createApp(App);
app.config.globalProperties.$bus = mitt();
const showErrorMessage = (msg: string) => {
  ElMessage({
    message: msg || 'error',
    type: 'error',
  });
};

app
  .use(ElementPlus, { size: 'small', zIndex: 3000, locale: zhCn })
  .use(ElementPlusIconsVue)
  .use(Toolbar)
  .use(Search)
  .use(SearchItem)
  .use(ListTemp)
  .use(ListTempItem)
  .use(Table)
  .use(TableColumn)
  .use(Input)
  .use(Http, {
    requestInterceptor(opts: any) {
      opts.params = clearEmptyData(opts.params);
      opts.data = clearEmptyData(opts.data);
    },
    interceptError(res: ResponseInfo) {
      const data: any = JSON.parse(JSON.stringify(res).toLowerCase());
      showErrorMessage(data.message);
    },
    interceptorSuccess(res: ResponseInfo) {
      const data: any = JSON.parse(JSON.stringify(res).toLowerCase());
      // 对响应成功数据做点什么
      if (data.code !== 0) {
        showErrorMessage(data.message);
      }
    },
    timeout: 60000,
  })
  .use(Permission, {
    //设置权限别名
    alias: alias(),
    router: router,
  })
  .use(store)
  .use(router);
app.mount('#app');

let PermissionPageId = 0;

router.beforeEach(async (to) => {
  const pageid = Number(to.meta.pageid);
  if (isString(to.meta.title)) {
    document.title = to.meta.title;
  }
  if (pageid && PermissionPageId !== pageid) {
    await apiGetPower(pageid)
      .then((res: ResponseInfo) => {
        if (res.Code === 0) {
          Permission.success(res.Data);
          PermissionPageId = pageid;
          if (!isView(pageid, res.Data)) {
            Permission.go403();
          }
          return true;
        }
        Permission.go403();
        return false;
      })
      .catch(function () {
        showErrorMessage('权限获取错误');
        return false;
      });
    return true;
  }
  return true;
});
