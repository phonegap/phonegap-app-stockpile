<template>
  <f7-page name="search">
    <f7-navbar>
      <f7-nav-left sliding>
        <f7-link icon-f7="bars" open-panel="left"></f7-link>
      </f7-nav-left>
      <f7-nav-center sliding>{{ title }}</f7-nav-center>
    </f7-navbar>
    <!-- Scrollable page content-->
    <f7-block-title>Search for Stock images by keyword</f7-block-title>
    <form ref="searchForm" form method="GET">
      <f7-list>
        <f7-list-item>
          <f7-label floating v-if="isMaterial">Image search</f7-label>
          <f7-input type="search" name="q"
            placeholder="Image search" ref="searchInput"
            autocorrect="off" autocapitalize="off"  />
        </f7-list-item>
      </f7-list>
      <f7-block>
        <input type="hidden" name="limit" value="60" />
        <input type="submit" name="submit" class="hidden" value="Search" />
        <f7-button @click.prevent="onSubmit" big raised fill>
          Find Images
        </f7-button>
        </f7-block>
    </form>
  </f7-page>
</template>

<script>
  export default {
    name: 'Search',
    data () {
      return {
        title: 'Search'
      };
    },
    methods: {
      onSubmit () {}
    },
    computed: {
      isMaterial () {
        return window.isMaterial;
      }
    },
    created () {
      this.$f7.mainView.history = ['/'];
    }
  };
</script>

<style scoped>
  .hidden {
    display: none;
  }
</style>
