<template>
  <div>
    <!-- Nút hiện chat -->
    <button
      v-if="!showChat"
      @click="showChatWindow"
      class="fixed bottom-0 right-0 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mb-8 mr-8 z-50"
    >
      Chat
    </button>

    <!-- Overlay và Chat box -->
    <div
      v-if="showChat"
      @click.self="hideChatWindow"
      class="fixed inset-0 bg-black bg-opacity-30 flex items-end justify-end z-40"
    >
      <div
        class="relative m-5 p-5 bg-white shadow-lg rounded-lg w-[700px] h-[600px] flex flex-col"
      >
        <!-- Nút đóng -->
        <button
          @click="hideChatWindow"
          class="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded"
        >
          Đóng
        </button>

        <!-- Nội dung chat -->
        <div class="flex flex-1 overflow-hidden mt-6">
          <!-- Sidebar -->
          <div class="w-1/3 border-r overflow-y-auto pr-2">
            <ul>
              <li
                v-for="conv in conversations || []"
                :key="conv.id"
                @click="selectConversation(conv)"
                class="cursor-pointer p-2 hover:bg-gray-100 flex items-center space-x-2"
                :class="{ 'font-bold bg-blue-50': currentConversationId === conv.id }"
              >
                <template v-if="userCache[getOtherUserId(conv)]?.avatar">
                  <img
                    :src="userCache[getOtherUserId(conv)].avatar"
                    alt="avatar"
                    class="w-10 h-10 rounded-full object-cover"
                  />
                </template>
                <template v-else>
                  <div
                    class="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-semibold"
                  >
                    {{ userCache[getOtherUserId(conv)]?.avatar }}
                  </div>
                </template>
                <span>{{ getUserNameByUserId(getOtherUserId(conv)) }}</span>
              </li>
            </ul>
          </div>

          <!-- Khung tin nhắn -->
          <div class="w-2/3 pl-4 flex flex-col">
            <div class="flex-1 overflow-y-auto space-y-2 pr-2">
              <div
                v-for="message in messages"
                :key="message.id + '-' + message.created_at"
                class="flex"
                :class="{
                  'justify-end': message.sender_id === confirmedUserId,
                  'justify-start': message.sender_id !== confirmedUserId
                }"
              >
                <div
                  :class="[ 
                    message.sender_id === confirmedUserId
                      ? 'bg-blue-500 text-white ml-auto' 
                      : 'bg-gray-200 text-black mr-auto', 
                    'rounded-lg px-3 py-2 max-w-[70%] break-words'
                  ]"
                >
                  {{ message.text }}
                </div>
              </div>
            </div>

            <!-- Nhập tin nhắn -->
            <div class="mt-2 flex">
              <input
                v-model="text"
                @keyup.enter="send"
                type="text"
                placeholder="Nhập tin nhắn..."
                class="border flex-1 px-3 py-2 rounded"
              />
              <button
                @click="send"
                class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded ml-2"
              >
                Gửi
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { mapState, mapActions } from 'vuex'
import { jwtDecode } from 'jwt-decode'

