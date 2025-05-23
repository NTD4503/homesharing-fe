<template>
  <div class="flex-row flex gap-6">
    <ProvinceBtn
      v-for="item in locationData"
      :key="item.id"
      :image="item.image"
      :name="item.name"
      :province-id="item.ProvinceID"
    />
  </div>
</template>

<script>
import ProvinceBtn from "./ProvinceBtn/index.vue";
import { location as locationData } from "./const";

export default {
  components: {
    ProvinceBtn,
  },
  mounted() {
  },
  data() {
    return {
      locationData: locationData,
    };
  },
};
</script>

<style scoped></style>
