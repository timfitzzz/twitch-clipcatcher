import { IDENTITY_CONFIG } from './authConst'
import { UserManager, WebStorageStateStore, Log, IDTokenClaims } from 'oidc-client'
import { OIDCUserData } from '../../types';

export default class AuthService {
  private UserManager: UserManager;

  public clientId: string;

  constructor() {
    this.clientId = IDENTITY_CONFIG.client_id || '0000'
    this.UserManager = new UserManager({
      ...IDENTITY_CONFIG,
      userStore: new WebStorageStateStore({ store: window.sessionStorage })
    });
    // Logger
    Log.logger = console;
    Log.level = Log.INFO;
    this.UserManager.events.addUserLoaded((user) => {
      if (window.location.href.indexOf("signin-oidc") !== -1) {
        this.navigateToScreen();
      }
    });

    this.UserManager.events.addSilentRenewError((e) => {
      console.log("silent renew error", e.message);
    })

    this.UserManager.events.addAccessTokenExpired(() => {
      console.log("token expired");
      this.signinSilent();
    })

  }

  public signinRedirectCallback = () => {
    this.UserManager.signinRedirectCallback().then(() => {
      "";
    });
  }


  getUser = async () => {
    const user = await this.UserManager.getUser() as unknown as Promise<OIDCUserData>;
    if (!user) {
      return await this.UserManager.signinRedirectCallback();
    }
    return user;
  }

  parseJwt = (token: string) => {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace("-", "+").replace("_", "/");
    return JSON.parse(window.atob(base64));
  };

  signinRedirect = () => {
    localStorage.setItem("redirectUri", window.location.pathname);
    this.UserManager.signinRedirect({});
  }

  navigateToScreen = () => {
    window.location.replace("/");
  }

  isAuthenticated = () => {
    // console.log('getting user token from ', `oidc.user:${process.env.REACT_APP_TWITCH_AUTHORITY || 'https://id.twitch.tv/oauth2/.well-known/openid-configuration'}:${process.env.REACT_APP_TWITCH_CLIENT_ID || ''}`)
    let oidcInfo = sessionStorage.getItem(`oidc.user:${process.env.REACT_APP_TWITCH_AUTHORITY || 'https://id.twitch.tv/oauth2/.well-known/openid-configuration'}:${process.env.REACT_APP_TWITCH_CLIENT_ID || ''}`)
    // console.log(oidcInfo)
    let oidcStorage: IDTokenClaims | false = false
    if (oidcInfo) {
      oidcStorage = JSON.parse(oidcInfo)
    }
    // console.log(oidcStorage)
    return (oidcStorage && oidcStorage.id_token ? true : false)
  };

  signinSilent = () => {
      this.UserManager.signinSilent()
          .then((user) => {
              console.log("signed in", user);
          })
          .catch((err) => {
              console.log(err);
          });
  };
  signinSilentCallback = () => {
      this.UserManager.signinSilentCallback();
  };

  createSigninRequest = () => {
      return this.UserManager.createSigninRequest();
  };

  logout = () => {
      this.UserManager.signoutRedirect({
          id_token_hint: localStorage.getItem("id_token")
      });
      this.UserManager.clearStaleState();
  };

  signoutRedirectCallback = () => {
      this.UserManager.signoutRedirectCallback().then(() => {
          localStorage.clear();
          process.env.REACT_APP_PUBLIC_URL && window.location.replace(process.env.REACT_APP_PUBLIC_URL);
      });
      this.UserManager.clearStaleState();
  };


}