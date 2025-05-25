<template>
  <div>
    <h1 class="text-3xl">Đăng tin mới</h1>
    <div class="border-t border-gray-300 my-4"></div>
    <h2 class="text-2xl">Địa chỉ cho thuê</h2>
    <br />
    <a-form-model :model="form" @submit.prevent="handleSubmit">
      <div class="grid grid-cols-3 gap-4 justify-center">
        <div class="flex flex-col items-center">
          <span>Tỉnh/Thành phố </span>
          <br />
          <a-select
            v-model="selectedProvince"
            style="width: 200px"
            class="mr-1"
            @change="handleProvinceChange"
          >
            <a-select-option value="">Chọn tỉnh thành</a-select-option>
            <a-select-option
              v-for="province in provinces"
              :value="province.ProvinceID"
              :key="province.ProvinceID"
              >{{ province.ProvinceName }}</a-select-option
            >
          </a-select>
        </div>
        <div class="flex flex-col items-center">
          <span>Quận/Huyện</span>
          <br />
          <a-select
            v-model="selectedDistrict"
            style="width: 200px"
            class="mr-1"
            @change="handleDistrictChange"
          >
            <a-select-option value="">Chọn quận/huyện</a-select-option>
            <a-select-option
              v-for="district in districts"
              :value="district.DistrictID"
              :key="district.DistrictID"
              >{{ district.DistrictName }}</a-select-option
            >
          </a-select>
        </div>
        <div class="flex flex-col items-center">
          <span>Phường/Xã</span>
          <br />
          <a-select
            v-model="selectedWard"
            style="width: 200px"
            class="mr-1"
            @change="handleWardChange"
          >
            <a-select-option value="">Chọn phường/xã</a-select-option>
            <a-select-option
              v-for="ward in wards"
              :value="ward.WardCode"
              :key="ward.WardCode"
              >{{ ward.WardName }}</a-select-option
            >
          </a-select>
        </div>
        <div class="col-span-3 flex flex-col items-center">
          <a-form-model-item>
            <span>Địa chỉ cụ thể</span>
            <br />
            <a-input
              :disabled="disableDetailAddress"
              v-model="detailAddress"
              @input="onInput"
              @blur="onBlur"
              class="w-[600px]"
            />
            <div
              v-show="disableDetailAddress"
              class="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 rounded relative"
              role="alert"
            >
              <span class="block sm:inline">
                Vui lòng chọn thông tin về tỉnh/thành, quận/huyện, xã/phường
                trước!
              </span>
            </div>
          </a-form-model-item>
          <a-form-model-item class="w-full flex justify-center">
            <div class="w-[600px]">
              <span>Địa chỉ chính xác</span>
              <a-input :value="accurateAddress" disabled />
            </div>
          </a-form-model-item>
          <div class="w-full flex justify-center">
            <div class="w-[1400px]">
              <Map />
            </div>
          </div>
        </div>
      </div>

      <br /><br /><br />
      <h2 class="text-2xl">Thông tin mô tả</h2>
      <div class="text-center">
        <a-form-model-item>
          <div class="w-full flex justify-center">
            <div class="w-1/2">
              <span class="text-center block">Loại chuyên mục</span>
              <a-select
                disabled
                v-model="form.selectedPostType"
                class="text-center"
              >
                <a-select-option
                  v-for="postType in postTypes"
                  :value="postType.post_type_id"
                  :key="postType.post_type_id"
                >
                  {{ postType.post_type_name }}
                </a-select-option>
              </a-select>
            </div>
          </div>
        </a-form-model-item>

        <a-form-model-item>
          <div>
            <span>Loại phòng</span>
            <br />
            <a-select
              v-model="form.selectedRoomType"
              style="width: 50%"
              class="text-center"
            >
              <a-select-option
                v-for="roomType in roomTypes"
                :value="roomType.room_type_id"
                :key="roomType.room_type_id"
                class="text-center"
              >
                {{ roomType.room_type_name }}
              </a-select-option>
            </a-select>
          </div>
        </a-form-model-item>

        <a-form-model-item>
          <span> Tiêu đề </span>
          <br />
          <a-input class="w-1/2" v-model="form.title"></a-input>
        </a-form-model-item>
        <a-form-model-item>
          <span>Nội dung mô tả</span>
          <br />
          <a-textarea
            :auto-size="{ minRows: 10, maxRows: 20 }"
            class="w-1/2"
            allow-clear
            v-model="form.description"
          />
        </a-form-model-item>
        <a-form-model-item>
          <span>Số người</span>
          <br />
          <a-input type="number" class="w-1/2" v-model="form.capacity" />
        </a-form-model-item>
        <a-form-model-item>
          <span>Tiện ích</span>
          <br />
          <a-button @click="amenitiesModalVisible = true" class="w-1/2">
            Thêm tiện ích
          </a-button>
        </a-form-model-item>
        <div>
          <span> Thông tin liên hệ</span>
          <br />
          <a-input
            disabled
            class="w-1/2 text-center"
            :value="userName"
          ></a-input>
        </div>
        <br />
        <div>
          <span> Điện thoại</span>
          <br />
          <a-input disabled class="w-1/2 text-center" :value="phone"></a-input>
        </div>
        <br />
        <a-form-model-item>
          <span>Giá cho thuê</span>
          <br />
          <a-input
            addon-after="đồng/tháng"
            class="w-1/2"
            v-model="form.price"
          ></a-input>
        </a-form-model-item>
        <a-form-model-item>
          <span>Diện tích</span>
          <br />
          <a-input addon-after="m2" class="w-1/2" v-model="form.area"></a-input>
        </a-form-model-item>
        <a-form-model-item>
          <div>
            <span>Đối tượng cho thuê</span>
            <br />
            <a-select
              v-model="form.gender"
              style="width: 50%"
              class="text-center"
            >
              <a-select-option
                v-for="gender in genders"
                :value="gender.key"
                :key="gender.key"
                class="text-center"
              >
                {{ gender.name }}
              </a-select-option>
            </a-select>
          </div>
        </a-form-model-item>

        <br />
      </div>
      <div class="text-center">
        <a-form-model-item>
          <div>
            <a-upload
              :multiple="true"
              :show-upload-list="false"
              :before-upload="handleUpload"
            >
              <div class="upload-frame hover:bg-gray-200">
                <i class="fa fa-upload text-3xl"></i>
                <p class="mt-2">Tải ảnh lên</p>
              </div>
              <br /><br />
              <div class="text-base">
                Đã tải lên:
                <span class="font-bold">
                  {{ uploadCount }}
                </span>
              </div>
            </a-upload>
            <br />
            <div v-if="form.imageList.length > 0">
              <h3 class="text-lg">Danh sách ảnh đã tải lên:</h3>
              <br />
              <ul class="image-list">
                <li
                  v-for="(image, index) in displayedImages"
                  :key="index"
                  class="relative inline-block mr-4"
                >
                  <div
                    class="absolute top-0 right-0 p-1 cursor-pointer transform hover:scale-125 transition-transform"
                    @click="removeImage(index)"
                    title="Xóa ảnh"
                  >
                    <i
                      class="text-red-600 fa fa-trash text-lg"
                      aria-hidden="true"
                    ></i>
                  </div>

                  <img :src="image" class="uploaded-image border" />
                </li>
                <li v-if="form.imageList.length > 4" class="inline-block">
                  <a-button
                    @click="showPopup = true"
                    icon="plus"
                    shape="circle"
                    title="Xem thêm ảnh"
                  ></a-button>
                </li>
              </ul>
            </div>
            <a-modal
              v-model:visible="showPopup"
              :footer="null"
              title="Danh sách ảnh"
              width="1000px"
            >
              <ul class="image-list">
                <li
                  v-for="(image, index) in remainingImages"
                  :key="index"
                  class="relative inline-block mr-4"
                >
                  <div
                    class="absolute top-0 right-0 p-1 cursor-pointer transform hover:scale-125 transition-transform"
                    @click="removeImage(index)"
                    title="Xóa ảnh"
                  >
                    <i
                      class="text-red-600 fa fa-trash text-lg"
                      aria-hidden="true"
                    ></i>
                  </div>
                  <img :src="image" class="modal-uploaded-image border" />
                </li>
              </ul>
            </a-modal>
          </div>
        </a-form-model-item>
      </div>
      <a-modal
        v-model:visible="amenitiesModalVisible"
        :footer="null"
        title="Danh sách tiện ích"
        width="1000px"
      >
        <div
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
        >
          <div v-for="(option, index) in cloneAmenities" :key="index">
            <label class="flex items-center cursor-pointer">
              <input
                type="checkbox"
                :value="option.amenity_id"
                v-model="form.selectedAmenities"
                @change="handleAmenityChange(option.amenity_id)"
                class="form-checkbox h-5 w-5 text-indigo-600"
              />
              <span class="ml-2 text-gray-700">{{ option.amenity_name }}</span>
            </label>
          </div>
          <div class="col-span-full flex justify-center mt-4">
            <a-button @click="addNewAmenity">Thêm tiện ích mới</a-button>
          </div>
          <div class="col-span-full flex justify-center mt-4">
            <a-button @click="confirmSelection">Xác nhận</a-button>
          </div>
        </div>
      </a-modal>

      <a-form-model-item class="text-center">
        <a-button :loading="loading" html-type="submit">Đăng tin</a-button>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import { genders } from "./const";
