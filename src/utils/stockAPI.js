/* global fetch */

import { apiHeaders } from './config';

const apiBase = 'https://stock.adobe.io/Rest/Media/1/Search/Files';

export function formatResultColumns (columns) {
  if (columns.length < 1) return '';
  return `result_columns[]=${columns.join('&result_columns[]=')}`;
}

export function formatSearchParameters (parameters) {
  return parameters
    .map(param => `search_parameters[${param.key}]=${param.val}`)
    .join('&');
}

export default function fetchStockAPIJSON (options) {
  const { method, columns, parameters } = options;
  const resultColumns = formatResultColumns(columns);
  const searchParameters = formatSearchParameters(parameters);
  const apiURL = `${apiBase}?${resultColumns}&${searchParameters}`;

  const myInit = {
    method: method,
    headers: new Headers(apiHeaders)
  };

  // hacky but just wanted it to work for now
  if (method === 'POST') {
    const fileInput = document.querySelector('input[type="file"]');
    const data = new FormData();
    data.append('similar_image', fileInput.files[0]);
    myInit.body = data;
  }

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
