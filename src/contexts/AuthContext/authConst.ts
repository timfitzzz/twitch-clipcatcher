import { OidcClientSettings } from 'oidc-client'
export const TWITCH_CLIENT_ID = process.env.REACT_APP_TWITCH_CLIENT_ID

interface ExtendedOidcClientSettings extends OidcClientSettings {
  response_type: string
  webAuthResponseType: string
  nonce: string
  claims: {
    userinfo: {
      picture: string | null
      preferred_username: string | null
    }
  }
}

export const IDENTITY_CONFIG: ExtendedOidcClientSettings  = {
  authority: 'https://id.twitch.tv/oauth2/.well-known/openid-configuration',
  client_id: process.env.REACT_APP_TWITCH_CLIENT_ID,
  redirect_uri: process.env.REACT_APP_REDIRECT_URL,
  loadUserInfo: true,
  response_type: "token id_token",
  scope: "openid chat:read chat:edit",
  webAuthResponseType: "token id_token",
  nonce: '58008',
  claims: {
    userinfo: {
      picture: null,
      preferred_username: null
    }
  }
}

export const METADATA_OIDC: any = {
  revocation_endpoint:  'https://id.twitch.tv/oauth2/revoke'
}