/* eslint-disable no-unused-vars */

import fetchStockAPIJSON, {
  formatResultColumns,
  formatSearchParameters
} from '@/utils/stockAPI';

describe('stockAPI.js', () => {
  describe('formatResultColumns', () => {
    it('Should format an array as a list of result_columns parameters', () => {
      const columns = [
        'nb_results',
        'id',
        'title'
      ];
      const expectedResultColumns = 'result_columns[]=nb_results&result_columns[]=id&result_columns[]=title';
      expect(formatResultColumns(columns)).to.equal(expectedResultColumns);
    });
    it('Should format an array with one entry as a list of result_columns parameters', () => {
      const columns = [
        'nb_results'
      ];
      const expectedResultColumns = 'result_columns[]=nb_results';
      expect(formatResultColumns(columns)).to.equal(expectedResultColumns);
    });
    it('Should format an empty array into an empty string', () => {
      const columns = [];
      const expectedResultColumns = '';
      expect(formatResultColumns(columns)).to.equal(expectedResultColumns);
    });
  });
  describe('formatSearchParameters', () => {
    it('Should fromat an object as a list of search_parameters parameters', () => {
      const parameters = [
        { key: 'thumbnail_size', val: '160' },
        { key: 'limit', val: 23 },
        { key: 'words', val: 'cats' }
      ];
      const expectedSearchParameters = 'search_parameters[thumbnail_size]=160&search_parameters[limit]=23&search_parameters[words]=cats';
      expect(formatSearchParameters(parameters)).to.equal(expectedSearchParameters);
    });
  });
  describe('fetchStockAPIJSON', () => {});
});
