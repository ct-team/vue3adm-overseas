import { TypeOddsValue, TypeCountItem } from '@/types/commodity-management.d';
import { isNumber } from 'lodash-es';
//可售数量计算 普通模式
export const publicMode = (
  GoodsDetail: Array<TypeOddsValue>
): TypeCountItem => {
  const result: Array<number> = [];
  GoodsDetail.forEach((item: any) => {
    if (isNumber(item.GrantCount) && isNumber(item.CanSoldCount)) {
      result.push(Math.floor(item.CanSoldCount / item.GrantCount));
      return;
    }
    result.push(-1);
  });
  const minRsult = Math.min(...result);
  const minTotal = minRsult >= 0 ? minRsult : 0;

  return { total: minTotal, store: 0, sale: 0 };
};
//可售数量计算 概率模式
export const oddoMode = (GoodsDetail: Array<TypeOddsValue>): TypeCountItem => {
  //库存
  const storeList = [];
  let sale = 0;
  for (const item of GoodsDetail) {
    if (
      !isNumber(item.CanSoldCount) ||
      !isNumber(item.GrantCount) ||
      !isNumber(item.RoundGrantTotalCount)
    ) {
      return { total: 0, store: 0, sale: 0 };
    }
    sale += item.RoundGrantTotalCount / item.GrantCount;
    storeList.push(Math.floor(item.CanSoldCount / item.RoundGrantTotalCount));
  }

  const store = Math.min(...storeList);
  const total = store * sale;
  return { total, store, sale };
};

//获取计算好的数据列表
export const getWinRateData = (
  sourceData: Array<TypeOddsValue>
): { isComplete: boolean; data: Array<TypeOddsValue> } => {
  //数据是否完整
  let isComplete = true;
  //每轮发放总数
  let lsCount = 0;
  let data: Array<TypeOddsValue> = sourceData.map((element: TypeOddsValue) => {
    if (
      isNumber(element.CanSoldCount) &&
      isNumber(element.GrantCount) &&
      isNumber(element.RoundGrantTotalCount)
    ) {
      const num = Math.floor(element.RoundGrantTotalCount / element.GrantCount);
      element.ls = num;
      lsCount += num;
    } else {
      element.ls = 0;
      isComplete = false;
    }

    return element;
  });
  if (!isComplete) {
    data = data.map((element: TypeOddsValue) => {
      element.ls = 0;
      element.Rate = '';

      return element;
    });
  }
  if (isComplete) {
    data = data.map((element: TypeOddsValue) => {
      if (element.ls) {
        element.Rate = Number((element.ls / lsCount).toFixed(4));
      }
      return element;
    });
  }
  return { isComplete, data };
};

//获取每轮总数 按 单次倍数 计算
// eslint-disable-next-line
export const getRoundGrantTotalCount = (
  GrantCount: number,
  RoundGrantTotalCount: number,
  maxTotalCount: number, //
  isAdd: boolean
): number => {
  let roundGrantTotalCount = RoundGrantTotalCount;
  const r = RoundGrantTotalCount;
  const t = maxTotalCount;
  const g = GrantCount;
  //最大每轮发放次数
  const maxNum = Math.floor(t / g) * g;
  if (r < g) {
    roundGrantTotalCount = g;
  }
  //余数
  const modNum = r % g;
  if (r > g && modNum > 0) {
    let roundNum: number = parseInt((r / g).toString());
    roundNum = isAdd ? roundNum + 1 : roundNum;
    roundGrantTotalCount = roundNum * g;
  }
  if (roundGrantTotalCount > maxNum) {
    roundGrantTotalCount = maxNum;
  }
  return roundGrantTotalCount;
};

//过滤商品详细
export const filtersGoodsDetail = (
  data: Array<TypeOddsValue>,
  grantType: number
): Array<TypeOddsValue> => {
  const result: Array<TypeOddsValue> = [];
  if (grantType === 1) {
    data.forEach((element: TypeOddsValue) => {
      const item = {
        BatchNo: element.BatchNo,
        Name: element.Name,
        GrantCount: element.GrantCount,
      };
      result.push(item);
    });
  }
  if (grantType === 2) {
    data.forEach((element: TypeOddsValue) => {
      const item = {
        BatchNo: element.BatchNo,
        Name: element.Name,
        GrantCount: element.GrantCount,
        RoundGrantTotalCount: element.RoundGrantTotalCount,
        Rate: element.Rate,
      };
      result.push(item);
    });
  }
  return result;
};

export const getMaxNum = (
  CanSoldCount: number | string,
  maxSendNum: number
): number => {
  const n = Number(CanSoldCount);
  if (!n) {
    return 1;
  }
  return n > maxSendNum ? maxSendNum : n;
};
