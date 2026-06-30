import { redirect } from 'next/navigation';

export default function RedirectToOverview() {
  redirect('/accounts/overview');
}
