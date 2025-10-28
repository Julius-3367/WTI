// Demo data for dashboards
export const demoUsers = {
  admin: {
    id: 1,
    name: 'Admin User',
    email: 'admin@labourmobility.com',
    role: 'admin',
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
  candidate: {
    id: 2,
    name: 'John Doe',
    email: 'candidate@example.com',
    role: 'candidate',
    avatar: 'https://i.pravatar.cc/150?img=32',
  },
  // Add other roles as needed
};

export const statsData = {
  admin: [
    { name: 'Total Users', value: '1,234', change: '+12%' },
    { name: 'Active Courses', value: '28', change: '+5%' },
    { name: 'Placements', value: '856', change: '+23%' },
    { name: 'Revenue', value: '$124,567', change: '+8%' },
  ],
  candidate: [
    { name: 'Applied Jobs', value: '12', change: '+2' },
    { name: 'Interviews', value: '3', change: '+1' },
    { name: 'Skills Certified', value: '5/8', change: '+1' },
    { name: 'Profile Strength', value: '85%', change: '+5%' },
  ],
};

export const recentActivities = {
  admin: [
    { id: 1, type: 'user', action: 'New user registered', time: '10 minutes ago', user: 'New User' },
    { id: 2, type: 'course', action: 'New course published', time: '2 hours ago', course: 'Advanced React' },
  ],
  candidate: [
    { id: 1, type: 'application', action: 'Application submitted', time: '2 hours ago', position: 'Frontend Developer' },
    { id: 2, type: 'assessment', action: 'Assessment completed', time: '1 day ago', score: '85%' },
  ],
};

export const upcomingEvents = [
  { id: 1, title: 'Team Meeting', date: '2023-10-28T10:00:00', type: 'meeting' },
  { id: 2, title: 'Webinar: Modern JavaScript', date: '2023-10-29T14:30:00', type: 'webinar' },
];

export const notifications = [
  { id: 1, text: 'Your profile is 85% complete', type: 'info', read: false },
  { id: 2, text: 'New message from support', type: 'message', read: false },
];
