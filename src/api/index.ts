// Accesso App Internal API. 0.4.0
// ---
// This file is automatically generated by openapi with preset effector-openapi-preset
// Do not edit this file directly. Instead open openapi config file and follow the link in "file"
import { createEffect } from 'effector-root';
import * as typed from 'typed-contracts';
import { requestFx } from './request';

//#region prebuilt code
const custom = { any: (valueName: string, value: unknown): any => value };

export type GenericErrors =
  | {
      status: 'unexpected';
      error: Error;
    }
  | {
      status: 'unknown_status';
      error: { status: number; body: unknown };
    }
  | {
      status: 'validation_error';
      error: typed.ValidationError;
    };

type ErrorCodes =
  | 400
  | 401
  | 402
  | 403
  | 404
  | 405
  | 406
  | 500
  | 501
  | 502
  | 503
  | 503
  | 505;
/**
 * @throws
 */
function parseByStatus<
  Variants extends string,
  Contracts extends Record<number, [Variants, typed.Contract<any>]>,
  Result extends {
    [Code in keyof Contracts]: Contracts[Code] extends [
      infer Status,
      typed.Contract<infer T>,
    ]
      ? { status: Status; answer: T }
      : never;
  }
>(
  name: string,
  response: { status: number; body?: unknown },
  contracts: Contracts,
): Result[Exclude<keyof Result, ErrorCodes>] {
  const contractObject = contracts[response.status];
  if (!contractObject) {
    throw {
      status: 'unknown_status',
      error: {
        status: response.status,
        body: response.body,
      },
    };
  }
  const [status, contract] = contractObject;
  const answer = contract(name, response.body);
  if (answer instanceof typed.ValidationError) {
    throw { status: 'validation_error', error: answer };
  }
  if (response.status >= 400) {
    throw { status, error: answer };
  }
  return { status, answer } as Result[Exclude<keyof Result, ErrorCodes>];
}

//#endregion prebuilt code/* --- */
//#region oauthAuthorizeRequest
type OauthAuthorizeRequest = {
  body: {
    /* responseType is set to code indicating that you want an authorization code as the response. */
    responseType: 'code';

    /* The clientId is the identifier for your app. You will have received a clientId when first registering your app with the service. */
    clientId: string;

    /* The redirectUri may be optional depending on the API, but is highly recommended.
     *
     * This is the URL to which you want the user to be redirected after the authorization is complete.
     *
     * This must match the redirect URL that you have previously registered with the service. */
    redirectUri: string;

    /* Include one or more scope values (space-separated) to request additional levels of access. */
    scope?: string;

    /* The state parameter serves two functions.
     * When the user is redirected back to your app, whatever value you include as the state will also be included in the redirect.
     * This gives your app a chance to persist data between the user being directed to the authorization server and back again, such as using the state parameter as a session key. This may be used to indicate what action in the app to perform after authorization is complete, for example, indicating which of your app’s pages to redirect to after authorization. This also serves as a CSRF protection mechanism.
     * When the user is redirected back to your app, double check that the state value matches what you set it to originally. This will ensure an attacker can’t intercept the authorization flow. */
    state?: string;
  };
};

/* Authorization completed, now access token can be obtained. */
export const oauthAuthorizeRequestOk = typed.object({
  /* User should be redirected to */
  redirectUri: typed.string,

  /* This parameter contains the authorization code which the client will later exchange for an access token. */
  code: typed.string,

  /* If the initial request contained a state parameter, the response must also include the exact value from the request. The client will be using this to associate this response with the initial request. */
  state: typed.string.optional,
});
export type OauthAuthorizeRequestDone = {
  status: 'ok';
  answer: typed.Get<typeof oauthAuthorizeRequestOk>;
};

/* There are two different kinds of errors to handle. The first kind of error is when the developer did something wrong when creating the authorization request. The other kind of error is when the user rejects the request (clicks the “Deny” button).
 * If there is something wrong with the syntax of the request, such as the redirect_uri or client_id is invalid, then it’s important not to redirect the user and instead you should show the error message directly. This is to avoid letting your authorization server be used as an open redirector.
 * If the redirect_uri and client_id are both valid, but there is still some other problem, it’s okay to redirect the user back to the redirect URI with the error in the query string. */
