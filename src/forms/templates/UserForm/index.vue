<template>
  <FormWrapper :schema="userSchema">
    <DynamicFields :fields="formFields" />
    <FormActions />
  </FormWrapper>
</template> 