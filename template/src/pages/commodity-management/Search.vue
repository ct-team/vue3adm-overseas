<template>
  <dart-search ref="searchRef">
    <template #search-form>
      <dart-search-item label="商品名称">
        <el-input v-model="formData.GoodsName" clearable></el-input>
      </dart-search-item>
      <dart-search-item label="商品ID">
        <el-input v-model="formData.GoodsId" clearable></el-input>
      </dart-search-item>
      <dart-search-item label="商品类型">
        <el-select v-model="formData.GoodsType" clearable>
          <el-option
            v-for="item in stateGoodsType"
            :key="item.GoodsType"
            :label="item.Name"
            :value="item.GoodsType"
          ></el-option>
        </el-select>
      </dart-search-item>
      <dart-search-item label="发放类型">
        <el-select v-model="formData.GrantType" clearable>
          <el-option
            v-for="item in stateGrantType"
            :key="item.GrantType"
            :label="item.Name"
            :value="item.GrantType"
          ></el-option>
        </el-select>
      </dart-search-item>
      <dart-search-item label="可售状态">
        <el-select v-model="formData.GoodsState" clearable>
          <el-option
            v-for="item in SoldList"
            :key="item.value"
            :label="item.key"
            :value="item.value"
          ></el-option>
        </el-select>
      </dart-search-item>
    </template>
    <template #search-btn>
      <el-button
        type="primary"
        native-type="submit"
        icon="search"
        :loading="loading"
        @click="onSubmit"
      >
        查询
      </el-button>
    </template>
  </dart-search>
</template>

<script lang="ts" setup>
import { ref, reactive, computed } from 'vue';
import { TypeSearchInfo } from '@/types/commodity-management.d';
import { SoldList } from '@/config/index';
import useCommon from '@/hooks/use-common';
const { store } = useCommon();
const stateGoodsType = computed(() => store.state.goodsType);
const stateGrantType = computed(() => store.state.grantType);
const emit = defineEmits(['search']);
const searchRef = ref();
const formData = reactive<TypeSearchInfo>({
  GoodsName: '',
  GoodsId: '',
  GoodsType: '',
  GrantType: '',
  GoodsState: '',
  PageIndex: 1,
  PageSize: 10,
  IsCanDelete: 0,
});

const loading = ref(false);
const onSubmit = (): void => {
  setLoading(true);
  search();
};

const setLoading = (flag: boolean): void => {
  loading.value = flag;
};
const search = () => {
  emit('search', formData);
};
defineExpose({
  setLoading,
  search,
});
</script>
