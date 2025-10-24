// src/api/submissions.js
import { GOOGLE_SCRIPT_URL } from '../utils/constants';

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
        trainer: '', // Added for consistency
        assignedTo: 'TM001',
        remark: 'Initial contact made.' // Added remark
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
        trainer: '', // Added for consistency
        assignedTo: 'TM002',
        remark: 'Followed up, sent invoice.' // Added remark
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
        trainer: 'Mr. Lee', // Added for consistency
        assignedTo: 'unassigned',
        remark: '' // Added remark
      },
      {
        id: 4,
        timestamp: '2025-11-01 11:00:00',
        programme: 'Leadership Development Program',
        organisation: 'Tech Innovators Inc.',
        address: '101 Cyberjaya Street, Selangor',
        pic: 'Michael Ong',
        phone: '+6016 111 2222',
        email: 'michael.ong@techinnovators.com',
        participantCount: '3',
        participant1Name: 'Amanda Goh',
        participant1Phone: '+6017 333 4444',
        participant1Email: 'amanda.goh@techinnovators.com',
        participant1Designation: 'Senior Developer',
        participant2Name: 'Brian Koh',
        participant2Phone: '+6018 555 6666',
        participant2Email: 'brian.koh@techinnovators.com',
        participant2Designation: 'Project Manager',
        meal: 'Non Vege',
        member: 'Yes',
        memberId: 'MIM98765',
        claim: 'HRDC Claimable',
        voucher: '',
        status: 'registered',
        trainer: 'Dr. Lim',
        assignedTo: 'TM003',
        remark: 'Registration confirmed. Payment pending.'
      }
    ];
};

export const fetchSubmissions = async () => {
    try {
        if (!GOOGLE_SCRIPT_URL) {
            console.warn('Google Script URL not configured, using sample data');
            return generateSampleData();
        }

        const response = await fetch(GOOGLE_SCRIPT_URL);
        const result = await response.json();

        if (result.status === 'success' && result.data) {
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
                status: item.JobStatus || item.status || '',
                trainer: item.Trainer || item.trainer || '',
                assignedTo: item.AssignedTo || item.assignedTo || 'unassigned',
                remark: item.Remark || item.remark || '' // Add remark field
            }));
            return transformedData;
        } else {
            const stored = localStorage.getItem('form-submissions');
            return stored ? JSON.parse(stored) : generateSampleData();
        }
    } catch (error) {
        console.error('Error loading submissions:', error);
        const stored = localStorage.getItem('form-submissions');
        return stored ? JSON.parse(stored) : generateSampleData();
    }
};

// For updating data (will need to be implemented on your Google Apps Script side)
export const updateSubmission = async (id, field, value) => {
    console.log(`Updating submission ${id}: ${field} to ${value}`);
    // In a real application, this would send an update request to your Google Apps Script.
    // For now, it just simulates success.
    
    // Example:
    /*
    try {
        const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=update&id=${id}&field=${field}&value=${value}`);
        const result = await response.json();
        if (result.status === 'success') {
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error updating submission:', error);
        return false;
    }
    */
    return new Promise(resolve => setTimeout(() => resolve(true), 200)); // Simulate API call
};
