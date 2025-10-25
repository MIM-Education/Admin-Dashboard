import React, { useEffect, useState } from "react";
import { FileText, TrendingUp } from "lucide-react";

const SalesDashboard = () => {
  const [submissions, setSubmissions] = useState([]);
  const [remarks, setRemarks] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("form-submissions");
    setSubmissions(stored ? JSON.parse(stored) : []);
    setLoading(false);
  }, []);

  const updateStatus = (id, newStatus) => {
    const updated = submissions.map((s) =>
      s.id === id ? { ...s, status: newStatus } : s
    );
    setSubmissions(updated);
    localStorage.setItem("form-submissions", JSON.stringify(updated));
  };

  const saveRemark = (id) => {
    const updated = submissions.map((s) =>
      s.id === id ? { ...s, remark: remarks[id] || "" } : s
    );
    setSubmissions(updated);
    localStorage.setItem("form-submissions", JSON.stringify(updated));
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading sales data...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6">Sales Dashboard</h1>

      <div className="bg-white shadow rounded-lg p-4">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="p-3">Organisation</th>
              <th className="p-3">PIC</th>
              <th className="p-3">Status</th>
              <th className="p-3">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((s) => (
              <tr key={s.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{s.organisation}</td>
                <td className="p-3">{s.pic}</td>
                <td className="p-3">
                  <select
                    value={s.status}
                    onChange={(e) => updateStatus(s.id, e.target.value)}
                    className="border rounded px-2 py-1"
                  >
                    <option value="pending">Pending</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="registered">Registered</option>
                    <option value="attended">Attended</option>
                  </select>
                </td>
                <td className="p-3">
                  <input
                    type="text"
                    placeholder="Remarks"
                    value={remarks[s.id] || s.remark || ""}
                    onChange={(e) =>
                      setRemarks({ ...remarks, [s.id]: e.target.value })
                    }
                    className="w-full border rounded px-2 py-1"
                  />
                  <button
                    onClick={() => saveRemark(s.id)}
                    className="text-blue-600 text-xs mt-1"
                  >
                    Save
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesDashboard;
