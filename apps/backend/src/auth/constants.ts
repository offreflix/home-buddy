export const jwtConstants = {
  secret: process.env.JWT_SECRET,
};

export const googleConstants = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
};
