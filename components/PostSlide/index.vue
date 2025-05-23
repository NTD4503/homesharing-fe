<template>
  <div class="flex h-[400px]">
    <div
      v-for="post in posts"
      :key="post.post_id"
      @click="$router.push(`/${post.post_id}`)"
      class="cursor-pointer rounded-lg overflow-hidden w-full border border-gray-300 mr-5"
    >
      <img :src="post.images[0]" alt="Post Image" class="h-[200px] w-full" />
      <div class="p-4 flex flex-col justify-between flex-grow">
        <div>
          <h2 class="text-lg font-bold text-gray-800">
            {{ truncatedTitle(post) }}
          </h2>
          <p class="text-sm text-gray-600">
            <i class="fa fa-map-marker mr-2" aria-hidden="true"></i>
            {{ truncatedLocation(post) }}
          </p>
        </div>
        <p class="ml-5">
          <i class="fa fa-crop mr-2" aria-hidden="true"></i>
          {{ post.area }} m<sup>2</sup>
        </p>
        <p class="text-xl font-semibold text-green-600">
          <i class="fa fa-money mr-2" aria-hidden="true"></i>
          {{ formattedPrice(post) }}
        </p>
      </div>
    </div>
    <!-- Filler divs to maintain consistent layout -->
    <div
      v-for="n in fillerCount"
      :key="'filler-' + n"
      class="cursor-pointer rounded-lg overflow-hidden w-full border border-transparent mr-5"
    ></div>
  </div>
</template>

<script>
export default {
  props: {
    posts: {
      type: Array,
      required: true,
    },
    fillerCount: {
      type: Number,
      required: true,
    },
  },
  methods: {
    formattedPrice(post) {
      const formatted = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(post.price);
      return formatted;
    },
    truncatedTitle(post) {
      return this.truncateText(post.title, 20);
    },
    truncatedLocation(post) {
      return this.truncateText(post.location, 30);
    },
    truncateText(text, maxLength) {
      if (text.length > maxLength) {
        return text.substring(0, maxLength) + "...";
      } else {
        return text;
      }
    },
  },
};
</script>
