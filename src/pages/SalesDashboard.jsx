import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

// Sample team members (used for display, not assignment)
const TEAM_MEMBERS = [
  { id: 'unassigned', name: 'Unassigned' },
  { id: 'TM001', name: 'John Smith' },
  { id: 'TM002', name: 'Jane Doe' },
  { id: 'TM003', name: 'Alex Wong' },
  { id: 'TM004', name: 'Sarah Johnson' },
];

const SalesDashboard = () => {
  const { user, logout } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterClaim, setFilterStatus] = useState('all');
  const [filterMember, setFilterMember] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  // Load data on mount
  useEffect(() => {
    loadSubmissions();
  }, []);

  // Apply filters when data or filters change
  useEffect(() => {
    applyFilters();
  }, [submissions, searchTerm, filterStatus, filterClaim, filterMember, dateRange]);

  const loadSubmissions = async () => {
    setLoading(true);
    try {
      const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL;
      if (!GOOGLE_SCRIPT_URL) {
        console.warn('Google Script URL not configured, using sample data');
        const sampleData = generateSampleData();
        setSubmissions(sampleData);
        setLoading(false);
        return;
      }

      const response = await fetch(GOOGLE_SCRIPT_URL);
      const result = await response.json();

      if (result.status === 'success' && result.data) {
        const transformedData = result.data.map((item, index) => ({
          id: `submission-${index + 1}`,
          timestamp: item.Timestamp || item.timestamp || new Date().toISOString(),
          programme: item.Programme || item.programme || '',
          organisation: item.Organisation || item.organisation || '',
          address: item.Address || item.address || '',
          pic: item.PIC || item.pic || '',
          phone: item.Phone || item.phone || '',
          email: item.Email || item.email || '',
          participantCount: item['Participant Number'] || item.participantCount || '1',
          participant1Name: item['Participant Name'] || item.participant1Name || '',
          participant1Phone: item['Participant Phone'] || item.participant1Phone || '',
          participant1Email: item['Participant Email'] || item.participant1Email || '',
          participant1Designation: item['Participant Designation'] || item.participant1Designation || '',
          participant2Name: item['Participant Name2'] || item.participant2Name || '',
          participant2Phone: item['Participant Phone2'] || item.participant2Phone || '',
          participant2Email: item['Participant Email2'] || item.participant2Email || '',
          participant2Designation: item['Participant Designation2'] || item.participant2Designation || '',
          meal: item.Meal || item.meal || '',
          member: item.Member || item.member || 'No',
          memberId: item['Member ID'] || item.memberId || '',
          claim: item.Claim || item.claim || '',
          voucher: item.Voucher || item.voucher || '',
          status: item.JobStatus || item.status || '',
          trainer: item.Trainer || item.trainer || '',
          assignedTo: item.AssignedTo || item.assignedTo || 'unassigned',
          remarks: item.Remarks || item.remarks || '',
        }));

        setSubmissions(transformedData);
        localStorage.setItem('form-submissions', JSON.stringify(transformedData));
      } else {
        const stored = localStorage.getItem('form-submissions');
        if (stored) {
          setSubmissions(JSON.parse(stored));
        } else {
          setSubmissions(generateSampleData());
        }
      }
    } catch (error) {
      console.error('Error loading submissions:', error);
      const stored = localStorage.getItem('form-submissions');
      if (stored) {
        setSubmissions(JSON.parse(stored));
      } else {
        setSubmissions(generateSampleData());
      }
    }
    setLoading(false);
  };

  const generateSampleData = () => {
    return [
      {
        id: 'submission-1',
        timestamp: '2025-10-20 09:30:00',
        programme: 'Effective Administrative and Secretarial Skills',
        organisation: 'ABC Corporation Sdn Bhd',
        address: '123 Jalan Ampang, Kuala Lumpur',
        pic: 'Sarah Tan',
        phone: '+6012 345 6789',
        email: 'sarah.tan@abc.com',
        participantCount: '2',
        participant1Name: 'John Lim',
        participant1Phone: '+6012 987 6543',
        participant1Email: 'john.lim@abc.com',
        participant1Designation: 'Executive Assistant',
        participant2Name: 'Mary Wong',
        participant2Phone: '+6012 555 0123',
        participant2Email: 'mary.wong@abc.com',
        participant2Designation: 'Administrative Officer',
        meal: 'Vegetarian',
        member: 'Yes',
        memberId: 'MIM12345',
        claim: 'HRDC Claimable',
        voucher: '',
        status: 'pending',
        trainer: '',
        assignedTo: user?.username === 'sales' ? 'TM002' : 'TM001',
        remarks: 'Initial contact made',
      },
      {
        id: 'submission-2',
        timestamp: '2025-10-21 14:15:00',
        programme: 'Effective Administrative and Secretarial Skills',
        organisation: 'XYZ Technologies',
        address: '456 Jalan Tun Razak, Kuala Lumpur',
        pic: 'Ahmad Ibrahim',
        phone: '+6013 222 3333',
        email: 'ahmad@xyz.com',
        participantCount: '1',
        participant1Name: 'Lisa Chen',
        participant1Phone: '+6014 888 9999',
        participant1Email: 'lisa.chen@xyz.com',
        participant1Designation: 'Secretary',
        participant2Name: '',
        participant2Phone: '',
        participant2Email: '',
        participant2Designation: '',
        meal: 'Non Vege',
        member: 'No',
        memberId: '',
        claim: 'Own',
        voucher: 'DISCOUNT10',
        status: 'confirmed',
        trainer: '',
        assignedTo: user?.username === 'sales' ? 'TM002' : 'unassigned',
        remarks: '',
      },
    ];
  };

  const applyFilters = () => {
    let filtered = [...submissions];
    // Filter by assignedTo (only show submissions assigned to current user or unassigned)
    filtered = filtered.filter(
      (sub) => sub.assignedTo === (user?.username === 'sales' ? 'TM002' : 'unassigned') || sub.assignedTo === 'unassigned'
    );

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (sub) =>
          sub.organisation?.toLowerCase().includes(term) ||
          sub.pic?.toLowerCase().includes(term) ||
          sub.email?.toLowerCase().includes(term) ||
          sub.participant1Name?.toLowerCase().includes(term) ||
          sub.participant2Name?.toLowerCase().includes(term)
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter((sub) => sub.status === filterStatus);
    }

    // Claim filter
    if (filterClaim !== 'all') {
      filtered = filtered.filter((sub) => sub.claim === filterClaim);
    }

    // Member filter
    if (filterMember !== 'all') {
      filtered = filtered.filter((sub) => sub.member === filterMember);
    }

    // Date range filter
    if (dateRange.start || dateRange.end) {
      filtered = filtered.filter((sub) => {
        const subDate = new Date(sub.timestamp);
        const startDate = dateRange.start ? new Date(dateRange.start) : null;
        const endDate = dateRange.end ? new Date(dateRange.end) : null;
        if (startDate && subDate < startDate) return false;
        if (endDate && subDate > endDate) return false;
        return true;
      });
    }

    filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    setFilteredData(filtered);
  };

  const updateSubmissionField = async (id, field, value) => {
    const updated = submissions.map((sub) =>
      sub.id === id ? { ...sub, [field]: value } : sub
    );
    setSubmissions(updated);
    localStorage.setItem('form-submissions', JSON.stringify(updated));
  };

  const exportToCSV = () => {
    const headers = [
      'Timestamp', 'Programme', 'Organisation', 'Address', 'PIC', 'Phone', 'Email',
      'Participant Count', 'P1 Name', 'P1 Phone', 'P1 Email', 'P1 Designation',
      'P2 Name', 'P2 Phone', 'P2 Email', 'P2 Designation', 'Meal', 'Member',
      'Member ID', 'Claim', 'Voucher', 'JobStatus', 'Assigned To', 'Remarks'
    ];
    const csvRows = [
      headers.join(','),
      ...filteredData.map((sub) =>
        [
          sub.timestamp, sub.programme, sub.organisation, sub.address, sub.pic,
          sub.phone, sub.email, sub.participantCount, sub.participant1Name,
          sub.participant1Phone, sub.participant1Email, sub.participant1Designation,
          sub.participant2Name, sub.participant2Phone, sub.participant2Email,
          sub.participant2Designation, sub.meal, sub.member, sub.memberId,
          sub.claim, sub.voucher, sub.status, sub.assignedTo, sub.remarks
        ]
          .map((val) => `"${val ? val.replace(/"/g, '""') : ''}"`)
          .join(',')
      ),
    ];
    const csv = csvRows.join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'submissions.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const stats = {
    total: filteredData.length,
    pending: filteredData.filter((s) => s.status === 'pending').length,
    cancelled: filteredData.filter((s) => s.status === 'cancelled').length,
    registered: filteredData.filter((s) => s.status === 'registered').length,
    attended: filteredData.filter((s) => s.status === 'attended').length,
    members: filteredData.filter((s) => s.member === 'Yes').length,
    totalParticipants: filteredData.reduce((sum, s) => sum + parseInt(s.participantCount || 0), 0),
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Sales Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome, {user?.name}</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={exportToCSV}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Export CSV
              </button>
              <button
                onClick={logout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-600">Total Submissions</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-600">Pending</p>
            <p className="text-2xl font-bold">{stats.pending}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-600">Registered</p>
            <p className="text-2xl font-bold">{stats.registered}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-600">Total Participants</p>
            <p className="text-2xl font-bold">{stats.totalParticipants}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-gray-600 mb-1">Search</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 border rounded-lg"
                placeholder="Search organisation, PIC, etc."
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="registered">Registered</option>
                <option value="attended">Attended</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Claim</label>
              <select
                value={filterClaim}
                onChange={(e) => setFilterClaim(e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                <option value="all">All</option>
                <option value="HRDC Claimable">HRDC Claimable</option>
                <option value="Own">Own</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Member</label>
              <select
                value={filterMember}
                onChange={(e) => setFilterMember(e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                <option value="all">All</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-gray-600 mb-1">Start Date</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">End Date</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="w-full p-2 border rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organisation</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PIC</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remarks</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((sub) => (
                <tr key={sub.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{sub.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(sub.timestamp).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{sub.organisation}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{sub.pic}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={sub.status}
                      onChange={(e) => updateSubmissionField(sub.id, 'status', e.target.value)}
                      className="p-2 border rounded-lg"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="registered">Registered</option>
                      <option value="attended">Attended</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <textarea
                      value={sub.remarks}
                      onChange={(e) => updateSubmissionField(sub.id, 'remarks', e.target.value)}
                      className="w-full p-2 border rounded-lg"
                      rows="2"
                      placeholder="Enter remarks"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => setSelectedSubmission(sub)}
                      className="text-blue-600 hover:underline"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Submission Details</h2>
            <div className="grid grid-cols-1 gap-4">
              <p><strong>ID:</strong> {selectedSubmission.id}</p>
              <p><strong>Timestamp:</strong> {new Date(selectedSubmission.timestamp).toLocaleString()}</p>
              <p><strong>Programme:</strong> {selectedSubmission.programme}</p>
              <p><strong>Organisation:</strong> {selectedSubmission.organisation}</p>
              <p><strong>Address:</strong> {selectedSubmission.address}</p>
              <p><strong>PIC:</strong> {selectedSubmission.pic}</p>
              <p><strong>Phone:</strong> {selectedSubmission.phone}</p>
              <p><strong>Email:</strong> {selectedSubmission.email}</p>
              <p><strong>Participant Count:</strong> {selectedSubmission.participantCount}</p>
              <p><strong>Participant 1 Name:</strong> {selectedSubmission.participant1Name}</p>
              <p><strong>Participant 1 Phone:</strong> {selectedSubmission.participant1Phone}</p>
              <p><strong>Participant 1 Email:</strong> {selectedSubmission.participant1Email}</p>
              <p><strong>Participant 1 Designation:</strong> {selectedSubmission.participant1Designation}</p>
              {selectedSubmission.participant2Name && (
                <>
                  <p><strong>Participant 2 Name:</strong> {selectedSubmission.participant2Name}</p>
                  <p><strong>Participant 2 Phone:</strong> {selectedSubmission.participant2Phone}</p>
                  <p><strong>Participant 2 Email:</strong> {selectedSubmission.participant2Email}</p>
                  <p><strong>Participant 2 Designation:</strong> {selectedSubmission.participant2Designation}</p>
                </>
              )}
              <p><strong>Meal:</strong> {selectedSubmission.meal}</p>
              <p><strong>Member:</strong> {selectedSubmission.member}</p>
              {selectedSubmission.memberId && <p><strong>Member ID:</strong> {selectedSubmission.memberId}</p>}
              <p><strong>Claim:</strong> {selectedSubmission.claim}</p>
              {selectedSubmission.voucher && <p><strong>Voucher:</strong> {selectedSubmission.voucher}</p>}
              <p><strong>Status:</strong> {selectedSubmission.status}</p>
              <p><strong>Assigned To:</strong> {TEAM_MEMBERS.find((tm) => tm.id === selectedSubmission.assignedTo)?.name || 'Unassigned'}</p>
              <div>
                <label className="block text-gray-600 mb-1">Remarks</label>
                <textarea
                  value={selectedSubmission.remarks}
                  onChange={(e) => {
                    setSelectedSubmission({ ...selectedSubmission, remarks: e.target.value });
                    updateSubmissionField(selectedSubmission.id, 'remarks', e.target.value);
                  }}
                  className="w-full p-2 border rounded-lg"
                  rows="4"
                  placeholder="Enter remarks"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedSubmission(null)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesDashboard;
