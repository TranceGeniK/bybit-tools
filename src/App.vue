<template>
  <v-app>
    <Drawer v-model="drawer"></Drawer>
    <HeaderComp @toggleDrawer="drawer = !drawer"></HeaderComp>
    <Home></Home>
  </v-app>
</template>

<script>
  import Drawer from './components/Drawer';
  import HeaderComp from './components/HeaderComp';
  import Home from './components/Home';
  
  export default {
    name: 'App',
    components: {
      Home, HeaderComp, Drawer,
    },
    created() {
      this.$vuetify.theme.dark = true;
      this.$vuetify.theme.themes.dark.primary = '#eba51d';
      this.$vuetify.theme.themes.dark.success = '#78b63f';
      this.$vuetify.theme.themes.dark.error = '#ba4967';
    },
    data: () => ({
      drawer: false,
    }),
  };
</script>

<style lang="scss">
  html {
    overflow-y: auto !important;
  }
  
  .logo {
    display: inline;
  }
</style>