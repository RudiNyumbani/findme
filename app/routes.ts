import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("login","routes/login.tsx"),
    route("sign-up","routes/sign-up.tsx"),
    route("protected","routes/protected.tsx"),
    route("update-password","routes/update-password.tsx"),
    route("forgot-password","routes/forgot-password.tsx"),
] satisfies RouteConfig;
