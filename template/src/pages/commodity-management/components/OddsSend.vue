<template>
  <dart-list-temp
    v-model="currentValue"
    :max="20"
    :rules="publicRules"
    :is-operation="!isEdit"
    :is-foot="!isEdit"
    ref="listRef"
    :default-data="{
      _id: id++,
      BatchNo: '',
      Name: '',
      GrantCount: 1,
      RoundGrantTotalCount: 1,
      CanSoldCount: '',
      Rate: '',
      oldID: '',
      loading: false,
      ls: 0,
    }"
  >
    <dart-list-temp-item prop="BatchNo" width="150px" label="批次编号">
      <template #default="scope">
        <dart-input
          :disabled="isEdit"
          v-model="scope.row.BatchNo"
          :readonly="scope.row.loading"
          input-type="num"
          clearable
          :maxlength="30"
          @blur="onChangeID(scope.row)"
          @clear="onChangeID(scope.row, true)"
        >
          <template #suffix v-if="scope.row.loading">
            <el-icon class="is-loading">
              <Loading />
            </el-icon>
          </template>
        </dart-input>
      </template>
    </dart-list-temp-item>
    <dart-list-temp-item label="名称" min-width="100px">
      <template #default="scope">
        <div v-html="scope.row.Name"></div>
      </template>
    </dart-list-temp-item>
    <dart-list-temp-item prop="GrantCount" width="120px" label="单次发放数量">
      <template #default="scope">
        <input-number
          :disabled="scope.row.CanSoldCount === ''"
          :precision="0"
          v-model="scope.row.GrantCount"
          :min="1"
          :max="getMaxNum(scope.row.CanSoldCount, maxGrantCount)"
          @change="
            (newValue, oldValue) => {
              onChangeGrantCount(newValue, oldValue, scope.row);
            }
          "
        />
      </template>
    </dart-list-temp-item>
    <dart-list-temp-item
      prop="RoundGrantTotalCount"
      width="120px"
      label="每轮发放总数"
    >
      <template #default="scope">
        <input-number
          :disabled="scope.row.CanSoldCount === ''"
          :precision="0"
          v-model="scope.row.RoundGrantTotalCount"
          :key="scope.row.DLTKEY + scope.row.GrantCount"
          :min="1"
          :max="getMaxNum(scope.row.CanSoldCount, maxRoundGrantTotalCount)"
          @change="
            (newValue, oldValue) => {
              onChangeRoundGrantTotalCount(newValue, oldValue, scope.row);
            }
          "
        />
      </template>
    </dart-list-temp-item>
    <dart-list-temp-item label="库存" align="center">
      <template #default="scope">
        <div v-html="scope.row.CanSoldCount"></div>
      </template>
    </dart-list-temp-item>
  </dart-list-temp>
</template>
<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue';
import InputNumber from '@/components/InputNumber.vue';
import { apiGetCouponByBatchNo } from '@/api/commodity-management';
import { TypeOddsValue } from '@/types/commodity-management';
import { ResponseInfo } from '@/types/index';
import { isNumber, isArray, debounce } from 'lodash-es';
import { getWinRateData, getRoundGrantTotalCount, getMaxNum } from './send';
interface OddsProps {
  value: Array<TypeOddsValue>;
  isEdit: boolean;
}

