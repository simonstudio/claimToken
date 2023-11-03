import i18n, { TFunction } from 'i18next';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';
import homepage_en from './assets/lang/en/homepage.json';
import homepage_fr from './assets/lang/fr/homepage.json';
import homepage_id from './assets/lang/id/homepage.json';

import dashboard_page_en from './assets/lang/en/dashboardpage.json';
import dashboard_page_fr from './assets/lang/fr/dashboardpage.json';
import dashboard_page_id from './assets/lang/id/dashboardpage.json';
// import common_en from './assets/lang/en/common.json';
// import common_ce from './assets/lang/ce/common.json';

export type I18n = {
  t?: TFunction<'translation', undefined>
  i18n?: typeof i18n
}

i18n
  .use(Backend)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      en: {
        // common: common_en,
        homepage: homepage_en,
        dashboard_page: dashboard_page_en,

      },
      fr: {
        // common: common_ce,
        homepage: homepage_fr,
        dashboard_page: dashboard_page_fr
      },
      id: {
        // common: common_ce,
        homepage: homepage_id,
        dashboard_page: dashboard_page_id
      },
    },
    fallbackLng: 'en',
    debug: false,
    react: {
      useSuspense: false
    },
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    returnObjects: true
  });

export default i18n;