<template>
  <div id="app">
    <apt-price :data="priceData"></apt-price>
  </div>
</template>

<script>
import AptPrice from './components/AptPrice.vue';

export default {
  components: {
    AptPrice,
  },
  data() {
    return {
      priceData: [],
    };
  },
};
</script>

<style scoped>
/* Add styles here */
</style>
