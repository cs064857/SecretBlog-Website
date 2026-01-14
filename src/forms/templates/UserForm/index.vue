<template>
  <FormWrapper :schema="userSchema">
    <DynamicFields :fields="formFields" />
    <FormActions />
  </FormWrapper>
</template>

<script setup lang="ts">
// 目前此模板提供預設空設定，避免在未注入 schema/fields 前阻擋建置。
const userSchema: unknown[] = []
const formFields: unknown[] = []
</script>