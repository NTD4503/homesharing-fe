<template>
  <div class="fixed bottom-0 right-0 m-5 p-5 bg-white shadow-md rounded-lg w-[700px] h-[600px] flex flex-col">
    <!-- Header: Nhập ID người dùng -->
    <div class="flex items-center justify-between mb-4">
      <input
        v-model="currentUserId"
        type="number"
        placeholder="Nhập ID người dùng"
        class="border px-2 py-1 rounded w-1/2"
      />
      <button @click="confirmUser" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded">
        Xác nhận
      </button>
      <a-button @click="HandleuserCacheLog">userCacheLog</a-button>

    </div>

    <!-- Content -->
    <div class="flex flex-1 overflow-hidden">
      <!-- Danh sách cuộc trò chuyện (30%) -->
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
                class="w-10 h-10 rounded-full"
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

      <!-- Tin nhắn (70%) -->
      <div class="w-2/3 pl-4 flex flex-col">
        <div class="flex-1 overflow-y-auto space-y-2 pr-2">
          <div
            v-for="message in messages || []"
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
                'rounded-lg px-3 py-2 max-w-xs break-words'
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
            class="border flex-1 px-2 py-1 rounded"
          />
          <button
            @click="send"
            class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded ml-2"
          >
            Gửi
          </button>
        </div>
      </div>
    </div>

    <!-- Footer: Tạo cuộc trò chuyện -->
    <div class="mt-4 border-t pt-2">
      <div class="flex space-x-2">
        <input
          v-model.number="newUser1"
          type="number"
          placeholder="User 1 ID"
          class="border px-2 py-1 rounded"
        />
        <input
          v-model.number="newUser2"
          type="number"
          placeholder="User 2 ID"
          class="border px-2 py-1 rounded"
        />
        <button @click="createConversation" class="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded">
          Tạo cuộc trò chuyện
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  data() {
    return {
      currentUserId: null,      // ID người dùng nhập
      confirmedUserId: null,    // ID người dùng đã xác nhận
      text: '',
      newUser1: null,
      newUser2: null,
    }
  },
  watch: {
    currentConversationId(newId) {
      if (newId) {
        this.fetchMessages({ conversationId: newId, pusher: this.$pusher })
      }
    }
  },
  computed: {
    ...mapState({
      conversations: (state) => state.modules['message'].conversations,
      messages: (state) => state.modules['message'].messages,
      currentConversationId: (state) => state.modules['message'].currentConversationId,
      userCache: state => state.modules['user'].userCache || {}, // cache user data (avatar, name...)
    }),
      userCacheLog() {
    
    return this.userCache
  }
  },
  methods: {
    ...mapActions({
      fetchConversations: 'modules/message/fetchConversations',
      fetchMessages: 'modules/message/fetchMessages',
      createConversationAction: 'modules/message/createConversation',
      sendMessage: 'modules/message/sendMessage',
      fetchSingleUserById: 'modules/user/fetchSingleUserById',  // để load avatar/name khi cần
    }),

    getOtherUserId(conv) {
      if (!conv || !this.confirmedUserId) return null
      return conv.user1_id === this.confirmedUserId ? conv.user2_id : conv.user1_id
    },

    getUserNameByUserId(userId) {
      if (!userId) return 'Unknown user'
      return this.userCache[userId]?.user_name || `User #${userId}`
    },

    async confirmUser() {
      if (!this.currentUserId) {
        alert('Vui lòng nhập ID người dùng hợp lệ')
        return
      }
      this.confirmedUserId = Number(this.currentUserId)
      await this.fetchConversations(this.confirmedUserId)

      // Load avatar/name của tất cả user trong conversations vào userCache
      for (const conv of this.conversations) {
        const otherUserId = this.getOtherUserId(conv)
        if (otherUserId && !this.userCache[otherUserId]) {
          await this.fetchSingleUserById(otherUserId)
        }
      }
    },

    async send() {
      if (!this.text.trim()) return
      if (!this.currentConversationId) {
        alert('Vui lòng chọn cuộc trò chuyện')
        return
      }
      await this.sendMessage({
        conversation_id: this.currentConversationId,
        sender_id: this.confirmedUserId,
        text: this.text,
      })
      this.text = ''
      await this.fetchMessages({ conversationId: this.currentConversationId, pusher: this.$pusher })
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

    HandleuserCacheLog() {
  console.log("DataSource:", this.userCacheLog);
},

      conversationAvatars() {
    return this.conversations.map(conv => {
      const otherUserId = this.getOtherUserId(conv)
      const avatar = this.userCache[otherUserId]?.avatar || '0'
      console.log(`Avatar for user ${otherUserId}:`, avatar)
      return avatar
    })
  }


  },
}
</script>
