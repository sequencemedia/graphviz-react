const debug = require('debug')

const log = debug('@sequencemedia/graphviz-react')

const {
  env: {
    NODE_ENV = 'development'
  }
} = process

log('`@sequencemedia/graphviz-react` is awake')

function env () {
  log({ NODE_ENV })

  return (
    NODE_ENV === 'production'
  )
}

const presets = [
  [
    '@babel/env',
    {
      targets: {
        node: 'current',
        browsers: [
          'last 4 versions',
          'safari >= 9',
          'ios >= 8',
          'ie >= 9',
          '> 2%'
        ]
      },
      useBuiltIns: 'usage',
      corejs: 3
    }
  ],
  '@babel/react',
  '@babel/typescript'
]

module.exports = (api) => {
  if (api) api.cache.using(env)

  return {
    presets,
    ignore: [
      /node_modules\/(?!react-component-instance)\//,
      /node_modules\/(?!react-component-snapshot)\//,
      /node_modules\/(?!react-component-name)\//,
      /node_modules\/core-js\//
    ]
  }
}
