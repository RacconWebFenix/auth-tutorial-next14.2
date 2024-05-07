"use server";

import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { LoginSchema } from "@/schemas";
import { AuthError } from "next-auth";
import * as z from "zod";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validateFields = LoginSchema.safeParse(values);

  if (!validateFields.success) {
    return {
      error: "Invalid fields ",
    };
  }

  const { email, password } = validateFields.data;

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "AccessDenied":
        case "AdapterError":
        case "CallbackRouteError":
        case "ErrorPageLoop":
        case "EventError":
        case "InvalidCallbackUrl":
        case "CredentialsSignin":
          return {
            error: "Invalid credentials",
          };
        case "InvalidEndpoints":
        case "InvalidCheck":
        case "JWTSessionError":
        case "MissingAdapter":
        case "MissingAdapterMethods":
        case "MissingAuthorize":
        case "MissingSecret":
        case "OAuthAccountNotLinked":
        case "OAuthCallbackError":
        case "OAuthProfileParseError":
        case "SessionTokenError":
        case "OAuthSignInError":
        case "EmailSignInError":
        case "SignOutError":
        case "UnknownAction":
        case "UnsupportedStrategy":
        case "InvalidProvider":
        case "UntrustedHost":
        case "Verification":
        case "MissingCSRF":
        case "AccountNotLinked":
        case "DuplicateConditionalUI":
        case "MissingWebAuthnAutocomplete":
        case "WebAuthnVerificationError":
        case "ExperimentalFeatureNotEnabled":
        default: {
          return {
            error: "Something went wrong!",
          };
        }
      }
    }

    throw error;
  }
};
