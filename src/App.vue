<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">
// Import Bulma's core
  @import "~bulma/sass/utilities/_all";
  @import url('https://fonts.googleapis.com/css?family=Lato:400,700,900&display=swap');
  $blue: #2f88a7;
  // Set your colors
  $primary: $blue;
  $primary-invert: findColorInvert($primary);
  $twitter: #4099FF;
  $twitter-invert: findColorInvert($twitter);

  // Setup $colors to use as bulma classes (e.g. 'is-twitter')
  $colors: (
      "white": ($white, $black),
      "black": ($black, $white),
      "light": ($light, $light-invert),
      "dark": ($dark, $dark-invert),
      "primary": ($primary, $primary-invert),
      "info": ($info, $info-invert),
      "success": ($success, $success-invert),
      "warning": ($warning, $warning-invert),
      "danger": ($danger, $danger-invert),
      "twitter": ($twitter, $twitter-invert)
  );

  // Links
  $link: $primary;
  $link-invert: $primary-invert;
  $link-focus-border: $primary;

  * {
    font-family: 'Lato', Arial, Helvetica, sans-serif
  }

  // Import Bulma and Buefy styles
  @import "~bulma";
  @import "~buefy/src/scss/buefy";

</style>
