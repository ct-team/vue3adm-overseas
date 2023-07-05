<template>
  <el-row class="mb10">
    <el-col :span="12">
      <el-button
        icon="Setting"
        @click="onAlert"
        v-if="proxy.$dart.permission.is('CMSetEdit')"
      >
        预警配置
      </el-button>
    </el-col>
    <el-col :span="12" class="tr">
      <el-button
        icon="Plus"
        @click="onAdd"
        v-if="proxy.$dart.permission.is('CMGoodsEdit')"
      >
        添加商品
      </el-button>
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import useCommon from '@/hooks/use-common';
const { router, proxy } = useCommon();
const routerPush = (path: string, id?: number): void => {
  router.push({
    path,
    query: {
      id,
    },
  });
};
const onAdd = (): void => {
  routerPush('/add');
};
const onAlert = () => {
  routerPush('/alert-setting');
};
</script>
