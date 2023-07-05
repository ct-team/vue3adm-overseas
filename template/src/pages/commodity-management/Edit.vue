<template>
  <el-drawer size="70%" v-model="status" :title="title" @closed="onClosed">
    <div class="form-wrap" v-loading="slideLoading">
      <el-form
        :label-width="100"
        :model="formData.data"
        ref="formRef"
        :rules="formRules"
      >
        <el-form-item label="商品名称" prop="GoodsName">
          <el-input
            v-model="formData.data.GoodsName"
            clearable
            maxlength="30"
          ></el-input>
        </el-form-item>
        <el-form-item label="商品类型" prop="GoodsType">
          <el-select
            class="w200"
            v-model="formData.data.GoodsType"
            :disabled="isEdit"
          >
            <el-option
              v-for="item in stateGoodsType"
              :key="item.GoodsType"
              :label="item.Name"
              :value="item.GoodsType"
            ></el-option>
          </el-select>
        </el-form-item>
        <Send
          v-if="firstLoading"
          :GrantType="formData.data.GrantType"
          :GoodsDetail="formData.data.GoodsDetail"
          :TotalRound="formData.data.TotalRound"
          :CanSoldCount="formData.CanSoldCount"
          :isEdit="isEdit"
          @change="onSendChange"
          @changeCount="onSendCount"
        ></Send>
        <el-form-item label="预警数量" prop="WarningCount">
          <input-number
            class="w200"
            v-model="formData.data.WarningCount"
            :min="0"
            :max="formData.CanSoldCount"
            @change="onWarningCount"
          />
        </el-form-item>
        <el-form-item label="商品价值" prop="Worth">
          <input-number
            :disabled="isEdit"
            class="w200"
            v-model="formData.data.Worth"
            :min="0"
            :max="99999.9"
            :precision="1"
          />
          <span class="pl10 f14">元</span>
          <span class="color-gray ml10">此处为商品原价，非商品售价</span>
        </el-form-item>
        <el-form-item label="商品图片" prop="ImagePath">
          <ImageUploadVue
            :disabled="isEdit"
            v-model="formData.data.ImagePath"
            @change="onUploadChange"
          ></ImageUploadVue>
        </el-form-item>
        <el-form-item label="商品介绍" prop="Remark">
          <el-input
            v-model="formData.data.Remark"
            :autosize="{ minRows: 4, maxRows: 6 }"
            type="textarea"
            maxlength="300"
            show-word-limit
          />
        </el-form-item>
        <el-form-item>
          <el-button @click="status = false">取消</el-button>
          <el-button type="primary" @click="onSubmit">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-drawer>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, nextTick } from 'vue';
import ImageUploadVue from './components/ImageUpload.vue';
import { ResponseInfo } from '@/types/index.d';
import { apiEditGoods, apiGetGoodsDetail } from '@/api/commodity-management';
import InputNumber from '@/components/InputNumber.vue';
import Send from './components/Send.vue';
import type { FormInstance } from 'element-plus';
import { showMessage } from '@/utils';
import { ErrorCheckTip } from '@/config';
import { filtersGoodsDetail } from './components/send';
import useCommon from '@/hooks/use-common';
const { proxy, route, router, store } = useCommon();
const stateGoodsType = computed(() => store.state.goodsType);
const firstLoading = ref(false);
const slideLoading = ref(false);
const isEdit = route.meta.type === 'edit';
const title = !isEdit ? '新增' : '编辑';
const formRef = ref<FormInstance>();
const status = ref(true);
const id = Number(route.query.id);

const formData = reactive({
  data: {
    GoodsId: 0,
    GoodsName: '',
    GoodsType: '',
    GrantType: 1,
    WarningCount: 0,
    Worth: undefined,
    ImagePath: '',
    Remark: '',
    TotalRound: 0,
    GoodsDetail: [],
  },
  CanSoldCount: 0,
  RoundCanSoldCount: 0,
});
const formRules = {
  GoodsName: [{ required: true, message: '请填写商品名称', trigger: 'blur' }],
  GoodsType: [{ required: true, message: '请选择商品类型', trigger: 'change' }],
  WarningCount: [
    { required: true, message: '请填写预警数量', trigger: 'change' },
  ],
  Worth: [{ required: true, message: '请填写商品价值', trigger: 'change' }],
  ImagePath: [{ required: true, message: '请上传图片', trigger: 'change' }],
  Remark: [{ required: true, message: '请填写商品介绍', trigger: 'blur' }],
};
const onWarningCount = (num: number) => {
  setWarningCount(formData.CanSoldCount, false, num);
};
//设置预警数量
const setWarningCount = (
  TotalCount: number,
  isSetDefault: boolean,
  WarningCount: number
) => {
  if (isSetDefault) {
    const defaultNum = Math.floor(TotalCount * 0.2);
    formData.data.WarningCount = defaultNum;
    return;
  }
  if (WarningCount > TotalCount) {
    formData.data.WarningCount = TotalCount;
  }
};
const onSendCount = (item: any) => {
  if (isEdit) {
    return;
  }
  formData.CanSoldCount = item.total;
  formData.data.TotalRound = item.store;
  setWarningCount(item.total, true, 0);
};
const onUploadChange = () => {
  formRef?.value?.validateField('ImagePath');
};
const onSendChange = (type: 'GoodsDetail' | 'GrantType', value: any) => {
  if (isEdit) {
    return;
  }
  formData.data[type] = value;
};
const getEditInfo = (GoodsId: number) => {
  if (!isEdit) {
    firstLoading.value = true;
    return;
  }
  setSlideLoading(true);
  if (!GoodsId) {
    nextTick(() => {
      showMessage('编辑参数错误');
    });

    return;
  }

  apiGetGoodsDetail({ GoodsId }, () => {
    setSlideLoading(false);
  }).then((res) => {
    if (res.Code === 0) {
      const {
        GoodsId,
        GoodsName,
        GoodsType,
        GrantType,
        WarningCount,
        Worth,
        ImagePath,
        Remark,
        TotalRound,
        GoodsDetail,
        CanSoldCount,
        RoundCanSoldCount,
      } = res.Data;
      formData.data = {
        GoodsId,
        GoodsName,
        GoodsType,
        GrantType,
        WarningCount,
        Worth,
        ImagePath,
        Remark,
        TotalRound,
        GoodsDetail,
      };
      formData.CanSoldCount = CanSoldCount;
      formData.RoundCanSoldCount = RoundCanSoldCount;
    }
    firstLoading.value = true;
  });
};

const onSubmit = () => {
  setSlideLoading(true);
  formRef?.value?.validate((valid) => {
    if (valid) {
      const GoodsDetail = filtersGoodsDetail(
        formData.data.GoodsDetail,
        formData.data.GrantType
      );
      console.log(GoodsDetail, 'GoodsDetail');
      apiEditGoods({ ...formData.data, GoodsDetail }, () => {
        setSlideLoading(false);
      }).then((res: ResponseInfo) => {
        if (res.Code === 0) {
          showMessage('保存成功', 'success');
          const pageIndex = isEdit ? 0 : 1;
          proxy.$bus.emit('refreshTable', pageIndex);
          status.value = false;
        }
      });
      return;
    }
    showMessage(ErrorCheckTip);
    setSlideLoading(false);
  });
};
const setSlideLoading = (type: boolean): void => {
  slideLoading.value = type;
};

const onClosed = () => {
  router.push({
    path: '/',
  });
};

getEditInfo(id);
</script>
<style>
.color-gray {
  color: #8c939d;
  font-size: 12px;
}
</style>
