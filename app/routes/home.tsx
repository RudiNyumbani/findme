import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "FindMe" },
    { name: "description", content: "Welcome tO FindMe!" },
  ];
}

export default function Home() {
  return <Welcome />;
}
