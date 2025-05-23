<template>
  <div class="border p-4 rounded-lg">
    <div>
      <span class="font-bold text-xl">{{ title }}</span>
    </div>
    <ul class="flex flex-wrap">
      <li v-for="(category, index) in list" :key="index" class="w-1/2">
        <div
          class="block py-2 px-4 text-black cursor-pointer hover:text-red-500 relative border-b border-dashed link-with-arrow inline-block w-full"
          @click="navigate(category)"
        >
          <div
            v-if="
              category.min_price !== undefined &&
              category.max_price !== undefined
            "
          >
            <span v-if="category.min_price === 0">
              Dưới {{ category.max_price }} triệu</span
            >
            <span v-else-if="category.min_price === category.max_price">
              Trên {{ category.max_price }} triệu
            </span>
            <span v-else>
              {{ category.min_price }} triệu - {{ category.max_price }} triệu
            </span>
          </div>

          <div
            v-else-if="
              category.min_area !== undefined && category.max_area !== undefined
            "
          >
            <span v-if="category.min_area === 0"
              >Dưới {{ category.max_area }}m²</span
            >
            <span v-else-if="category.min_area === category.max_area">
              Trên {{ category.max_area }} m²
            </span>
            <span v-else>
              {{ category.min_area }}m² - {{ category.max_area }}m²
            </span>
          </div>
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
      const currentQueryParams = { ...this.$router.currentRoute.query };

      if (category.min_price >= 0 && category.max_price) {
        currentQueryParams.minPrice = category.min_price;
        currentQueryParams.maxPrice = category.max_price;
      } else if (category.min_area >= 0 && category.max_area) {
        currentQueryParams.minArea = category.min_area;
        currentQueryParams.maxArea = category.max_area;
      }
      this.$router.push({
        path: "/search",
        query: currentQueryParams,
      });
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
