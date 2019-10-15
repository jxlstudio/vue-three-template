<template>
    <img class="logo" :src="logo" @error="loadPng" alt="Oxtops Logo" width="175">
</template>
<script>
import LogoSvg from '@/assets/logo.svg'
import LogoPng from '@/assets/logo.png'

export default {
  data () {
    return {
      logo: LogoSvg
    }
  },
  methods: {
    loadPng: function () {
      this.logo = LogoPng
    }
  }
}
</script>

<style lang="scss">
.logo {
    position: absolute;
    top: 20px;
    left: 20px;
    width: 175px;
}
</style>
