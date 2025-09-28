type AuthCredentials = {
  username?: string;
  email: string;
  password: string;
};
type SignInWithOAuthParams = {
  provider: "google"; // Extend this union type as you add more providers
  providerAccountId: string;
  user: {
    username: string;
    email: string;
    image?: string;
  };
};
