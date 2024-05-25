"use server";

import { signIn } from "@/auth";
import { getUserByEmail } from "@/data/user";
import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/tokens";
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

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Email does not exist!" };
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email
    );

    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );

    return { success: "Confirmation email sent!" };
  }

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
          return {
            error: "Something went wrong!",
          };

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
