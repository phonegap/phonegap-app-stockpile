1. Create using Split-Panel template
	- `phonegap create Stockpile com.phonegap.stockpile Stockpile --template https://github.com/phonegap/phonegap-template-vue-f7-split-panel`
	- `cd Stockpile`
	- `npm install`

2. Test it out
	- `npm run dev` (will open a browser to `http://localhost:8080`) – OR – `npm run build && phonegap serve` and open Chrome to `http://localhost:3000` (if viewed at `localhost` or `127.0.0.1`, this should actually install the service worker, etc and can be tested with Lighthouse).
	- `npm test` (run unit and end to end tests)

3. Tweaks to _**index.html**_
	- change `<title />` to "Stockpile"

4. Home.vue -> Search.vue
	- rename `Home.vue` to `Search.vue`
	- `<f7-page name="home">` to `<f7-page name="search">`
	- change the `<f7-nav-center />` to `{{ title }}`
	- change the `title` data property to "Search"
	- `name: 'Home',` to `name: 'Search',`
	- update `routes.js` to use "Search" instead of "Home" (three instances)
	- replace `<f7-block-title />` and `<f7-block-inner />`  with:

          <form form method="GET" id="search-form" @submit.prevent="onSubmit">
            <f7-list>
            </f7-list>
          </form>

	- in the default export, add a `methods` object with a stub (for now) for the `onSubmit()` function:

          export default {
            name: 'Search',
            data () {
              return {
                title: 'Search'
              };
            },
            methods: {
              onSubmit () {}
            }
          };

    - in _**LeftPanel.vue**_, change the title of the first link from "Home" to "Search"

5. Start adding search form
	- Add the search input:

          <f7-list-item>
            <f7-label floating v-if="isMaterial">Image search</f7-label>
            <f7-input type="search" name="q"
              placeholder="Image search" ref="searchInput"
              autocorrect="off" autocapitalize="off" />
          </f7-list-item>

	- A hidden field to set the required limit and add the button to submit the search:

          <f7-block>
            <input type="hidden" name="limit" value="60" />
            <input type="submit" name="submit" class="hidden" value="Search" />
            <f7-button @click.prevent="onSubmit" big raised fill>
              Find Images
            </f7-button>
          </f7-block>

	- Add a computed property for `isMaterial`:

          computed: {
            isMaterial () {
              return window.isMaterial;
            }
          },

6. `onSubmit()`
	- replace the stub `onSubmit()` with this:

          onSubmit () {
            const { searchInput, searchForm } = this.$refs;
            const { filter, limit, q } = this.$f7.formToJSON(searchForm);
            const { router } = this.$f7.mainView;
            const input = searchInput.$el.querySelector('input');

            input.blur();

            if (!q.trim()) {
              this.$f7.alert('Please enter a search term', 'Search Error');
              return;
            }
            router.loadPage(`/results/${filter || 'words'}/${limit}/${q}/search`);
          }

	- _((explain this function))_

7. Add a little hack to ensure search is always at the top of the history (explain?)

        created () {
          this.$f7.mainView.history = ['/'];
        }

8. The global store
	- in _**main.js**_, add a global `store` object:

          // Global store defaults
          window.store = {
            images: [],
            imagesById: {}
          };

9. _**About.vue**_ -> _**Results.vue**_
	- Edit `routes.js` and replace the import for `About` with `import Results from './components/pages/Results';`
	- Edit `routes.js` and replace the route for `/about/` with:

          {
            path: '/results/:filter/:limit/:q',
            component: Results
          },

	- remove the "About" link from `LeftPanel.vue`
	- rename `About.vue` to `Results.vue`
	- change `name` property to "Results"
	- `title` data object returns "Results"
	- replace entire `<f7-navbar ...` block with `<f7-navbar title="Results" back-link="Back" sliding></f7-navbar>`
	- in the `<f7-block-title>`, replace `{{ title }}` with `{{ imagesReturned }}`
	- modify the return expression for `data ()` in the default export to return the global store from above:

          data () {
            return {
              images: []
            };
          }

	- in the default export after `data ()`, add a `computed` property:

          imagesReturned () {
            // build the string to display for the number of results
            const { q } = this;
            const { filter } = this.$route.params;
            // wait for something to be returned
            if (!this.images) {
              return '';
            }
            switch (filter) {
              case 'similar':
                return this.images.length
                ? `${this.totalReturned} similar results to ${q}`
                : '';
              case 'creator_id':
                const [ img ] = this.images;
                return this.images.length
                  ? `${this.totalReturned} results for ${img.creator_name}`
                  : '';
              default:
                return this.images.length
                  ? `${this.totalReturned} results for "${q}"`
                  : '';
            }
          }

	- _((explain this function))_
	- add a `methods` property to the default export with a stub for `fetchResults ()`:

          methods: {
            fetchResults () {}
          }

	- after the `<script>` tag, add the CSS for the images grid

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

	- _((explain this CSS))_

10. `fetchResults () {}`
	- first add the `fetch` polyfill: `npm install whatwg-fetch --save` (for Android 4.x and iOS < 10)
	- then add an import for it at the top of _**main.js**_: `import 'whatwg-fetch';`
	- in `index.html`, replace the CSP with: `<meta http-equiv="Content-Security-Policy" content="default-src 'self' data: gap: https://ssl.gstatic.com https://api.spotify.com 'unsafe-eval' 'unsafe-inline' ws://*; style-src 'self' 'unsafe-inline'; media-src *; img-src * data:">	`
	- back in _**Results.vue**_, add an exception to the eslint comment for `fetch`: `/* global store fetch */`
	- add the real `fetchResults ()` method:

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

    - _((explain this function - will need to be broken down a bit))_

11. Fire `fetchResults ()` in a lifecycle hook
	- add a `mounted ()` lifecycle hook to the default export:

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

		_((explain this function and lifecycle hooks))_

12. _**Another.vue**_ -> _**Details.vue**_

13. _**Services.vue**_ -> _**Favorites.vue**_
