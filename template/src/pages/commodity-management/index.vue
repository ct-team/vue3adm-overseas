<template>
  <div>
    <Search @search="onSearch" ref="searchRef" />
    <Tool></Tool>
    <Table
      @open-edit="onOpenEdit"
      @page-change="onPageChange"
      :data="tableData"
      :loading="loading"
    ></Table>
    <router-view></router-view>
  </div>
</template>

<script lang="ts" setup>
import { ref, onBeforeUnmount, onMounted } from 'vue';
import Search from './Search.vue';
import Table from './Table.vue';
import Tool from './Tool.vue';
import { ResponseInfo } from '@/types/index.d';
import { TypeSearchInfo } from '@/types/commodity-management.d';
import {
  apiGetGoodsList,
  apiGetGoodsType,
  apiGetGrantType,
} from '@/api/commodity-management';
import useCommon from '@/hooks/use-common';
const { router, proxy } = useCommon();
const searchRef = ref();
const tableData = ref({});
const loading = ref(true);
let searchDataHistory: TypeSearchInfo = {};

const onSearch = (searchValue: TypeSearchInfo): void => {
  searchDataHistory = searchValue;
  refreshTable(searchValue, () => {
    (searchRef as any).value.setLoading(false);
  });
};

const onOpenEdit = (id: number): void => {
  routerPush('/edit', id);
};
const setTableLoading = (type: boolean) => {
  loading.value = type;
};
const onPageChange = (PageIndex: number) => {
  if (PageIndex > 0) {
    searchDataHistory.PageIndex = PageIndex;
  }

  refreshTable(searchDataHistory);
};
//刷新表格数据
const refreshTable = (data?: TypeSearchInfo, complete?: any) => {
  setTableLoading(true);
  const newData = data ? data : searchDataHistory;
  apiGetGoodsList(newData)
    .then((res: ResponseInfo) => {
      if (res.Code === 0) {
        tableData.value = res.Data;
      }
    })
    .catch(() => {
      tableData.value = [];
    })
    .then(() => {
      complete && complete();
      setTableLoading(false);
    });
};
const bindBusEvent = () => {
  proxy.$bus.on('refreshTable', (index: number) => {
    onPageChange(index);
  });
};
const routerPush = (path: string, id: number): void => {
  router.push({
    path,
    query: {
      id,
    },
  });
};

onBeforeUnmount(() => {
  proxy.$bus.off('refreshTable');
});
onMounted(() => {
  (searchRef as any).value.search();
});

bindBusEvent();
apiGetGoodsType();
apiGetGrantType();
</script>