export const oauthAuthorizeRequestBadRequest = typed.object({
  /* Possible errors:
   *
   * If the user denies the authorization request, the server will redirect the user back to the redirect URL with error=`access_denied` in the query string, and no code will be present. It is up to the app to decide what to display to the user at this point.
   *
   * `invalid_request` — The request is missing a required parameter, includes an invalid parameter value, or is otherwise malformed.
   *
   * `unsupported_response_type` — The authorization server does not support obtaining an authorization code using this method.
   *
   * `invalid_scope` — The requested scope is invalid, unknown, or malformed.
   *
   * `server_error` — The authorization server encountered an unexpected condition which prevented it from fulfilling the request.
   *
   * `temporarily_unavailable` — The authorization server is currently unable to handle the request due to a temporary overloading or maintenance of the server.
   *
   * [OAuth2 Possible Errors](https://www.oauth.com/oauth2-servers/server-side-apps/possible-errors/) */
  error: typed.union(
    'access_denied',
    'invalid_request',
    'invalid_scope',
    'server_error',
    'temporarily_unavailable',
    'unauthenticated_user',
    'unauthorized_client',
    'unsupported_response_type',
  ),

  /* User should be redirected to if passed redirectUri and clientId is correct */
  redirectUri: typed.string.optional,

  /* If the initial request contained a state parameter, the response must also include the exact value from the request. The client will be using this to associate this response with the initial request. */
  state: typed.string.optional,
});

/* Something goes wrong */
export const oauthAuthorizeRequestInternalServerError = typed.nul;
export type OauthAuthorizeRequestFail =
  | {
      status: 'bad_request';
      error: typed.Get<typeof oauthAuthorizeRequestBadRequest>;
    }
  | {
      status: 'internal_server_error';
      error: typed.Get<typeof oauthAuthorizeRequestInternalServerError>;
    }
  | GenericErrors;

/* Authorization request */
export const oauthAuthorizeRequest = createEffect<
  OauthAuthorizeRequest,
  OauthAuthorizeRequestDone,
  OauthAuthorizeRequestFail
>({
  async handler({ body }) {
    const name = 'oauthAuthorizeRequest.body';
    const response = await requestFx({
      path: '/oauth/authorize',
      method: 'POST',
      body,
    });
    return parseByStatus(name, response, {
      200: ['ok', oauthAuthorizeRequestOk],
      400: ['bad_request', oauthAuthorizeRequestBadRequest],
      500: ['internal_server_error', oauthAuthorizeRequestInternalServerError],
    });
  },
});
//#endregion oauthAuthorizeRequest

/* --- */
//#region accessRecoverySendEmail
type AccessRecoverySendEmail = {
  body: {
    email: string;
  };
};

/* Password changed successfully */
export const accessRecoverySendEmailOk = typed.nul;
export type AccessRecoverySendEmailDone = {
  status: 'ok';
  answer: typed.Get<typeof accessRecoverySendEmailOk>;
};

/* Reset code or password is invalid */
export const accessRecoverySendEmailBadRequest = typed.object({
  error: typed.union('invalid_email', 'invalid_password'),
});

/* Something goes wrong */
export const accessRecoverySendEmailInternalServerError = typed.nul;
export type AccessRecoverySendEmailFail =
  | {
      status: 'bad_request';
      error: typed.Get<typeof accessRecoverySendEmailBadRequest>;
    }
  | {
      status: 'internal_server_error';
      error: typed.Get<typeof accessRecoverySendEmailInternalServerError>;
    }
  | GenericErrors;

/* Send password recovery confirmation code to email */
export const accessRecoverySendEmail = createEffect<
  AccessRecoverySendEmail,
  AccessRecoverySendEmailDone,
  AccessRecoverySendEmailFail
>({
  async handler({ body }) {
    const name = 'accessRecoverySendEmail.body';
    const response = await requestFx({
      path: '/access-recovery/send-email',
      method: 'POST',
      body,
    });
    return parseByStatus(name, response, {
      200: ['ok', accessRecoverySendEmailOk],
      400: ['bad_request', accessRecoverySendEmailBadRequest],
      500: [
        'internal_server_error',
        accessRecoverySendEmailInternalServerError,
      ],
    });
  },
});
//#endregion accessRecoverySendEmail

/* --- */
//#region accessRecoverySetPassword
type AccessRecoverySetPassword = {
  body: {
    password: string;
    code: string;
  };
};

/* Confirmation code is sent to email */
export const accessRecoverySetPasswordOk = typed.nul;
export type AccessRecoverySetPasswordDone = {
  status: 'ok';
  answer: typed.Get<typeof accessRecoverySetPasswordOk>;
};
export const accessRecoverySetPasswordBadRequest = typed.object({
  error: typed.union(
    'invalid_code',
    'password_is_too_short',
    'password_is_too_weak',
  ),
});

