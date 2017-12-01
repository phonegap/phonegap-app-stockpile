import Search from './components/pages/Search';
import Results from './components/pages/Results';
import Favorites from './components/pages/Favorites';
import Details from './components/pages/Details';

export default [
  {
    path: '/',
    component: Search
  },
  {
    path: '/results/:filter/:limit/:q/:referrer',
    component: Results
  },
  {
    path: '/favorites/',
    component: Favorites
  },
  {
    path: '/results/details/:id',
    component: Details
  }
];
