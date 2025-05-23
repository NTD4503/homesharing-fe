<template>
  <div class="slider">
    <div class="slides" :style="{ transform: 'translateX(' + offset + 'px)' }">
      <div class="slide" v-for="(image, index) in images" :key="index">
        <img
          :src="image"
          class="rounded h-full"
          @click="showPopup(image)"
          style="cursor: pointer"
        />
      </div>
    </div>
    <div class="navigation prev" @click="slide('prev')">
      <i class="fa fa-chevron-left"></i>
    </div>
    <div class="navigation next" @click="slide('next')">
      <i class="fa fa-chevron-right"></i>
    </div>
    <div class="pagination">
      <span
        v-for="(image, index) in images"
        :key="index"
        class="dot"
        :class="{ active: index === currentIndex }"
        @click="goToSlide(index)"
      ></span>
    </div>
    <a-modal
      :visible.sync="modalVisible"
      :footer="null"
      @cancel="modalVisible = false"
      :width="800"
      :height="200"
    >
      <div class="flex justify-center">
        <img
          :src="modalImageUrl"
          alt="Image"
          class="rounded-lg h-full"
        />
      </div>
      <div
        class="navigation prev"
        style="
          position: absolute;
          top: 50%;
          left: 0;
          transform: translateY(-50%);
        "
        @click="prevModalImage"
      >
        <i class="fa fa-chevron-left"></i>
      </div>
      <div
        class="navigation next"
        style="
          position: absolute;
          top: 50%;
          right: 0;
          transform: translateY(-50%);
        "
        @click="nextModalImage"
      >
        <i class="fa fa-chevron-right"></i>
      </div>
    </a-modal>
  </div>
</template>

<script>
export default {
  props: {
    images: {
      required: true,
      type: Array,
    },
  },
  data() {
    return {
      currentIndex: 0,
      offset: 0,
      modalImageUrl: null,
      modalVisible: false,
      slideWidth: 900, // Adjust slide width according to your design
    };
  },
  methods: {
    showPopup(image) {
      this.modalImageUrl = image;
      this.modalVisible = true;
    },
    slide(direction) {
      const numSlides = this.images.length;
      if (direction === "prev") {
        this.currentIndex = (this.currentIndex - 1 + numSlides) % numSlides;
      } else {
        this.currentIndex = (this.currentIndex + 1) % numSlides;
      }
      this.offset = -this.currentIndex * this.slideWidth;
    },
    goToSlide(index) {
      this.currentIndex = index;
      this.offset = -this.currentIndex * this.slideWidth;
    },
    prevModalImage() {
      this.slide("prev");
      this.modalImageUrl = this.images[this.currentIndex];
    },
    nextModalImage() {
      this.slide("next");
      this.modalImageUrl = this.images[this.currentIndex];
    },
  },
};
</script>

<style scoped>
.slider {
  border-radius: 10px;
  position: relative;
  width: 900px; /* Adjust slider width */
  height: 600px;
  overflow: hidden;
  margin: 0 auto;
  display: flex;
  align-items: center;
}

.slides {
  display: flex;
  transition: transform 0.5s ease;
}

.slide {
  flex-shrink: 0;
  width: 900px; /* Adjust slide width */
  width: 100%;
}

.navigation {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 24px; /* Adjust icon size */
}

.navigation.prev {
  left: 0;
}

.navigation.next {
  right: 0;
}

.pagination {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
}

.dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  background-color: #bbb;
  border-radius: 50%;
  margin: 0 5px;
  cursor: pointer;
}

.dot.active {
  background-color: #000;
}
</style>
