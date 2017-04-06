// const argv = require('yargs').argv;
const webpack = require('webpack');
const cssnano = require('cssnano');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const project = require('./project.config');
const debug = require('debug')('app:config:webpack');
const path = require('path');

const __DEV__ = project.globals.__DEV__;
const __PROD__ = project.globals.__PROD__;
const __TEST__ = project.globals.__TEST__;

debug('Creating configuration.');

const webpackConfig = {
  name: 'client',
  target: 'web',
  devtool: project.compiler_devtool,
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    modules: [ path.resolve(__dirname, project.paths.client()), 'node_modules']
  },
  module: {},
  node: {
    fs: 'empty',
    buffertools: 'empty',
    child_process: 'empty',
    module: 'empty'
  }
};
// ------------------------------------
// Entry Points
// ------------------------------------
const APP_ENTRY = project.paths.client('main.js');

webpackConfig.entry = {
  app: __DEV__ ?
    [APP_ENTRY].concat(`webpack-hot-middleware/client?path=${project.compiler_public_path}__webpack_hmr`) :
    [APP_ENTRY],
  vendor: project.compiler_vendors
};

// ------------------------------------
// Bundle Output
// ------------------------------------
webpackConfig.output = {
  filename: `[name].[${project.compiler_hash_type}].js`,
  path: project.paths.dist(),
  publicPath: project.compiler_public_path
};

// ------------------------------------
// Externals
// ------------------------------------
webpackConfig.externals = {};
webpackConfig.externals['react/lib/ExecutionEnvironment'] = true;
webpackConfig.externals['react/lib/ReactContext'] = true;
webpackConfig.externals['react/addons'] = true;

// ------------------------------------
// Plugins
// ------------------------------------
webpackConfig.plugins = [
  new webpack.IgnorePlugin(/^(buffertools)$/),
  new webpack.DefinePlugin(project.globals),
  new webpack.EnvironmentPlugin(['API_HOST', 'NODE_ENV']),
  new HtmlWebpackPlugin({
    template: project.paths.client('index.html'),
    hash: false,
    favicon: project.paths.public('favicon.ico'),
    filename: 'index.html',
    inject: 'body',
    minify: {
      collapseWhitespace: true
    }
  })
];

// Ensure that the compiler exits on errors during testing so that
// they do not get skipped and misreported.
// if (__TEST__ && !argv.watch) {
if (__TEST__ ) {
  webpackConfig.plugins.push(function () {
    this.plugin('done', (stats) => {
      if (stats.compilation.errors.length) {
        // Pretend no assets were generated. This prevents the tests
        // from running making it clear that there were warnings.
        throw new Error(
          stats.compilation.errors.map(err => err.message || err)
        );
      }
    });
  });
}

if (__DEV__) {
  debug('Enabling plugins for live development (HMR, NoErrors).');
  webpackConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  );
} else if (__PROD__) {
  debug('Enabling plugins for production (OccurenceOrder &UglifyJS).');
  webpackConfig.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      minimize: true,
      compress: {
        unused: true,
        dead_code: true,
        warnings: false
      }
    }),
    new webpack.optimize.AggressiveMergingPlugin()
  );
}

// Don't split bundles during testing, since we only want import one bundleq
if (!__TEST__) {
  webpackConfig.plugins.push(
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor']
    })
  );
}

// ------------------------------------
// Loaders
// ------------------------------------
// JavaScript / JSON

webpackConfig.module.rules = [{
  test: /\.(js|jsx)$/,
  exclude: /(node_modules|bower_components)/,
  loader: 'babel-loader',
  query: project.compiler_babel
}];

// ------------------------------------
// Style Loaders
// ------------------------------------
// We use cssnano with the postcss loader, so we tell
// css-loader not to duplicate minimization.
const BASE_CSS_LOADER = 'css-loader?sourceMap&-minimize';

webpackConfig.module.rules.push({
  test: /\.scss$/,
  use: [
    'style-loader',
    BASE_CSS_LOADER,
    'postcss-loader',
    'sass-loader?sourceMap'
  ]
});
webpackConfig.module.rules.push({
  test: /\.css$/,
  use: [
    'style-loader',
    BASE_CSS_LOADER,
    'postcss-loader'
  ]
});

// webpackConfig.sassLoader = {
//   includePaths: project.paths.client('styles')
// };

// webpackConfig.postcss = [
//   cssnano({
//     autoprefixer: {
//       add: true,
//       remove: true,
//       browsers: ['last 2 versions']
//     },
//     discardComments: {
//       removeAll: true
//     },
//     discardUnused: false,
//     mergeIdents: false,
//     reduceIdents: false,
//     safe: true,
//     sourcemap: true
//   })
// ];

// File loaders
/* eslint-disable */
webpackConfig.module.rules.push(
  { test: /\.woff(\?.*)?$/,  loader: 'url-loader?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/font-woff' },
  { test: /\.woff2(\?.*)?$/, loader: 'url-loader?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/font-woff2' },
  { test: /\.otf(\?.*)?$/,   loader: 'file-loader?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=font/opentype' },
  { test: /\.ttf(\?.*)?$/,   loader: 'url-loader?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/octet-stream' },
  { test: /\.eot(\?.*)?$/,   loader: 'file-loader?prefix=fonts/&name=[path][name].[ext]' },
  { test: /\.svg(\?.*)?$/,   loader: 'url-loader?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=image/svg+xml' },
  { test: /\.(png|jpg)$/,    loader: 'url-loader?limit=8192' }
)
/* eslint-enable */

// ------------------------------------
// Finalize Configuration
// ------------------------------------
// when we don't know the public path (we know it only when HMR is enabled [in development]) we
// need to use the extractTextPlugin to fix this issue:
// http://stackoverflow.com/questions/34133808/webpack-ots-parsing-error-loading-fonts/34133809#34133809
if (!__DEV__) {
  debug('Applying ExtractTextPlugin to CSS loaders.');
  webpackConfig.module.rules.filter((rule) =>
    rule.use && rule.use.find((name) => /css-loader/.test(name.split('?')[0]))
  ).forEach((loader) => {
    const first = loader.use[0];
    const rest = loader.use.slice(1);
    loader.use = ExtractTextPlugin.extract({
      fallback: first,
      use: rest
    });
  });

  webpackConfig.plugins.push(
    new ExtractTextPlugin({
      filename: '[name].[contenthash].css',
      allChunks: true
    })
  );
}

module.exports = webpackConfig;
