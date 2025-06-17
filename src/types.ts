// types.ts
export type RootStackParamList = {
  LoginScreen: undefined;
  SignUpScreen: undefined;
  Splash: undefined;
  Home: undefined;
  VerifySignUpScreen: {
    name: string;
    mobile: string;
    email: string;
    village: string;
    gp: string;
    password: string;
  };
};
