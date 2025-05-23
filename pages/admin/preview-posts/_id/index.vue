<template>
  <div class="container mx-auto py-12">
    <h1 class="font-bold text-3xl text-center text-gray-800 mb-8">Xem trước bài đăng</h1>
    <div v-if="post" class="w-full lg:w-2/3 mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <PostDetail :post="post" />
    </div>
  </div>
</template>

<script>
import PostDetail from "../../../../components/PostDetail/index.vue";
import { mapActions, mapState } from "vuex";

export default {
  layout: "admin",
  components: {
    PostDetail,
  },
  data() {
    return {};
  },
  async mounted() {
    const postId = this.$route.params.id;
    await this.fetchPostById(postId);
  },
  computed: {
    ...mapState({
      post: (state) => state.modules["post-detail"].post,
    }),
  },
  methods: {
    ...mapActions({
      fetchPostById: "modules/post-detail/fetchPostById",
    }),
  },
};
</script>

<style scoped>
.container {
  background: linear-gradient(to right, #f8fafc, #e2e8f0);
}

h1 {
  font-family: 'Inter', sans-serif;
}

div[w-full] {
  background: #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
}

div[w-full] > * {
  transition: transform 0.2s;
}

div[w-full]:hover > * {
  transform: translateY(-0.5rem);
}
</style>