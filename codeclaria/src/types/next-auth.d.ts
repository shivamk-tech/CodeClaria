import "next-auth";

declare module "next-auth" {
  interface Profile {
    id: number;
    login: string;
    avatar_url: string;
    email?: string | null;
    name?: string | null;
  }

  interface Session {
    accessToken?: string;
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: number;
    image?: string;
    accessToken?: string;
  }
}
