<template>
  <div class="filter-bar">
    <!-- Select for Apartment Type -->
    <a-select v-model="selectedApartmentType" class="w-48 mr-3">
      <a-select-option value="all">Chọn loại căn hộ</a-select-option>
      <a-select-option
        v-for="type in roomTypes"
        :key="type.room_type_name"
        :value="type.room_type_name"
      >
        {{ type.room_type_name }}
      </a-select-option>
    </a-select>
    <a-cascader
      v-model="selectedLocation"
      class="w-[400px] mr-3"
      :options="locationOptions"
      change-on-select
      placeholder="Chọn địa điểm"
    ></a-cascader>
    <a-select v-model="selectedGender" class="w-40 mr-3">
      <a-select-option value="">Phòng dành cho</a-select-option>
      <a-select-option
        v-for="gender in genders"
        :key="gender.key"
        :value="gender.key"
      >
        {{ gender.name }}
      </a-select-option>
    </a-select>
    <a-button
      @click="showPricePopup"
      class="mr-3 bg-white text-black hover:bg-blue-500 hover:text-white hover:border-blue-500 relative"
      style="padding-right: 30px"
    >
      <template
        v-if="
          (priceRange[0] !== 0 || priceRange[1] !== 15) &
          (priceRange[0] !== priceRange[1])
        "
      >
        <span class="ml-3">{{
          `${priceRange[0]} - ${priceRange[1]} triệu`
        }}</span>
      </template>
      <template
        v-else-if="priceRange[0] === priceRange[1] && priceRange[0] !== 0"
      >
        <span> Trên 15 triệu </span>
      </template>
      <template v-else> Chọn giá phòng </template>
    </a-button>

    <a-button
      @click="showAreaPopup"
      class="mr-3 bg-white text-black hover:bg-blue-500 hover:text-white hover:border-blue-500 relative"
    >
      <template
        v-if="
          (areaRange[0] !== 0 || areaRange[1] !== 90) &&
          areaRange[0] !== areaRange[1]
        "
      >
        <span class="">{{ `${areaRange[0]} - ${areaRange[1]} m²` }}</span>
      </template>
      <template v-else-if="areaRange[0] === areaRange[1] && areaRange[0] !== 0">
        <span class=""> Trên 90 m²</span>
      </template>
      <template v-else> Chọn diện tích </template>
    </a-button>
    <a-button
      @click="toggleMap"
      class="mr-3 bg-white text-black hover:bg-blue-500 hover:text-white hover:border-blue-500 relative"
    >
      {{ showMap ? "Tìm kiếm theo bán kính" : "Tìm kiếm theo bán kính" }}
    </a-button>

    <!-- Button for Search -->
    <a-button
      @click="search"
      class="mr-1 bg-white text-black hover:bg-blue-500 hover:text-white hover:border-blue-500"
    >
      <i class="fa fa-search" aria-hidden="true"></i> &nbsp;Tìm kiếm
    </a-button>

    <a-button title="Đặt lại" @click="resetAllFilters" type="default" class="">
      <i class="fa fa-refresh" aria-hidden="true"></i>
    </a-button>
    <!-- tìm kiếm theo vị trí -->
    <template>
      <div class="mt-4">
        <!-- Button -->

        <!-- Form for search query -->
        <div v-show="showMap">
          <form
            @submit.prevent="searchLocation"
            class="mb-3 flex items-center gap-4 px-5"
          >
            <input
              v-model="searchQuery"
              placeholder="Nhập địa điểm (VD: 12 Nguyễn Trãi, Hà Nội)"
              class="px-3 py-2 w-72 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-500 transition"
            />
            <button
              type="submit"
              class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            >
              Tìm địa chỉ
            </button>

            <!-- Input for radius -->
            <a-input-number
              v-model="radius"
              :min="0"
              :max="50"
              :step="1"
              class="w-40 ml-4"
              placeholder="Bán kính (km)"
            >
              <template #addonAfter>km</template>
            </a-input-number>
          </form>
          <div class="text-sm text-gray-600 mt-2">
            Hệ thống sẽ tìm phòng trong bán kính từ vị trí hiện tại (hoặc vị trí
            đã chọn).
          </div>

          <!-- Map container -->
          <div id="map" class="h-96 mt-4"></div>

          <!-- Selected LatLng -->
          <div v-if="selectedLatLng" class="result mt-2 text-sm text-gray-700">
            📍 Vị trí đã chọn:
            <strong>{{ selectedLatLng.lat }}, {{ selectedLatLng.lng }}</strong>
          </div>
        </div>
      </div>
    </template>

    <!-- Price Popup Modal -->
    <a-modal
      :footer="null"
      v-model:visible="priceModalVisible"
      title="Chọn giá phòng"
    >
      <span v-if="priceRange[0] !== priceRange[1]" class="mr-3">
        Giá phòng: {{ priceRange[0] }} - {{ priceRange[1] }} triệu
      </span>
      <span v-if="priceRange[0] === priceRange[1] && priceRange[0] !== 0">
        Giá phòng: Trên 15 triệu
      </span>
      <br />
      <a-slider v-model="priceRange" range :min="0" :max="15" :step="1" />
      <br />
      <span class="font-bold">Chọn nhanh:</span>
      <br />
      <div class="mt-4 grid grid-cols-3 gap-4">
        <a-button @click="setPriceRange([0, 1])">Dưới 1 triệu</a-button>
        <a-button @click="setPriceRange([1, 2])">1-2 triệu</a-button>
        <a-button @click="setPriceRange([2, 3])">2-3 triệu</a-button>
        <a-button @click="setPriceRange([3, 5])">3-5 triệu</a-button>
        <a-button @click="setPriceRange([5, 7])">5-7 triệu</a-button>
        <a-button @click="setPriceRange([7, 10])">7-10 triệu</a-button>
        <a-button @click="setPriceRange([10, 15])">10-15 triệu</a-button>
        <a-button @click="setPriceRange([15, 15])">Trên 15 triệu</a-button>
      </div>
      <div class="mt-4 flex justify-center">
        <a-button @click="handleOk">Áp dụng</a-button>
      </div>
    </a-modal>

    <a-modal
      :footer="null"
      v-model:visible="areaModalVisible"
      title="Chọn diện tích"
    >
      <span v-if="areaRange[0] !== areaRange[1]" class="mr-3">
        Diện tích: {{ areaRange[0] }} - {{ areaRange[1] }} m<sup>2</sup>
      </span>
      <span v-if="areaRange[0] === areaRange[1] && areaRange[0] !== 0"
        >Trên 90 m<sup>2</sup>
      </span>
      <br />
      <a-slider v-model="areaRange" range :min="0" :max="90" :step="1" />
      <br />
      <!-- Additional Options for Area Range -->
      <span class="font-bold">Chọn nhanh:</span>
      <br />
      <div class="mt-4 grid grid-cols-3 gap-4">
        <a-button @click="setAreaRange([0, 20])"
          >Dưới 20 m<sup>2</sup></a-button
        >
        <a-button @click="setAreaRange([20, 30])">20-30 m<sup>2</sup></a-button>
        <a-button @click="setAreaRange([30, 50])">30-50 m<sup>2</sup></a-button>
        <a-button @click="setAreaRange([50, 70])">50-70 m<sup>2</sup></a-button>
        <a-button @click="setAreaRange([70, 90])">70-90 m<sup>2</sup></a-button>
        <a-button @click="setAreaRange([90, 90])"
          >Trên 90 m<sup>2</sup></a-button
        >
      </div>
      <!-- Áp dụng button -->
      <div class="mt-4 flex justify-center">
        <a-button @click="handleOk">Áp dụng</a-button>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { Modal, Button, Cascader, Select, Slider } from "ant-design-vue";
