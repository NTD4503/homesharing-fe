<template>
  <div class="border p-4 rounded-lg">
    <div>
      <span class="font-bold text-xl">{{ title }}</span>
    </div>
    <ul>
      <li v-for="(category, index) in list" :key="index">
        <div
          class="block py-2 px-4 text-black cursor-pointer hover:text-red-500 relative border-b border-dashed link-with-arrow"
          @click="navigate(category)"
        >
          <span>{{ category.name }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  props: {
    title: {
      required: true,
    },
    list: {
      required: true,
    },
  },
  computed: {
    ...mapState({}),
  },
  methods: {
    navigate(category) {
      if (category.ProvinceID && category.DistrictID) {
        let encodedLocation = this.encodeSelectedLocation([
          category.ProvinceID,
          category.DistrictID,
        ]);
        this.$router.push({
          path: "/search",
          query: {
            codes: encodedLocation,
          },
        });
      } else if (category.room_type_name) {
        const currentQueryParams = { ...this.$router.currentRoute.query };
        currentQueryParams.roomType = category.room_type_name;
        this.$router.push({
          path: "/search",
          query: currentQueryParams,
        });
      }
    },
    encodeSelectedLocation(selectedProvinceIds) {
      return encodeURIComponent(JSON.stringify(selectedProvinceIds));
    },
  },
};
</script>

<style scoped>
.link-with-arrow::before {
  content: ">";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  margin-left: 1rem;
  color: #000;
}

.link-with-arrow span {
  padding-left: 1rem;
}
</style>
