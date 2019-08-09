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
      this.$vuetify.theme.themes.dark.primary = '#eba51d'
    },
    data: () => ({
      drawer: null,
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