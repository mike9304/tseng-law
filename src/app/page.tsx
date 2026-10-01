import { redirect } from 'next/navigation';

export default function RootPage() {
  // Middleware answers `/` from Accept-Language; this only runs if middleware is bypassed.
  redirect('/ko');
}
