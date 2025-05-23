<template>
  <div>
    <div class="border-2 p-4 rounded-lg" v-if="post">
      <div>
        <div class="flex justify-center">
          <ImageSlider :images="post.images" />
        </div>
        <br />
        <div>
          <a-icon
            type="star"
            theme="filled"
            class="text-yellow-500 mr-1 text-2xl"
            v-for="(index, star) in 5"
            :key="index"
            :style="{ color: star <= maxStars - 1 ? 'yellow' : 'gray' }"
          ></a-icon>
          <span class="text-red-600 text-3xl">
            {{ post.title }}
          </span>
        </div>
        <div class="mt-2 text-xl">
          <i class="fa fa-map-marker mr-2 text-blue-500" aria-hidden="true"></i>
          Địa chỉ:
          {{ post.location }}
        </div>
        <div class="mt-2 flex items-center text-lg">
          <i class="fa fa-money text-xl mr-2" aria-hidden="true"></i>
          <span class="ml-1 text-green-500"
            >{{ formatCurrency(post.price) }} / Tháng</span
          >
          <span class="ml-5">
            <i class="fa fa-crop mr-2" aria-hidden="true"></i>
            {{ post.area }} m<sup>2</sup>
          </span>
          <span class="ml-5">
            <i class="fa fa-clock-o mr-2" aria-hidden="true"></i>
            <span class="">{{ formattedTime() }}</span>
          </span>
        </div>

        <div class="mt-4">
          <span class="font-bold text-2xl">Thông tin mô tả</span>
          <p class="mt-2 text-lg" v-html="post.description"></p>
        </div>

        <div class="mt-4">
          <span class="font-bold text-2xl">Đối tượng</span>
          <p class="mt-2 text-lg">
            <i class="fa fa-mars mr-2"></i>
            Phòng dành cho:
            {{
              post.gender === "ALL"
                ? "Nam/Nữ"
                : post.gender === "M"
                ? "Nam"
                : "Nữ"
            }}
          </p>
        </div>

        <div class="mt-4">
          <span class="font-bold text-2xl">Tiện ích</span>
          <br />
          <div class="flex justify-center">
            <div class="amenities-container rounded-lg border p-4 mt-2 w-3/4">
              <ul class="amenities-list flex flex-wrap">
                <li
                  v-for="(amenity, index) in post.amenities"
                  :key="index"
                  class="ml-[40px] mb-2 flex items-center text-base"
                >
                  <i
                    class="fa fa-dot-circle-o text-lg text-gray-700 mr-1"
                    aria-hidden="true"
                  ></i>
                  {{ amenity }}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="mt-4">
          <span class="font-bold text-2xl">Thông tin liên hệ</span>
          <br />
          <div class="flex justify-center">
            <a-table
              class="rounded-table mt-2 w-3/4"
              bordered
              :columns="landlordColumns"
              :data-source="landLordData"
              :pagination="false"
            >
              <template slot="icon" slot-scope="text">
                <i :class="text" aria-hidden="true"></i>
              </template>
              <template slot="info" slot-scope="text">
                {{ text }}
              </template>
            </a-table>
          </div>
        </div>

        <div class="mt-4">
          <span class="font-bold text-2xl">Bản đồ</span>
          <br />
          <br />
          <span class="text-lg">Địa chỉ:{{ post.location }}</span>
          <br />
          <br />
          <Map />
          <br /><br /><br />
        </div>
        <div v-if="!$route.path.includes('preview')" class="mt-4">
          <span class="font-bold text-2xl">Đánh giá</span>
          <CommentFrame />
        </div>
      </div>
    </div>
    <div v-else><a-spin></a-spin></div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import LandlordInfo from "../LandlordInfo/index.vue";
import ImageSlider from "../ImageSlider/index.vue";
import Map from "../Map/index.vue";
import CommentFrame from "../CommentFrame/index.vue";
import { landlordColumns } from "./const";
import moment from "moment";

export default {
  name: "PostDetail",
  props: {
    post: {
      required: true,
    },
  },
  components: {
    LandlordInfo,
    ImageSlider,
    Map,
    CommentFrame,
  },
  computed: {
    ...mapState({
      services: (state) => state.modules["service"].services,
    }),
    landLordData() {
      return [
        { icon: "fa fa-user", text: `${this.post.user_name}` },
        { icon: "fa fa-phone", text: `${this.post.phone}` },
      ];
    },
    maxStars() {
      if (this.services.length > 0) {
        let postService = this.services.find(
          (serv) => serv.service_id === this.post.service_id
        );
        if (postService) {
          return 6 - postService.service_id;
        }
      }
    },
  },
  data() {
    return {
      landlordColumns,
    };
  },
  async created() {
    await this.fetchAllServices();
  },
  methods: {
    ...mapActions({
      fetchAllServices: "modules/service/fetchAllServices",
    }),
    formattedTime() {
      const createdAt = this.post.created_at;
      return (
        moment(createdAt).fromNow().charAt(0).toUpperCase() +
        moment(createdAt).fromNow().slice(1)
      );
    },
    formatCurrency(amount) {
      const formatter = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      });
      return formatter.format(amount);
    },
  },
};
</script>

<style scoped>
.rounded-table {
  border-radius: 20px;
}

.ant-table-thead {
  display: none;
}

.amenities-container {
  margin-top: 10px;
}

.amenities-list {
  list-style: none;
  padding-left: 0;
}

.amenities-list li {
  display: inline-block;
}

.fa-dot-circle-o {
  color: #000;
}
</style>
