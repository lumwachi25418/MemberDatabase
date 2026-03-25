import { useState, useEffect } from "react";
import { jsPDF } from "jspdf";

const STORAGE_KEY = "church-members-data";

// Format dates nicely
const formatDate = (date) => new Date(date).toLocaleDateString("en-KE");

// PDF Export
const exportPDF = (members) => {
  const doc = new jsPDF();
  let y = 15;
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("CHURCH MEMBERSHIP REPORT", 105, y, { align: "center" });
  y += 10;
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Generated: ${formatDate(new Date())}`, 14, y);
  y += 8;
  doc.line(14, y, 196, y);
  y += 10;

  members.forEach((m, idx) => {
    doc.text(`${idx + 1}. ${m.name}`, 14, y);
    y += 6;
    doc.text(`Expires: ${formatDate(m.expiryDate)}`, 20, y);
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
  const [today, setToday] = useState(new Date().toISOString().split("T")[0]);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setMembers(JSON.parse(saved));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
  }, [members]);

  // Add member
  const addMember = () => {
    if (!name.trim()) return;
    const currentYear = new Date().getFullYear();
    const expiryDate = new Date(`${currentYear}-12-31`); // Expiry 31st Dec of the year
    const newMember = { name, expiryDate: expiryDate.toISOString() };
    setMembers([...members, newMember]);
    setName("");
  };

  // Delete member
  const deleteMember = (idx) => {
    if (!window.confirm("Delete this member?")) return;
    setMembers(members.filter((_, i) => i !== idx));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-amber-700">⛪ Church Membership</h1>
        <p className="text-gray-600 text-sm sm:text-base">Add members and manage renewals</p>
      </div>

      {/* Add Member */}
      <div className="max-w-md mx-auto mb-6 flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Member Name"
          className="flex-1 p-2 border rounded"
        />
        <button
          onClick={addMember}
          className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700 transition"
        >
          Add Member
        </button>
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
                  <td className="p-2">{formatDate(m.expiryDate)}</td>
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

      {/* Export PDF */}
      <div className="text-center mt-6">
        <button
          onClick={() => exportPDF(members)}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
        >
          📄 Export PDF
        </button>
      </div>
    </div>
  );
}