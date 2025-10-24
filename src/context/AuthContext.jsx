import { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const TEAM_MEMBERS = [
    { id: 'unassigned', name: 'Unassigned' },
    { id: 'TM001', name: 'John Smith' },
    { id: 'TM002', name: 'Jane Doe' },
    { id: 'TM003', name: 'Alex Wong' },
    { id: 'TM004', name: 'Sarah Johnson' },
  ];

  const login = (userId, password) => {
    const foundUser = TEAM_MEMBERS.find(member => member.id === userId);
    if (foundUser && password === 'password') {
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout, TEAM_MEMBERS }}>
      {children}
    </AuthContext.Provider>
  );
};
