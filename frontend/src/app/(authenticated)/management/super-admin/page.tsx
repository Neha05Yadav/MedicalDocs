import { redirect } from 'next/navigation';

export default function RedirectToOverview() {
  redirect('/super-admin/overview');
}
