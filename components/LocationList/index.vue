<template>
  <div class="border p-4 rounded-lg">
    <div>
      <ul class="grid grid-cols-6 gap-4 mt-4">
        <li v-for="(category, index) in list" :key="index">
          <button
            @click="navigateToCategory(category)"
            class="block py-2 px-4 text-blue-500 hover:text-red-500"
          >
            {{ category.name }}
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  props: {
    list: {
      required: true,
    },
  },
  computed: {
    ...mapState([]),
    storedProvince() {
      return this.decodeSelectedLocation(this.$route.query.codes)[0] || null;
    },
  },
  methods: {
    navigateToCategory(category) {
      let newLocations;
      if (category.ProvinceID && category.DistrictID) {
        newLocations = [category.ProvinceID, category.DistrictID];
      } else {
        const storedProvince = this.storedProvince;
        newLocations = [storedProvince, category.DistrictID, category.WardCode];
      }
      const currentQueryParams = { ...this.$router.currentRoute.query };
      currentQueryParams.codes = this.encodeSelectedLocation(newLocations);
      this.$router.push({
        path: "/search",
        query: currentQueryParams,
      });
    },

    decodeSelectedLocation(selectedProvinceIds) {
      return JSON.parse(decodeURIComponent(selectedProvinceIds));
    },

    encodeSelectedLocation(selectedProvinceIds) {
      return encodeURIComponent(JSON.stringify(selectedProvinceIds));
    },
  },
};
</script>

<style scoped>
.grid {
  display: grid;
}
</style>
