///<reference types="react" />

declare module "feed/CounterAppOne" {
	const CounterAppOne: React.ComponentType;
	export default CounterAppOne;
};

declare module "authentication/AuthGuard" {
	const AuthGuard: React.ComponentType;
	export default AuthGuard;
};

declare module "authentication/user" {
	const AuthGuard: React.ComponentType;
	export default AuthGuard;
};

declare module "authentication/LoginPage" {
	const LoginPage: React.ComponentType;
	export default LoginPage;
};

declare module "authentication/SignupPage" {
	const SignupPage: React.ComponentType;
	export default SignupPage;
};

declare module "authentication/useAuth" {
	interface AuthResponse {
		data: {
			access_token: string;
			refresh_token: string;
		};
	}

	interface UseAuth {
		user: AuthResponse | null;
		isLoading: boolean;
		error: Error | null;
		logout: () => void;
	}

	const useAuth: () => UseAuth;
	export default useAuth;
};

declare module "feed/features/SharePost" {
	const SharePost: React.ComponentType;
	export default SharePost;
};

declare module "feed/sections/FeedSection" {
	const FeedSection: React.ComponentType;
	export default FeedSection;
};