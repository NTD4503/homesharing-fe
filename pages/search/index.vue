<template>
  <div>
    <div class="text-center">
      <FilterBar />
    </div>
    <br />
    <div style="display: flex; justify-content: center">
      <LocationList
        :list="mappedDistricts"
        v-if="decodedLocations.length === 1"
      />
      <LocationList
        :list="mappedWards"
        v-else-if="decodedLocations.length === 2"
      />
    </div>
    <br />
    <div class="flex gap-6 px-8">
      <div class="border-2 p-4 rounded-lg flex-1">
        <div>
          <div class="flex items-center space-x-4">
            <span class="text-gray-700">Sắp xếp:</span>
            <a-button
              @click="sortByDefault"
              class="hover:bg-blue-300 font-bold rounded"
            >
              Mặc định
            </a-button>
            <a-button
              @click="sortByLatest"
              class="hover:bg-blue-300 font-bold rounded"
            >
              Mới nhất <i class="fa fa-clock-o ml-2" aria-hidden="true"></i>
            </a-button>
            <a-button
              @click="toggleSort('price')"
              class="hover:bg-blue-300 font-bold rounded"
            >
              Giá
              <i
                :class="
                  currentSortType === 'price' && currentOrder === 'asc'
                    ? 'fa fa-arrow-up ml-2'
                    : 'fa fa-arrow-down ml-2'
                "
              ></i>
            </a-button>
            <a-button
              @click="toggleSort('area')"
              class="hover:bg-blue-300 font-bold rounded"
            >
              Diện tích
              <i
                :class="
                  currentSortType === 'area' && currentOrder === 'asc'
                    ? 'fa fa-arrow-up ml-2'
                    : 'fa fa-arrow-down ml-2'
                "
              ></i>
            </a-button>
          </div>
          <div>
            <PostCard
              v-for="post in paginatedPosts"
              :key="post.id"
              :post="post"
            />
          </div>
          <div class="pagination-container" v-if="paginatedPosts.length > 0">
            <a-pagination
              :current="currentPage"
              :pageSize="pageSize"
              :total="criteriaPosts.filter(post => !post.is_blocked).length"
              @change="handlePageChange"
            />
          </div>
          <br />
          <template v-if="paginatedPosts.length === 0">
            <div class="flex flex-col items-center justify-center min-h-screen">
              <p class="text-lg text-gray-700 mb-4">
                Rất tiếc không tìm thấy bài đăng phù hợp.
              </p>
              <NuxtLink
                to="/home"
                class="text-blue-500 hover:text-blue-700 underline"
                >Quay về trang tìm kiếm</NuxtLink
              >
            </div>
          </template>
        </div>
      </div>
      <div class="w-[350px] flex-shrink-0">
        <CriteriaList title="Xem theo giá" :list="priceRanges" />
        <br />
        <CriteriaList title="Xem theo diện tích" :list="areaRanges" />
        <br />
        <Categories title="Danh mục cho thuê" :list="mappedRoomTypes" />
        <br />
        <RelatedPost :posts="hottestPosts" type="hot" />
        <br />
        <RelatedPost :posts="latestPosts" type="recent" />
      </div>
    </div>
  </div>
</template>

<script>
import PostCard from "../../components/PostCard/index.vue";
import Province from "../../components/Province/index.vue";
import RelatedPost from "../../components/RelatedPost/index.vue";
import FilterBar from "../../components/FilterBar/index.vue";
import Categories from "../../components/Categories/index.vue";
import LocationList from "../../components/LocationList/index.vue";
import CriteriaList from "../../components/CriteriaList/index.vue";
import { priceRanges, areaRanges } from "../../utils/const";
import { mapActions, mapState } from "vuex";

