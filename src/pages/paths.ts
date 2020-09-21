export const path = {
  home: () => '/',
  login: () => '/login',
  register: () => '/register',
  registerConfirm: (code: string) => `/register/confirm-${code}`,
  accessRecovery: () => '/access-recovery',
  oauthAuthorize: () => '/oauth/authorize',
};
