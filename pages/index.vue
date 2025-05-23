<template>
  <div class="">
    <div class="slider">
      <div
        class="slides"
        :style="{ transform: 'translateX(' + offset + 'vw)' }"
      >
        <div class="slide" v-for="(image, index) in images" :key="index">
          <img :src="image" class="rounded h-full" />
          <div
            class="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
          >
            <div class="flex">
              <div
                class="text-white w-64 h-32 border-4 border-blue-500 flex flex-col justify-center"
              >
                <div class="text-center text-3xl">Cho thuê</div>
              </div>
              <div
                class="w-64 h-32 border-black flex flex-col justify-center bg-blue-500 text-white"
              >
                <div class="text-center text-3xl">Tìm kiếm</div>
              </div>
            </div>
            <br />

            <p class="text-lg text-white">
              Không chỉ mang tới cộng đồng những phòng trọ chất lượng mà còn cả
              môi trường - văn hóa sống tốt đẹp.
            </p>
            <button
              @click="$router.push('/home')"
              class="mt-4 px-6 py-3 bg-blue-500 text-white font-semibold rounded-full hover:bg-blue-600 transition duration-300"
            >
              Tìm phòng trọ ngay.
            </button>
          </div>
        </div>
      </div>
      <div class="navigation prev" @click="slide('prev')">
        <i class="fa fa-chevron-left"></i>
      </div>
      <div class="navigation next" @click="slide('next')">
        <i class="fa fa-chevron-right"></i>
      </div>
      <div class="pagination">
        <span
          v-for="(image, index) in images"
          :key="index"
          class="dot"
          :class="{ active: index === currentIndex }"
          @click="goToSlide(index)"
        ></span>
      </div>
    </div>
    <br />
    <!-- <div class="flex items-center justify-center mt-6">
      <hr class="w-1/4 border-yellow-400 border-t-4 rounded-full" />
      <i class="fa fa-star text-yellow-400 mx-4"></i>
      <hr class="w-1/4 border-yellow-400 border-t-4 rounded-full" />
    </div>
    <br />
    <div class="text-center">
      <p class="text-xl font-semibold text-gray-800">Các bài đăng nổi bật</p>
    </div>
    <br /> -->
    <!-- <div class="">
      <div class="border-2 rounded-lg post-slider mt-6 pl-4 pr-4 pt-16 pb-16">
        <div
          class="slides"
          :style="{ transform: 'translateX(' + postOffset + '%)' }"
        >
          <div
            class="post-slide"
            v-for="(slide, index) in postSlides"
            :key="index"
          >
            <PostSlide
              class="mr-2"
              :posts="slide"
              :filler-count="getFillerCount(slide)"
            />
          </div>
        </div>
        <div class="navigation prev" @click="slidePosts('prev')">
          <i class="fa text-blue-500 fa-chevron-left"></i>
        </div>
        <div class="navigation next" @click="slidePosts('next')">
          <i class="fa text-blue-500 fa-chevron-right"></i>
        </div>
        <div class="pagination">
          <span
            v-for="(slide, index) in postSlides"
            :key="index"
            class="dot"
            :class="{ active: index === currentPostIndex }"
            @click="goToPostSlide(index)"
          ></span>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script>
import langdingImg1 from "../static/landing-page-img1.jpg";
import PostSlide from "../components/PostSlide/index.vue";
import { mapActions, mapState } from "vuex";
import _ from "lodash";

export default {
  components: {
    PostSlide,
  },
  data() {
    return {
      currentIndex: 0,
      offset: 0,
      slideWidth: 100,
      images: [langdingImg1, langdingImg1],
      sortedPosts: [],
      currentPostIndex: 0,
      postOffset: 0,
      postsPerSlide: 5,
      timer: null,
    };
  },
  computed: {
    ...mapState({
      posts: (state) => state.modules["post"].posts,
    }),
    postSlides() {
      const slides = [];
      for (let i = 0; i < this.sortedPosts.length; i += this.postsPerSlide) {
        slides.push(this.sortedPosts.slice(i, i + this.postsPerSlide));
      }
      return slides;
    },
  },
  beforeDestroy() {},
  async mounted() {
    await this.fetchAllPosts();
    let clonePosts = _.cloneDeep(this.posts);
    this.sortedPosts = clonePosts.sort((a, b) => a.service_id - b.service_id);
  },
  methods: {
    ...mapActions({
      fetchAllPosts: "modules/post/fetchAllPosts",
    }),
    slide(direction) {
      const numSlides = this.images.length;
      if (direction === "prev") {
        this.currentIndex = (this.currentIndex - 1 + numSlides) % numSlides;
      } else {
        this.currentIndex = (this.currentIndex + 1) % numSlides;
      }
      this.offset = -this.currentIndex * this.slideWidth;
    },
    goToSlide(index) {
      this.currentIndex = index;
      this.offset = -this.currentIndex * this.slideWidth;
    },
    getFillerCount(slide) {
      if (slide.length < this.postsPerSlide) {
        return this.postsPerSlide - slide.length;
      }
      return 0;
    },
    slidePosts(direction) {
      const numSlides = this.postSlides.length;
      if (direction === "prev") {
        this.currentPostIndex =
          (this.currentPostIndex - 1 + numSlides) % numSlides;
      } else {
        this.currentPostIndex = (this.currentPostIndex + 1) % numSlides;
      }
      this.postOffset = -this.currentPostIndex * 100; // Change to percentage for better handling of responsive design
    },
    goToPostSlide(index) {
      this.currentPostIndex = index;
      this.postOffset = -this.currentPostIndex * 100; // Change to percentage for better handling of responsive design
    },
  },
};
</script>

<style scoped>
.slider {
  border-radius: 10px;
  position: relative;
  width: 100%; /* Adjust slider width */
  height: 600px;
  overflow: hidden;
  margin: 0 auto;
  display: flex;
  align-items: center;
}

.slides {
  display: flex;
  transition: transform 0.5s ease;
}

.slide {
  flex-shrink: 0;
  width: 900px; /* Adjust slide width */
  width: 100%;
}

.post-slider {
  border-radius: 10px;
  position: relative;
  width: 50%;
  height: 100%;
  overflow: hidden;
  margin: 0 auto;
}
.post-slide {
  flex-shrink: 0;
  width: 100%;
}

.navigation {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 24px;
}

/* .slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
} */

.navigation.prev {
  left: 0;
}

.navigation.next {
  right: 0;
}

.pagination {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
}

.dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  background-color: #bbb;
  border-radius: 50%;
  margin: 0 5px;
  cursor: pointer;
}

.dot.active {
  background-color: #000;
}
</style>
