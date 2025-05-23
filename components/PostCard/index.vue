<template>
  <div>
    <div>
      <div class="h-px bg-red-500 my-4"></div>
    </div>
    <div class="flex bg-white rounded-lg shadow-lg overflow-hidden h-60">
      <div class="w-2/5">
        <img
          :src="post.images[0]"
          alt="Room Image"
          class="w-full h-full object-cover rounded-lg cursor-pointer"
          @click="$router.push(`/${post.post_id}`)"
        />
      </div>
      <div class="w-3/5 pl-4">
        <h2
          :class="[titleSize]"
          :style="{ color: titleColor }"
          class="font-bold mb-2 line-clamp-2"
        >
          {{ post.title }}
        </h2>
        <p class="text-gray-700 text-base mb-2 line-clamp-1">
          {{ post.location }}
        </p>
        <div v-if="isRenderStar" class="flex items-center mb-2">
          <a-icon
            type="star"
            theme="filled"
            class="text-yellow-500 mr-1"
            v-for="(index, star) in 5"
            :key="index"
            :style="{ color: star <= maxStars - 1 ? 'yellow' : 'gray' }"
          ></a-icon>
        </div>
        <span class="text-gray-700 text-base mb-2 mr-2"
          >{{ formatCurrency(post.price) }}/tháng</span
        >
        <span class="text-gray-700 text-base mb-2"
          >{{ post.area }} m<sup>2</sup></span
        >
        <span class="ml-5">{{ formattedTime() }}</span>
        <p
          class="text-gray-700 text-base mb-2 line-clamp-2"
          v-html="post.description"
        ></p>
        <div class="flex items-center mb-2">
          <img
            :src="post.avatar"
            alt="Landlord Avatar"
            class="w-8 h-8 rounded-full mr-2"
          />
          <span>{{ post.user_name }}</span>
          <span class="text-gray-700 ml-2">{{ post.phone }}</span>
          <span
            @click="toggleFavorite"
            class="heart-icon ml-2 text-lg"
            :class="{ 'text-red-500': isFavorite }"
            title="Yêu Thích"
          >
            <i class="fa fa-heart" aria-hidden="true"></i>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Icon, message } from "ant-design-vue";
import { mapActions, mapState } from "vuex";
import { jwtDecode } from "jwt-decode";
import moment from "moment";

export default {
  components: {
    "a-icon": Icon,
  },
  props: {
    post: {
      required: true,
    },
  },
  data() {
    return {
      isFavorite: false,
      userId: null,
      postId: null,
    };
  },
  computed: {
    ...mapState({
      favorite: (state) => state.modules["favorite"].favorite,
      services: (state) => state.modules["service"].services,
    }),
    maxStars() {
      if (this.postService && this.services.length > 0) {
        return 6 - this.postService.service_id;
      } else {
        return 5;
      }
    },
    isRenderStar() {
      return this.postService && this.postService.service_id <= 3;
    },
    titleSize() {
      if (this.postService) {
        switch (this.postService.service_id) {
          case 1:
            return "text-2xl";
          case 2:
            return "text-xl";
          case 3:
            return "text-lg";
          case 4:
            return "text-base";
          default:
            return "text-xl";
        }
      } else {
        return "text-xl";
      }
    },
    titleColor() {
      return this.postService ? this.postService.title_color : null;
    },
    postService() {
      if (this.services.length > 0) {
        return this.services.find(
          (serv) => serv.service_id === this.post.service_id
        );
      } else {
        return null;
      }
    },
  },
  async mounted() {
    await this.fetchAllServices();
    await this.setService();
  },
  methods: {
    ...mapActions({
      favorPost: "modules/favorite/favorPost",
      unfavorPost: "modules/favorite/unfavorPost",
      fetchFavoriteByPost: "modules/favorite/fetchFavoriteByPost",
      fetchAllServices: "modules/service/fetchAllServices",
    }),
    async setService() {
      //  console.log("postsetService_postcard ", this.post); 
      if (process.browser) {
        const token = localStorage.getItem("accessToken");
        if (token) {
          const decoded = jwtDecode(token);
          this.userId = decoded.user.user_id;
        }
        this.postId = this.post.post_id;

        if (this.userId) {
          let requestData = {
            post_id: this.postId,
            user_id: this.userId,
          };

          await this.fetchFavoriteByPost(requestData);

          if (this.favorite) {
            this.isFavorite = true;
          }
        }
      }
    },
    async toggleFavorite() {
      try {
        if (!this.userId) {
          this.$router.push("/login");
          return;
        }

        let requestData = {
          post_id: this.postId,
          user_id: this.userId,
        };
        if (this.isFavorite) {
          await this.unfavorPost(requestData);
          message.success("Bỏ thích bài viết thành công");
        } else {
          await this.favorPost(requestData);
          message.success("Thích bài viết thành công");
        }
        this.isFavorite = !this.isFavorite;
      } catch (error) {
        console.error("Error toggling favorite:", error);
        message.error("Đã xảy ra lỗi, vui lòng thử lại sau");
      }
    },
formattedTime() {
  const createdAt = this.post.created_at;
  // console.log('createdAt trong formattedTime: ', createdAt);
  
  if (!createdAt) {
    return 'Không rõ thời gian';
  }

  const time = moment(createdAt).fromNow();
  return time.charAt(0).toUpperCase() + time.slice(1);
},

    formatCurrency(amount) {
      const formatter = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      });
      return formatter.format(amount);
    },
  },
  watch: {
    "$route.query.postType": {
      handler: function (newQuery, oldQuery) {
        this.setService();
      },
      deep: true,
    },
  },
};
</script>

<style scoped>
.heart-icon {
  cursor: pointer;
}

.heart-icon i {
  color: inherit;
}

.heart-icon:hover i {
  color: #ff0000;
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 1;

}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 3;
  
}
</style>
