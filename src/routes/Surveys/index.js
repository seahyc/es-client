import { injectReducer } from '../../store/reducers';

export default (store) => ({
  path: 'surveys',

  /*  Async getComponent is only invoked when route matches   */
  getComponent(nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
     and embed an async module loader (jsonp) when bundling   */
    require.ensure([
      './components/Surveys',
      './modules/surveys'
    ], (require) => {
      /*  Webpack - use require callback to define
       dependencies for bundling   */
      const Surveys = require('./components/Surveys').default;
      const reducer = require('./modules/surveys').default;

      /*  Add the reducer to the store on key 'survey'  */
      injectReducer(store, { key: 'surveys', reducer });

      /*  Return getComponent   */
      cb(null, Surveys);

      /* Webpack named bundle   */
    }, 'surveys');
  }
});
