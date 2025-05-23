import { jwtDecode } from "jwt-decode";

export default function (context) {
  const token = localStorage.getItem("accessToken");
  const isAdminRoute = context.route.path.startsWith("/admin");
  const isManageRoute = context.route.path.startsWith("/manage");
  const isLoginOrRegisterRoute =
    context.route.path === "/login" || context.route.path === "/register";

  if (token) {
    const { user } = jwtDecode(token);
    const isAdmin = user.role_id === 1;

    if (isAdmin && !context.route.path.includes("/admin")) {
      context.redirect("/admin");
    } else if (!isAdmin && context.route.path.includes("/admin")) {
      context.redirect("/manage");
    }
  }

  if (
    (!token && (isAdminRoute || isManageRoute)) ||
    (token && isLoginOrRegisterRoute)
  ) {
    setTimeout(() => {
      context.redirect("/");
    }, 0);
  }
}
