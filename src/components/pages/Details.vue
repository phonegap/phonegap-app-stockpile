<template>
  <f7-page name="details">
    <f7-navbar back-link="Results" sliding>
      <f7-nav-center>
        Details
      </f7-nav-center>
      <f7-nav-right>
        <f7-link icon-f7="star_filled" @click="toggleFavorite" v-if="isFavorite" />
        <f7-link icon-f7="star" @click="toggleFavorite" v-else />
      </f7-nav-right>
    </f7-navbar>
    <f7-card>
      <f7-card-content>
        <div class="img-container" :style="imgBackground()" @click="loadInPhotoBrowser">
          <div class="img-container-inner" :style="imgBackground(500)"></div>
        </div>
      </f7-card-content>
      <f7-card-footer>
        {{item.title}}
      </f7-card-footer>
    </f7-card>
    <f7-photo-browser
      ref="pb"
      type="page"
      :photos="photos"
      :lazyLoading="true"
      backLinkText="Details"
    ></f7-photo-browser>
  </f7-page>
</template>

<script>
  /* global store */

  import { toggleFavorite } from '../../utils/favorites';

  export default {
    name: 'Details',
    data () {
      return store;
    },
    methods: {
      toggleFavorite () {
        const { mainView: { router } } = this.$f7;
        if (this.displayingFavorite) {
          // let the animation happen before removing the fave
          setTimeout(() => {
            toggleFavorite(this.item);
          }, 410);
          router.back();
        } else {
          toggleFavorite(this.item);
        }
      },
      imgBackground (size = 0) {
        const url = size > 0 ? `thumbnail_${size}_url` : 'thumbnail_url';
        return `background-image: url(${this.item[url]})`;
      },
      loadInPhotoBrowser () {
        this.$refs.pb.open();
      }
    },
    computed: {
      id () {
        const { id } = this.$route.params;
        return id;
      },
      displayingFavorite () {
        const { displayingFavorite = false } = this.$route.query;
        return !!displayingFavorite;
      },
      item () {
        let item;
        if (this.displayingFavorite) {
          item = this.favoritesById[this.id];
        } else {
          item = this.imagesById[this.id];
        }
        return item;
      },
      isFavorite () {
        const filteredFavorites =
          this.favorites.filter(favorite => favorite.id.toString() === this.id);
        return !!filteredFavorites.length;
      },
      photos () {
        return [
          {
            url: this.item.thumbnail_1000_url,
            caption: this.item.title
          }
        ];
      }
    }
  };
</script>

<style scoped>
  .swiper {
    height: 300px;
  }
  .img-container {
    position: relative;
    width: 100%;
    height: 240px;
    max-height: 240px;
    overflow: hidden;
    margin: 0;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
  }

  .img-container-inner {
    position:absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 100%;
    height: 100%;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
    z-index: 2;
  }
</style>
