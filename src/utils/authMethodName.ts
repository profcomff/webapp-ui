import { AuthMethodLink, AuthMethodLinkList } from '@/models';

export function isAuthMethod(authMethod: string | string[]): authMethod is AuthMethodLink {
	return AuthMethodLinkList.includes(authMethod as AuthMethodLink);
}
