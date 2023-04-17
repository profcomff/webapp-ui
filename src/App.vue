<script setup>
import Updates from './components/Updates.vue'


</script>

<script>
export default {
  components: {
    Updates
  },
  data() {
    return {
      open: false,
    }
  },
  methods: {
    openModal() {
      this.open = !this.open
    },
  },
  mounted() {
    setTimeout(() => {
      this.open = true;
    }, 1000);
  }
}
</script>

<template>
  <Updates @closeModal="openModal"
    :open="this.open" />
  <div class="btn"
    @click="openModal">Update</div>
</template>

<style scoped>
.btn {
  cursor: pointer;
}
</style>
