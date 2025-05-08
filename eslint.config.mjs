import { defineConfig } from 'eslint/config'
import globals from 'globals'
import js from '@eslint/js'

export default defineConfig([{
	extends: [ js.configs.recommended ],
	languageOptions: {
		globals: {
			...globals.browser,
			...globals.node,
		},
	},
	rules: {
		camelcase: ['error'],
		'comma-dangle': 0,
		indent: [2, 'tab'],
		'no-trailing-spaces': 'error',
		semi: [2, 'never'],
		quotes: ['error', 'single'],
		'guard-for-in': 'error',
	},
}])