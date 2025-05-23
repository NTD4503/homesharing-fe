<template>
  <div
    :class="'border shadow-md  text-blue-700 rounded-lg cursor-pointer transition duration-300 transform hover:scale-105'"
    @click="handleFilterProvince"
  >
    <img
      :src="image"
      :alt="name"
      class="w-[190px] h-[110px] object-cover rounded-tl-md rounded-tr-md"
    />
    <div class="font-medium p-2 text-center">
      <span class="block py-2 px-4 text-blue-500 text-lg">{{ name }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProvinceBtn",
  props: {
    name: String,
    image: String,
    provinceId: String,
  },
  methods: {
    handleFilterProvince() {
      const encodedLocation = this.encodeSelectedLocation([this.provinceId]);
      localStorage.removeItem("filters");
      const filters = {
        selectedApartmentType: "all",
        selectedLocation: [this.provinceId],
        priceRange: [0, 5],
        areaRange: [0, 200],
      };
      localStorage.setItem("filters", JSON.stringify(filters));
      this.$router.push(`/search?codes=${encodedLocation}`);
    },
    encodeSelectedLocation(selectedProvinceIds) {
      return encodeURIComponent(JSON.stringify(selectedProvinceIds));
    },
  },
};
</script>

<style scoped></style>
