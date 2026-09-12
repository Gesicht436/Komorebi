import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (!supabaseUrl || !supabaseAnonKey) {
    return supabaseResponse;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isDemo = request.cookies.get('komorebi_demo')?.value === 'true';
  const isAuthRoute =
    request.nextUrl.pathname.startsWith('/login') ||
    request.nextUrl.pathname.startsWith('/signup') ||
    request.nextUrl.pathname.startsWith('/forgot-password');
  const isResetPasswordRoute = request.nextUrl.pathname.startsWith('/reset-password');
  const isAuthHandler = request.nextUrl.pathname.startsWith('/auth/');

  // If visiting an auth route, clear lingering demo cookie so the user can log into their real account
  if ((isAuthRoute || isResetPasswordRoute) && isDemo) {
    supabaseResponse.cookies.set('komorebi_demo', '', { path: '/', maxAge: 0 });
  }

  // Protect app routes if not logged in and not in demo mode
  if (
    !user &&
    !isDemo &&
    !isAuthRoute &&
    !isResetPasswordRoute &&
    !isAuthHandler &&
    request.nextUrl.pathname !== '/' &&
    !request.nextUrl.pathname.startsWith('/_next') &&
    !request.nextUrl.pathname.startsWith('/api/auth') &&
    !request.nextUrl.pathname.includes('.')
  ) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Only redirect to dashboard if an actual authenticated user is accessing login/signup/forgot-password
  // (Do NOT redirect from /reset-password so the user can complete setting their new password)
  if (user && isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
