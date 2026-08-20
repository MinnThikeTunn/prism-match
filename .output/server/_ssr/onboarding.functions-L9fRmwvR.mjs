import process from "node:process";
import { T as TSS_SERVER_FUNCTION, a as createServerFn } from "./index.mjs";

import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import "../_libs/h3-v2.mjs";
import "../_libs/unenv.mjs";


import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";





import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";

import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "../_libs/isbot.mjs";
var createServerRpc = (serverFnMeta, splitImportFn) => {
  const url = "/_serverFn/" + serverFnMeta.id;
  return Object.assign(splitImportFn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const MAX_PAYLOAD_BYTES = 96 * 1024;
function clean(value, max = 500) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.slice(0, max);
}
function validateToken(token) {
  if (typeof token !== "string" || !/^[a-f0-9]{32,128}$/i.test(token)) {
    throw new Error("Invalid device token");
  }
  return token;
}
function validateJson(value, label) {
  const obj = value && typeof value === "object" && !Array.isArray(value) ? JSON.parse(JSON.stringify(value)) : {};
  const size = JSON.stringify(obj).length;
  if (size > MAX_PAYLOAD_BYTES) throw new Error(`${label} payload too large`);
  return obj;
}
async function hashToken(token) {
  const data = new TextEncoder().encode(`matchwise:${token}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}
const saveOnboardingProfile_createServerFn_handler = createServerRpc({
  id: "3a1cd8c514a5776b350119f2c414771ad99b06b0377859581ca22ab337fe8cf1",
  name: "saveOnboardingProfile",
  filename: "src/lib/onboarding.functions.ts"
}, (opts) => saveOnboardingProfile.__executeServer(opts));
const saveOnboardingProfile = createServerFn({
  method: "POST"
}).inputValidator((input) => {
  validateToken(input?.token);
  return input;
}).handler(saveOnboardingProfile_createServerFn_handler, async ({
  data
}) => {
  const {
    supabaseAdmin
  } = await import("./client.server-CK2Ilf7B.mjs");
  const tokenHash = await hashToken(data.token);
  const publicData = validateJson(data.publicData, "Profile");
  const features = validateJson(data.features, "Answers");
  const row = {
    token_hash: tokenHash,
    name: clean(data.name, 120) ?? "",
    title: clean(data.title, 160),
    location: clean(data.location, 160),
    bio: clean(data.bio, 1e3),
    avatar: clean(data.avatar, 500),
    public_data: publicData,
    is_public: data.isPublic !== false
  };
  const {
    data: profile,
    error
  } = await supabaseAdmin.from("anon_profiles").upsert(row, {
    onConflict: "token_hash"
  }).select("id").single();
  if (error || !profile) throw new Error(error?.message ?? "Failed to save profile");
  const {
    error: featuresError
  } = await supabaseAdmin.from("anon_profile_features").upsert({
    profile_id: profile.id,
    features,
    completed: data.completed === true
  }, {
    onConflict: "profile_id"
  });
  if (featuresError) throw new Error(featuresError.message);
  return {
    id: profile.id
  };
});
const getOnboardingProfile_createServerFn_handler = createServerRpc({
  id: "9470fa06cf9e7d567b09dd56ac606cad8ec8007a0d09a15eb5b9c4bcca9b93e2",
  name: "getOnboardingProfile",
  filename: "src/lib/onboarding.functions.ts"
}, (opts) => getOnboardingProfile.__executeServer(opts));
const getOnboardingProfile = createServerFn({
  method: "POST"
}).inputValidator((input) => {
  validateToken(input?.token);
  return input;
}).handler(getOnboardingProfile_createServerFn_handler, async ({
  data
}) => {
  const {
    supabaseAdmin
  } = await import("./client.server-CK2Ilf7B.mjs");
  const tokenHash = await hashToken(data.token);
  const {
    data: profile
  } = await supabaseAdmin.from("anon_profiles").select("id, name, title, location, bio, avatar, public_data, is_public").eq("token_hash", tokenHash).maybeSingle();
  if (!profile) return {
    profile: null,
    features: null,
    completed: false
  };
  const {
    data: features
  } = await supabaseAdmin.from("anon_profile_features").select("features, completed").eq("profile_id", profile.id).maybeSingle();
  return {
    profile,
    features: features?.features ?? null,
    completed: features?.completed ?? false
  };
});
const listPublicProfiles_createServerFn_handler = createServerRpc({
  id: "b2140c00d4a7fad224ad0ba3c84cf7fc79eb3c37349318bb89ec69d3d794e72d",
  name: "listPublicProfiles",
  filename: "src/lib/onboarding.functions.ts"
}, (opts) => listPublicProfiles.__executeServer(opts));
const listPublicProfiles = createServerFn({
  method: "GET"
}).handler(listPublicProfiles_createServerFn_handler, async () => {
  const {
    createClient
  } = await import("../_libs/supabase__supabase-js.mjs");
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
  const url = process.env["SUPABASE_URL"];
  const supabasePublic = createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
          headers.delete("Authorization");
        }
        headers.set("apikey", key);
        return fetch(input, {
          ...init,
          headers
        });
      }
    }
  });
  const {
    data,
    error
  } = await supabasePublic.from("anon_profiles").select("id, name, title, location, bio, avatar, public_data, updated_at").eq("is_public", true).order("updated_at", {
    ascending: false
  }).limit(50);
  if (error) return {
    profiles: [],
    error: error.message
  };
  return {
    profiles: data ?? [],
    error: null
  };
});
export {
  getOnboardingProfile_createServerFn_handler,
  listPublicProfiles_createServerFn_handler,
  saveOnboardingProfile_createServerFn_handler
};
