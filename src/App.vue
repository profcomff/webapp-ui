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
      this.open = true
      document.body.style.overflow = 'hidden';
    },
    closeModal() {
      this.open = false
      document.body.style.overflow = '';
    }
  },
  mounted() {
    setTimeout(() => {
      this.openModal();
    }, 1000);
  }
}
</script>

<template>
  <Updates @closeModal="closeModal"
    :open="this.open" />
  <div class="btn"
    @click="openModal">Update</div>
</template>

<style scoped>
.btn {
  cursor: pointer;
}
</style>
