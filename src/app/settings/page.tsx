import type { Metadata } from "next";
import Account, { metadata as meta } from "./account/page";

export const metadata: Metadata = meta;

export default function Page() {
  return <Account />;
}
