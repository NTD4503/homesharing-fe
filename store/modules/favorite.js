export const state = () => ({
  favorite: null,
  favoritePosts: [],
});

export const mutations = {
  SET_FAVORITE(state, favorite) {
    state.favorite = favorite;
  },
  SET_FAVORITE_POSTS(state, favoritePosts) {
    state.favoritePosts = favoritePosts;
  },
};

export const actions = {
  favorPost({ commit }, payload) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post(`/api/v1/favorites/add`, payload)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          console.error(`Error favor post`, error);
          reject(error);
        });
    });
  },
  unfavorPost({ commit }, payload) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post(`/api/v1/favorites/remove`, payload)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          console.error(`Error unfavor post`, error);
          reject(error);
        });
    });
  },
  fetchFavoriteByPost({ commit }, payload) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post(`/api/v1/favorites/by-post`, payload)
        .then((response) => {
          commit("SET_FAVORITE", response.data);
          resolve(response.data);
        })
        .catch((error) => {
          console.error(`Error unfavor post`, error);
          reject(error);
        });
    });
  },
  fetchFavoriteByUser({ commit }, payload) {
    console.log(payload);
    return new Promise((resolve, reject) => {
      this.$axios
        .post(`/api/v1/favorites/by-user`, payload)
        .then((response) => {
          commit("SET_FAVORITE_POSTS", response.data);
          resolve(response.data);
        })
        .catch((error) => {
          console.error(`Error unfavor post`, error);
          reject(error);
        });
    });
  },
};
