import Search from './components/pages/Search';
import Results from './components/pages/Results';
import Details from './components/pages/Details';
import Favorites from './components/pages/Favorites';

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
    path: '/results/details/:id',
    component: Details
  },
  {
    path: '/favorites/',
    component: Favorites
  }
];
