<template>
  <div class="w-full bg-white rounded-md p-4 border p-4">
    <h3 class="font-semibold text-lg mb-4">
      {{ type === "recent" ? "Tin mới đăng" : "Tin nổi bật" }}
    </h3>
    <div class="w-full flex flex-col gap-2">
      <Sitem
        v-for="post in posts"
        :key="post.post_id"
        :postId="post.post_id"
        :title="post.title"
        :price="post.price"
        :createdAt="post.created_at"
        :image="post.images[0]"
      />
    </div>
  </div>
</template>

<script>
import Sitem from "../Sitem/index.vue";

export default {
  props: {
    posts: {
      required: true,
    },
    type: {
      required: true,
    },
  },
  components: {
    Sitem,
  },
};
</script>

<style scoped>
/* Add your component-specific styles here */
</style>
