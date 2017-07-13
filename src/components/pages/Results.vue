<template>
  <f7-page name="results" @page:reinit="onPageReinit">
    <f7-navbar sliding :back-link="backLink" title="Results"></f7-navbar>
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
  import fetchStockAPIJSON from '../../utils/stockAPI';

  export default {
    name: 'Results',
    data () {
      return {
        images: []
      };
    },
    methods: {
      fetchResults (q, limit, filter) {
        const columns = [
          'nb_results',
          'id',
          'title',
          'thumbnail_url',
          'thumbnail_500_url',
          'thumbnail_1000_url',
          'content_type',
          'creation_date',
          'creator_name',
          'creator_id',
          'category',
          'description',
          'content_type',
          'keywords',
          'comp_url'
        ];
        const parameters = [
          { key: 'thumbnail_size', val: '160' },
          { key: 'limit', val: limit },
          { key: filter, val: q }
        ];
        fetchStockAPIJSON({ columns, parameters })
          .then(json => {
            this.totalReturned = json.nb_results;
            this.images = json.files;
            // reduce the images by id
            this.imagesById = this.images.reduce((a, b) => {
              const c = a;
              c[b.id] = b;
              return c;
            }, {});
            // Load the data for this page into the store
            Object.assign(window.store, {
              images: this.images,
              imagesById: this.imagesById,
              totalReturned: this.totalReturned
            });
            this.$f7.hidePreloader();
          }).catch(ex => {
            console.log('fetching failed', ex);
            this.$f7.hidePreloader();
          });
      },
      onImageClick (id) {
        const { mainView: { router } } = this.$f7;
        router.loadPage(`/results/details/${id}`);
      },
      onPageReinit () {
        // Load the data for this page back into the store
        Object.assign(window.store, {
          images: this.images,
          imagesById: this.imagesById,
          totalReturned: this.totalReturned
        });
      }
    },
    computed: {
      backLink () {
        const { referrer } = this.$route.params;
        return referrer === 'details' ? 'Details' : 'Search';
      },
      imagesReturned () {
        const { q } = this;
        const { filter } = this.$route.params;
        if (!this.images) return '';
        const moreThan =
          this.totalReturned && this.images.length < this.totalReturned
            ? 'More than '
            : '';
        if (filter === 'similar') {
          return this.images.length ? `${moreThan}${this.images.length} similar results to ${q}` : '';
        }
        if (filter === 'creator_id') {
          return this.images.length ? `${moreThan}${this.images.length} results for ${this.images[0].creator_name}` : '';
        }
        return this.images.length ? `${moreThan}${this.images.length} results for "${q}"` : '';
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
    mounted () {
      this.images = [];
      Object.assign(this, this.$route.params);
      this.$f7.showPreloader('Searching');
      this.fetchResults(this.q, this.limit, this.filter);
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
