import { redirect } from 'next/navigation';

export default function RedirectToOverview() {
  redirect('/support/overview');
}
