export interface TypeSearchInfo {
  GoodsName?: string;
  GoodsId?: number | string;
  GoodsType?: number | string;
  GrantType?: number | string;
  GoodsState?: number | string;
  PageIndex?: number | null;
  PageSize?: number | null;
  IsCanDelete?: number | null;
}

export interface TypeOddsValue {
  _id?: number;
  BatchNo: string;
  Name: string;
  GrantCount: number;
  RoundGrantTotalCount?: number;
  Rate?: number | string;
  CanSoldCount?: number | string;
  total?: number | string;
  odds?: number | string;
  oldID?: string;
  loading?: boolean;
  ls?: number;
}

export interface TypeTableData {
  GoodsState: number;
  _delLoading?: boolean;
  GoodsId: number;
}

export interface TypeAlertSetting {
  UserName: string;
  Email: string;
  Phone: number;
}

export interface TypeCountItem {
  total: number;
  store: number;
  sale: number;
}
export interface TypeSendProps {
  GrantType: number;
  TotalRound: number;
  CanSoldCount: number;
  isEdit: boolean;
  GoodsDetail: Array<TypeOddsValue>;
}
export interface TypeCompleteFun {
  (any: any): void;
}

export interface TypeAnyObject {
  [propName: string]: string;
}
export interface TypeFormData {
  GoodsId: number;
  GoodsName: string;
  GoodsType: number | string;
  GrantType: number;
  WarningCount: number;
  Worth: number | undefined;
  ImagePath: string;
  Remark: string;
  TotalRound: number;
  GoodsDetail: Array<TypeOddsValue>;
}
