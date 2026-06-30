









import React from 'react';
const Users = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><path d="M16 3.128a4 4 0 0 1 0 7.744"></path><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><circle cx="9" cy="7" r="4"></circle></svg>;
const Hospital = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 7v4"></path><path d="M14 21v-3a2 2 0 0 0-4 0v3"></path><path d="M14 9h-4"></path><path d="M18 11h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2h2"></path><path d="M18 21V5a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16"></path></svg>;
const FlaskConical = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 2v6a2 2 0 0 0 .245.96l5.51 10.08A2 2 0 0 1 18 22H6a2 2 0 0 1-1.755-2.96l5.51-10.08A2 2 0 0 0 10 8V2"></path><path d="M6.453 15h11.094"></path><path d="M8.5 2h7"></path></svg>;
const Stethoscope = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M11 2v2"></path><path d="M5 2v2"></path><path d="M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1"></path><path d="M8 15a6 6 0 0 0 12 0v-3"></path><circle cx="20" cy="10" r="2"></circle></svg>;
const FileText = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"></path><path d="M14 2v5a1 1 0 0 0 1 1h5"></path><path d="M10 9H8"></path><path d="M16 13H8"></path><path d="M16 17H8"></path></svg>;
const ShieldCheck = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path><path d="m9 12 2 2 4-4"></path></svg>;
const TrendingUp = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M16 7h6v6"></path><path d="m22 7-8.5 8.5-5-5L2 17"></path></svg>;
const DollarSign = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="12" x2="12" y1="2" y2="22"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>;
const ArrowUpRight = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 7h10v10"></path><path d="M7 17 17 7"></path></svg>;

export default function SuperAdminDashboard() {
  const stats = [
    { title: "Total Users", value: "24,592", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Total Hospitals", value: "145", icon: Hospital, color: "text-indigo-600", bg: "bg-indigo-50" },
    { title: "Total Labs", value: "89", icon: FlaskConical, color: "text-amber-600", bg: "bg-amber-50" },
    { title: "Total Doctors", value: "1,204", icon: Stethoscope, color: "text-emerald-600", bg: "bg-emerald-50" },
    { title: "Total Reports", value: "1.2M", icon: FileText, color: "text-rose-600", bg: "bg-rose-50" },
    { title: "Active Admins", value: "12", icon: ShieldCheck, color: "text-slate-600", bg: "bg-slate-100" },
    { title: "Monthly Growth", value: "+15.4%", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
    { title: "Platform Revenue", value: "₹4.5M", icon: DollarSign, color: "text-purple-600", bg: "bg-purple-50" },
  ];
  return (
    <div className="p-8 max-w-7xl mx-auto w-full min-h-screen font-sans space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
            <div className={`absolute -right-6 -top-6 size-24 rounded-full ${stat.bg} opacity-50 group-hover:scale-150 transition-transform duration-500 ease-out`} />
            <div className="relative flex justify-between items-start">
              <div>
                <p className="text-sm font-bold text-slate-500 mb-2">{stat.title}</p>
                <h3 className="text-3xl font-extrabold text-slate-900">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="size-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-[11px] font-bold text-emerald-600 uppercase tracking-wider gap-1 relative">
              <ArrowUpRight className="size-3" />
              <span>Up from last month</span>
            </div>
          </div>
        ))}
      </div>
      {/* Additional UI elements can go here later, like charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Revenue Chart Mock */}
         <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col h-80">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-900">Revenue Analytics</h3>
              <select className="text-xs border border-slate-200 rounded-lg px-2 py-1 outline-none text-slate-600 font-medium bg-transparent cursor-pointer hover:bg-slate-50 transition-colors">
                <option>Last 6 Months</option>
                <option>This Year</option>
              </select>
            </div>
            <div className="flex-1 flex items-end gap-2 sm:gap-4 mt-auto">
              {[40, 70, 45, 90, 65, 100].map((height, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <div className="w-full bg-slate-100 rounded-t-md relative flex-1 flex items-end overflow-hidden group-hover:bg-slate-200 transition-colors">
                    <div 
                      className="w-full bg-purple-500 rounded-t-md" 
                      style={{ height: `${height}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i]}
                  </span>
                </div>
              ))}
            </div>
         </div>
         {/* User Distribution Mock */}
         <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col h-80">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-900">User Distribution</h3>
              <button className="text-xs text-blue-600 font-bold hover:underline">View Details</button>
            </div>
            <div className="flex-1 flex flex-col justify-center gap-5">
              {[
                { region: 'North Region', users: '12.4k', percent: 85, color: 'bg-blue-500' },
                { region: 'South Region', users: '8.2k', percent: 65, color: 'bg-emerald-500' },
                { region: 'West Region',  users: '5.1k', percent: 45, color: 'bg-amber-500' },
                { region: 'East Region',  users: '2.8k', percent: 25, color: 'bg-rose-500' },
              ].map((item, i) => (
                <div key={i} className="w-full group">
                  <div className="flex justify-between items-center text-sm font-bold text-slate-700 mb-1.5">
                    <span>{item.region}</span>
                    <span className="text-slate-500 group-hover:text-blue-600 transition-colors">{item.users} users</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
         </div>
      </div>
    </div>
  );
}
