<template>
  <div>
    <a-upload
      :show-upload-list="false"
      :before-upload="handleFileUpload"
      :disabled="isFileUploaded"
    >
      <a-avatar
        :src="imageUrl"
        v-if="imageUrl"
        :size="100"
        class="cursor-pointer"
        :class="{ 'border-blue-500': imageUrl }"
        :style="{ 'border-width': imageUrl ? '2px' : '0' }"
      />
      <a-avatar icon="user" v-else :size="100" class="cursor-pointer" />
    </a-upload>
  </div>
</template>

<script>
export default {
  props: {
    avatar: {
      required: true,
    },
  },
  data() {
    return {
      imageUrl: "",
      isFileUploaded: false,
    };
  },
  methods: {
    handleFileUpload(file) {
      if (!this.isFileUploaded) {
        const reader = new FileReader();
        reader.onload = () => {
          this.imageUrl = reader.result;
          this.isFileUploaded = true;
        };
        reader.readAsDataURL(file);
      }
      return false; 
    },
  },
};
</script>

<style scoped>
</style>
