<template>
  <div class="t1">
    <el-upload
        ref="uploadRef"
        class="upload-demo"
        action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
        :auto-upload="false"
        list-type="picture"
    >

      <el-button type="primary">select file</el-button>


      <el-button class="ml-3" type="success" @click="submitUpload">
        upload to server
      </el-button>

      <template #tip>
        <div class="el-upload__tip">
          jpg/png files with a size less than 500kb
        </div>
      </template>
    </el-upload>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import type {UploadInstance} from 'element-plus'

const uploadRef = ref<UploadInstance>()

const submitUpload = () => {
  uploadRef.value!.submit()
}
</script>

<style scoped>
  .t1 {
    background: #f9f9f9;
    width: 500px;
    height: 500px;
  }
</style>