export default {
  components: {
    PostCard,
    Province,
    RelatedPost,
    FilterBar,
    Categories,
    CriteriaList,
    LocationList,
  },
  data() {
    return {
      mappedRoomTypes: [],
      mappedDistricts: [],
      mappedWards: [],
      decodedLocations: [],
      locationName: "",
      priceRanges,
      areaRanges,
      currentPage: 1,
      pageSize: 10,
      sortOrders: {
        price: "asc",
        area: "asc",
      },
      currentSortType: null,
      currentOrder: null,
    };
  },
  computed: {
    ...mapState({
      posts: (state) => state.modules["post"].posts,
      latestPosts: (state) => state.modules["post"].latestPosts,
      hottestPosts: (state) => state.modules["post"].hottestPosts,
      criteriaPosts: (state) => state.modules["post"].criteriaPosts,
      roomTypes: (state) => state.modules["post"].roomTypes,
      districts: (state) => state.modules["province"].districts,
      wards: (state) => state.modules["province"].wards,
    }),
    paginatedPosts() {
      const now = new Date();
      const filtered = this.criteriaPosts.filter(post => {
        if (post.is_blocked) return false;
        if (!post.expired_in) return true; 
        const expiryDate = new Date(post.expired_in);
        return expiryDate > now;
       });
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return filtered.slice(start, end);
    },
  },
  async created() {
    await Promise.all([
      this.decodeSelectedLocation(),
      this.fetchAllPosts(),
      this.fetchHottestPosts(),
      this.fetchLatestPosts(),
      this.fetchRoomTypes(),
    ]);
    this.mappedRoomTypes = this.roomTypes.map((roomType) => {
      return {
        ...roomType,
        name: roomType.room_type_name,
      };
    });
    this.setCurrentSortOrder();
  },
  methods: {
    ...mapActions({
      fetchAllPosts: "modules/post/fetchAllPosts",
      fetchLatestPosts: "modules/post/fetchLatestPosts",
      fetchHottestPosts: "modules/post/fetchHottestPosts",
      filterPostsByCriteria: "modules/post/filterPostsByCriteria",
      fetchRoomTypes: "modules/post/fetchRoomTypes",
      getDistricts: "modules/province/getDistricts",
      getWards: "modules/province/getWards",
    }),
    async handleRenderDistricts() {
      await this.getDistricts(this.decodedLocations[0]);
      this.mappedDistricts = this.districts.map((district) => {
        return {
          ...district,
          name: district.DistrictName,
        };
      });
    },
    async handleRenderWards() {
      await this.getWards(this.decodedLocations[1]);
      this.mappedWards = this.wards.map((ward) => {
        return {
          ...ward,
          name: ward.WardName,
        };
      });
    },
    sortByLatest() {
      const currentQueryParams = { ...this.$router.currentRoute.query };
      currentQueryParams.sortType = "latest";

      this.$router.push({ path: "/search", query: currentQueryParams });
    },
    sortByDefault() {
      const currentQueryParams = { ...this.$router.currentRoute.query };
      delete currentQueryParams.sortType;
      delete currentQueryParams.order;
      this.$router.push({ path: "/search", query: currentQueryParams });
    },
    toggleSort(type) {
      const currentQueryParams = { ...this.$router.currentRoute.query };
      currentQueryParams.sortType = type;
      this.sortOrders[type] = this.sortOrders[type] === "asc" ? "desc" : "asc";
      currentQueryParams.order = this.sortOrders[type];

      this.$router.push({ path: "/search", query: currentQueryParams });
    },
    handlePageChange(page) {
      this.currentPage = page;
      window.scrollTo({ top: -5, behavior: "smooth" }); // Scroll to the specific position
    },
    async decodeSelectedLocation() {
      const queryParams = this.$route.query;

      const locationCodes = queryParams.codes;
      const roomType = queryParams.roomType;
      const postType = queryParams.postType;
      const minPrice = queryParams.minPrice;
      const maxPrice = queryParams.maxPrice;
      const minArea = queryParams.minArea;
      const maxArea = queryParams.maxArea;
      const sortType = queryParams.sortType;
      const gender = queryParams.gender;
      const order = queryParams.order;
      const radius_km = queryParams.radius;
      console.log("radius_km:", radius_km);
      if (locationCodes) {
        this.decodedLocations = JSON.parse(decodeURIComponent(locationCodes));
      }

        let lat = null;
  let lng = null;
  if (radius_km) {
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
        });
      });
      lat = position.coords.latitude;
      lng = position.coords.longitude;
      console.log("Vị trí hiện tại:", lat, lng);
    } catch (error) {
      console.error("Không thể lấy vị trí hiện tại:", error);
    }
  }

 const searchCriteria = {
    post_type_id: postType,
    room_type_name: roomType,
    min_price: minPrice,
    max_price: maxPrice,
    min_area: minArea,
    max_area: maxArea,
    location_codes: this.decodedLocations,
    sort_type: sortType,
    gender: gender,
    order: order,
    radius_km: radius_km,
    lat: lat,
    lng: lng,
  };
 console.log('searchCriteria',searchCriteria);
  await this.filterPostsByCriteria(searchCriteria);
  this.setCurrentSortOrder();
},
    setCurrentSortOrder() {
      const queryParams = this.$route.query;
      this.currentSortType = queryParams.sortType || null;
      this.currentOrder = queryParams.order || null;
    },
  },
  watch: {
    "$route.query": {
      handler: function (newQuery, oldQuery) {
        if (JSON.stringify(newQuery) !== JSON.stringify(oldQuery)) {
          this.decodeSelectedLocation();
        }
      },
      deep: true,
    },
    decodedLocations: {
      handler: function (newLocations, oldLocations) {
        switch (newLocations.length) {
          case 1:
            this.handleRenderDistricts();
            break;
          case 2:
            this.handleRenderWards();
            break;
          default:
            break;
        }
      },
      deep: true,
    },
  },
};
</script>

<style>
.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
