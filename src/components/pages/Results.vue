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
          'nb_results', 'id', 'title', 'thumbnail_url', 'thumbnail_500_url',
          'thumbnail_1000_url', 'content_type', 'creation_date',
          'creator_name', 'creator_id', 'category', 'description',
          'content_type', 'keywords', 'comp_url'
        ];
        const parameters = [
          { key: 'thumbnail_size', val: '160' },
          { key: 'limit', val: limit },
          { key: filter, val: q },
          { key: 'offset', val: offset }
        ];
        const method = 'GET';

        fetchStockAPIJSON({ method, columns, parameters })
          .then(json => {
            if (json.nb_results >= this.totalReturned) {
              this.totalReturned = json.nb_results;
            }

            // merge the two arrays adding in the new results
            this.images = this.images.concat(json.files);

            // reduce the images array into an object referenced by id...
            const imagesById = this.images.reduce((a, b) => {
              const c = a;
              c[b.id] = b;
              return c;
            }, {});
            // ...then merge with existing imagesById
            this.imagesById = Object.assign({}, this.imagesById, imagesById);

            // update the store
            // merging new and existing data using Object.assign()
            window.store = Object.assign(window.store, {
              images: this.images,
              imagesById: this.imagesById,
              totalReturned: this.totalReturned
            });

            // set the new offset
            this.offset = offset + limit; // not working currently...see: issue #4

            // remove the spinning preloader if we have all the results
            if (json.files.length === 0) {
              this.$$('.infinite-scroll-preloader').remove();
            }
          }).catch(ex => {
            console.log('fetching failed', ex);
            this.$$('.infinite-scroll-preloader').remove();
          });
      },
      onInfiniteScroll () {
        const limit = parseInt(this.limit, 10);
        const offset = parseInt(this.offset, 10);
        if (this.totalReturned === this.images.length) {
          return;
        }
        this.fetchResults(this.q, limit, this.filter, offset);
      },
      onImageClick (id) {
        // route to the details page
        const { mainView: { router } } = this.$f7;
        router.loadPage(`/results/details/${id}`);
      },
      onPageReinit () {
        // load the data for this page back into the store
        Object.assign(window.store, {
          images: this.images,
          imagesById: this.imagesById,
          totalReturned: this.totalReturned
        });
      }
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
        if (!this.images) {
          return '';
        }
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
        // default
        return this.images.length
          ? `${this.totalReturned} results for "${q}"`
          : '';
      }
    },
    mounted () {
      // set some initial defaults
      Object.assign(this, this.$route.params);
      this.offset = parseInt(this.offset, 10) || 0;
      this.limit = parseInt(this.limit, 10) || 60;
      this.images = [];
      this.totalReturned = 0;
      this.fetchResults(this.q, this.limit, this.filter, this.offset);
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
  /* tablets / landscape */
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
