<template>
  <div v-if="post" class="flex px-12 py-4 gap-6">
    <div class="flex-1">
      <PostDetail :post="post" />
      <br />
      <span class="font-bold text-xl"
        >- Các phòng trọ ở khu vực {{ locationName }}:</span
      >
      <br /><br />
      <div class="">
        <div v-if="filteredAreaPosts.length > 0">
          <div class="border-2 p-4 rounded-lg">
            <PostCard
              v-for="post in filteredAreaPosts"
              :key="post.id"
              :post="post"
            />
          </div>
        </div>
        <div v-else>
          <div
            class="flex items-center justify-center h-40 border border-gray-300 rounded-lg bg-gray-100"
          >
            <div class="text-lg text-gray-600">
              Ở khu vực này không có phòng nào khác
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="w-[350px] flex-shrink-0">
      <div class="">
        <LandlordInfo
          :avatar="post.avatar"
          :user-name="post.user_name"
          :phone="post.phone"
          :userID="post.user_id"
        />
        <br />
        <Categories
          :title="'Khu vực ' + provinceName"
          :list="mappedDistricts"
        />
        <br />
        <RelatedPost :posts="hottestPosts" type="hot" />
        <br />
        <RelatedPost :posts="latestPosts" type="recent" />
      </div>
    </div>
  </div>
</template>

<script>
import PostDetail from "../../components/PostDetail/index.vue";
import RelatedPost from "../../components/RelatedPost/index.vue";
import LandlordInfo from "../../components/LandlordInfo/index.vue";
import PostCard from "../../components/PostCard/index.vue";
import Categories from "../../components/Categories/index.vue";

import { mapActions, mapState } from "vuex";
import _ from "lodash";

export default {
  components: {
    PostDetail,
    RelatedPost,
    LandlordInfo,
    PostCard,
  },
  data() {
    return {
      mappedDistricts: [],
      provinceName: "",
      locationName: "",
    };
  },
  async mounted() {
    const postId = this.$route.params.id;
    await Promise.all([
      this.fetchPostById(postId),
      this.fetchHottestPosts(),
      this.fetchLatestPosts(),
    ]);
    let clonePost = _.cloneDeep(this.post);
    clonePost.location_codes.pop();
    await Promise.all([
      this.getDistricts(parseInt(this.post.location_codes[0])),
      this.filterPostsByArea({ area_codes: clonePost.location_codes }),
    ]);
    this.provinceName = clonePost.location.split(",").pop();
    this.locationName = clonePost.location.split(",").slice(-2).join(",");
    this.mappedDistricts = this.districts.map((district) => {
      return {
        ...district,
        name: district.DistrictName,
      };
    });
  },
  computed: {
    ...mapState({
      post: (state) => state.modules["post-detail"].post,
      latestPosts: (state) => state.modules["post"].latestPosts,
      hottestPosts: (state) => state.modules["post"].hottestPosts,
      areaPosts: (state) => state.modules["post"].areaPosts,
      districts: (state) => state.modules["province"].districts,
    }),
    filteredAreaPosts() {
      return this.areaPosts.filter((post) => {
        return (
          post.post_id !== this.post.post_id &&
          post.post_type_id === this.post.post_type_id
        );
      });
    },
  },
  methods: {
    ...mapActions({
      fetchPostById: "modules/post-detail/fetchPostById",
      fetchLatestPosts: "modules/post/fetchLatestPosts",
      fetchHottestPosts: "modules/post/fetchHottestPosts",
      filterPostsByArea: "modules/post/filterPostsByArea",
      getDistricts: "modules/province/getDistricts",
    }),
  },
};
</script>
