import globals from 'globals'
import standard from '@sequencemedia/eslint-config-standard/configs/recommended/merge'
import typescript from '@sequencemedia/eslint-config-typescript/configs/recommended/merge'
import babelParser from '@babel/eslint-parser'
import typescriptParser from '@typescript-eslint/parser'
import reactPlugin from 'eslint-plugin-react'

const reactParserOptions = {
  ecmaFeatures: {
    jsx: true
  }
}

const reactPlugins = {
  react: reactPlugin
}

const reactRules = {
  'no-unused-vars': [
    'error',
    {
      varsIgnorePattern: 'React'
    }
  ],
  quotes: [
    'error',
    'single'
  ],
  'jsx-quotes': [
    'error',
    'prefer-single'
  ],
  'react/jsx-indent': [
    'error',
    2,
    {
      checkAttributes: true,
      indentLogicalExpressions: true
    }
  ]
}

const reactSettings = {
  react: {
    version: 'detect'
  }
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
    ...reactPlugin.configs.flat.recommended,
    settings: {
      ...reactPlugin.configs.flat.recommended.settings,
      ...reactSettings
    }
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
      parser: babelParser,
      parserOptions: {
        ...reactParserOptions,
        project: null
      },
      globals: {
        ...globals.browser
      }
    },
    plugins: {
      ...reactPlugins
    },
    rules: {
      ...reactRules
    },
    settings: {
      ...reactSettings
    }
  }),
  standard({
    files: [
      'src/**/__tests__/**/*.{mjs,jsx}'
    ],
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        ...reactParserOptions,
        project: null
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
    },
    settings: {
      ...reactSettings
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
      parser: typescriptParser,
      parserOptions: {
        ...reactParserOptions,
        projectService: true,
        project: 'tsconfig.json'
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
    },
    settings: {
      ...reactSettings
    }
  }),
  typescript({
    files: [
      'src/**/__tests__/**/*.{mts,tsx}'
    ],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ...reactParserOptions,
        projectService: true,
        project: 'tsconfig.json'
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
    },
    settings: {
      ...reactSettings
    }
  })
]
