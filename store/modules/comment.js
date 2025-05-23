export const state = () => ({
  comments: [],
});

export const mutations = {
  SET_COMMENTS(state, comments) {
    state.comments = comments;
  },
};

export const actions = {
  getCommentsByPostId({ commit }, postId) {
    return new Promise((resolve, reject) => {
      this.$axios
        .get(`/api/v1/comments/${postId}`)
        .then((response) => {
          commit("SET_COMMENTS", response.data);
          resolve(response.data);
        })
        .catch((error) => {
          console.error(`Error fetching comments with id ${postId}:`, error);
          reject(error);
        });
    });
  },
  createComment({ commit }, payload) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post("/api/v1/comments", payload)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          console.error("Error creating coment", error);
          reject(error);
        });
    });
  },

  deleteComment({ commit }, commentId) {
    return new Promise((resolve, reject) => {
      this.$axios
        .delete(`/api/v1/comments/${commentId}`)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          console.error("Error deleting coment", error);
          reject(error);
        });
    });
  },
};