/* Something goes wrong */
export const accessRecoverySetPasswordInternalServerError = typed.nul;
export type AccessRecoverySetPasswordFail =
  | {
      status: 'bad_request';
      error: typed.Get<typeof accessRecoverySetPasswordBadRequest>;
    }
  | {
      status: 'internal_server_error';
      error: typed.Get<typeof accessRecoverySetPasswordInternalServerError>;
    }
  | GenericErrors;

/* Set new password by reset code from email */
export const accessRecoverySetPassword = createEffect<
  AccessRecoverySetPassword,
  AccessRecoverySetPasswordDone,
  AccessRecoverySetPasswordFail
>({
  async handler({ body }) {
    const name = 'accessRecoverySetPassword.body';
    const response = await requestFx({
      path: '/access-recovery/set-password',
      method: 'POST',
      body,
    });
    return parseByStatus(name, response, {
      200: ['ok', accessRecoverySetPasswordOk],
      400: ['bad_request', accessRecoverySetPasswordBadRequest],
      500: [
        'internal_server_error',
        accessRecoverySetPasswordInternalServerError,
      ],
    });
  },
});
//#endregion accessRecoverySetPassword

/* --- */
//#region registerRequest
type RegisterRequest = {
  body: {
    email: string;
  };
};

/* Registration link sent to email, now user can find out when the link expires */
export const registerRequestCreated = typed.object({
  /* UTC Unix TimeStamp when the link expires */
  expiresAt: typed.number,
});
export type RegisterRequestDone = {
  status: 'created';
  answer: typed.Get<typeof registerRequestCreated>;
};

/* Please, login or recover password */
export const registerRequestBadRequest = typed.object({
  error: typed.union(
    'email_already_registered',
    'invalid_form',
    'invalid_payload',
  ),
});

/* Something goes wrong */
export const registerRequestInternalServerError = typed.nul;
export type RegisterRequestFail =
  | {
      status: 'bad_request';
      error: typed.Get<typeof registerRequestBadRequest>;
    }
  | {
      status: 'internal_server_error';
      error: typed.Get<typeof registerRequestInternalServerError>;
    }
  | GenericErrors;

/* Send registration link to email */
export const registerRequest = createEffect<
  RegisterRequest,
  RegisterRequestDone,
  RegisterRequestFail
>({
  async handler({ body }) {
    const name = 'registerRequest.body';
    const response = await requestFx({
      path: '/register/request',
      method: 'POST',
      body,
    });
    return parseByStatus(name, response, {
      201: ['created', registerRequestCreated],
      400: ['bad_request', registerRequestBadRequest],
      500: ['internal_server_error', registerRequestInternalServerError],
    });
  },
});
//#endregion registerRequest

/* --- */
//#region registerConfirmation
type RegisterConfirmation = {
  body: {
    confirmationCode: string;
    firstName: string;
    lastName: string;
    password: string;
  };
};

/* Okay, user created */
export const registerConfirmationCreated = typed.nul;
export type RegisterConfirmationDone = {
  status: 'created';
  answer: typed.Get<typeof registerConfirmationCreated>;
};

/* Please, login or recover password */
export const registerConfirmationBadRequest = typed.object({
  error: typed.union(
    'code_invalid_or_expired',
    'email_already_activated',
    'invalid_form',
    'invalid_payload',
  ),
});

/* Something goes wrong */
export const registerConfirmationInternalServerError = typed.nul;
export type RegisterConfirmationFail =
  | {
      status: 'bad_request';
      error: typed.Get<typeof registerConfirmationBadRequest>;
    }
  | {
      status: 'internal_server_error';
      error: typed.Get<typeof registerConfirmationInternalServerError>;
    }
  | GenericErrors;

/* Confirm email, fill profile required fields and create user */
export const registerConfirmation = createEffect<
  RegisterConfirmation,
  RegisterConfirmationDone,
  RegisterConfirmationFail
>({
  async handler({ body }) {
    const name = 'registerConfirmation.body';
    const response = await requestFx({
      path: '/register/confirmation',
      method: 'POST',
      body,
    });
    return parseByStatus(name, response, {
      201: ['created', registerConfirmationCreated],
      400: ['bad_request', registerConfirmationBadRequest],
      500: ['internal_server_error', registerConfirmationInternalServerError],
    });
  },
});
//#endregion registerConfirmation

/* --- */
//#region sessionCreate
type SessionCreate = {
  body: {
    email: string;
    password: string;
  };
};

