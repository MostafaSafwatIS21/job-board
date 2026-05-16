import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { getAuthToken } from "@/utils/api";

declare global {
  interface Window {
    Pusher: typeof Pusher;
  }
}

window.Pusher = Pusher;

const reverbHost = import.meta.env.VITE_REVERB_HOST ?? "localhost";
const reverbPort = Number(import.meta.env.VITE_REVERB_PORT ?? 8080);
const reverbScheme = import.meta.env.VITE_REVERB_SCHEME ?? "http";
const useTls = reverbScheme === "https";

const echo = new Echo({
  broadcaster: "reverb",
  key: "uya84uejbtpw5bbjjl3w",
  wsHost: reverbHost,
  wsPort: reverbPort,
  wssPort: reverbPort,
  forceTLS: useTls,
  enabledTransports: useTls ? ["wss"] : ["ws"],

  // Authorization configuration for Private Channels
  authEndpoint: "http://localhost:8000/api/broadcasting/auth",
  auth: {
    headers: {
      // Replace this with however you retrieve your stored token
      Authorization: `Bearer ${getAuthToken() ?? ""}`,
      Accept: "application/json",
    },
  },
});

export default echo;
