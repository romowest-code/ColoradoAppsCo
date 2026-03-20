import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SITE_PASSWORD = process.env.SITE_PASSWORD || "humbledtrader2026";
const COOKIE_NAME = "site-auth";

export function middleware(request: NextRequest) {
  // Allow the login API route and Twilio webhook routes through
  if (
    request.nextUrl.pathname === "/ht/api/login" ||
    request.nextUrl.pathname.startsWith("/api/twilio/")
  ) {
    return NextResponse.next();
  }

  // Check for auth cookie
  const authCookie = request.cookies.get(COOKIE_NAME);
  if (authCookie?.value === SITE_PASSWORD) {
    return NextResponse.next();
  }

  // Serve the login page inline
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Humbled Trader — Access Required</title>
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&display=swap" rel="stylesheet" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Manrope', sans-serif;
      background: #ffffff;
      color: #1c1917;
      min-height: 100dvh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .container {
      text-align: center;
      padding: 2rem;
      max-width: 380px;
      width: 100%;
    }
    .icon {
      width: 56px; height: 56px;
      background: #c9982e;
      border-radius: 12px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1.5rem;
    }
    .icon svg { width: 28px; height: 28px; fill: white; }
    h1 { font-size: 0.65rem; letter-spacing: 0.15em; text-transform: uppercase; color: #c9982e; font-weight: 800; margin-bottom: 0.25rem; }
    h2 { font-size: 1.25rem; font-weight: 700; margin-bottom: 1.5rem; }
    input {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 1.5px solid #e7e5e4;
      border-radius: 10px;
      font-family: inherit;
      font-size: 0.875rem;
      outline: none;
      background: #f7f5f2;
      margin-bottom: 0.75rem;
    }
    input:focus { border-color: #c9982e; }
    button {
      width: 100%;
      padding: 0.75rem;
      background: #c9982e;
      color: white;
      border: none;
      border-radius: 10px;
      font-family: inherit;
      font-size: 0.875rem;
      font-weight: 700;
      cursor: pointer;
    }
    button:hover { background: #a87d1a; }
    .error { color: #dc2626; font-size: 0.75rem; margin-top: 0.5rem; display: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="icon"><svg viewBox="0 0 24 24"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2z"/></svg></div>
    <h1>Humbled Trader</h1>
    <h2>Enter Password</h2>
    <form id="form">
      <input type="password" id="pw" placeholder="Password" autocomplete="off" autofocus />
      <button type="submit">Access Watchlist</button>
      <p class="error" id="err">Incorrect password. Try again.</p>
    </form>
  </div>
  <script>
    document.getElementById('form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const pw = document.getElementById('pw').value;
      const res = await fetch('/ht/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pw })
      });
      if (res.ok) {
        window.location.reload();
      } else {
        document.getElementById('err').style.display = 'block';
        document.getElementById('pw').value = '';
        document.getElementById('pw').focus();
      }
    });
  </script>
</body>
</html>`;

  return new NextResponse(html, {
    status: 200,
    headers: { "Content-Type": "text/html" },
  });
}

export const config = {
  matcher: ["/ht/:path*", "/messages/:path*"],
};
