export const state = () => ({
  queryPosts: [],
  normalMessage: null,
});

export const mutations = {
  SET_QUERY_POSTS(state, posts) {
    state.queryPosts = posts;
  },
  SET_NORMAL_MESSAGE(state, normalMessage) {
    state.normalMessage = normalMessage;
  },
};

export const actions = {
  chatCompletion({ commit }, message) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post(`/api/v1/chat`, { message })
        .then((response) => {
          if (Array.isArray(response.data)) {
            commit("SET_QUERY_POSTS", response.data);
          } else {
            commit("SET_NORMAL_MESSAGE", response.data);
          }
          resolve(response.data);
        })
        .catch((error) => {
          console.error(`Error in chat completion:`, error);
          reject(error);
        });
    });
  },
};
