/**
 * @typedef {import('eslint').Linter.RulesRecord} RulesRecord
 */

import globals from 'globals'
import standard from '@sequencemedia/eslint-config-standard/configs/recommended/merge'
import typescript from '@sequencemedia/eslint-config-typescript/configs/recommended/merge'
import reactPlugin from '@eslint-react/eslint-plugin'

const reactParserOptions = {
  ecmaFeatures: {
    jsx: true
  }
}

const reactPlugins = {
  react: reactPlugin
}

/**
 * @type {RulesRecord}
 */
const reactRules = {
  'no-unused-vars': [
    'error',
    {
      varsIgnorePattern: 'React'
    }
  ],
  '@stylistic/quotes': [
    'error',
    'single'
  ],
  '@stylistic/jsx-quotes': [
    'error',
    'prefer-single'
  ],
  '@stylistic/indent': [
    'error',
    2,
    {
      SwitchCase: 1,
      ignoredNodes: [
        'TemplateLiteral *'
      ],
      offsetTernaryExpressions: true
    }
  ]
}

export default [
  {
    ignores: [
      'lib'
    ]
  },
  /**
   *  React config for all `jsx` and `tsx` files
   */
  {
    ...reactPlugin.configs.recommended,
    files: [
      '**/*.jsx',
      '**/*.tsx'
    ]
  },
  /**
   *  Standard config
   */
  standard({
    files: [
      '**/*.{mjs,cjs,mts,cts}'
    ],
    ignores: [
      'src'
    ],
    languageOptions: {
      globals: {
        ...globals.node
      }
    }
  }),
  standard({
    files: [
      'src/**/*.{mjs,cjs,mts,cts}'
    ],
    languageOptions: {
      globals: {
        ...globals.browser
      }
    }
  }),
  /**
   *  Standard config for all `jsx` and `tsx` files
   */
  standard({
    files: [
      'src/**/*.{mts,tsx}'
    ],
    ignores: [
      'src/__tests__/**/*.{mts,tsx}'
    ],
    languageOptions: {
      globals: {
        ...globals.browser
      }
    },
    plugins: {
      ...reactPlugins
    },
    rules: {
      ...reactRules
    }
  }),
  standard({
    files: [
      'src/**/__tests__/**/*.{mjs,jsx,mts,tsx}'
    ],
    languageOptions: {
      parserOptions: {
        ...reactParserOptions
      },
      globals: {
        ...globals.browser,
        ...globals.jest
      }
    },
    plugins: {
      ...reactPlugins
    },
    rules: {
      ...reactRules
    }
  }),
  /**
   *  TypeScript config
   */
  typescript({
    files: [
      '**/*.{mts,cts}'
    ],
    ignores: [
      'src'
    ],
    languageOptions: {
      globals: {
        ...globals.node
      }
    }
  }),
  typescript({
    files: [
      'src/**/*.{mts,cts}'
    ],
    languageOptions: {
      globals: {
        ...globals.browser
      }
    }
  }),
  /**
   *  TypeScript config for only `tsx` files
   */
  typescript({
    files: [
      'src/**/*.{mts,tsx}'
    ],
    ignores: [
      'src/**/__tests__/**/*.{mts,tsx}'
    ],
    languageOptions: {
      parserOptions: {
        ...reactParserOptions,
        projectService: true
      },
      globals: {
        ...globals.browser
      }
    },
    plugins: {
      ...reactPlugins
    },
    rules: {
      ...reactRules,
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unnecessary-condition': 'off'
    }
  }),
  typescript({
    files: [
      'src/**/__tests__/**/*.{mts,tsx}'
    ],
    languageOptions: {
      parserOptions: {
        ...reactParserOptions,
        projectService: true
      },
      globals: {
        ...globals.browser,
        ...globals.jest
      }
    },
    plugins: {
      ...reactPlugins
    },
    rules: {
      ...reactRules
    }
  })
]
