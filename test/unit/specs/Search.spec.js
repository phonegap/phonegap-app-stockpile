import Vue from 'vue'; // eslint-disable-line no-unused-vars
// Import F7
import Framework7 from 'framework7'; // eslint-disable-line no-unused-vars

// Import F7 Vue Plugin
import Framework7Vue from 'framework7-vue';

import Search from '@/components/pages/Search';

// Init F7 Vue Plugin
Vue.use(Framework7Vue);

let vm; // eslint-disable-line no-unused-vars

describe('Search.vue', () => {
  beforeEach(() => {
    vm = new Vue({ // eslint-disable-line no-new
      el: document.createElement('div'),
      render: h => h(Search),
      // Init Framework7 by passing parameters here
      // The absolute minimum is an empty routes array
      framework7: {
        routes: []
      }
    });
  });

  describe('Data', () => {
    it('should have a name of "Search"', () => {
      expect(Search.name).to.equal('Search');
    });
    it('should have a data method', () => {
      expect(Search.data).to.be.a('function');
    });
  });
});
