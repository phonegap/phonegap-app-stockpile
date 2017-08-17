/* global fetch */

import { apiHeaders } from './config';

const apiBase = 'https://stock.adobe.io/Rest/Media/1/Search/Files';

// function to format an array of columns into the query string needed
export function formatResultColumns (columns) {
  if (columns.length < 1) return '';
  return `result_columns[]=${columns.join('&result_columns[]=')}`;
}

// function to format an object containing parameters into the query string needed
export function formatSearchParameters (parameters) {
  return parameters
    .map(param => `search_parameters[${param.key}]=${param.val}`)
    .join('&');
}

// function to call the Adobe Stock API and return the results
export default function fetchStockAPIJSON (options) {
  const { columns, parameters } = options;
  const resultColumns = formatResultColumns(columns);
  const searchParameters = formatSearchParameters(parameters);
  const apiURL = `${apiBase}?${resultColumns}&${searchParameters}`;
  const myInit = {
    method: 'GET',
    headers: new Headers(apiHeaders)
  };
  return new Promise((resolve, reject) => {
    fetch(apiURL, myInit)
      .then(response => response.json())
      .then((json) => {
        resolve(json);
      }).catch((ex) => {
        reject(ex);
      });
  });
}
