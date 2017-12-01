<template>
  <f7-page name="favorites">
    <f7-navbar sliding>
      <f7-nav-left>
        <f7-link icon-f7="bars" open-panel="left"></f7-link>
      </f7-nav-left>
      <f7-nav-center>
        Favorites
      </f7-nav-center>
    </f7-navbar>
    <!-- Scrollable page content-->
    <f7-list media-list v-if="hasFavorites">
      <f7-list-item v-for="favorite in favorites"
        :key="favorite.id"
        @click="clickItem(favorite.id)"
        @swipeout:deleted="onSwipeoutDeleted(favorite)"
        :link="`/results/details/${favorite.id}`"
        :media="mediaItemImage(favorite.thumbnail_url, favorite.title)"
        :title="favorite.title"
        :text="formatDate(favorite.creation_date)"
        :subtitle="favorite.category.name"
        swipeout
      >
        <f7-swipeout-actions>
          <f7-swipeout-button delete>Delete</f7-swipeout-button>
        </f7-swipeout-actions>
      </f7-list-item>
    </f7-list>
    <f7-content-block v-else>
      <p>
        You have no favorites saved. Search for something then use the
        star icon to save a favorite
      </p>
    </f7-content-block>
  </f7-page>
</template>

<script>
  /* global store */
  import moment from 'moment';
  import { toggleFavorite } from '../../utils/favorites';

  export default {
    name: 'Favorites',
    data () {
      return store;
    },
    computed: {
      hasFavorites () {
        return !!this.favorites.length;
      }
    },
    methods: {
      clickItem (id) {
        this.$f7.mainView.router
          .loadPage(`/results/details/${id}?displayingFavorite=true`);
      },
      mediaItemImage (url, title) {
        return `<img alt="${title}" width="80" src="${url}" />`;
      },
      formatDate (date) {
        const created = moment(date);
        return `Created: ${created.format('MMMM Do YYYY')}`;
      },
      onSwipeoutDeleted (favorite) {
        toggleFavorite(favorite);
      }
    },
    created () {
      this.$f7.mainView.history = ['/favorites/'];
    }
  };
</script>
