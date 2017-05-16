import { injectReducer } from '../../store/reducers';

export default (store) => ({
  path: 'card/:profileId',

  /*  Async getComponent is only invoked when route matches   */
  getComponent(nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
     and embed an async module loader (jsonp) when bundling   */
    require.ensure([
      './components/Card',
      './modules/card'
    ], (require) => {
      /*  Webpack - use require callback to define
       dependencies for bundling   */
      const Card = require('./components/Card').default;
      const reducer = require('./modules/card').default;

      /*  Add the reducer to the store on key 'card'  */
      injectReducer(store, { key: 'card', reducer });

      /*  Return getComponent   */
      cb(null, Card);

      /* Webpack named bundle   */
    }, 'card');
  }
});
