import { AuthOauth2BaseApi } from '@/api/auth/AuthOauth2BaseApi';
import { authGithubApi } from './AuthGithubApi';
import { authLkmsuApi } from './AuthLkmsuApi';
import { authMymsuApi, authYandexApi } from './AuthMymsuApi';
import { authGoogleApi, authPhysicsApi } from './AuthPhysicsApi';
import { authTelegramApi } from './AuthTelegramApi';
import { authVkApi } from './AuthVkApi';

export { authEmailApi } from './AuthEmailApi';
export { AuthOauth2BaseApi } from '@/api/auth/AuthOauth2BaseApi';
export { authGithubApi } from './AuthGithubApi';
export { authVkApi } from './AuthVkApi';
export { authTelegramApi } from './AuthTelegramApi';
export { authGoogleApi, authPhysicsApi } from './AuthPhysicsApi';
export { authLkmsuApi } from './AuthLkmsuApi';
export { authYandexApi, authMymsuApi } from './AuthMymsuApi';
export { authGroupApi, GroupInfo } from './AuthGroupApi';
export { authScopeApi } from './AuthScopeApi';
export { authUserApi, UserInfo } from './AuthUserApi';
export { userSessionApi, MySessionInfo, AuthMethod, SessionInfo } from './UserSessionApi';

export const oauth2Methods: Record<string, AuthOauth2BaseApi> = {
	github: authGithubApi,
	google: authGoogleApi,
	vk: authVkApi,
	'lk-msu': authLkmsuApi,
	yandex: authYandexApi,
	'my-msu': authMymsuApi,
	'physics-msu': authPhysicsApi,
	telegram: authTelegramApi,
};
