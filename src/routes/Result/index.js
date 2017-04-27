import { injectReducer } from '../../store/reducers';

export default (store) => ({
  path: 'results/:profileId',

  /*  Async getComponent is only invoked when route matches   */
  getComponent(nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
     and embed an async module loader (jsonp) when bundling   */
    require.ensure([
      './components/Result',
      './modules/result'
    ], (require) => {
      /*  Webpack - use require callback to define
       dependencies for bundling   */
      const Result = require('./components/Result').default;
      const reducer = require('./modules/result').default;

      /*  Add the reducer to the store on key 'survey'  */
      injectReducer(store, { key: 'result', reducer });

      /*  Return getComponent   */
      cb(null, Result);

      /* Webpack named bundle   */
    }, 'result');
  }
});
