<template>
  <div>
    <button
      v-if="!showChat"
      @click="showChatWindow"
      class="fixed bottom-0 right-0 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mb-8 mr-8"
    >
      Chat
    </button>

    <div
      v-if="showChat"
      class="fixed bottom-0 right-0 m-5 p-5 bg-white shadow-md rounded-lg w-[500px] h-[500px] overflow-hidden"
    >
      <a-button
        type="primary"
        @click="hideChatWindow"
        class="absolute top-0 right-0 m-2"
        ><i class="fa fa-close text-red-500 mr-2 text-base"></i> Đóng</a-button
      >

      <div
        class="max-h-[450px] overflow-y-auto max-w-[500px] pb-10"
        ref="chatWindow"
      >
        <br />
        <div
          v-for="(message, index) in messages"
          :key="index"
          class="flex mb-6"
        >
          <div
            v-if="message.type === 'user'"
            class="flex justify-end w-full mr-2"
          >
            <div class="bg-blue-500 text-white rounded-lg p-2 max-w-xs">
              <p>{{ message.content }}</p>
            </div>
          </div>
          <div
            v-else-if="message.type === 'bot'"
            class="flex justify-start w-full"
          >
            <div
              v-if="message.render === 'text'"
              class="bg-gray-500 text-white rounded-lg p-2 max-w-xs"
            >
              <p>{{ message.content }}</p>
            </div>
            <a-card v-else class="rounded w-64">
              <div class="flex items-center">
                <a-avatar
                  :src="message.content.avatar"
                  :size="32"
                  class="mr-2"
                />
                <div>
                  <p class="text-gray-600">{{ message.content.user_name }}</p>
                  <p class="text-sm text-gray-500">
                    {{ message.content.phone }}
                  </p>
                </div>
              </div>
              <div class="mt-2">
                <img
                  :src="message.content.images[0]"
                  alt="Post Image"
                  class="rounded mb-2 w-full h-24 object-cover"
                />
                <p class="text-sm text-gray-800">
                  Giá phòng : {{ formatCurrency(message.content.price) }}
                </p>
                <p class="text-sm text-gray-800">
                  Diện tích: {{ formatArea(message.content.area) }}
                </p>
                <p class="text-sm text-gray-800">
                  Địa chỉ: {{ message.content.location }}
                </p>
              </div>
              <a-button
                type="primary"
                @click="goToPost(message.content.post_id)"
                class="mt-2"
              >
                Xem bài đăng
              </a-button>
            </a-card>
          </div>
        </div>
      </div>

      <div class="absolute bottom-0 w-full bg-white p-2 flex items-center">
        <div v-if="isBotAnswering" class="ml-[200px] flex items-center">
          <div class="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <span>Bot đang trả lời...</span>
        </div>
        <div class="flex flex-1">
          <a-textarea
            v-model="inputMessage"
            @pressEnter="sendMessage"
            placeholder="Nhập yêu cầu của bạn..."
            class="ml-5 mr-2 w-[350px]"
            v-if="!isBotAnswering"
          />
          <a-button
            :disabled="inputMessage === '' || isBotAnswering"
            type="primary"
            @click="sendMessage"
            class="mt-2"
            v-if="!isBotAnswering"
            ><i class="fa fa-paper-plane mr-2" aria-hidden="true"></i>
            Gửi</a-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { message } from "ant-design-vue";
import { mapActions, mapState } from "vuex";
import markdownTable from "markdown-table";

export default {
  components: {},
  data() {
    return {
      showChat: false,
      inputMessage: "",
      messages: [{ content: "Chào bạn!!", type: "bot", render: "text" }],
      isBotAnswering: false,
    };
  },
  computed: {
    ...mapState({
      queryPosts: (state) => state.modules["chat"].queryPosts,
      normalMessage: (state) => state.modules["chat"].normalMessage,
      services: (state) => state.modules["service"].services,
    }),
    filteredPosts() {
      return this.queryPosts;
    },
  },
  async mounted() {
    await this.fetchAllServices();
  },
  methods: {
    ...mapActions({
      chatCompletion: "modules/chat/chatCompletion",
      fetchAllServices: "modules/service/fetchAllServices",
    }),
    showChatWindow() {
      this.showChat = true;
      this.$nextTick(() => {
        this.scrollToBottom();
      });
    },
    hideChatWindow() {
      this.showChat = false;
    },
    async callChatAPI() {
      try {
        this.isBotAnswering = true;
        let postMessage = this.inputMessage;
        this.inputMessage = "";
        if (postMessage.toLowerCase().includes("dịch vụ")) {
          this.messages.push({
            content: this.renderServices(),
            type: "bot",
            render: "text",
          });
          this.isBotAnswering = false;
          return;
        }
        const response = await this.chatCompletion(postMessage);
        console.log(response);
        if (typeof response !== "string") {
          if (this.queryPosts.length > 0) {
            this.messages.push({
              content: "Các phòng theo yêu cầu của bạn:",
              type: "bot",
              render: "text",
            });
            this.queryPosts.forEach((post) => {
              this.messages.push({
                content: post,
                type: "bot",
                render: "post",
              });
            });
          } else {
            this.messages.push({
              content:
                "Xin lỗi,tôi không tìm thấy thông tin theo yêu cầu của bạn\nVui lòng đưa ra các tiêu chí khác!",
              type: "bot",
              render: "text",
            });
          }
        } else {
          this.messages.push({
            content: this.normalMessage,
            type: "bot",
            render: "text",
          });
        }
        this.isBotAnswering = false;
      } catch (error) {
        console.error("Error calling Chat API:", error);
      }
    },
    renderServices() {
      const serviceList = this.services
        .map((service) => {
          return `• ${service.service_name}\n`;
        })
        .join("");
      return "Chúng tôi có các gói dịch vụ sau:\n\n" + serviceList;
    },

    async sendMessage() {
      if (this.inputMessage.trim() !== "") {
        this.messages.push({
          content: this.inputMessage,
          type: "user",
        });

        await this.callChatAPI();

        this.$nextTick(() => {
          this.scrollToBottom();
        });
        this.inputMessage = "";
      } else {
        message.warning("Vui lòng nhập tin nhắn");
      }
    },

    scrollToBottom() {
      const chatWindow = this.$refs.chatWindow;
      if (chatWindow) {
        chatWindow.scrollTop = chatWindow.scrollHeight;
      }
    },
    goToPost(postId) {
      this.$router.push(postId);
    },
    formatCurrency(price) {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(price);
    },
    formatArea(area) {
      return new Intl.NumberFormat("vi-VN").format(area) + " m²";
    },
  },
};
</script>

<style scoped>
.typing-indicator {
  display: flex;
  align-items: center;
}

.typing-indicator span {
  background-color: #ccc;
  border-radius: 50%;
  display: inline-block;
  height: 8px;
  width: 8px;
  margin: 0 2px;
  animation: typing 1s infinite;
}

.typing-indicator span:nth-child(1) {
  animation-delay: 0s;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.333s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.666s;
}

@keyframes typing {
  0% {
    opacity: 0.2;
    transform: translateY(0);
  }
  20% {
    opacity: 1;
    transform: translateY(-5px);
  }
  100% {
    opacity: 0.2;
    transform: translateY(0);
  }
}
</style>
