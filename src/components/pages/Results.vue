<template>
  <f7-page name="results" @page:reinit="onPageReinit"
   infinite-scroll @infinite="onInfiniteScroll"
   :infinite-scroll-preloader="false"
  >
    <f7-navbar sliding :back-link="backLink" title="Results"></f7-navbar>
    <!-- Scrollable page content-->
    <f7-block-title v-if="results">{{ imagesReturned }}</f7-block-title>
    <f7-block v-if="results">
      <div class="grid">
        <div class="cell"
          v-if="!images.length"
          v-for="n in 60"
          :key="n"
        >
          <div class="placeholder" />
        </div>
        <div class="cell"
          v-for="image in images"
          @click="() => onImageClick(image.id)"
          :key="image.id"
        >
          <img
            :src="image.thumbnail_url"
         />
        </div>
      </div>
    </f7-block>
    <f7-block v-if="!results">
      <p class="center">No results found.</p>
      <p class="center">Go back and try a different search?</p>
    </f7-block>
    <div class="infinite-scroll-preloader">
      <f7-preloader :style="images.length ? '' : 'display: none; animation: none'" />
    </div>
  </f7-page>
</template>

<script>
  import fetchStockAPIJSON from '../../utils/stockAPI';

  export default {
    name: 'Results',
    data () {
      return {
        images: [],
        results: true
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

        fetchStockAPIJSON({ columns, parameters })
          .then(json => {
            // remove preloader if no results returned
            //  either from the end of the pagination or no results
            if (json.nb_results === 0) {
              this.$$('.initial-preloader').remove();
              this.$$('.infinite-scroll-preloader').remove();
            }

            // set initial totalReturned
            //  only if nb_results is > existing totalReturned
            //  this is because sometimes nb_results is 0
            if (json.nb_results >= this.totalReturned) {
              this.totalReturned = json.nb_results;
            }

            // set results bool to true if we have results
            //  and false if we do not
            this.results = !!this.totalReturned;

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

            // remove the preloader if we have all the results
            if (json.files.length === 0 || this.totalReturned <= limit) {
              this.$$('.infinite-scroll-preloader').remove();
            }
          }).catch(ex => {
            console.log('fetching failed', ex);
            this.$f7.addNotification({
              title: 'Error',
              message: 'Failed to fetch from Adobe Stock',
              hold: 3000
            });
            this.$$('.infinite-scroll-preloader').remove();
          });
      },
      onInfiniteScroll () {
        const limit = parseInt(this.limit, 10); // better safe
        const offset = parseInt(this.offset, 10); // ...than sorry
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
    },
    mounted () {
      const { params } = this.$route;
      // set some initial defaults
      params.offset = parseInt(params.offset, 10) || 0;
      params.limit = parseInt(params.limit, 10) || 60;
      params.images = [];
      params.totalReturned = 0;
      Object.assign(this, params);
      this.fetchResults(this.q, this.limit, this.filter, this.offset);
    }
  };
</script>

<style scoped>
  /* default for phones / portrait */
  .cell .placeholder {
    width: 100%;
    padding-top: 100%;
    background: #fcfcfc;
  }
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
  .initial-preloader {
    text-align: center;
  }
  .center {
    text-align: center;
  }
</style>
