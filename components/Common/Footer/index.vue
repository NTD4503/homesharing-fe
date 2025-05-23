<template>
  <footer class="w-full mx-auto p-8 rounded-lg py-8 text-center">
    <div>
      <div class="flex items-center justify-center">
        <div
          class="w-2/3 h-1 bg-gray-400 hover:bg-gray-600 transition-colors duration-300"
        ></div>
      </div>
      <br />
      <div>
        <div class="text-center text-2xl mb-4">
          <span class="font-bold">Tại sao lại chọn rentalapp123.com?</span>
        </div>
        <p class="text-center text-lg mb-6 leading-relaxed">
          Chúng tôi biết bạn có rất nhiều lựa chọn, nhưng Phongtro123.com tự hào
          là trang web đứng top google về các từ khóa: cho thuê phòng trọ, nhà
          trọ, thuê nhà nguyên căn, cho thuê căn hộ, tìm người ở ghép, cho thuê
          mặt bằng... Vì vậy tin của bạn đăng trên website sẽ tiếp cận được với
          nhiều khách hàng hơn, do đó giao dịch nhanh hơn, tiết kiệm chi phí
          hơn.
        </p>
      </div>
      <div class="flex justify-center space-x-10 mb-6">
        <div>
          <span class="font-bold text-2xl">{{ totalUsers }}+</span>
          <br />
          <span class="text-lg">Thành viên</span>
        </div>
        <div>
          <span class="font-bold text-2xl">{{ totalPosts }}+</span>
          <br />
          <span class="text-lg">Bài đăng</span>
        </div>
      </div>
      <div class="text-lg mb-6">
        <span class="font-bold text-xl">Chi phí thấp, hiệu quả tối đa</span>
        <br />
        <div class="flex justify-center mt-2">
          <i
            class="fa fa-star text-yellow-500 text-2xl"
            v-for="(star, index) in 5"
            :key="index"
          ></i>
        </div>
      </div>
      <div class="flex items-center justify-center mt-6">
        <hr class="w-1/4 border-yellow-400 border-t-4 rounded-full" />
        <i class="fa fa-star text-yellow-400 mx-4"></i>
        <hr class="w-1/4 border-yellow-400 border-t-4 rounded-full" />
      </div>
      <div class="mt-12 text-center">
        <h2 class="text-2xl font-bold mb-6">CÓ GÌ Ở Rental123?</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          <div class="flex flex-col items-center">
            <img :src="apartmentSrc" alt="Căn hộ" class="w-12 h-12 mb-4" />
            <h3 class="font-bold text-lg mb-2">CĂN HỘ</h3>
            <p>
              Vệ sinh sạch sẽ, không gian thoáng mát, đầy đủ nội thất lắp đặt
              mới.
            </p>
          </div>
          <div class="flex flex-col items-center">
            <img :src="electricSrc" alt="Giá điện" class="w-12 h-12 mb-4" />
            <h3 class="font-bold text-lg mb-2">GIÁ ĐIỆN</h3>
            <p>
              Người thuê phòng sẽ được "trả tiền điện" theo đúng "khung giá nhà
              nước".
            </p>
          </div>
          <div class="flex flex-col items-center">
            <img :src="waterSrc" alt="Nước sinh hoạt" class="w-12 h-12 mb-4" />
            <h3 class="font-bold text-lg mb-2">NƯỚC SINH HOẠT</h3>
            <p>
              Người thuê phòng không phải lo "thiếu nước sạch" hay "giá tiền
              nước cao".
            </p>
          </div>
          <div class="flex flex-col items-center">
            <img :src="securitySrc" alt="An ninh" class="w-12 h-12 mb-4" />
            <h3 class="font-bold text-lg mb-2">AN NINH</h3>
            <p>
              Hệ thống an ninh đảm bảo an toàn từ "camera giám sát" đến "bảo mật
              vân tay".
            </p>
          </div>
          <div class="flex flex-col items-center">
            <img :src="cultureSrc" alt="Văn hóa" class="w-12 h-12 mb-4" />
            <h3 class="font-bold text-lg mb-2">VĂN HÓA</h3>
            <p>
              Nếp sống văn hóa lành mạnh, thân thiện & gần gũi trong khu nhà
              trọ.
            </p>
          </div>
          <div class="flex flex-col items-center">
            <img :src="supportSrc" alt="Hỗ trợ 24h" class="w-12 h-12 mb-4" />
            <h3 class="font-bold text-lg mb-2">HỖ TRỢ 24H</h3>
            <p>
              Đội ngũ vận hành hỗ trợ 24h, xử lý mọi vấn đề cho người thuê
              phòng.
            </p>
          </div>
        </div>
      </div>
      <br />
      <div class="flex items-center justify-center mt-6">
        <hr class="w-1/4 border-yellow-400 border-t-4 rounded-full" />
        <i class="fa fa-star text-yellow-400 mx-4"></i>
        <hr class="w-1/4 border-yellow-400 border-t-4 rounded-full" />
      </div>
      <br />
      <div class="text-center">
        <p class="text-2xl font-bold mb-6">Đánh giá từ người dùng</p>
        <p><i class="fa fa-quote-left text-2xl" aria-hidden="true"></i></p>
      </div>
      <br />
      <div class="mb-6">
        <p class="italic text-lg">
          "Trước khi biết website rental123, mình phải tốn nhiều công sức và chi
          phí cho việc đăng tin cho thuê: từ việc phát tờ rơi, dán giấy, và đăng
          lên các website khác nhưng hiệu quả không cao. Từ khi biết website
          phongtro123.com, mình đã thử đăng tin lên và đánh giá hiệu quả khá cao
          trong khi chi phí khá thấp, không còn tình trạng phòng trống kéo dài."
        </p>
        <span class="block mt-2 text-right text-lg"
          >- Anh Khánh (chủ hệ thống phòng trọ tại Tp.HCM)</span
        >
      </div>
      <div>
        <button
          @click="handlePostClick"
          class="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-full transition duration-300"
        >
          Đăng tin ngay
        </button>
      </div>
    </div>
  </footer>
</template>

<script>
import { mapActions, mapState } from "vuex";
import apartmentSrc from "../../../static/apartment.png";
import waterSrc from "../../../static/water.png";
import securitySrc from "../../../static/security.png";
import cultureSrc from "../../../static/culture.png";
import electricSrc from "../../../static/electric.png";
import supportSrc from "../../../static/support.png";

export default {
  data() {
    return {
      totalPosts: null,
      totalUsers: null,
      apartmentSrc,
      waterSrc,
      securitySrc,
      cultureSrc,
      electricSrc,
      supportSrc,
    };
  },
  computed: {
    ...mapState({}),
  },
  async created() {
    this.totalPosts = await this.fetchTotalPosts();
    this.totalUsers = await this.fetchTotalUsers();
  },
  methods: {
    ...mapActions({
      fetchTotalUsers: "modules/user/fetchTotalUsers",
      fetchTotalPosts: "modules/post/fetchTotalPosts",
    }),
    handlePostClick() {
      const token = localStorage.getItem("accessToken");
      if (token) {
        this.$router.push("manage/new-post");
      } else {
        this.$router.push("/login");
      }
    },
  },
};
</script>
