import { useState, useEffect } from "react";
import { jsPDF } from "jspdf";

const STORAGE_KEY = "church-members-data";

// PDF Export (only names)
const exportPDF = (members) => {
  const doc = new jsPDF();
  let y = 15;
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("CHURCH MEMBERSHIP REPORT", 105, y, { align: "center" });
  y += 10;
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Generated: ${new Date().toLocaleDateString("en-KE")}`, 14, y);
  y += 8;
  doc.line(14, y, 196, y);
  y += 10;

  members.forEach((m, idx) => {
    doc.text(`${idx + 1}. ${m.name}`, 14, y);
    y += 8;
    if (y > 270) {
      doc.addPage();
      y = 15;
    }
  });

  doc.save("members-report.pdf");
};

export default function Home() {
  const [members, setMembers] = useState([]);
  const [name, setName] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setMembers(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
  }, [members]);

  const addMember = () => {
    if (!name.trim()) return;
    const expiryDate = new Date(new Date().getFullYear(), 11, 31); // 31 Dec
    setMembers([...members, { name, expiryDate: expiryDate.toISOString() }]);
    setName("");
    setShowAdd(false);
  };

  const deleteMember = (idx) => {
    if (!window.confirm("Delete this member?")) return;
    setMembers(members.filter((_, i) => i !== idx));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-amber-700">⛪ Church Membership</h1>
        <p className="text-gray-600 text-sm sm:text-base">Manage members and renewals</p>
      </div>

      {/* Member List */}
      <div className="max-w-3xl mx-auto bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-left text-sm sm:text-base">
          <thead className="bg-gray-800 text-white sticky top-0">
            <tr>
              <th className="p-2">#</th>
              <th className="p-2">Name</th>
              <th className="p-2">Expires</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m, idx) => {
              const isExpired = new Date(m.expiryDate) < new Date();
              return (
                <tr key={idx} className={`${isExpired ? "bg-red-100" : "bg-green-50"} border-b`}>
                  <td className="p-2">{idx + 1}</td>
                  <td className="p-2 font-medium">{m.name}</td>
                  <td className="p-2">{new Date(m.expiryDate).toLocaleDateString("en-KE")}</td>
                  <td className="p-2">
                    <button
                      onClick={() => deleteMember(idx)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Buttons */}
      <div className="text-center mt-6 flex justify-center gap-4">
        <button
          onClick={() => setShowAdd(true)}
          className="bg-amber-600 text-white px-6 py-2 rounded hover:bg-amber-700 transition"
        >
          ➕ Add Member
        </button>
        <button
          onClick={() => exportPDF(members)}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
        >
          📄 Export PDF
        </button>
      </div>

      {/* Add Member Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4">Add New Member</h2>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Member Name"
              className="w-full p-2 border rounded mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowAdd(false)}
                className="px-4 py-2 rounded border hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={addMember}
                className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700 transition"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}