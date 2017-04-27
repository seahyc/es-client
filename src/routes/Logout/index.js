import { injectReducer } from '../../store/reducers';

export default (store) => ({
  path: 'logout',

  /*  Async getComponent is only invoked when route matches   */
  getComponent(nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
     and embed an async module loader (jsonp) when bundling   */
    require.ensure([
      './components/Logout',
      '../Login/modules/login'
    ], (require) => {
      /*  Webpack - use require callback to define
       dependencies for bundling   */
      const Logout = require('./components/Logout').default;
      const reducer = require('../Login/modules/login').default;

      /*  Add the reducer to the store on key 'login'  */
      injectReducer(store, { key: 'login', reducer });

      /*  Return getComponent   */
      cb(null, Logout);

      /* Webpack named bundle   */
    }, 'logout');
  }
});
