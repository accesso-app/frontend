export const path = {
  home: () => '/',
  login: () => '/login',
  register: () => '/register',
  registerConfirm: (code: string) => `/register/confirm-${code}`,
  accessRecovery: () => '/access-recovery',
  accessRecoveryConfirm: (code: string) => `/access-recovery/confirm-${code}`,
  oauthAuthorize: () => '/oauth/authorize',
  settings: {
    base: () => '/settings',
    profile: () => `${path.settings.base()}/profile`,
  },
};
