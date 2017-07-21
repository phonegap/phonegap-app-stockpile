<template>
  <f7-page name="results" @page:reinit="onPageReinit"
   infinite-scroll @infinite="onInfiniteScroll"
  >
    <f7-navbar sliding :back-link="backLink" title="Results"></f7-navbar>
    <!-- Scrollable page content-->
    <f7-block-title>{{ imagesReturned }}</f7-block-title>
    <f7-block>
      <div class="grid">
        <div class="cell" v-for="image in images">
          <img
            class="result-image"
            @click="() => onImageClick(image.id)"
            :src="image.thumbnail_url"
         />
        </div>
      </div>
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
      fetchResults (q, limit, filter, offset = 0) {
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
          { key: filter, val: q },
          { key: 'offset', val: offset }
        ];
        this.loading = true;
        fetchStockAPIJSON({ columns, parameters })
          .then(json => {
            if (json.nb_results >= this.totalReturned) {
              this.totalReturned = json.nb_results;
            }
            this.images = this.images.concat(json.files);
            // reduce the images by id
            const imagesById = this.images.reduce((a, b) => {
              const c = a;
              c[b.id] = b;
              return c;
            }, {});
            this.imagesById = Object.assign({}, this.imagesById, imagesById);
            // Load the data for this page into the store
            window.store = Object.assign(window.store, {
              images: this.images,
              imagesById: this.imagesById,
              totalReturned: this.totalReturned
            });
            this.offset = offset + limit; // not working currently... bug in the API?
            this.loading = false;
            if (this.totalReturned === this.images.length) {
              this.$$('.infinite-scroll-preloader').remove();
            }
          }).catch(ex => {
            console.log('fetching failed', ex);
            this.$$('.infinite-scroll-preloader').remove();
          });
      },
      onInfiniteScroll () {
        if (this.loading) return;
        if (this.totalReturned === this.images.length) return;
        this.fetchResults(this.q, parseInt(this.limit), this.filter, parseInt(this.offset));
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
        if (filter === 'similar') {
          return this.images.length
            ? `${this.totalReturned} similar results to ${q}`
            : '';
        }
        if (filter === 'creator_id') {
          const [ img ] = this.images;
          return this.images.length
            ? `${this.totalReturned} results for ${img.creator_name}`
            : '';
        }
        return this.images.length
          ? `${this.totalReturned} results for "${q}"`
          : '';
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
      this.loading = true;
      this.offset = 0;
      this.images = [];
      this.totalReturned = 0;
      Object.assign(this, this.$route.params);
      this.fetchResults(this.q, parseInt(this.limit), this.filter, parseInt(this.offset));
    }
  };
</script>

<style scoped>
  /* default for phones / portrait */
  .cell img {
    display: block;
    width: 100%;
  }
  .grid {
    background: #fff;
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
  }
  .cell {
    background: #fcfcfc;
    box-sizing: border-box;
    margin: 4px;
    width: calc(33% - 8px);
  }
  /* tablets landscape */
  @media screen and (min-width: 960px) {
    .cell {
      width: calc(25% - 8px);
    }
  }
  /* desktop */
  @media screen and (min-width: 1200px) {
    .cell {
      width: calc(20% - 8px);
    }
  }
</style>
