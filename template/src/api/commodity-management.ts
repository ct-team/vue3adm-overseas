import { commodityManagementApi } from '@/api/interface';
import store from '@/store';
import { ResponseInfo } from '@/types/index.d';
import {
  TypeAlertSetting,
  TypeSearchInfo,
  TypeCompleteFun,
  TypeFormData,
} from '@/types/commodity-management.d';
import { Http } from 'ct-dart3';

//添加预警配置
export const apiAddWarningConfig = (
  params: Array<TypeAlertSetting>,
  complete: TypeCompleteFun
): Promise<any> => {
  return Http.ajax({
    method: 'post',
    url: commodityManagementApi.AddWarningConfig,
    data: params,
    complete: complete,
  });
};

//获取预警配置
export const apiGetWarningConfig = (
  complete?: TypeCompleteFun
): Promise<any> => {
  return Http.ajax({
    method: 'get',
    url: commodityManagementApi.GetWarningConfig,
    complete: complete,
  });
};

//获取商品列表
export const apiGetGoodsList = (
  params: TypeSearchInfo,
  complete?: TypeCompleteFun
): Promise<any> => {
  return Http.ajax({
    method: 'get',
    url: commodityManagementApi.GetGoodsList,
    data: params,
    complete: complete,
  });
};

//获取商品列表
export const apiDeleteGoods = (GoodsId: number): Promise<any> => {
  return Http.ajax({
    method: 'get',
    url: commodityManagementApi.DeleteGoods,
    data: { GoodsId },
  });
};

//获取商品类型
export const apiGetGoodsType = (): void => {
  Http.ajax({
    method: 'get',
    url: commodityManagementApi.GetGoodsType,
  }).then((res: ResponseInfo) => {
    if (res.Code === 0) {
      store.state.goodsType = res.Data;
    }
  });
};
//获取发放类型
export const apiGetGrantType = (): void => {
  Http.ajax({
    method: 'get',
    url: commodityManagementApi.GetGrantType,
  }).then((res: ResponseInfo) => {
    if (res.Code === 0) {
      store.state.grantType = res.Data;
    }
  });
};

//获取某批次优惠券信息
export const apiGetCouponByBatchNo = (
  params: { BatchNo: string | number },
  complete: TypeCompleteFun
): Promise<any> => {
  return Http.ajax({
    method: 'get',
    url: commodityManagementApi.GetCouponByBatchNo,
    data: params,
    complete: complete,
  });
};
//获取商品
// export const apiGetCanAddGoodsList = (
//   params: any,
//   complete?: TypeCompleteFun
// ): Promise<any> => {
//   return Http.ajax({
//     method: 'get',
//     url: commodityManagementApi.GetCanAddGoodsList,
//     data: params,
//     complete,
//   });
// };

//编辑新增

export const apiEditGoods = (
  params: TypeFormData,
  complete?: TypeCompleteFun
): Promise<any> => {
  return Http.ajax({
    method: 'post',
    url: commodityManagementApi.EditGoods,
    data: params,
    complete,
  });
};

//获取商品详情
export const apiGetGoodsDetail = (
  params: { GoodsId: number },
  complete?: TypeCompleteFun
): Promise<any> => {
  return Http.ajax({
    method: 'get',
    url: commodityManagementApi.GetGoodsDetail,
    data: params,
    complete,
  });
};
//预警开关
export const apiEditWarning = (
  params: { IsOpen: boolean; GoodsId: number },
  complete?: TypeCompleteFun
): Promise<any> => {
  return Http.ajax({
    method: 'post',
    url: commodityManagementApi.EditWarning,
    data: params,
    complete,
  });
};
