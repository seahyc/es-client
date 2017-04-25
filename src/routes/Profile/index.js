import { injectReducer } from '../../store/reducers';

export default (store) => ({
  path: 'profiles/:userId',

  /*  Async getComponent is only invoked when route matches   */
  getComponent(nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
     and embed an async module loader (jsonp) when bundling   */
    require.ensure([
      './components/Profile',
      './modules/profile'
    ], (require) => {
      /*  Webpack - use require callback to define
       dependencies for bundling   */
      const Profile = require('./components/Profile').default;
      const reducer = require('./modules/profile').default;

      /*  Add the reducer to the store on key 'survey'  */
      injectReducer(store, { key: 'profile', reducer });

      /*  Return getComponent   */
      cb(null, Profile);

      /* Webpack named bundle   */
    }, 'profile');
  }
});
