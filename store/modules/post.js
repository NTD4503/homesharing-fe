export const state = () => ({
  posts: [],
  allPostsForAdmin: [],
  postsByUser: [],
  postTypes: [],
  roomTypes: [],
  latestPosts: [],
  hottestPosts: [],
  criteriaPosts: [],
  areaPosts: [],
  queryPosts: [],
  amenities: [],
  accurateAddress: "",
});

export const mutations = {
  SET_ACCURATE_ADDRESS(state, accurateAddress) {
    state.accurateAddress = accurateAddress;
  },
  SET_POSTS(state, posts) {
    state.posts = posts;
  },
  SET_ALL_POSTS_FOR_ADMIN(state, posts) {
    state.allPostsForAdmin = posts;
  },
  SET_POSTS_BY_USER(state, postsByUser) {
    state.postsByUser = postsByUser;
  },
  SET_POST_TYPES(state, postTypes) {
    state.postTypes = postTypes;
  },
  SET_ROOM_TYPES(state, roomTypes) {
    state.roomTypes = roomTypes;
  },
  SET_AMENITIES(state, amenities) {
    state.amenities = amenities;
  },
  SET_LATEST_POSTS(state, posts) {
    state.latestPosts = posts;
  },
  SET_HOTTEST_POSTS(state, posts) {
    state.hottestPosts = posts;
  },
  SET_CRITERIA_POSTS(state, posts) {
    state.criteriaPosts = posts;
  },
  SET_AREA_POSTS(state, posts) {
    state.areaPosts = posts;
  },
  SET_QUERY_POSTS(state, posts) {
    state.queryPosts = posts;
  },
};

