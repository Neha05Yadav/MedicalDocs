"use client";
const CheckSquare = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 10.656V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12.344"></path><path d="m9 11 3 3L22 4"></path></svg>;
const Square = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="18" height="18" x="3" y="3" rx="2"></rect></svg>;



import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
export function EditAccessModal({
  isOpen,
  onOpenChange,
  editingRole,
  tempModules,
  systemModules,
  toggleModule,
  handleSaveAccess
}: any) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-900">
            {editingRole?.name} Permissions
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <h4 className="font-bold text-slate-900 mb-4">Modules</h4>
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            {systemModules.map((module: string) => {
              const isChecked = tempModules.includes(module);
              return (
                <label 
                  key={module} 
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleModule(module);
                    }}
                    className="focus:outline-none"
                  >
                    {isChecked ? (
                      <CheckSquare className="size-5 text-blue-600" />
                    ) : (
                      <Square className="size-5 text-slate-300" />
                    )}
                  </button>
                  <span className={`text-sm font-medium ${isChecked ? 'text-slate-900' : 'text-slate-600'}`}>
                    {module}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button 
            onClick={() => onOpenChange(false)} 
            className="px-5 py-2.5 border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSaveAccess} 
            className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm"
          >
            Save
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
export function CreateRoleModal({
  isOpen,
  onOpenChange,
  newFullName,
  setNewFullName,
  newEmail,
  setNewEmail,
  newPhoneNo,
  setNewPhoneNo,
  newRoleAssign,
  setNewRoleAssign,
  handleProvision
}: any) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-900">Provision Account</DialogTitle>
          <DialogDescription>Add a new user and assign their access role.</DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div>
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-2">Full Name</label>
            <input 
              type="text" 
              value={newFullName}
              onChange={(e) => setNewFullName(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-full text-sm focus:outline-none focus:border-slate-400 text-slate-700 bg-white" 
              placeholder="Employee Name"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-2">Email</label>
              <input 
                type="email" 
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-full text-sm focus:outline-none focus:border-slate-400 text-slate-700 bg-white" 
                placeholder="name@company.com"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-2">Phone No</label>
              <input 
                type="tel"
                value={newPhoneNo}
                onChange={(e) => setNewPhoneNo(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-full text-sm focus:outline-none focus:border-slate-400 text-slate-700 bg-white" 
                placeholder="+91 9876543210"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-2">Role Assignment</label>
            <select 
              value={newRoleAssign}
              onChange={(e) => setNewRoleAssign(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-full text-sm focus:outline-none focus:border-slate-400 text-slate-900 font-medium bg-white"
            >
              <option value="Sales Manager">Sales Manager</option>
              <option value="Accounts Manager">Accounts Manager</option>
              <option value="Support Manager">Support Manager</option>
            </select>
          </div>
        </div>
        <div className="flex justify-center pt-4">
          <button onClick={handleProvision} className="w-full py-3.5 bg-[#231F20] text-white rounded-full text-sm font-bold hover:bg-black transition-colors shadow-sm">
            Provision Account
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
