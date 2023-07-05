<template>
  <el-upload
    class="avatar-uploader"
    :action="commodityManagementApi.UpLoadImage"
    :show-file-list="false"
    :accept="accept"
    name="imagefile"
    :on-success="onAvatarSuccess"
    :on-error="onError"
    :before-upload="onBeforeAvatarUpload"
  >
    <img v-if="imageUrl" :src="imageUrl" class="avatar" />
    <template v-else>
      <el-icon v-if="!loading" class="avatar-uploader-icon"><Plus /></el-icon>
      <el-icon v-if="loading" class="is-loading avatar-uploader-icon">
        <Loading />
      </el-icon>
    </template>

    <template #tip>
      <div class="color-gray">
        支持jpg\jpeg\png\gif格式图片上传，大小限制500k
      </div>
    </template>
  </el-upload>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue';
import { commodityManagementApi } from '@/api/interface';
import type { UploadProps } from 'element-plus';
import { showMessage } from '@/utils';
const emit = defineEmits(['update:modelValue', 'change']);
const props = defineProps({
  modelValue: String,
});
const loading = ref(false);
const accept = '.jpg,.jpeg,.png,.gif';
const imageUrl = computed({
  get: () => {
    return props.modelValue;
  },
  set: (value) => {
    emit('update:modelValue', value);
    emit('change', value);
  },
});

const onError = (error: any) => {
  showMessage(error);
  loading.value = false;
};
const onAvatarSuccess: UploadProps['onSuccess'] = (res) => {
  loading.value = false;
  if (res.Code === 0) {
    imageUrl.value = res.Data;
    return;
  }
  showMessage(res.Message);
  imageUrl.value = '';
};
const isExt = (fileName: string, ext: string) => {
  if (!ext) {
    return true;
  }
  const m = ext.split(',');
  const fileExt = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();

  for (let i = 0; i < m.length; i++) {
    if (fileExt === m[i]) {
      return true;
    }
  }
  return false;
};
const onBeforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (!isExt(rawFile.name, accept)) {
    showMessage('上传正确格式的图片');
    return false;
  }
  if (rawFile.size / 1024 > 500) {
    showMessage('上传图片大小不能超过 500KB!');
    return false;
  }
  loading.value = true;
  return true;
};
</script>
<style lang="scss">
.avatar-uploader .avatar {
  width: 200px;
  height: 100px;
  display: block;
}
.avatar-uploader .el-upload {
  border: 1px dashed #ccc;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 200px;
  height: 100px;
  text-align: center;
}
</style>
