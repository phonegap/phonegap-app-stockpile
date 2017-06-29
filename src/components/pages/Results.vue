<template>
  <f7-page name="results">
    <f7-navbar sliding back-link="Search" title="Results"></f7-navbar>
    <!-- Scrollable page content-->
    <f7-block-title>{{ imagesReturned }}</f7-block-title>
    <f7-block>
      <f7-grid v-for="i in Math.ceil(images.length / 3)" key="i">
        <f7-col
          width="33"
          v-for="image in images.slice((i - 1) * 3, i * 3)"
          key="image.id"
        >
          <img
            class="result-image"
            @click="() => onImageClick(image.id)"
            :src="image.thumbnail_url"
         />
        </f7-col>
      </f7-grid>
    </f7-block>
  </f7-page>
</template>

<script>
  /* global store */
  import fetchStockAPIJSON from '../../utils/stockAPI';

  export default {
    name: 'Results',
    data () {
      return store;
    },
    methods: {
      fetchResults () {
        let { q = 'cats' } = this.$route.params;
        const { limit = 23, filter = 'words' } = this.$route.params;
        const columns = [
          'nb_results',
          'id',
          'title',
          'thumbnail_url',
          'thumbnail_1000_url'
        ];
        const parameters = [
          { key: 'thumbnail_size', val: '160' },
          { key: 'limit', val: limit },
          { key: filter, val: q }
        ];
        fetchStockAPIJSON({ columns, parameters })
          .then(json => {
            store.totalReturned = json.nb_results;
            store.images = json.files;
            // reduce the images by id
            store.imagesById = store.images.reduce((a, b) => {
              const c = a;
              c[b.id] = b;
              return c;
            }, {});
            this.$f7.hidePreloader();
          }).catch(ex => {
            console.log('fetching failed', ex);
            this.$f7.hidePreloader();
          });
      },
      onImageClick (id) {
        const index = this.photos.findIndex(element => {
          return element.id === id;
        });
        const albumPhotoBrowser = this.$f7.photoBrowser({
          photos: this.photos,
          type: 'page',
          backLinkText: 'Results',
          lazyLoading: true,
          lazyLoadingInPrevNext: true,
          lazyLoadingOnTransitionStart: true,
          initialSlide: index || 0
        });
        albumPhotoBrowser.open();
      }
    },
    computed: {
      imagesReturned () {
        const { q } = this.$route.params;
        const moreThan =
          this.totalReturned && this.images.length < this.totalReturned
            ? 'More than '
            : '';
        return this.images ? `${moreThan}${this.images.length} results for "${q}"` : '';
      },
      photos () {
        return this.images.map(image => {
          return {
            id: image.id,
            url: image.thumbnail_1000_url,
            caption: image.title
          };
        });
      }
    },
    created () {
      this.$f7.showPreloader('Searching');
      this.images = [];
      this.fetchResults();
    }
  };
</script>

<style scoped>
  .row {
    margin-bottom: 5px;
  }
  .result-image {
    width: 100%;
  }
</style>
