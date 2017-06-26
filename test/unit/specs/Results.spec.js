import Vue from 'vue'; // eslint-disable-line no-unused-vars
// Import F7
import Framework7 from 'framework7'; // eslint-disable-line no-unused-vars

// Import F7 Vue Plugin
import Framework7Vue from 'framework7-vue';

import Results from '@/components/pages/Results';

// Init F7 Vue Plugin
Vue.use(Framework7Vue);

let vm; // eslint-disable-line no-unused-vars

describe('Results.vue', () => {
  beforeEach(() => {
    vm = new Vue({ // eslint-disable-line no-new
      el: document.createElement('div'),
      render: h => h(Results),
      // Init Framework7 by passing parameters here
      // The absolute minimum is an empty routes array
      framework7: {
        routes: []
      }
    });
    window.store = {
      images: []
    };
  });

  it('should have a name of "Results"', () => {
    expect(Results.name).to.equal('Results');
  });

  describe('Data', () => {
    it('should have a data method', () => {
      expect(Results.data).to.be.a('function');
    });
    it('should have a data method that returns the global store"', () => {
      expect(Results.data().images).to.equal(window.store.images);
    });
  });
});
