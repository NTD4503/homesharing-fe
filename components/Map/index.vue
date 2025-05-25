<template>
  <div class="map-container">
    <a-spin
      v-if="isLoading"
      tip="Đang tải bản đồ..."
      class="loading-spinner"
    ></a-spin>
    <div ref="map" v-show="!isLoading" class="map-container"></div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Spin } from "ant-design-vue";

const customIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});

export default {
  components: {
    "a-spin": Spin,
  },
  data() {
    return {
      responseData: null,
      map: null,
      marker: null,
      lat: 21.0285, // Default to Hanoi
      lng: 105.8542, // Default to Hanoi
      defaultZoom: 20,
      isLoading: true,
    };
  },
  async created() {
    try {
      if (this.$route.params.id && !this.$route.path.includes("manage")) {
        const postId = this.$route.params.id;
        await this.fetchPostById(postId);
        let payload = {
          address: this.post.location,
        };
        await this.getGeolocation(payload);
        this.lat = this.geolocation.location.lat;
        this.lng = this.geolocation.location.lng;
      }
    } catch (error) {
      console.error("Error fetching geolocation data:", error);
    } finally {
      this.isLoading = false;
      this.$nextTick(() => {
        this.initializeMap();
      });
    }
  },
  computed: {
    ...mapState({
      geolocation: (state) => state.modules["post-detail"].geolocation,
      post: (state) => state.modules["post-detail"].post,
      accurateAddress: (state) => state.modules["post"].accurateAddress,
    }),
  },
  methods: {
    ...mapActions({
      getGeolocation: "modules/post-detail/getGeolocation",
      fetchPostById: "modules/post-detail/fetchPostById",
    }),
    initializeMap() {
      if (this.$refs.map) {
        this.map = L.map(this.$refs.map).setView(
          [this.lat, this.lng],
          this.defaultZoom
        );

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap contributors",
        }).addTo(this.map);

        this.marker = L.marker([this.lat, this.lng], {
          icon: customIcon,
        }).addTo(this.map);
      }
    },
  },
  watch: {
    async accurateAddress(newValue, oldValue) {
      try {
        this.isLoading = true;
        let payload = {
          address: newValue,
        };
        await this.getGeolocation(payload);
              const lat = this.geolocation.location.lat;
        const lng = this.geolocation.location.lng;
        this.lat = lat;
        this.lng = lng;
this.$store.commit("modules/post/SET_LAT_LNG", { lat, lng });
        if (this.map) {
          this.map.setView([this.lat, this.lng], this.defaultZoom);
          this.marker.setLatLng([this.lat, this.lng]);
        } else {
          this.initializeMap();
        }
        this.isLoading = false;
      } catch (error) {
        console.error("Error fetching geolocation data:", error);
        this.isLoading = false;
      }
    },
  },
};
</script>

<style scoped>
.map-container {
  border-radius: 10px;
  width: 100%;
  height: 400px;
  position: relative;
}

.loading-spinner {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
