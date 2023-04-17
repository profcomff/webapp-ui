import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import SwiperCore, { Pagination } from 'swiper/core';

// Import Swiper styles
import 'swiper/swiper-bundle.css';

SwiperCore.use([Pagination]);

createApp(App).mount('#app')