const props = withDefaults(defineProps<OddsProps>(), {
  value: () => [],
});
const emit = defineEmits(['update:modelValue', 'change']);
const maxGrantCount = 999;
const maxRoundGrantTotalCount = 99999;
const listRef = ref();
const id = ref(0);
//中奖率列表
const winList: any = {};
const currentValue = ref<Array<TypeOddsValue>>([]);
onMounted(() => {
  setTimeout(() => {
    currentValue.value = initDartList(props.value);
    setWinList(currentValue.value);
  }, 100);
});
watch(currentValue, (value) => {
  winRateDebounce(value);
});
const initDartList = (data: Array<TypeOddsValue>) => {
  const newData = data.map((element: TypeOddsValue) => {
    element._id = id.value++;
    return element;
  });
  return newData;
};
const checkID = (rule: any, value: any, callback: any) => {
  const isRepeat = checkBatchNoRepeat(value);
  if (isRepeat) {
    callback(new Error('批次号重复'));
    return;
  }

  callback();
};
const checkBatchNoRepeat = (id: string): boolean => {
  let isRepeat = 0;
  currentValue.value.forEach((item: TypeOddsValue) => {
    if (item.BatchNo === id) {
      isRepeat++;
    }
  });
  return isRepeat > 1;
};
const getRateNum = (id: number) => {
  const value = winList[id];
  return isNumber(value) ? value * 100 + '%' : '--';
};
//设置中奖率对象 数值
const setWinList = (data: Array<TypeOddsValue> | TypeOddsValue) => {
  if (isArray(data)) {
    data.forEach((element: TypeOddsValue) => {
      if (element._id) {
        winList[element._id] = element.Rate;
      }
    });
    return;
  }
  if (data) {
    if (data._id) {
      winList[data._id] = data.Rate;
    }
  }
};

const winRateAndNum = (sourceData: Array<TypeOddsValue>) => {
  const newData = getWinRateData(sourceData);
  setWinList(newData.data);

  emit('change', newData.data);
};
const winRateDebounce = debounce(winRateAndNum, 300);

const publicRules = {
  BatchNo: [
    { required: true, message: '请输入批次编号', trigger: 'blur' },
    { validator: checkID, trigger: 'blur' },
  ],
  GrantCount: [{ required: true, message: '单次发放数量', trigger: 'change' }],
  RoundGrantTotalCount: [
    { required: true, message: '每轮发放总数', trigger: 'change' },
  ],
};
const onChangeID = (item: TypeOddsValue, isClear?: boolean) => {
  if (item.BatchNo === item.oldID && item.BatchNo !== '') {
    return;
  }
  item.Name = '';
  item.GrantCount = 1;
  item.RoundGrantTotalCount = 1;
  item.CanSoldCount = '';
  item.Rate = '';
  item.oldID = '';
  if (!item.BatchNo || isClear || checkBatchNoRepeat(item.BatchNo)) {
    return;
  }

  item.loading = true;
  //赋值
  apiGetCouponByBatchNo({ BatchNo: item.BatchNo }, () => {
    item.loading = false;
  }).then((res: ResponseInfo) => {
    if (res.Code === 0) {
      item.Name = res.Data.Name;
      item.CanSoldCount = res.Data.Count;
      item.oldID = item.BatchNo;
    }
  });
};

const onChangeGrantCount = (newVal: number, oldValue: number, row: any) => {
  const r = row.RoundGrantTotalCount;
  const t = row.CanSoldCount;

  if (newVal < maxGrantCount && newVal < t) {
    row.RoundGrantTotalCount = getRoundGrantTotalCount(
      newVal,
      r,
      t,
      newVal > oldValue
    );
    return;
  }
  setTimeout(() => {
    const maxNum = maxGrantCount > t ? t : maxGrantCount;
    const maxNumR = maxRoundGrantTotalCount > t ? t : maxRoundGrantTotalCount;
    row.GrantCount = maxNum;
    row.RoundGrantTotalCount = row.RoundGrantTotalCount =
      getRoundGrantTotalCount(maxNum, r, maxNumR, newVal > oldValue);
  }, 1);
};
const onChangeRoundGrantTotalCount = (
  newVal: number,
  oldValue: number,
  row: any
) => {
  const g = row.GrantCount;
  const t = row.CanSoldCount;
  if (newVal % g === 0 && newVal <= t) {
    return;
  }
  setTimeout(() => {
    const maxNum = maxRoundGrantTotalCount > t ? t : maxRoundGrantTotalCount;
    row.RoundGrantTotalCount = getRoundGrantTotalCount(
      g,
      newVal,
      maxNum,
      newVal > oldValue
    );
  }, 1);
};
const getRef = () => {
  return listRef;
};

defineExpose({
  getRef,
});
</script>
<style lang="scss"></style>
