"use server";

import { headers } from "next/headers";
import { auth } from "../better-auth/auth";
import { inngest } from "../inngest/client";

export const signUpWithEmail = async ({
  email,
  password,
  fullName,
  country,
  investmentGoals,
  preferredIndustry,
  riskTolerance,
}: SignUpFormData) => {
  try {
    console.log("Starting sign up process for:", email);

    //call betterauth api to create user
    const response = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name: fullName,
      },
    });

    console.log("Better Auth response:", response);

    if (response) {
      // Send user data to Inngest for additional processing
      try {
        await inngest.send({
          name: "app/user.created",
          data: {
            email,
            name: fullName,
            country,
            investmentGoals,
            riskTolerance,
            preferredIndustry,
          },
        });
        console.log("User data sent to Inngest successfully");
      } catch (inngestError) {
        console.error("Inngest error (non-critical):", inngestError);
        // Don't fail the signup if Inngest fails
      }
    }

    return { success: true, data: response };
  } catch (error) {
    console.error("Sign up error:", error);

    // Extract meaningful error message
    let errorMessage = "Sign up failed. Please try again.";

    if (error instanceof Error) {
      if (
        error.message.includes("already exists") ||
        error.message.includes("duplicate")
      ) {
        errorMessage = "An account with this email already exists.";
      } else if (error.message.includes("invalid email")) {
        errorMessage = "Please enter a valid email address.";
      } else if (error.message.includes("password")) {
        errorMessage = "Password does not meet requirements.";
      } else {
        errorMessage = error.message;
      }
    }

    return { success: false, message: errorMessage };
  }
};

export const signInWithEmail = async ({ email, password }: SignInFormData) => {
  try {
      const response = await auth.api.signInEmail({ body: { email, password } })

      return { success: true, data: response }
  } catch (e) {
      console.log('Sign in failed', e)
      return { success: false, error: 'Sign in failed' }
  }
}

export const signOut = async () => {
   try {
    await auth.api.signOut({
      headers: await headers()
    })
   } catch (error) {
    console.log("Sign out error:", error);
    return { success: false, message: "Sign out failed. Please try again." };
   }
}
