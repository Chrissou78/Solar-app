const path = require('path')

module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es', 'fr', 'de', 'pt'],
  },
  ns: ['common'],
  defaultNS: 'common',
  localePath: path.resolve('./public/locales'),
}