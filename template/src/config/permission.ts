export const config: any = {
  CM: {
    pageId: 69130101,
    title: '商品管理',
    view: 69110101,
    data: {
      CMGoodsEdit: 69110102,
      CMSetEdit: 69110103,
    },
  },
  LM: {
    pageId: 69130102,
    title: '商品列表管理',
    view: 69110201,
    data: {
      LMListEdit: 69110202,
      LMSelfPageEdit: 69110203,
    },
  },
  OD: {
    pageId: 69130103,
    title: '订单明细',
    view: 69110301,
    data: {
      ODExport: 69110302,
    },
  },
};

export const isView = (pageid: number, list: Array<number>) => {
  if (!pageid || !list) {
    return false;
  }
  for (const key in config) {
    const item = config[key];
    if (item.pageId === pageid) {
      return list.indexOf(item.view) >= 0;
    }
  }
  return false;
};

export const alias = () => {
  let result = {};
  for (const key in config) {
    result = { ...result, ...config[key].data };
  }
  return result;
};
