import axios from 'axios'

let channels = {}

export default {
    namespaced: true,
    state: {
        conversations: [],
        messages: [],
        currentConversationId: null,
    },
    mutations: {
        setConversations(state, conversations) {
            state.conversations = conversations
        },
        setMessages(state, messages) {
            state.messages = messages
        },
        setCurrentConversationId(state, id) {
            state.currentConversationId = id
        },
        addMessage(state, message) {
            state.messages.push(message)
        },
    },
    actions: {
        async fetchConversations({ commit }, userId) {
            const res = await axios.get(`http://localhost:4000/api/v1/chat/conversations/${userId}`)
            commit('setConversations', res.data)
        },

        async fetchMessages({ commit, dispatch }, { conversationId, pusher }) {
            const res = await axios.get(`http://localhost:4000/api/v1/chat/messages/${conversationId}`)
            commit('setMessages', res.data)
            dispatch('subscribeToConversation', { conversationId, pusher })
        },

        async createConversation({ commit }, { user1_id, user2_id }) {
            const res = await axios.post('http://localhost:4000/api/v1/chat/conversations', { user1_id, user2_id })
            commit('setCurrentConversationId', res.data.id)
            return res.data
        },

        async sendMessage({ commit }, { conversation_id, sender_id, text, image_url = '' }) {
            const res = await axios.post('http://localhost:4000/api/v1/chat/messages', { conversation_id, sender_id, text, image_url })
            // commit('addMessage', res.data)
            return res.data
        },

        subscribeToConversation({ state, commit }, { conversationId, pusher }) {
            if (!pusher) {
                console.warn('Pusher chưa được khởi tạo, truyền pusher instance vào action')
                return
            }

            if (channels[conversationId]) return // đã subscribe rồi

            const channel = pusher.subscribe(`chat-${conversationId}`)

            channel.bind('new-message', (message) => {
                if (state.currentConversationId === conversationId) {
                    commit('addMessage', message)
                }
            })

            channels[conversationId] = channel
        },
    },
}
