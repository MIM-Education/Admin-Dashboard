// src/components/SalesDashboard.jsx
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const SalesDashboard = () => {
  const { user, logout, TEAM_MEMBERS } = useContext(AuthContext);
  const [submissions, setSubmissions] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const navigate = useNavigate();

  const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL;

  useEffect(() => {
    loadSubmissions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [submissions, searchTerm, filterStatus]);

  const loadSubmissions = async () => {
    setLoading(true);
    try {
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
          id: index + 1,
          timestamp: item.Timestamp || new Date().toISOString(),
          programme: item.Programme || '',
          organisation: item.Organisation || '',
          address: item.Address || '',
          pic: item.PIC || '',
          phone: item.Phone || '',
          email: item.Email || '',
          participantCount: item['Participant Number'] || '1',
          participant1Name: item['Participant Name'] || '',
          participant1Phone: item['Participant Phone'] || '',
          participant1Email: item['Participant Email'] || '',
          participant1Designation: item['Participant Designation'] || '',
          participant2Name: item['Participant Name2'] || '',
          participant2Phone: item['Participant Phone2'] || '',
          participant2Email: item['Participant Email2'] || '',
          participant2Designation: item['Participant Designation2'] || '',
          meal: item.Meal || '',
          member: item.Member || 'No',
          memberId: item['Member ID'] || '',
          claim: item.Claim || '',
          voucher: item.Voucher || '',
          status: item.JobStatus || '',
          trainer: item.Trainer || '',
          assignedTo: item.AssignedTo || 'unassigned',
          remarks: item.Remarks || '',
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
        id: 1,
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
        assignedTo: user.id,
        remarks: '',
      },
    ];
  };

  const applyFilters = () => {
    let filtered = submissions.filter(sub => sub.assignedTo === user.id);

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(sub =>
        sub.organisation?.toLowerCase().includes(term) ||
        sub.pic?.toLowerCase().includes(term) ||
        sub.email?.toLowerCase().includes(term) ||
        sub.participant1Name?.toLowerCase().includes(term) ||
        sub.participant2Name?.toLowerCase().includes(term)
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(sub => sub.status === filterStatus);
    }

    filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    setFilteredData(filtered);
  };

  const updateSubmission = async (id, updates) => {
    const updated = submissions.map(sub =>
      sub.id === id ? { ...sub, ...updates } : sub
    );
    setSubmissions(updated);
    localStorage.setItem('form-submissions', JSON.stringify(updated));
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
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Sales Dashboard</h1>
              <p className="text-sm text-gray-600">Assigned Submissions - {user.name}</p>
            </div>
            <button
              onClick={() => { logout(); navigate('/login'); }}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
              <option value="registered">Registered</option>
              <option value="attended">Attended</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Timestamp</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Organisation</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Person in Charge</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Participants</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Status</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Remarks</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((submission) => (
                  <tr key={submission.id} className="hover:bg-gray-50">
                    <td className="px-3 py-3 text-xs text-gray-900 whitespace-nowrap">
                      {new Date(submission.timestamp).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                      <br />
                      <span className="text-gray-500">
                        {new Date(submission.timestamp).toLocaleTimeString('en-GB', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-xs text-gray-900">
                      <div className="font-medium max-w-[150px] truncate" title={submission.organisation}>
                        {submission.organisation}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-xs text-gray-900">
                      <div className="font-medium max-w-[120px] truncate" title={submission.pic}>{submission.pic}</div>
                      <div className="text-gray-500 max-w-[120px] truncate" title={submission.email}>{submission.email}</div>
                      <div className="text-gray-500 whitespace-nowrap">{submission.phone}</div>
                    </td>
                    <td className="px-3 py-3 text-xs text-gray-900 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {submission.participantCount} pax
                      </span>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <select
                        value={submission.status}
                        onChange={(e) => updateSubmission(submission.id, { status: e.target.value })}
                        className={`text-xs rounded-full px-2 py-1 font-medium w-full ${
                          submission.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : submission.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : submission.status === 'registered'
                            ? 'bg-green-100 text-green-800'
                            : submission.status === 'attended'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="registered">Registered</option>
                        <option value="attended">Attended</option>
                      </select>
                    </td>
                    <td className="px-3 py-3 text-xs text-gray-900">
                      <input
                        type="text"
                        value={submission.remarks}
                        onChange={(e) => updateSubmission(submission.id, { remarks: e.target.value })}
                        className="w-full px-2 py-1 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500"
                        placeholder="Add remarks..."
                      />
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-xs">
                      <button
                        onClick={() => setSelectedSubmission(submission)}
                        className="text-blue-600 hover:text-blue-900 font-medium"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredData.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No assigned submissions found.</p>
            </div>
          )}
        </div>

        {selectedSubmission && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">Submission Details</h3>
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    Organisation Details
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Programme</p>
                        <p className="font-medium">{selectedSubmission.programme}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Organisation</p>
                        <p className="font-medium">{selectedSubmission.organisation}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm text-gray-600">Address</p>
                        <p className="font-medium">{selectedSubmission.address}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Person in Charge</p>
                        <p className="font-medium">{selectedSubmission.pic}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="font-medium">{selectedSubmission.phone}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium">{selectedSubmission.email}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    Participant Details
                  </h4>
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="font-semibold text-gray-900 mb-2">Participant 1</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Name</p>
                          <p className="font-medium">{selectedSubmission.participant1Name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Designation</p>
                          <p className="font-medium">{selectedSubmission.participant1Designation}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Phone</p>
                          <p className="font-medium">{selectedSubmission.participant1Phone}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Email</p>
                          <p className="font-medium">{selectedSubmission.participant1Email}</p>
                        </div>
                      </div>
                    </div>
                    {selectedSubmission.participant2Name && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="font-semibold text-gray-900 mb-2">Participant 2</p>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Name</p>
                            <p className="font-medium">{selectedSubmission.participant2Name}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Designation</p>
                            <p className="font-medium">{selectedSubmission.participant2Designation}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Phone</p>
                            <p className="font-medium">{selectedSubmission.participant2Phone}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Email</p>
                            <p className="font-medium">{selectedSubmission.participant2Email}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Meal Preference</p>
                          <p className="font-medium">{selectedSubmission.meal}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">MIM Member</p>
                          <p className="font-medium">{selectedSubmission.member}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Trainer for TTT</p>
                          <p className="font-medium">{selectedSubmission.trainer}</p>
                        </div>
                        {selectedSubmission.memberId && (
                          <div>
                            <p className="text-sm text-gray-600">Member ID</p>
                            <p className="font-medium">{selectedSubmission.memberId}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Payment & Claim Details</h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Claim Process</p>
                        <p className="font-medium">{selectedSubmission.claim}</p>
                      </div>
                      {selectedSubmission.voucher && (
                        <div>
                          <p className="text-sm text-gray-600">Voucher Code</p>
                          <p className="font-medium">{selectedSubmission.voucher}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-sm text-gray-600">Job Status</p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          selectedSubmission.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : selectedSubmission.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : selectedSubmission.status === 'registered'
                            ? 'bg-green-100 text-green-800'
                            : selectedSubmission.status === 'attended'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {selectedSubmission.status}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Assigned To</p>
                        <p className="font-medium">
                          {TEAM_MEMBERS.find(member => member.id === selectedSubmission.assignedTo)?.name || 'Unassigned'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Submitted</p>
                        <p className="font-medium">{new Date(selectedSubmission.timestamp).toLocaleString()}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm text-gray-600">Remarks</p>
                        <input
                          type="text"
                          value={selectedSubmission.remarks}
                          onChange={(e) => updateSubmission(selectedSubmission.id, { remarks: e.target.value })}
                          className="w-full px-2 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                          placeholder="Add remarks..."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-t px-6 py-4 flex justify-end gap-3">
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesDashboard;