export default {
  data() {
    return {
      currentUserId: null,      // user nhập
      confirmedUserId: null,    // user đã xác nhận từ token
      text: '',
      newUser1: null,
      newUser2: null,
      showChat: false, // Biến để điều khiển hiển thị chat
    }
  },

  computed: {
    ...mapState({
      conversations: (state) => state.modules['message'].conversations,
      messages: (state) => state.modules['message'].messages,
      currentConversationId: (state) => state.modules['message'].currentConversationId,
      userCache: state => state.modules['user'].userCache || {},
    }),
  },

  async mounted() {
    window.addEventListener('open-chat', this.onOpenChatEvent)
    if (process.browser) {
      const token = localStorage.getItem("accessToken")
      if (token) {
        try {
          const decoded = jwtDecode(token)
          const userId = decoded.user?.user_id
          if (userId) {
            this.confirmedUserId = Number(userId)
            // console.log("user_id lấy từ token:", this.confirmedUserId)

            // Fetch conversations ngay khi lấy được userId
            await this.fetchConversations(this.confirmedUserId)
                  for (const conv of this.conversations) {
        const otherUserId = this.getOtherUserId(conv)
        if (otherUserId && !this.userCache[otherUserId]) {
          await this.fetchSingleUserById(otherUserId)
        }
      }
          } else {
            console.warn("Không tìm thấy user_id trong token")
          }
        } catch (err) {
          console.error("Lỗi giải mã token:", err)
        }
      } else {
        console.warn("Không tìm thấy accessToken trong localStorage")
      }
    }
  },

  beforeDestroy() {
  window.removeEventListener('open-chat', this.onOpenChatEvent)
},


  methods: {
    ...mapActions({
      fetchConversations: 'modules/message/fetchConversations',
      fetchMessages: 'modules/message/fetchMessages',
      createConversationAction: 'modules/message/createConversation',
      sendMessage: 'modules/message/sendMessage',
      fetchSingleUserById: 'modules/user/fetchSingleUserById',
    }),

      async onOpenChatEvent(event) {
    const conversationId = event.detail.conversationId
    const conversation = this.conversations.find(c => c.id === conversationId)
    if (conversation) {
      await this.selectConversation(conversation)
      this.showChatWindow()
    } else {
      console.warn("Không tìm thấy cuộc trò chuyện với ID:", conversationId)
    }
  },
    

    showChatWindow() {
      this.showChat = true
    },

    hideChatWindow() {
      this.showChat = false
    },

        getOtherUserId(conv) {
      if (!conv || !this.confirmedUserId) return null
      return conv.user1_id === this.confirmedUserId ? conv.user2_id : conv.user1_id
    },

    getUserNameByUserId(userId) {
      if (!userId) return 'Unknown user'
      return this.userCache[userId]?.user_name || `User #${userId}`
    },

    async send() {
      if (!this.text.trim()) return
      await this.sendMessage({
        conversation_id: this.currentConversationId,
        sender_id: this.confirmedUserId,
        text: this.text,
      })
      this.text = ''
    },

    async selectConversation(conversation) {
      this.$store.commit('modules/message/setCurrentConversationId', conversation.id)
      await this.fetchMessages({ conversationId: conversation.id, pusher: this.$pusher })

      // Load avatar/name của user đối thoại nếu chưa có
      const otherUserId = this.getOtherUserId(conversation)
      if (otherUserId && !this.userCache[otherUserId]) {
        const user = await this.fetchSingleUserById(otherUserId)
        console.log(`✅ [selectConversation] Fetched user:`, user)
      }
    },

        async createConversation() {
      if (!this.newUser1 || !this.newUser2) {
        alert('Nhập đủ user 1 và user 2 ID')
        return
      }
      try {
        const conversation = await this.createConversationAction({
          user1_id: this.newUser1,
          user2_id: this.newUser2,
        })

        this.$store.commit('modules/message/setCurrentConversationId', conversation.id)

        await this.fetchConversations(this.confirmedUserId)
        await this.fetchMessages({ conversationId: conversation.id, pusher: this.$pusher })

        // Tự động tải userCache cho user mới
        const otherUserId = this.getOtherUserId(conversation)
        if (otherUserId && !this.userCache[otherUserId]) {
          await this.fetchSingleUserById(otherUserId)
        }

        this.newUser1 = null
        this.newUser2 = null
      } catch (error) {
        console.error('Lỗi tạo cuộc trò chuyện:', error)
      }
    },
  },

    async onOpenChatEvent(e) {
    const conversationId = e.detail.conversationId
    if (!conversationId) return

    this.showChat = true
    this.$store.commit('modules/message/setCurrentConversationId', conversationId)
    await this.fetchMessages({ conversationId, pusher: this.$pusher })

    // Optional: fetch avatar người kia nếu chưa có
    const conv = this.conversations.find(c => c.id === conversationId)
    if (conv) {
      const otherId = this.getOtherUserId(conv)
      if (otherId && !this.userCache[otherId]) {
        await this.fetchSingleUserById(otherId)
      }
    }
  }

  
}
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
