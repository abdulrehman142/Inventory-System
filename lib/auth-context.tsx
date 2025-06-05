"use client"
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

type User = {
  user_id: number;
  employee_id: number;
  password: string;
  username: string;
  email: string;
};

type Employee = {
  employee_id: number;
  role_id: number;
  first_name: string;
  last_name: string;
  position: string;
  status: string;
};

type Role = {
  role_id: number;
  role_name: string;
  description: string;
};

type AuthContextType = {
  user: User | null;
  employee: Employee | null;
  role: Role | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  hasAccess: (path: string) => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for stored auth data on mount
    const storedUser = localStorage.getItem('user');
    const storedEmployee = localStorage.getItem('employee');
    const storedRole = localStorage.getItem('role');

    if (storedUser && storedEmployee && storedRole) {
      setUser(JSON.parse(storedUser));
      setEmployee(JSON.parse(storedEmployee));
      setRole(JSON.parse(storedRole));
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<void> => {
    try {
      // Fetch user data
      const userResponse = await fetch('http://localhost:3000/api/personnel/user');
      const users = await userResponse.json();
      const foundUser = users.find((u: User) => u.username === username && u.password === password);

      if (!foundUser) {
        throw new Error('Invalid credentials');
      }

      // Fetch employee data
      const employeeResponse = await fetch('http://localhost:3000/api/personnel/employee');
      const employees = await employeeResponse.json();
      const foundEmployee = employees.find((e: Employee) => e.employee_id === foundUser.employee_id);

      if (!foundEmployee) {
        throw new Error('Employee not found');
      }

      // Fetch role data
      const roleResponse = await fetch('http://localhost:3000/api/personnel/role');
      const roles = await roleResponse.json();
      const foundRole = roles.find((r: Role) => r.role_id === foundEmployee.role_id);

      if (!foundRole) {
        throw new Error('Role not found');
      }

      // Store auth data
      setUser(foundUser);
      setEmployee(foundEmployee);
      setRole(foundRole);

      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(foundUser));
      localStorage.setItem('employee', JSON.stringify(foundEmployee));
      localStorage.setItem('role', JSON.stringify(foundRole));

      // Store in cookies for middleware
      document.cookie = `user=${JSON.stringify(foundUser)}; path=/`;
      document.cookie = `role=${foundRole.role_id}; path=/`;

      // Determine redirect path based on role and navigate
      const redirectPath = foundRole.role_id > 10 ? '/inventory' : '/';
      router.replace(redirectPath);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setEmployee(null);
    setRole(null);
    localStorage.removeItem('user');
    localStorage.removeItem('employee');
    localStorage.removeItem('role');
    router.push('/login');
  };

  const hasAccess = (path: string) => {
    if (!role) return false;

    // Full access for upper management (role_id 1-5)
    if (role.role_id >= 1 && role.role_id <= 5) {
      return true;
    }

    // HR access (role_id 6-10) only to root path
    if (role.role_id >= 6 && role.role_id <= 10) {
      return path === '/';
    }

    // Inventory access (role_id > 10) only to inventory path
    return path === '/inventory';
  };

  return (
    <AuthContext.Provider value={{ user, employee, role, isLoading, login, logout, hasAccess }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 