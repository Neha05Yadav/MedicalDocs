import { redirect } from 'next/navigation';

export default function RedirectToOverview() {
  redirect('/management/super-admin/overview');
}
