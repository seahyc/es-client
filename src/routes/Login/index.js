import { injectReducer } from '../../store/reducers';

export default (store) => ({
  path: 'login',

  /*  Async getComponent is only invoked when route matches   */
  getComponent(nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
     and embed an async module loader (jsonp) when bundling   */
    require.ensure([
      './components/Login',
      './modules/login'
    ], (require) => {
      /*  Webpack - use require callback to define
       dependencies for bundling   */
      const Login = require('./components/Login').default;
      const reducer = require('./modules/login').default;

      /*  Add the reducer to the store on key 'survey'  */
      injectReducer(store, { key: 'login', reducer });

      /*  Return getComponent   */
      cb(null, Login);

      /* Webpack named bundle   */
    }, 'login');
  }
});
