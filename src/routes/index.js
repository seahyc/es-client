// We only need to import the modules necessary for initial render
import CoreLayout from '../layouts/CoreLayout';
import Home from './Home';
import SurveyRoute from './Survey';
import LoginRoute from './Login';
import SurveysRoute from './Surveys';
import ResultRoute from './Result';
import ResultsRoute from './Results';
import LogoutRoute from './Logout';
import ProfileRoute from './Profile';
import CardRoute from './Card';

/*  Note: Instead of using JSX, we recommend using react-router
    PlainRoute objects to build route definitions.   */

export const createRoutes = (store) => ({
  path: '/',
  component: CoreLayout,
  indexRoute: Home,
  childRoutes: [
    SurveyRoute(store),
    SurveysRoute(store),
    LoginRoute(store),
    ResultRoute(store),
    ResultsRoute(store),
    LogoutRoute(store),
    ProfileRoute(store),
    CardRoute(store)
  ]
});

/*  Note: childRoutes can be chunked or otherwise loaded programmatically
    using getChildRoutes with the following signature:

    getChildRoutes (location, cb) {
      require.ensure([], (require) => {
        cb(null, [
          // Remove imports!
          require('./Counter').default(store)
        ])
      })
    }

    However, this is not necessary for code-splitting! It simply provides
    an API for async route definitions. Your code splitting should occur
    inside the route `getComponent` function, since it is only invoked
    when the route exists and matches.
*/

export default createRoutes;
