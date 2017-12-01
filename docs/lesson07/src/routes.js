import Search from './components/pages/Search';
import Results from './components/pages/Results';
import Services from './components/pages/Services';
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
    path: '/services/',
    component: Services
  },
  {
    path: '/results/details/:id',
    component: Details
  }
];
