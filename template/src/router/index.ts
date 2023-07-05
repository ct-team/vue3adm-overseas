import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import { config } from '@/config/permission';
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('@/pages/commodity-management/index.vue'),
    meta: { pageid: config.CM.pageId, title: config.CM.title },
    children: [
      {
        path: 'add',
        component: () => import('@/pages/commodity-management/Edit.vue'),
        meta: { type: 'add' },
      },
      {
        path: 'edit',
        component: () => import('@/pages/commodity-management/Edit.vue'),
        meta: { type: 'edit' },
      },
      {
        path: 'alert-setting',
        component: () =>
          import('@/pages/commodity-management/AlertSetting.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
