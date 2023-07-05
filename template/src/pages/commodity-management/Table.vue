<template>
  <dart-table
    :data="data.List"
    :loading="loading"
    border
    :page-size="data.PageSize"
    :page-total="data.RecordCount"
    :current-page="data.PageIndex"
    @page-current-change="onPageChange"
  >
    <el-table-column prop="GoodsId" width="100" label="商品ID" />
    <el-table-column prop="GoodsName" min-width="200" label="商品名称" />
    <el-table-column prop="GoodsTypeName" min-width="100" label="商品类型" />
    <el-table-column prop="GrantTypeName" width="100" label="发放类型" />
    <el-table-column
      prop="Worth"
      width="100"
      label="商品价值"
    ></el-table-column>
    <dart-table-column label="商品图片" prop="ImagePath" width="120">
      <template #default="scope">
        <el-image
          style="width: 100px; height: 50px"
          :src="scope.row.ImagePath"
        />
      </template>
      <template #header><div>123</div></template>
    </dart-table-column>
    <dart-table-column prop="CanSoldCount" label="可售数量" width="100" />
    <dart-table-column prop="SoldCount" label="已售数量" width="100" />
    <dart-table-column
      width="70"
      prop="GoodsState"
      label="可售状态"
      :formatter="stausFormatter"
    />
    <dart-table-column
      prop="UpdateUnixTime"
      label="最后操作时间"
      width="150"
      useType="date"
      useArg="dateTime"
    ></dart-table-column>
    <el-table-column prop="Operator" width="100" label="最后操作人" />
    <el-table-column label="数量预警" width="100">
      <template #default="scope">
        <el-switch
          v-model="scope.row.IsOpenWarning"
          width="75px"
          size="default"
          inline-prompt
          style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
          active-text="已启用"
          inactive-text="已禁用"
          @change="onVendEdit($event, scope.row.GoodsId)"
        />
      </template>
    </el-table-column>
    <el-table-column label="操作" width="150" fixed="right">
      <template #default="scope">
        <el-button
          icon="edit"
          type="text"
          @click="onEdit(scope.row.GoodsId)"
          v-if="proxy.$dart.permission.is('CMGoodsEdit')"
        >
          编辑
        </el-button>
        <el-popconfirm
          title="确定删除吗？"
          @confirm="onDel(scope.row)"
          v-if="
            scope.row.IsCanDelete && proxy.$dart.permission.is('CMGoodsEdit')
          "
        >
          <template #reference>
            <el-button
              :loading="scope.row._delLoading"
              type="text"
              icon="Delete"
            >
              删除
            </el-button>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </dart-table>
</template>

<script setup lang="ts">
import { SoldList } from '@/config/index';
import { showMessage } from '@/utils';
import { apiDeleteGoods, apiEditWarning } from '@/api/commodity-management';
import useCommon from '@/hooks/use-common';
import { ResponseInfo, TypeList } from '@/types';
import { TypeTableData } from '@/types/commodity-management';
const { proxy } = useCommon();
defineProps({
  data: { type: Object, default: () => {} },
  loading: Boolean,
});

// 声明emits
const emit = defineEmits(['open-view', 'open-edit', 'page-change']);
const stausFormatter = (row: TypeTableData) => {
  const item = SoldList.find((op: TypeList) => {
    return op.value === row.GoodsState;
  });
  return item ? item.key : '';
};

const onPageChange = (index: number) => {
  emit('page-change', index);
};
const onEdit = (id: number) => {
  emit('open-edit', id);
};
const onDel = (row: TypeTableData) => {
  row._delLoading = true;
  apiDeleteGoods(row.GoodsId).then((res: ResponseInfo) => {
    if (res.Code === 0) {
      showMessage('删除成功', 'success');
      proxy.$bus.emit('refreshTable');
      return;
    }
    row._delLoading = false;
  });
};
const onVendEdit = (value: boolean, goodsId: number) => {
  apiEditWarning({ IsOpen: value, GoodsId: goodsId }).then(
    (res: ResponseInfo) => {
      if (res.Code === 0) {
        showMessage('数量预警设置成功', 'success');
      }
    }
  );
};
</script>
