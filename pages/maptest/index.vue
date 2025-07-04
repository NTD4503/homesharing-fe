<template>
  <div>
    <button
      @click="toggleMap"
      class="mb-3 bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition"
    >
      {{ showMap ? "Ẩn bản đồ" : "Hiện bản đồ" }}
    </button>

    <div v-show="showMap">
      <!-- Form tìm kiếm địa điểm -->
      <form
        @submit.prevent="searchLocation"
        class="mb-3 flex flex-wrap items-center gap-2"
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
          Tìm
        </button>
      </form>

      <!-- Bán kính input -->
      <div class="mt-2">
        <input
          v-model.number="radius_km"
          type="number"
          placeholder="Nhập bán kính (km)"
          class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-500 transition"
        />
        <button
          @click="drawCircle"
          class="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition ml-2"
        >
          Hiển thị vòng tròn
        </button>
      </div>

      <!-- Bản đồ -->
      <div id="map" style="height: 400px"></div>

      <!-- Hiển thị vị trí đã chọn -->
      <div v-if="selectedLatLng" class="result mt-2">
        📍 Vị trí đã chọn:
        <strong>{{ selectedLatLng.lat }}, {{ selectedLatLng.lng }}</strong>
      </div>
    </div>
  </div>
</template>

<script>
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
  name: "MapPicker",
  data() {
    return {
      map: null,
      marker: null,
      selectedLatLng: null,
      searchQuery: "",
      radius_km: null, // Bán kính từ vị trí
      circle: null, // Vòng tròn được vẽ trên bản đồ
      showMap: true,
      hasSearched: false, // ✅ để kiểm tra người dùng đã tìm chưa
    };
  },
  mounted() {
    this.initMap();
    this.getCurrentLocation();
  },
  methods: {
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

      // Nếu có vòng tròn cũ, xóa nó trước khi vẽ lại
      if (this.circle) {
        this.circle.remove();
      }
    },
    async searchLocation() {
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
    drawCircle() {
      if (this.radius_km && this.selectedLatLng) {
        // Chuyển đổi km thành mét
        const radiusInMeters = this.radius_km * 1000;

        // Vẽ vòng tròn
        this.circle = L.circle(this.selectedLatLng, {
          color: "blue",
          fillColor: "#30a5ff",
          fillOpacity: 0.3,
          radius: radiusInMeters,
        }).addTo(this.map);
      } else {
        alert("Vui lòng nhập bán kính và chọn vị trí!");
      }
    },
  },
};
</script>

<style scoped>
.result {
  font-size: 16px;
}
</style>