import { jwtDecode } from "jwt-decode";
import { message, Modal } from "ant-design-vue";
import swal from "sweetalert";
import Map from "../../../components/Map/index.vue";
import _ from "lodash";
import moment from "moment";

export default {
  layout: "manage",
  data() {
    return {
      selectedProvince: "",
      selectedDistrict: "",
      selectedWard: "",
      showPopup: false,
      amenitiesModalVisible: false,
      detailAddress: "",
      userName: "",
      phone: "",
      genders,
      tempFiles: [],
      isInputing: false,
      loading: false,
      roleId: null,
      serviceId: null,
      cloneAmenities: [],
      period: null,
      form: {
        title: null,
        description: null,
        price: null,
        area: null,
        selectedAmenities: [],
        selectedRoomType: null,
        selectedPostType: this.roleId === 2 ? 1 : 2,
        capacity: null,
        userId: null,
        accurateAddress: null,
        locationCodes: [],
        lat: 21.0278,
        lng: 105.8342,
        gender: null,
        imageList: [],
      },
    };
  },
  async mounted() {
    if (process.browser) {
      const token = localStorage.getItem("accessToken");
      if (token) {
        const decoded = jwtDecode(token);
        this.form.userId = decoded.user.user_id;
        this.userName = decoded.user.user_name;
        this.phone = decoded.user.phone;
        this.roleId = decoded.user.role_id;
        this.serviceId = decoded.user.service_id;
      }
      this.form.selectedPostType = this.roleId === 2 ? 1 : 2;
      await Promise.all([
        this.getProvinces(),
        this.fetchAmenities(),
        this.fetchPostTypes(),
        this.fetchRoomTypes(),
        this.fetchAllServices(),
      ]);
      this.cloneAmenities = _.cloneDeep(this.amenities);

      let userService = this.services.find(
        (serv) => serv.service_id === this.serviceId
      );
      this.period = userService.period;
    }
  },
  computed: {
    ...mapState({
      provinces: (state) => state.modules["province"].provinces,
      districts: (state) => state.modules["province"].districts,
      wards: (state) => state.modules["province"].wards,
      postTypes: (state) => state.modules["post"].postTypes,
      roomTypes: (state) => state.modules["post"].roomTypes,
      amenities: (state) => state.modules["post"].amenities,
      services: (state) => state.modules["service"].services,
     lat: (state) => state.modules["post"].lat,
    lng: (state) => state.modules["post"].lng,
    }),
    displayedImages() {
      return this.form.imageList.slice(0, 4);
    },
    uploadCount() {
      return this.tempFiles.length;
    },
    remainingImages() {
      return this.form.imageList.slice(4);
    },
    accurateAddress() {
      let address = "";
      if (this.detailAddress && !this.isInputing) {
        address += this.detailAddress + ", ";
      }
      if (this.selectedWard !== "") {
        const ward = this.wards.find(
          (ward) => ward.WardCode === this.selectedWard
        );
        if (ward) address += ward.WardName + ", ";
      }
      if (this.selectedDistrict !== "") {
        const district = this.districts.find(
          (district) => district.DistrictID === this.selectedDistrict
        );
        if (district) address += district.DistrictName + ", ";
      }
      if (this.selectedProvince !== "") {
        const province = this.provinces.find(
          (province) => province.ProvinceID === this.selectedProvince
        );
        address += province.ProvinceName;
      }
      this.form.accurateAddress = address;
      this.setAccurateAdress(address);
      return address;
    },
    disableDetailAddress() {
      return (
        this.selectedProvince === "" ||
        this.selectedDistrict === "" ||
        this.selectedWard === ""
      );
    },
  },
  methods: {
    ...mapMutations({
      setAccurateAdress: "modules/post/SET_ACCURATE_ADDRESS",
    }),
    ...mapActions({
      getProvinces: "modules/province/getProvinces",
      getDistricts: "modules/province/getDistricts",
      getWards: "modules/province/getWards",
      uploadImage: "modules/upload-image/uploadImage",
      fetchPostTypes: "modules/post/fetchPostTypes",
      fetchRoomTypes: "modules/post/fetchRoomTypes",
      fetchRoomTypes: "modules/post/fetchRoomTypes",
      fetchAmenities: "modules/post/fetchAmenities",
      createPost: "modules/post/createPost",
      fetchUserById: "modules/user/fetchUserById",
      fetchAllServices: "modules/service/fetchAllServices",
    }),
    confirmSelection() {
      console.log("Options selected:", this.form.selectedAmenities);
      this.amenitiesModalVisible = false;
    },
    isFormFieldsFilled(form) {
      for (const key in form) {
        if (!form[key] || (form[key].length === 0 && key !== "locationCodes")) {
          return false;
        }
      }
      return true;
    },
    addNewAmenity() {
      swal({
        text: "Nhập tên tiện ích mới (tối đa 20 ký tự)",
        content: "input",
        button: {
          text: "Thêm",
          closeModal: false,
        },
      })
        .then((value) => {
          if (!value) throw null;
          if (value.length > 20) {
            throw new Error("Tên tiện ích không được quá 20 ký tự.");
          }
          this.cloneAmenities.push({
            amenity_id:
              this.cloneAmenities[this.cloneAmenities.length - 1].amenity_id +
              1,
            amenity_name: value,
          });
          swal.close();
        })
        .catch((err) => {
          if (err) {
            this.addNewAmenity();
            swal("Lỗi!", err.message, "error");
          } else {
            swal.stopLoading();
            swal.close();
          }
        });
    },
    async handleSubmit() {
      this.loading = true;
      console.log("TRƯỚC KHI SUBMIT:", {
  lat: this.form.lat,
  lng: this.form.lng,
  locationCodes: this.form.locationCodes,
});


      if (
        // !this.isFormFieldsFilled(this.form) ||
        !this.selectedProvince ||
        !this.selectedDistrict ||
        !this.selectedWard ||
        !this.detailAddress
      ) {
        console.log(this.form);
        message.warning("Vui lòng nhập đủ các thông tin.");
        this.loading = false;
        return;
      }
      try {
        this.form.locationCodes = [
  this.selectedProvince.toString(),
  this.selectedDistrict.toString(),
  this.selectedWard.toString(),
];

        const imageUrls = await Promise.all(
          this.tempFiles.map(async (image) => {
            const imageUrl = await this.uploadImage(image);
            return imageUrl;
          })
        );
        let customAmenities = this.cloneAmenities.filter((amenity) => {
          return (
            this.amenities.findIndex(
              (a) => a.amenity_id === amenity.amenity_id
            ) === -1 &&
            this.form.selectedAmenities.includes(amenity.amenity_id)
          );
        });
        this.form.selectedAmenities = this.form.selectedAmenities.filter(
          (amenityId) => {
            return !customAmenities
              .map((customAmenity) => customAmenity.amenity_id)
              .includes(amenityId);
          }
        );

        const periodParts = this.period.split(" ");
        const duration = parseInt(periodParts[0]);
        const unit = periodParts[1];
        const expirationDate = moment()
          .add(duration, unit)
          .format("YYYY-MM-DD");

        let formattedDescription = this.form.description.replace(/\n/g, "<br>");

        const postData = {
          title: this.form.title,
          description: formattedDescription,
          price: this.form.price,
          location: this.form.accurateAddress,
          room_type_id: this.form.selectedRoomType,
          capacity: this.form.capacity,
          area: this.form.area,
          custom_amenities: customAmenities,
          amenitiesIds: this.form.selectedAmenities,
          imageUrls: imageUrls,
          user_id: this.form.userId,
          gender: this.form.gender,
          location_codes: this.form.locationCodes,
          lat: this.lat,
          lng: this.lng,
          post_type_id: this.form.selectedPostType,
          is_approved: this.serviceId === 1 ? true : false,
          expired_in: this.serviceId === 1 ? expirationDate : null,
        };
        await this.createPost(postData);
        this.loading = false;
        setTimeout(() => {
          location.reload();
        }, 1000);
        message.info("Bài đăng của bạn đã được thêm vào danh sách chờ duyệt!");
      } catch (error) {
        message.error("Đăng tin không thành công.");
        console.error("Error creating post:", error);
      }
    },
    handleUpload(file) {
      if (file) {
        if (this.form.imageList.length >= 10) {
          message.warn("Bạn chỉ có thể tải lên tối đa 10 ảnh!");
          return false;
        }

        try {
          this.tempFiles.push(file);
          this.form.imageList.push(URL.createObjectURL(file));
        } catch (error) {
          console.error("Error creating object URL:", error);
        }
      } else {
        console.error("Invalid file object:", file);
      }
      return false;
    },
    removeImage(index) {
      this.tempFiles.splice(index, 1);
      this.form.imageList.splice(index, 1);
    },
    async handleProvinceChange(newValue) {
      await this.getDistricts(newValue);
      this.detailAddress = "";
      this.selectedDistrict = "";
      this.selectedWard = "";
    },
    async handleDistrictChange(newValue) {
      await this.getWards(newValue);
      this.detailAddress = "";
      this.selectedWard = "";
    },
    async handleWardChange() {
      this.detailAddress = "";
    },
    onInput() {
      this.isInputing = true;
    },
    onBlur() {
      this.isInputing = false;
    },
    handleAmenityChange(amenity_id) {
      console.log(`Amenity ${amenity_id} changed`);
      console.log("Selected amenities:", this.form.selectedAmenities);
    },
  },
  watch: {
    remainingImages: {
      handler(newRemainingImages) {
        if (newRemainingImages.length === 0) {
          this.showPopup = false;
        }
      },
      deep: true,
    },
  },
};
</script>

<style scoped>
.image-list {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
}

.uploaded-image {
  width: 300px;
  height: 200px;
  object-fit: cover;
  margin-left: 40px;
  border-radius: 8px;
}

.modal-uploaded-image {
  width: 250px;
  height: 150px;
  object-fit: cover;
  margin-left: 40px;
  border-radius: 8px;
  margin-bottom: 30px;
}

.remove-btn {
  cursor: pointer;
}

.upload-frame {
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.3s;
}
.upload-frame:hover {
  background-color: #f3f4f6;
}
/* .uploaded-image,
.modal-uploaded-image {
  max-width: 150px;
  max-height: 150px;
  border-radius: 8px;
} */
</style>
