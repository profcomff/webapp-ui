import { AuthMethodName, AuthMethodNameList } from '@/models';

export function isAuthMethod(authMethod: string | string[]): authMethod is AuthMethodName {
	return AuthMethodNameList.includes(authMethod as AuthMethodName);
}
