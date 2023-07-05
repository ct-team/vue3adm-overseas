<template>
  <dart-list-temp
    v-model="currentValue"
    :max="20"
    :rules="publicRules"
    :is-operation="!isEdit"
    :is-foot="!isEdit"
    ref="listRef"
    :default-data="{
      BatchNo: '',
      Name: '',
      GrantCount: 1,
      CanSoldCount: '',
      oldID: '',
      loading: false,
      odds: '',
    }"
  >
    <dart-list-temp-item prop="BatchNo" width="180px" label="批次编号">
      <template #default="scope">
        <dart-input
          v-model="scope.row.BatchNo"
          :readonly="scope.row.loading"
          :disabled="isEdit"
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
    <dart-list-temp-item label="名称" min-width="180px">
      <template #default="scope">
        <div v-html="scope.row.Name"></div>
      </template>
    </dart-list-temp-item>
    <dart-list-temp-item prop="GrantCount" width="120px" label="发放数量">
      <template #default="scope">
        <input-number
          :disabled="scope.row.CanSoldCount === ''"
          :precision="0"
          v-model="scope.row.GrantCount"
          :min="1"
          :max="getMaxNum(scope.row.CanSoldCount, maxSendNum)"
        />
      </template>
    </dart-list-temp-item>

    <dart-list-temp-item label="库存" width="150px" align="center">
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
import { debounce } from 'lodash-es';
import { getMaxNum } from './send';
interface OddsProps {
  value: Array<TypeOddsValue>;
  isEdit: boolean;
}
const props = withDefaults(defineProps<OddsProps>(), {
  value: () => [],
});
const emit = defineEmits(['update:modelValue', 'change']);
const currentValue = ref<Array<TypeOddsValue>>([]);
const listRef = ref();
const maxSendNum = 999;

onMounted(() => {
  setTimeout(() => {
    currentValue.value = props.value;
  }, 100);
});
watch(currentValue, (value) => {
  publicDebounce(value);
});
const changeEmit = (value: Array<TypeOddsValue>) => {
  emit('change', value);
};
const publicDebounce = debounce(changeEmit, 300);

const checkID = (rule: any, value: any, callback: any) => {
  let isRepeat = 0;
  currentValue.value.forEach((item: TypeOddsValue) => {
    if (item.BatchNo === value) {
      isRepeat++;
    }
  });

  if (isRepeat > 1) {
    callback(new Error('批次号重复'));
    return;
  }

  callback();
};
const publicRules = {
  BatchNo: [
    { required: true, message: '请输入批次编号', trigger: 'blur' },
    { validator: checkID, trigger: 'blur' },
  ],
  GrantCount: [
    { required: true, message: '请输入发放数量', trigger: 'change' },
  ],
};
const onChangeID = (item: TypeOddsValue, isClear?: boolean) => {
  if (item.BatchNo === item.oldID && item.BatchNo !== '') {
    return;
  }
  item.Name = '';
  item.CanSoldCount = '';
  item.GrantCount = 1;
  item.odds = '';
  item.oldID = '';
  if (isClear || item.BatchNo === '') {
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

const getRef = () => {
  return listRef;
};

defineExpose({
  getRef,
});
</script>
<style lang="scss"></style>
