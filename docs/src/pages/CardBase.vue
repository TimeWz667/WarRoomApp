<template>
  <div class="card mb-2">
    <div v-if="title !== ''" class="card-header p-3 pt-2">
      <div class="col-6 d-flex align-items-center">
        <h6 class="mb-0">{{ title }}</h6>
      </div>
    </div>
    <div class="card-body p-3">
      <slot></slot>
    </div>
    <hr class="dark horizontal my-0" />
  </div>
</template>

<script>
export default {
  name: "card-base",
  props: {
    title: {
      type: String,
      default: "",
    },
  },
};
</script>
