<template>
  <f7-page name="favorites">
    <f7-navbar sliding>
      <f7-nav-left>
        <f7-link icon="icon-bars" open-panel="left"></f7-link>
      </f7-nav-left>
      <f7-nav-center>
        Favorites
      </f7-nav-center>
    </f7-navbar>
    <f7-list media-list v-if="hasFavorites">
      <f7-list-item v-for="favorite in favorites"
        :key="favorite.id"
        @click="clickItem(favorite.id)"
        :link="`/results/details/${favorite.id}`"
        :media="mediaItemImage(favorite.thumbnail_url)"
        :title="favorite.title"
        :text="formatDate(favorite.creation_date)"
        :subtitle="favorite.category.name"
      />
      </f7-list>
  </f7-page>
</template>

<script>
  /* global store */
  import moment from 'moment';

  export default {
    name: 'Favorites',
    data () {
      return store;
    },
    methods: {
      mediaItemImage (url) {
        return `<img width="80" src="${url}" />`;
      },
      clickItem (id) {
        this.$f7.mainView.router
          .loadPage(`/results/details/${id}?displayingFavorite=true`);
      },
      formatDate (date) {
        const created = moment(date);
        return `Created: ${created.format('MMMM Do YYYY')}`;
      }
    },
    computed: {
      hasFavorites () {
        return !!this.favorites.length;
      }
    },
    created () {
      this.$f7.mainView.history = ['/favorites/'];
    }
  };
</script>