/* Session created, token wrote to cookies */
export const sessionCreateCreated = typed.object({
  firstName: typed.string,
  lastName: typed.string,
  email: typed.string,
});
export type SessionCreateDone = {
  status: 'created';
  answer: typed.Get<typeof sessionCreateCreated>;
};

/* Login failed */
export const sessionCreateBadRequest = typed.object({
  error: typed.union('invalid_credentials', 'invalid_form', 'invalid_payload'),
});

/* Something went wrong */
export const sessionCreateInternalServerError = typed.nul;
export type SessionCreateFail =
  | {
      status: 'bad_request';
      error: typed.Get<typeof sessionCreateBadRequest>;
    }
  | {
      status: 'internal_server_error';
      error: typed.Get<typeof sessionCreateInternalServerError>;
    }
  | GenericErrors;

/* Login and create new session token */
export const sessionCreate = createEffect<
  SessionCreate,
  SessionCreateDone,
  SessionCreateFail
>({
  async handler({ body }) {
    const name = 'sessionCreate.body';
    const response = await requestFx({
      path: '/session/create',
      method: 'POST',
      body,
    });
    return parseByStatus(name, response, {
      201: ['created', sessionCreateCreated],
      400: ['bad_request', sessionCreateBadRequest],
      500: ['internal_server_error', sessionCreateInternalServerError],
    });
  },
});
//#endregion sessionCreate

/* --- */
//#region sessionGet
type SessionGet = {};

/* Session exists */
export const sessionGetOk = typed.object({
  /* Current user in a session */
  user: typed.object({
    firstName: typed.string,
    lastName: typed.string,
    email: typed.string,
  }),
});
export type SessionGetDone = {
  status: 'ok';
  answer: typed.Get<typeof sessionGetOk>;
};

/* User not authorized */
export const sessionGetUnauthorized = typed.nul;

/* Something went wrong */
export const sessionGetInternalServerError = typed.nul;
export type SessionGetFail =
  | {
      status: 'unauthorized';
      error: typed.Get<typeof sessionGetUnauthorized>;
    }
  | {
      status: 'internal_server_error';
      error: typed.Get<typeof sessionGetInternalServerError>;
    }
  | GenericErrors;

/* Read session token and show current session. Authenticated checked by session-token cookie */
export const sessionGet = createEffect<
  SessionGet,
  SessionGetDone,
  SessionGetFail
>({
  async handler() {
    const name = 'sessionGet.body';
    const response = await requestFx({
      path: '/session/get',
      method: 'POST',
    });
    return parseByStatus(name, response, {
      200: ['ok', sessionGetOk],
      401: ['unauthorized', sessionGetUnauthorized],
      500: ['internal_server_error', sessionGetInternalServerError],
    });
  },
});
//#endregion sessionGet

/* --- */
//#region sessionDelete
type SessionDelete = {
  body: {
    deleteAllSessions: boolean;
  };
};

/* session deleted */
export const sessionDeleteOk = typed.nul;
export type SessionDeleteDone = {
  status: 'ok';
  answer: typed.Get<typeof sessionDeleteOk>;
};

/* failed to delete session */
export const sessionDeleteBadRequest = typed.object({
  error: typed.union('invalid_payload'),
});

/* User not authorized */
export const sessionDeleteUnauthorized = typed.nul;

/* Something went wrong */
export const sessionDeleteInternalServerError = typed.nul;
export type SessionDeleteFail =
  | {
      status: 'bad_request';
      error: typed.Get<typeof sessionDeleteBadRequest>;
    }
  | {
      status: 'unauthorized';
      error: typed.Get<typeof sessionDeleteUnauthorized>;
    }
  | {
      status: 'internal_server_error';
      error: typed.Get<typeof sessionDeleteInternalServerError>;
    }
  | GenericErrors;

/* Delete current or all sessions */
export const sessionDelete = createEffect<
  SessionDelete,
  SessionDeleteDone,
  SessionDeleteFail
>({
  async handler({ body }) {
    const name = 'sessionDelete.body';
    const response = await requestFx({
      path: '/session/delete',
      method: 'POST',
      body,
    });
    return parseByStatus(name, response, {
      200: ['ok', sessionDeleteOk],
      400: ['bad_request', sessionDeleteBadRequest],
      401: ['unauthorized', sessionDeleteUnauthorized],
      500: ['internal_server_error', sessionDeleteInternalServerError],
    });
  },
});
//#endregion sessionDelete
