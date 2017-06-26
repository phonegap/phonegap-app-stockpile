<template>
  <f7-page name="search">
    <f7-navbar>
      <f7-nav-left sliding>
        <f7-link icon="icon-bars" open-panel="left"></f7-link>
      </f7-nav-left>
      <f7-nav-center sliding>{{ title }}</f7-nav-center>
    </f7-navbar>
    <!-- Scrollable page content-->
    <form form method="GET" id="search-form" @submit.prevent="onSubmit">
	    <f7-list>
        <f7-list-item>
          <f7-input type="text" name="q"
          placeholder="image search" ref="searchInput"
          autocorrect="off" autocapitalize="off"  />
        </f7-list-item>
      </f7-list>
      <f7-block>
        <input type="hidden" name="limit" value="23" />
    		<input
          type="submit"
          class="button button-big button-fill search-submit"
          value="Find Tracks"
        />
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
      onSubmit () {
        const { filter, limit, q } = this.$f7.formToJSON('#search-form');
        const { searchInput } = this.$refs;
        const { router } = this.$f7.mainView;
        const input = searchInput.$el.querySelector('input');

        input.blur();

        if (!q.trim()) {
          this.$f7.alert('Please enter a search term', 'Search Error');
          return;
        }
        router.loadPage(`/results/${filter || 'words'}/${limit}/${q}`);
      }
    }
  };
</script>
