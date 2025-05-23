export const state = () => ({});

export const mutations = {};

export const actions = {
  uploadImage({ commit }, image) {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("image", image);

      this.$axios
        .post("/api/v1/image-url", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          resolve(response.data.imageUrl);
        })
        .catch((error) => {
          console.error("Error uploading image:", error);
          reject(error);
        });
    });
  },
};
