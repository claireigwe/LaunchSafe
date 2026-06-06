import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Next.js Proxy (formerly Middleware).
 * Runs on every request to:
 * 1. Refresh the Supabase session
 * 2. Protect authenticated app routes
 * 3. Redirect authenticated users away from auth pages
 */
export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session — do not add logic between createServerClient and getUser.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protect all (app) routes.
  const protectedPrefixes = [
    "/onboarding",
    "/dashboard",
    "/business",
    "/businesses",
    "/assessments",
    "/compliance",
    "/documents",
    "/regulatory-updates",
    "/notifications",
    "/reports",
    "/settings",
  ];

  const isAppRoute = protectedPrefixes.some((prefix) =>
    request.nextUrl.pathname.startsWith(prefix)
  );

  if (isAppRoute && !user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("redirectTo", request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect authenticated users away from auth pages.
  // Respect ?redirect= param if present (preserves conversion flow).
  const isAuthRoute =
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/signup") ||
    request.nextUrl.pathname.startsWith("/forgot-password") ||
    request.nextUrl.pathname.startsWith("/reset-password");

  if (isAuthRoute && user) {
    const redirectParam = request.nextUrl.searchParams.get("redirect");
    if (redirectParam) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = redirectParam;
      redirectUrl.search = "";
      return NextResponse.redirect(redirectUrl);
    }
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/onboarding";
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