import { mapState, mapActions } from "vuex";
import { genders } from "./const";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default {
  components: {
    "a-button": Button,
    "a-cascader": Cascader,
    "a-select": Select,
    "a-select-option": Select.Option,
    "a-slider": Slider,
  },
  data() {
    return {
      selectedApartmentType: "all",
      selectedGender: "",
      selectedLocation: [],
      priceRange: [0, 15],
      areaRange: [0, 90],
      priceModalVisible: false,
      areaModalVisible: false,
      genders,
      radius: null,
      map: null,
      marker: null,
      selectedLatLng: null,
      searchQuery: "",
      showMap: false,
      lat: null,
      lng: null,
      hasSearched: false,
    };
  },
  computed: {
    ...mapState({
      provinces: (state) => state.modules["province"].provinces,
      districts: (state) => state.modules["province"].districts,
      wards: (state) => state.modules["province"].wards,
      postTypes: (state) => state.modules["post"].postTypes,
      roomTypes: (state) => state.modules["post"].roomTypes,
    }),

    locationOptions() {
      return this.provinces.map((province) => ({
        value: province.ProvinceID,
        label: province.ProvinceName,
        children: this.districts.map((district) => ({
          value: district.DistrictID,
          label: district.DistrictName,
          children: this.wards.map((ward) => ({
            value: ward.WardCode,
            label: ward.WardName,
          })),
        })),
      }));
    },
  },
  async mounted() {
    this.initMap();
    this.getCurrentLocation();
    await this.getProvinces();
    if (this.$route.path !== "/") {
      await this.fetchInitialData();
    } else {
      const [firstProvince] = this.provinces;

      if (firstProvince) {
        const districtPromise = this.getDistricts(firstProvince.ProvinceID);
        const [firstDistrict] = await districtPromise;

        if (firstDistrict) {
          const wardPromise = this.getWards(firstDistrict.DistrictID);
          const roomTypesPromise = this.fetchRoomTypes();

          await Promise.all([wardPromise, roomTypesPromise]);
        }
      }
    }
  },
  methods: {
    ...mapActions({
      getProvinces: "modules/province/getProvinces",
      getDistricts: "modules/province/getDistricts",
      getWards: "modules/province/getWards",
      fetchPostTypes: "modules/post/fetchPostTypes",
      fetchRoomTypes: "modules/post/fetchRoomTypes",
    }),
    toggleMap() {
      this.showMap = !this.showMap;
      this.$nextTick(() => {
        if (this.showMap && this.map) {
          this.map.invalidateSize();
        }
      });
    },
    initMap() {
      this.map = L.map("map").setView([21.0278, 105.8342], 16); // Hà Nội mặc định

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(this.map);

      this.map.on("click", (e) => {
        this.setMarker(e.latlng);
      });
    },
    getCurrentLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;
          const latlng = L.latLng(latitude, longitude);

          // ❗ Chỉ setView nếu chưa từng tìm kiếm
          if (!this.hasSearched) {
            this.map.setView(latlng, 16);
          }

          this.setMarker(latlng);
        });
      }
    },
    setMarker(latlng) {
      this.selectedLatLng = latlng;

      if (this.marker) {
        this.marker.setLatLng(latlng);
      } else {
        this.marker = L.marker(latlng).addTo(this.map);
      }
    },
    async searchLocation() {
      console.log("Tìm kiếm địa điểm:", this.searchQuery);
      if (!this.searchQuery) return;

      try {
        const res = await axios.get(
          "https://nominatim.openstreetmap.org/search",
          {
            params: {
              q: this.searchQuery,
              format: "json",
              addressdetails: 1,
              limit: 1,
            },
          }
        );

        if (res.data.length > 0) {
          const place = res.data[0];
          const lat = parseFloat(place.lat);
          const lon = parseFloat(place.lon);
          const latlng = L.latLng(lat, lon);

          this.hasSearched = true; // ✅ Đã tìm kiếm

          this.map.setView(latlng, 16);
          this.setMarker(latlng);
        } else {
          alert("Không tìm thấy địa điểm!");
        }
      } catch (error) {
        console.error("Lỗi tìm địa điểm:", error);
      }
    },

    async fetchInitialData() {
      const urlParams = new URLSearchParams(window.location.search);
      const params = {
        selectedApartmentType: urlParams.get("roomType") || "all",
        selectedGender: urlParams.get("gender") || "",
        selectedLocation: urlParams.get("codes")
          ? JSON.parse(decodeURIComponent(urlParams.get("codes")))
          : [],
        priceRange: [
          parseInt(urlParams.get("minPrice")) || 0,
          parseInt(urlParams.get("maxPrice")) || 15,
        ],
        areaRange: [
          parseInt(urlParams.get("minArea")) || 0,
          parseInt(urlParams.get("maxArea")) || 90,
        ],
        radius: urlParams.get("radius")
          ? parseFloat(urlParams.get("radius"))
          : null,
      };
      Object.assign(this, params);
    },
    showPricePopup() {
      this.priceModalVisible = true;
    },
    showAreaPopup() {
      this.areaModalVisible = true;
    },
    saveFiltersToQuery() {
      // Kiểm tra nếu có radius hoặc lat, lng
      if (
        this.radius ||
        (this.selectedLatLng?.lat && this.selectedLatLng?.lng)
      ) {
        this.selectedLocation = []; // Gán selectedLocation là một mảng rỗng
      }
      const encodedLocation = this.encodeSelectedLocation(
        this.selectedLocation
      );

      const defaultCriterias = {
        selectedApartmentType: "all",
        selectedGender: "",
        selectedLocation: [],
        priceRange: [0, 15],
        areaRange: [0, 90],
        radius: null,
      };

      const criteriaChanged = Object.keys(defaultCriterias).some((key) => {
        if (Array.isArray(defaultCriterias[key])) {
          return (
            defaultCriterias[key].length !== this[key].length ||
            defaultCriterias[key].some(
              (value, index) => value !== this[key][index]
            )
          );
        } else {
          return defaultCriterias[key] !== this[key];
        }
      });

      if (criteriaChanged) {
        let query = `/search?codes=${encodedLocation}&gender=${this.selectedGender}&roomType=${this.selectedApartmentType}`;

        if (
          this.priceRange[0] !== defaultCriterias.priceRange[0] ||
          this.priceRange[1] !== defaultCriterias.priceRange[1]
        ) {
          query += `&minPrice=${this.priceRange[0]}&maxPrice=${this.priceRange[1]}`;
        }

        if (
          this.areaRange[0] !== defaultCriterias.areaRange[0] ||
          this.areaRange[1] !== defaultCriterias.areaRange[1]
        ) {
          query += `&minArea=${this.areaRange[0]}&maxArea=${this.areaRange[1]}`;
        }

        if (this.radius !== null && this.radius !== "") {
          query += `&radius=${this.radius}`;
        }
        if (this.selectedLatLng?.lat && this.selectedLatLng?.lng) {
          query += `&lat=${this.selectedLatLng.lat}&lng=${this.selectedLatLng.lng}`;
        }

        this.$router.push(query);
      } else {
        this.$router.push("/home");
      }
    },

    handleOk() {
      this.saveFiltersToQuery();
      this.priceModalVisible = false;
      this.areaModalVisible = false;
    },
    clearAreaRange() {
      this.areaRange = [0, 90];
    },
    clearPriceRange() {
      this.priceRange = [0, 15];
    },
    setPriceRange(range) {
      this.priceRange = range;
    },
    setAreaRange(range) {
      this.areaRange = range;
    },
    resetAllFilters() {
      this.selectedApartmentType = "all";
      this.selectedGender = "";
      this.selectedLocation = [];
      this.priceRange = [0, 15];
      this.areaRange = [0, 90];
      this.saveFiltersToQuery();
      this.$router.push("/home");
    },
    search() {
      this.showMap = false;
      this.saveFiltersToQuery();
    },
    encodeSelectedLocation(selectedProvinceIds) {
      return encodeURIComponent(JSON.stringify(selectedProvinceIds));
    },
  },
  watch: {
    $route(to) {
      this.fetchInitialData();
    },
    selectedLocation: {
      deep: true,
      handler: async function (value) {
        const [provinceId, districtId] = value;
        if (provinceId) {
          await this.getDistricts(provinceId);
        }
        if (districtId) {
          await this.getWards(districtId);
        }
      },
    },
  },
};
</script>

<style scoped>
.filter-bar a-select {
  /* Custom styles for Select */
}
</style>
