export type LoginResponse = {
  // Tipe ini dibuat fleksibel menyesuaikan fungsi extractAuthTokens
  accessToken?: string;
  refreshToken?: string;
  access_token?: string;
  refresh_token?: string;
  tokens?: {
    access?: { token: string };
    refresh?: { token: string };
  };
  [key: string]: any; 
};

export type AuthFormState = {
  email: string; // Diubah dari username
  password: string;
};