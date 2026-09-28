"use server";

import { signIn } from "@/auth";
import getUrlFromHeaders from "../getUrlFromHeaders";
import type { BuiltInProviders } from "@auth/core/providers";

export default async function signInAction(provider?: keyof BuiltInProviders) {
  const callbackUrlFromHeaders = (await getUrlFromHeaders()) || "/";
  const callbackUrl = new URL(callbackUrlFromHeaders);
  callbackUrl.searchParams.append("hideBackBtn", "");

  signIn(provider, {
    redirectTo: callbackUrl.toString(),
  });
}
