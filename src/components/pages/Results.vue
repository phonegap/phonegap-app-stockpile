<template>
  <f7-page name="results">
    <f7-navbar sliding back-link="Search" title="Results"></f7-navbar>
    <!-- Scrollable page content-->
    <f7-block-title>{{ imagesReturned }}</f7-block-title>
    <f7-block>
      <f7-grid v-for="i in Math.ceil(images.length / 3)" key="i">
        <f7-col width="33" v-for="image in images.slice((i - 1) * 3, i * 3)" key="image.id">
          <img @click="() => onImageClick(image.id)" :src="image.thumbnail_url" style="width: 100%" />
        </f7-col>
      </f7-grid>
    </f7-block>
    <!-- Photo Browser -->
    <!-- @TODO Add custom navbar template to allow Favorites -->
    <f7-photo-browser ref="photoBrowser" :photos="photos"></f7-photo-browser>
  </f7-page>
</template>

<script>
  /* global store fetch */

  export default {
    name: 'Results',
    data () {
      return store;
    },
    methods: {
      fetchResults () {
        let { q } = this.$route.params;
        const { limit, filter } = this.$route.params; // eslint-disable-line no-unused-vars
        const apiURL =
          `https://stock.adobe.io/Rest/Media/1/Search/Files?search_parameters[limit]=${limit}&search_parameters[${filter}]=${q}`;
        const myHeaders = new Headers({
          'x-api-key': '35600b72b7b04b8fb240dfb952058eb8', // replace with your api-key
          'X-Product': 'Stockpile/0.0.1'
        });
        console.log(filter);
        const myInit = {
          method: 'GET',
          headers: myHeaders
        };
        fetch(apiURL, myInit)
          .then(response => response.json())
          .then((json) => {
            store.images = json.files;
            console.log(store.images);
            // reduce the images by id
            store.imagesById = store.images.reduce((a, b) => {
              const c = a;
              c[b.id] = b;
              return c;
            }, {});
            console.log(store);
            this.$f7.hidePreloader();
          }).catch((ex) => {
            console.log('fetching failed', ex);
            this.$f7.hidePreloader();
          });
      },
      onImageClick (id) {
        const index = this.photos.findIndex(element => {
          return element.id === id;
        });
        console.log(index);
        const albumPhotoBrowser = this.$f7.photoBrowser({
          photos: this.photos,
          type: 'page',
          backLinkText: 'Results',
          lazyLoading: true,
          initialSlide: index || 0
        });
        albumPhotoBrowser.open();
      }
    },
    computed: {
      imagesReturned () {
        const { q } = this.$route.params;
        return this.images ? `${this.images.length} reults for "${q}"` : '';
      },
      photos () {
        return this.images.map(image => {
          return {
            id: image.id,
            url: image.thumbnail_url,
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
</style>
