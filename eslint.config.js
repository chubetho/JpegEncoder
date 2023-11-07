import antfu from '@antfu/eslint-config'
import unocss from '@unocss/eslint-plugin'

export default antfu(
  {
    rules: { 'no-console': 'off', 'unused-imports/no-unused-vars': 'off' },
  },
  unocss.configs.flat,
)
