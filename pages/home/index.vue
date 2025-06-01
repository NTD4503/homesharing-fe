<template>
  <div class ="home">
    <div class="text-center">
      <FilterBar />
    </div>
    <br />
    <div class="text-center">
      <span class="font-bold text-3xl"> Tìm kiếm chỗ thuê ưng ý </span>
      <br />
      <p>
        Kênh thông tin Phòng trọ số 1 Việt Nam - Website đăng tin cho thuê phòng
        trọ, nhà nguyên căn, căn hộ, ở ghép nhanh, hiệu quả với 100.000+ tin
        đăng và 2.500.000 lượt xem mỗi tháng.
      </p>
      <br />
      <p class="text-base font-bold">Khu vực nổi bật</p>
    </div>
    <br />
    <div style="display: flex; justify-content: center">
      <Province />
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
              Mới nhất<i class="fa fa-clock-o ml-2" aria-hidden="true"></i>
            </a-button>
            <a-button
              @click="toggleSort('price')"
              class="hover:bg-blue-300 font-bold rounded"
            >
              Giá
              <i
                :class="
                  sortOrders.price === 'asc'
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
                  sortOrders.area === 'asc'
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
          <div class="pagination-container">
            <a-pagination
              :current="currentPage"
              :pageSize="pageSize"
              :total="filteredPosts.filter(post => !post.is_blocked).length"
              @change="handlePageChange"
            />
          </div>
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
  },
  data() {
    return {
      currentLocation: {
      lat: null,
      lng: null,
    },
      mappedRoomTypes: [],
      priceRanges,
      areaRanges,
      currentPage: 1,
      pageSize: 10,
      sortOrders: {
        price: "asc",
        area: "asc",
      },
    };
  },
  async created() {
    await Promise.all([
      this.fetchAllPosts(),
      this.fetchLatestPosts(),
      this.fetchHottestPosts(),
      this.fetchRoomTypes(),
    ]);
     this.getCurrentLocation();
    this.mappedRoomTypes = this.roomTypes.map((roomType) => {
      return {
        ...roomType,
        name: roomType.room_type_name,
      };
    });
  },
  computed: {
  ...mapState({
    posts: (state) => state.modules["post"].posts,
    latestPosts: (state) => state.modules["post"].latestPosts,
    hottestPosts: (state) => state.modules["post"].hottestPosts,
    roomTypes: (state) => state.modules["post"].roomTypes,
  }),

filteredPosts() {
  const now = new Date(); 
  return this.posts.filter(post => {
    if (post.is_blocked) return false;
    if (!post.expired_in) return true; 
    const expiryDate = new Date(post.expired_in); 
    return expiryDate > now; 
  });
},

  paginatedPosts() {
    const filtered = this.filteredPosts.filter(post => !post.is_blocked);
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return filtered.slice(start, end);
  }
},

  methods: {
    ...mapActions({
      fetchAllPosts: "modules/post/fetchAllPosts",
      fetchLatestPosts: "modules/post/fetchLatestPosts",
      fetchHottestPosts: "modules/post/fetchHottestPosts",
      fetchRoomTypes: "modules/post/fetchRoomTypes",
    }),
    sortByDefault() {
      const currentQueryParams = { ...this.$router.currentRoute.query };
      delete currentQueryParams.sortType;
      delete currentQueryParams.order;

      this.$router.push({ path: "/search", query: currentQueryParams });
    },
    sortByLatest() {
      const currentQueryParams = { ...this.$router.currentRoute.query };
      currentQueryParams.sortType = "latest";

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
  getCurrentLocation() {
    if (!navigator.geolocation) {
      alert("Trình duyệt không hỗ trợ lấy vị trí");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        // console.log("Lấy vị trí thành công:", lat, lng);

        this.currentLocation = { lat, lng };
        });
      (error) => {
        alert("Không lấy được vị trí: " + error.message);
      }
  }
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
