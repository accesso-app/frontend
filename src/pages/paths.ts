export const path = {
  home: () => '/',
  login: () => '/login',
  register: () => '/register',
  registerConfirm: (code: string) => `/register/${code}`,
};
