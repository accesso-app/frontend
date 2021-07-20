export const path = {
  home: () => '/',
  login: () => '/login',
  register: () => '/register',
  registerConfirm: (code: string) => `/register/confirm-${code}`,
  accessRecovery: () => '/access-recovery',
  accessRecoveryConfirm: (code: string) => `/access-recovery/confirm-${code}`,
  oauth: {
    base: () => '/oauth',
    authorize: () => `${path.oauth.base()}/authorize`,
    accessoDone: () => `${path.oauth.base()}/accesso/done`,
  },
};
