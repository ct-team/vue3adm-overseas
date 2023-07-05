import { commonApi } from '@/api/interface';
import { TypeCompleteFun } from '@/types/commodity-management.d';
import { Http } from 'ct-dart3';

//获取所属页面
export const apiGetPower = (
  id: number,
  complete?: TypeCompleteFun
): Promise<any> => {
  return Http.ajax({
    method: 'get',
    url: commonApi.GetPower,
    data: { pageId: id },
    complete,
  });
};
