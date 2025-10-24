import React, { useState, useEffect } from 'react';
import { Search, Download, Filter, Users, FileText, Calendar, TrendingUp, Mail, Phone, Building } from 'lucide-react';

// Google Apps Script Web App URL - Replace with your deployed script URL
const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL;

// Sample team members for assignment
const TEAM_MEMBERS = [
  { id: 'unassigned', name: 'Unassigned' },
  { id: 'TM001', name: 'John Smith' },
  { id: 'TM002', name: 'Jane Doe' },
  { id: 'TM003', name: 'Alex Wong' },
  { id: 'TM004', name: 'Sarah Johnson' },
];

const AdminDashboard = () => {
  const [submissions, setSubmissions] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterClaim, setFilterClaim] = useState('all');
  const [filterMember, setFilterMember] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  // Load data from storage on mount
  useEffect(() => {
    loadSubmissions();
  }, []);

  // Apply filters whenever data or filters change
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
        // Transform the data to match dashboard format
        const transformedData = result.data.map((item, index) => ({
          id: index + 1,
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
          status: item.Status || item.status || 'pending',
          trainer: item.Trainer || item.trainer || '',
          assignedTo: item.AssignedTo || item.assignedTo || 'unassigned'
        }));

        setSubmissions(transformedData);
        // Save to localStorage as backup
        localStorage.setItem('form-submissions', JSON.stringify(transformedData));
      } else {
        // Fallback to localStorage or sample data
        const stored = localStorage.getItem('form-submissions');
        if (stored) {
          setSubmissions(JSON.parse(stored));
        } else {
          setSubmissions(generateSampleData());
        }
      }
    } catch (error) {
      console.error('Error loading submissions:', error);
      // Fallback to localStorage or sample data
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
        assignedTo: 'TM001'
      },
      {
        id: 2,
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
        assignedTo: 'TM002'
      },
      {
        id: 3,
        timestamp: '2025-10-22 10:45:00',
        programme: 'Effective Administrative and Secretarial Skills',
        organisation: 'Global Services Malaysia',
        address: '789 Jalan Sultan Ismail, Kuala Lumpur',
        pic: 'Priya Kumar',
        phone: '+6012 777 8888',
        email: 'priya@globalservices.com',
        participantCount: '2',
        participant1Name: 'David Tan',
        participant1Phone: '+6013 444 5555',
        participant1Email: 'david@globalservices.com',
        participant1Designation: 'Admin Manager',
        participant2Name: 'Emily Lee',
        participant2Phone: '+6014 666 7777',
        participant2Email: 'emily@globalservices.com',
        participant2Designation: 'Office Coordinator',
        meal: 'Vegetarian',
        member: 'Yes',
        memberId: 'MIM67890',
        claim: 'HRDC Claimable',
        voucher: '',
        status: 'pending',
        assignedTo: 'unassigned'
      }
    ];
  };

  const applyFilters = () => {
    let filtered = [...submissions];

    // Search filter
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

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(sub => sub.status === filterStatus);
    }

    // Claim filter
    if (filterClaim !== 'all') {
      filtered = filtered.filter(sub => sub.claim === filterClaim);
    }

    // Member filter
    if (filterMember !== 'all') {
      filtered = filtered.filter(sub => sub.member === filterMember);
    }

    // Date range filter
    if (dateRange.start || dateRange.end) {
      filtered = filtered.filter(sub => {
        const subDate = new Date(sub.timestamp);
        const startDate = dateRange.start ? new Date(dateRange.start) : null;
        const endDate = dateRange.end ? new Date(dateRange.end) : null;

        if (startDate && subDate < startDate) return false;
        if (endDate && subDate > endDate) return false;
        return true;
      });
    }

    filtered.sort((a, b) => {
      const dateA = new Date(a.timestamp);
      const dateB = new Date(b.timestamp);
      return dateB - dateA; // Descending order (newest first)
    });

    setFilteredData(filtered);
  };

  const updateStatus = async (id, newStatus) => {
    const updated = submissions.map(sub =>
      sub.id === id ? { ...sub, status: newStatus } : sub
    );
    setSubmissions(updated);
    await window.storage.set('form-submissions', JSON.stringify(updated));
  };

  const updateAssignment = async (id, assignedTo) => {
    const updated = submissions.map(sub =>
      sub.id === id ? { ...sub, assignedTo } : sub
    );
    setSubmissions(updated);
    await window.storage.set('form-submissions', JSON.stringify(updated));
  };

  const exportToCSV = () => {
    const headers = [
      'Timestamp', 'Programme', 'Organisation', 'Address', 'PIC', 'Phone', 'Email',
      'Participant Count', 'P1 Name', 'P1 Phone', 'P1 Email', 'P1 Designation',
      'P2 Name', 'P2 Phone', 'P2 Email', 'P2 Designation',
      'Meal', 'Member','Trainer', 'Member ID', 'Claim', 'Voucher', 'Status', 'Assigned To'
    ];

    const rows = filteredData.map(sub => [
      sub.timestamp, sub.programme, sub.organisation, sub.address, sub.pic, sub.phone, sub.email,
      sub.participantCount, sub.participant1Name, sub.participant1Phone, sub.participant1Email, sub.participant1Designation,
      sub.participant2Name || '', sub.participant2Phone || '', sub.participant2Email || '', sub.participant2Designation || '',
      sub.meal, sub.member, sub.memberId || '', sub.claim, sub.voucher || '', sub.status, 
      TEAM_MEMBERS.find(member => member.id === sub.assignedTo)?.name || 'Unassigned', sub.trainer || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `form-submissions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const stats = {
    total: submissions.length,
    pending: submissions.filter(s => s.status === 'pending').length,
    cancelled: submissions.filter(s => s.status === 'cancelled').length,
    registered: submissions.filter(s => s.status === 'registered').length,
    attended: submissions.filter(s => s.status === 'attended').length,
    members: submissions.filter(s => s.member === 'Yes').length,
    totalParticipants: submissions.reduce((sum, s) => sum + parseInt(s.participantCount || 0), 0)
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
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600">Short Course Form Submissions</p>
            </div>
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Submissions</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Calendar className="w-8 h-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cancelled</p>
                <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
              </div>
              <Calendar className="w-8 h-8 text-red-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Registered</p>
                <p className="text-2xl font-bold text-green-600">{stats.registered}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Attended</p>
                <p className="text-2xl font-bold text-blue-600">{stats.attended}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">MIM Members</p>
                <p className="text-2xl font-bold text-purple-600">{stats.members}</p>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Participants</p>
                <p className="text-2xl font-bold text-indigo-600">{stats.totalParticipants}</p>
              </div>
              <Users className="w-8 h-8 text-indigo-600" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
              <option value="registered">Registered</option>
              <option value="attended">Attended</option>
            </select>

            <select
              value={filterClaim}
              onChange={(e) => setFilterClaim(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="all">All Claims</option>
              <option value="HRDC Claimable">HRDC Claimable</option>
              <option value="Own">Own</option>
            </select>

            <select
              value={filterMember}
              onChange={(e) => setFilterMember(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="all">All Members</option>
              <option value="Yes">Members Only</option>
              <option value="No">Non-Members</option>
            </select>

            <div className="grid grid-cols-2 gap-2 xl:col-span-1 md:col-span-2 lg:col-span-1">
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="w-full px-2 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Start"
              />
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="w-full px-2 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="End"
              />
            </div>
          </div>
        </div>

        {/* Submissions Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Timestamp
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Organisation
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Person in Charge
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Participants
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Member
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Claim
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Status
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Assigned To
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Actions
                  </th>
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
                    <td className="px-3 py-3 text-xs whitespace-nowrap">
                      {submission.member === 'Yes' ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          Member
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Non-Member
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-xs text-gray-900 whitespace-nowrap">
                      <span className="max-w-[100px] truncate block" title={submission.claim}>
                        {submission.claim}
                      </span>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <select
                        value={submission.status}
                        onChange={(e) => updateStatus(submission.id, e.target.value)}
                        className={`text-xs rounded-full px-2 py-1 font-medium w-full ${
                          submission.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : submission.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : submission.status === 'registered'
                            ? 'bg-green-100 text-green-800'
                            : submission.status === 'attended'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="registered">Registered</option>
                        <option value="attended">Attended</option>
                      </select>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <select
                        value={submission.assignedTo}
                        onChange={(e) => updateAssignment(submission.id, e.target.value)}
                        className="text-xs rounded-full px-2 py-1 font-medium w-full bg-indigo-100 text-indigo-800"
                      >
                        {TEAM_MEMBERS.map(member => (
                          <option key={member.id} value={member.id}>{member.name}</option>
                        ))}
                      </select>
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
              <p className="text-gray-500">No submissions found matching your filters.</p>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
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
              {/* Organisation Details */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Building className="w-5 h-5" />
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

              {/* Participant Details */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Participant Details
                </h4>
                <div className="space-y-4">
                  {/* Participant 1 */}
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

                  {/* Participant 2 */}
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

              {/* Payment & Claim Details */}
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
                      <p className="text-sm text-gray-600">Status</p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        selectedSubmission.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : selectedSubmission.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : selectedSubmission.status === 'registered'
                            ? 'bg-green-100 text-green-800'
                            : selectedSubmission.status === 'attended'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-red-100 text-red-800'
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
  );
};

export default AdminDashboard;