export const actions = {
  fetchRoomTypes({ commit }) {
    return new Promise((resolve, reject) => {
      this.$axios
        .get("/api/v1/room/type/all")
        .then((response) => {
          commit("SET_ROOM_TYPES", response.data);
          resolve(response.data);
        })
        .catch((error) => {
          console.error("Error fetching post types:", error);
          reject(error);
        });
    });
  },

  updatePostRange({ commit }, { postId, dateRange, timeFrames }) {
    return new Promise((resolve, reject) => {
      this.$axios
        .put(`/api/v1/posts/${postId}/range`, {
          dateRange,
          timeFrames,
        })
        .then((response) => {
          console.log(`Post with ID ${postId} updated successfully.`);
          resolve(response.data);
        })
        .catch((error) => {
          console.error("Error updating post range:", error);
          reject(error);
        });
    });
  },

  fetchTotalPosts({ commit }, userId) {
    return new Promise((resolve, reject) => {
      this.$axios
        .get(`/api/v1/posts/count/total`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          console.error(error);
          reject(error);
        });
    });
  },

  fetchAmenities({ commit }) {
    return new Promise((resolve, reject) => {
      this.$axios
        .get("/api/v1/amenities/type/all")
        .then((response) => {
          commit("SET_AMENITIES", response.data);
          resolve(response.data);
        })
        .catch((error) => {
          console.error("Error fetching amenities:", error);
          reject(error);
        });
    });
  },

  fetchAmenityIds({ commit }, amenityNames) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post("/api/v1/amenities/ids-by-name", amenityNames)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          console.error("Error fetching amenities:", error);
          reject(error);
        });
    });
  },

  fetchPostTypes({ commit }) {
    return new Promise((resolve, reject) => {
      this.$axios
        .get("/api/v1/posts/type/all")
        .then((response) => {
          commit("SET_POST_TYPES", response.data);
          resolve(response.data);
        })
        .catch((error) => {
          console.error("Error fetching post types:", error);
          reject(error);
        });
    });
  },

  fetchAllPosts({ commit }) {
    return new Promise((resolve, reject) => {
      this.$axios
        .get("/api/v1/posts")
        .then((response) => {
          const filteredPosts = response.data.filter(post => !post.is_block);
          // console.log("datapost", response.data);
          commit("SET_POSTS", filteredPosts);
          resolve(filteredPosts);
        })
        .catch((error) => {
          console.error("Error fetching posts:", error);
          reject(error);
        });
    });
  },

  fetchAllPostsForAdmin({ commit }) {
    return new Promise((resolve, reject) => {
      this.$axios
        .get("/api/v1/posts")
        .then((response) => {
          commit("SET_ALL_POSTS_FOR_ADMIN", response.data);
          resolve(response.data);
        })
        .catch((error) => {
          console.error("Error fetching posts:", error);
          reject(error);
        });
    });
  },

  fetchLatestPosts({ commit }) {
    return new Promise((resolve, reject) => {
      this.$axios
        .get("/api/v1/posts/criteria/latest")
        .then((response) => {
          const filteredPosts = response.data.filter(post => !post.is_blocked);
          console.log('latePost store', filteredPosts);
          commit("SET_LATEST_POSTS", filteredPosts);
          resolve(filteredPosts);
        })
        .catch((error) => {
          console.error("Error fetching posts:", error);
          reject(error);
        });
    });
  },

  fetchHottestPosts({ commit }) {
    return new Promise((resolve, reject) => {
      this.$axios
        .get("/api/v1/posts/criteria/hottest")
        .then((response) => {
          commit("SET_HOTTEST_POSTS", response.data);
          resolve(response.data);
        })
        .catch((error) => {
          console.error("Error fetching posts:", error);
          reject(error);
        });
    });
  },

  createPost({ commit }, postData) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post("/api/v1/posts", postData)
        .then((response) => resolve(response.data))
        .catch((error) => {
          console.error("Error creating post:", error);
          reject(error);
        });
    });
  },

  updatePost({ commit }, { postId, updateData }) {
    return new Promise((resolve, reject) => {
      this.$axios
        .put(`/api/v1/posts/${postId}`, updateData)
        .then((response) => resolve(response.data))
        .catch((error) => {
          console.error(`Error updating post with id ${postId}:`, error);
          reject(error);
        });
    });
  },

  deletePost({ commit }, postId) {
    return new Promise((resolve, reject) => {
      this.$axios
        .delete(`/api/v1/posts/${postId}`)
        .then((response) => resolve(response.data))
        .catch((error) => {
          console.error(`Error deleting post with id ${postId}:`, error);
          reject(error);
        });
    });
  },

  updatePostApprovedStatus({ commit }, updateData) {
    return new Promise((resolve, reject) => {
      this.$axios
        .put(`/api/v1/posts/${updateData.post_id}/approved`, updateData)
        .then((response) => resolve(response.data))
        .catch((error) => {
          console.error(`Error updating post with id ${postId}:`, error);
          reject(error);
        });
    });
  },

  updatePostBlockedStatus({ commit }, updateData) {
    return new Promise((resolve, reject) => {
      this.$axios
        .put(`/api/v1/posts/${updateData.post_id}/blocked`, updateData)
        .then((response) => resolve(response.data))
        .catch((error) => {
          console.error(`Error updating post with id ${postId}:`, error);
          reject(error);
        });
    });
  },

  fetchPostsByUser({ commit }, userId) {
    return new Promise((resolve, reject) => {
      this.$axios
        .get(`/api/v1/posts/by-user/${userId}`)
        .then((response) => {
          commit("SET_POSTS_BY_USER", response.data);
          resolve(response.data);
        })
        .catch((error) => {
          console.error(
            `Error fetching posts by user with id ${userId}:`,
            error
          );
          reject(error);
        });
    });
  },

  filterPostsByCriteria({ commit }, criteria) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post("/api/v1/posts/filter-by-criteria", criteria)
        .then((response) => {
          commit("SET_CRITERIA_POSTS", response.data);
          resolve(response.data);
        })
        .catch((error) => {
          console.error("Error filtering posts by criteria:", error);
          reject(error);
        });
    });
  },
  filterPostsByArea({ commit }, areaCodes) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post("/api/v1/posts/filter-by-area", areaCodes)
        .then((response) => {
          commit("SET_AREA_POSTS", response.data);
          resolve(response.data);
        })
        .catch((error) => {
          console.error("Error filtering posts by area:", error);
          reject(error);
        });
    });
  },

  filterPostsByQuery({ commit }, query) {
    console.log(query);
    return new Promise((resolve, reject) => {
      this.$axios
        .post("/api/v1/posts/filter-by-query", { query })
        .then((response) => {
          commit("SET_QUERY_POSTS", response.data);
          resolve(response.data);
        })
        .catch((error) => {
          console.error("Error filtering posts by query:", error);
          reject(error);
        });
    });
  },
};
