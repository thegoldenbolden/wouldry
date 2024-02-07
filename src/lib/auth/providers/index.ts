import type { Provider } from "~/lib/auth/utils";
import type { TupleUnion } from "~/types";

export const providers: TupleUnion<Provider> = ["discord", "google", "twitch"];
