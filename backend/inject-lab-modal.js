const fs = require('fs');
const file = 'c:/Users/neha yadav/Desktop/Medidoc/Medidoc-/frontend/src/app/(authenticated)/clinic/patients/page.tsx';
let code = fs.readFileSync(file, 'utf8');

// 1. Add State
const stateToAdd = `
  // Lab Test Request State
  const [isLabModalOpen, setIsLabModalOpen] = useState(false);
  const [labForm, setLabForm] = useState({ patientId: "", labId: "", labTestName: "", priority: "Normal" });
  const [labsList, setLabsList] = useState<any[]>([]);
  const [isSubmittingLab, setIsSubmittingLab] = useState(false);

  const fetchLabsList = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch('/api/clinic/labs', { headers: { 'Authorization': \`Bearer \${token}\` }});
      if (res.ok) {
        const data = await res.json();
        setLabsList(data);
      }
    } catch(e) { console.error(e); }
  };

  const submitLabRequest = async () => {
    if (!labForm.patientId || !labForm.labId || !labForm.labTestName) {
      toast.error("Please fill in all fields");
      return;
    }
    setIsSubmittingLab(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch('/api/clinic/test-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': \`Bearer \${token}\` },
        body: JSON.stringify(labForm)
      });
      if (res.ok) {
        toast.success("Lab test request sent successfully!");
        setIsLabModalOpen(false);
        setLabForm({ patientId: "", labId: "", labTestName: "", priority: "Normal" });
      } else {
        toast.error("Failed to send lab request");
      }
    } catch(e) {
      toast.error("Error submitting lab request");
    } finally {
      setIsSubmittingLab(false);
    }
  };
`;
if (!code.includes('isLabModalOpen')) {
  code = code.replace('// New Patient Modal state', stateToAdd + '\n  // New Patient Modal state');
}

// 2. Add fetchLabsList to useEffect
if (!code.includes('fetchLabsList()')) {
  code = code.replace('fetchMyPatients();', 'fetchMyPatients();\n    fetchLabsList();');
}

// 3. Add Button
const buttonToAdd = `
          <div className="flex gap-3">
            <button
              onClick={() => setIsLabModalOpen(true)}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <FileText className="size-4" />
              Lab Test Request
            </button>
`;
if (!code.includes('Lab Test Request')) {
  code = code.replace('<button \n            onClick={() => {\n              setEditingPatientId(null);', buttonToAdd + '            <button \n              onClick={() => {\n                setEditingPatientId(null);');
  
  // Close the div tag for the buttons container
  code = code.replace('New Patient\n          </button>\n        </div>', 'New Patient\n            </button>\n          </div>\n        </div>');
}

// 4. Add Modal UI
const modalToAdd = `
      {/* Lab Test Request Modal */}
      {isLabModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-indigo-50/50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <FileText className="size-5 text-indigo-600" />
                Send Lab Test Request
              </h3>
              <button onClick={() => setIsLabModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">
                <X className="size-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Select Patient</label>
                <select 
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                  value={labForm.patientId}
                  onChange={e => setLabForm({...labForm, patientId: e.target.value})}
                >
                  <option value="">-- Choose Patient --</option>
                  {doctorPatientsData.map(dp => (
                    <option key={dp.id} value={dp.id}>{dp.name} ({dp.id})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Select Laboratory</label>
                <select 
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                  value={labForm.labId}
                  onChange={e => setLabForm({...labForm, labId: e.target.value})}
                >
                  <option value="">-- Choose Lab --</option>
                  {labsList.map(lab => (
                    <option key={lab.id} value={lab.id}>{lab.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Test Name</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  placeholder="e.g. Complete Blood Count (CBC)"
                  value={labForm.labTestName}
                  onChange={e => setLabForm({...labForm, labTestName: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Priority</label>
                <div className="flex gap-3">
                  {["Normal", "High", "Urgent"].map(p => (
                    <label key={p} className={\`flex-1 cursor-pointer border \${labForm.priority === p ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 hover:border-slate-300 text-slate-600'} rounded-xl px-4 py-3 flex items-center justify-center font-medium transition-colors\`}>
                      <input type="radio" name="priority" className="hidden" checked={labForm.priority === p} onChange={() => setLabForm({...labForm, priority: p})} />
                      {p}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
              <button 
                onClick={() => setIsLabModalOpen(false)}
                className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={submitLabRequest}
                disabled={isSubmittingLab}
                className="px-6 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmittingLab ? "Sending..." : "Send Request"}
              </button>
            </div>
          </div>
        </div>
      )}
`;
if (!code.includes('Lab Test Request Modal')) {
  code = code.replace('    </div>\n  );\n}\n', modalToAdd + '    </div>\n  );\n}\n');
}

fs.writeFileSync(file, code);
console.log('Done modifying page.tsx');
