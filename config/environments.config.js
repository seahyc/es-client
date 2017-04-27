// Here is where you can define configuration overrides based on the execution environment.
// Supply a key to the default export matching the NODE_ENV that you wish to target, and
// the base configuration will apply your overrides before exporting itself.
module.exports = {
  // ======================================================
  // Overrides when NODE_ENV === 'development'
  // ======================================================
  // NOTE: In development, we use an explicit public path when the assets
  // are served webpack by to fix this issue:
  // http://stackoverflow.com/questions/34133808/webpack-ots-parsing-error-loading-fonts/34133809#34133809
  development: (config) => ({
    compiler_public_path: `http://${config.server_host}:${config.server_port}/`
  }),

  // ======================================================
  // Overrides when NODE_ENV === 'staging'
  // ======================================================
  staging: (config) => ({
    globals: {
      'process.env'  : {
        'NODE_ENV' : JSON.stringify(config.env),
        'API_HOST' : JSON.stringify('https://es-api.staging.glints.com')
      },
      'NODE_ENV'     : config.env,
      '__DEV__'      : config.env === 'development',
      '__PROD__'     : config.env === 'production',
      '__STAGE__'    : config.env === 'staging',
      '__TEST__'     : config.env === 'test',
      // '__COVERAGE__' : !argv.watch && config.env === 'test',
      '__BASENAME__' : JSON.stringify(process.env.BASENAME || '')
    },
    compiler_public_path: '/',
    compiler_fail_on_warning: false,
    compiler_hash_type: 'chunkhash',
    compiler_devtool: false,
    compiler_stats: {
      chunks: true,
      chunkModules: true,
      colors: true
    }
  }),

  // ======================================================
  // Overrides when NODE_ENV === 'production'
  // ======================================================
  production: (config) => ({
    globals: {
      'process.env'  : {
        'NODE_ENV' : JSON.stringify(config.env),
        'API_HOST' : JSON.stringify('https://es-api.glints.com')
      },
      'NODE_ENV'     : config.env,
      '__DEV__'      : config.env === 'development',
      '__PROD__'     : config.env === 'production',
      '__STAGE__'    : config.env === 'staging',
      '__TEST__'     : config.env === 'test',
      // '__COVERAGE__' : !argv.watch && config.env === 'test',
      '__BASENAME__' : JSON.stringify(process.env.BASENAME || '')
    },
    compiler_public_path: '/',
    compiler_fail_on_warning: false,
    compiler_hash_type: 'chunkhash',
    compiler_devtool: false,
    compiler_stats: {
      chunks: true,
      chunkModules: true,
      colors: true
    }
  })
};
