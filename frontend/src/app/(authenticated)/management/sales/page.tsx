import { redirect } from 'next/navigation';

export default function RedirectToOverview() {
  redirect('/management/sales/overview');
}
