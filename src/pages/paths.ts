export const path = {
  home: () => '/',
  login: () => '/login',
  register: () => '/register',
  registerConfirm: (code: string) => `/register/confirm-${code}`,
  accessRecovery: () => '/access-recovery',
  accessRecoveryConfirm: (code: string) => `/access-recovery/confirm-${code}`,
  // TODO some magic router config~
  oauthAuthorize: (client_id = '', redirect_uri = '', response_type = '') => {
    if (client_id && redirect_uri && response_type) {
      return `/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=${response_type}`;
    }
    return '/oauth/authorize';
  },
};
