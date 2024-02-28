export default {
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'jsx'
  ],
  bail: 1,
  verbose: true,
  rootDir: '.',
  testEnvironment: 'jsdom',
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.[tj]sx$',
  transform: {
    '^.+\\.(ts|mts|cts|tsx)?$': 'babel-jest',
    '^.+\\.(js|mjs|cjs|jsx)?$': 'babel-jest'
  },
  transformIgnorePatterns: [
    '/node_modules\\/(?!d3-color)\\/',
    '/node_modules\\/(?!d3-graphviz)\\/',
    '/node_modules\\/core-js/'
  ],
  setupFiles: [
    './src/__tests__/setup.mjs'
  ]
}
