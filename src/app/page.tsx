import { redirect } from 'next/navigation';

export default function Home() {
  // This will be the first page a user hits.
  // The AuthGuard on the dispute page will handle redirecting to /login if not authenticated.
  // If the user is already logged in, this avoids flashing the login page.
  redirect('/disputes/1');
}
