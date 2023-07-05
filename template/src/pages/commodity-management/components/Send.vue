<template>
  <div>
    <el-form-item
      label="发放类型"
      prop="GoodsDetail"
      ref="formItemRef"
      :rule="rules"
    >
      <el-radio-group
        :disabled="isEdit"
        v-model="currentGrantType"
        @change="onSendTypeChange"
        class="mb10"
      >
        <el-radio
          v-for="item in stateGrantType"
          :key="item.GrantType"
          :label="item.GrantType"
        >
          <div v-html="item.Name"></div>
        </el-radio>
      </el-radio-group>
      <div>
        <template v-if="currentGrantType === 1">
          <PublicSend
            :value="currentGoodsDetail"
            @change="onSendChange"
            ref="publicSendRef"
            :isEdit="isEdit"
          ></PublicSend>
        </template>
        <template v-if="currentGrantType === 2">
          <OddsSend
            :value="currentGoodsDetail"
            @change="onSendChange"
            ref="OddsSendRef"
            :isEdit="isEdit"
          ></OddsSend>
        </template>
      </div>
    </el-form-item>
    <el-form-item label="可售数量">
      <template v-if="currentGrantType === 1">
        <div v-html="count.total"></div>
        <div class="color-gray">
          商品最多可售卖的数量，根据计算 【库存/发放数量】
          的最小值，向下取整获得
        </div>
      </template>
      <template v-if="currentGrantType === 2">
        <div>
          <span v-html="count.total"></span>
        </div>
        <div class="color-gray">
          商品最多可售卖的数量，每轮最多可售：【∑(每轮发放总数/单次发放数量)】
          ；库存最多支持轮数：【MIN(库存/每轮发放总数) 向下取整】
        </div>
      </template>
    </el-form-item>
  </div>
</template>
<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import PublicSend from './PubicSend.vue';
import OddsSend from './OddsSend.vue';
import { TypeOddsValue, TypeCountItem } from '@/types/commodity-management';
import { publicMode, oddoMode } from './send';
import { debounce } from 'lodash-es';
import useCommon from '@/hooks/use-common';
const props = defineProps({
  GrantType: Number,
  TotalRound: Number,
  CanSoldCount: Number,
  isEdit: Boolean,
  GoodsDetail: { type: Array, default: () => [] },
});
const emit = defineEmits(['change', 'change-count']);
const { store } = useCommon();
const publicSendRef = ref();
const OddsSendRef = ref();
const count = ref<TypeCountItem>({ total: 0, store: 0, sale: 0 });
const stateGrantType = computed(() => store.state.grantType);
const formItemRef = ref();
const currentGrantType = computed({
  get: () => {
    return props.GrantType;
  },
  set: (value) => {
    emit('change', 'GrantType', value);
  },
});
const currentGoodsDetail = ref<Array<TypeOddsValue>>(
  props.GoodsDetail as Array<TypeOddsValue>
);
watch(currentGoodsDetail, (value) => {
  emit('change', 'GoodsDetail', value);
  vendibilityNumComputed();
});

const changeCount = (data: TypeCountItem) => {
  count.value = data;
  emit('change-count', data);
};
//可售数量计算;
const vendibilityNum = () => {
  let result = { total: 0, sale: 0, store: 0 };
  if (currentGoodsDetail.value.length === 0) {
    changeCount(result);
    return;
  }
  if (currentGrantType.value === 1) {
    result = publicMode(currentGoodsDetail.value);
  } else {
    result = oddoMode(currentGoodsDetail.value);
  }
  changeCount(result);
};
const vendibilityNumComputed = debounce(vendibilityNum, 300);
const rules = [
  { required: true, message: '请添加发放商品', trigger: 'blur' },
  {
    validator: (rule: any, value: any, callback: any) => {
      let domRef = null;

      if (currentGrantType.value === 1) {
        domRef = publicSendRef.value.getRef();
      } else {
        domRef = OddsSendRef.value.getRef();
      }
      if (count.value.total === 0) {
        callback(new Error('商品配置有错误'));
        return;
      }

      domRef.value
        .validate()
        .then(() => {
          callback();
        })
        .catch(() => {
          callback(new Error('商品配置有错误'));
        });
    },
    trigger: 'blur',
  },
];
const clearValidate = () => {
  formItemRef?.value?.clearValidate();
};
const onSendChange = (value: Array<TypeOddsValue>) => {
  currentGoodsDetail.value = value;

  clearValidate();
};
const onSendTypeChange = () => {
  currentGoodsDetail.value = [];
  changeCount({ total: 0, sale: 0, store: 0 });
  clearValidate();
};
</script>
<style lang="scss"></style>
