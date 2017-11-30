<template>
  <f7-page name="results">
    <f7-navbar sliding :back-link="backLink" title="Results"></f7-navbar>
    <!-- Scrollable page content-->
    <f7-block-title v-if="results">{{ imagesReturned }}</f7-block-title>
  </f7-page>
</template>

<script>
  export default {
    name: 'Results',
    data () {
      return {
        images: [],
        results: true
      };
    },
    computed: {
      backLink () {
        // back link label for iOS
        const { referrer } = this.$route.params;
        return referrer === 'details' ? 'Details' : 'Search';
      },
      imagesReturned () {
        // build the string to display for the number of results
        const { q } = this;
        const { filter } = this.$route.params;
        let message = 'Loading results...';
        if (!this.images.length) return message;
        // wait for something to be returned
        switch (filter) {
          case 'similar':
            message = `${this.totalReturned} similar results to ${q}`;
            break;
          case 'creator_id':
            const [ img ] = this.images;
            message = `${this.totalReturned} results for ${img.creator_name}`;
            break;
          default:
            message = `${this.totalReturned} results for "${q}"`;
        }
        return message;
      }
    }
  };
</script>
