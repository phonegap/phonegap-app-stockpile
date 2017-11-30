import Search from './components/pages/Search';
import About from './components/pages/About';
import Services from './components/pages/Services';
import Another from './components/pages/Another';

export default [
  {
    path: '/',
    component: Search
  },
  {
    path: '/about/',
    component: About
  },
  {
    path: '/services/',
    component: Services
  },
  {
    path: '/about/another/',
    component: Another
  }
];
