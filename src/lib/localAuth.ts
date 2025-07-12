import { User } from '../types';

// Local storage keys
const USERS_KEY = 'rewear_users';
const CURRENT_USER_KEY = 'rewear_current_user';
const USER_VISITS_KEY = 'rewear_user_visits';
const ALL_EMAILS_KEY = 'rewear_all_emails';

// Admin file path for user data
const ADMIN_FILE_PATH = 'user_data.txt';

export interface LocalUser {
  id: string;
  email: string;
  name: string;
  password: string; // In a real app, this would be hashed
  points: number;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  last_visit?: string;
  visit_count?: number;
}

export interface UserVisit {
  email: string;
  name: string;
  visit_time: string;
  user_id: string;
}

export interface LocalAuthResponse {
  user: LocalUser | null;
  error: string | null;
}

class LocalAuth {
  private users: LocalUser[] = [];
  private userVisits: UserVisit[] = [];
  private allEmails: string[] = [];

  constructor() {
    this.loadUsers();
    this.loadUserVisits();
    this.loadAllEmails();
  }

  private loadUsers() {
    try {
      const stored = localStorage.getItem(USERS_KEY);
      this.users = stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading users:', error);
      this.users = [];
    }
  }

  private loadUserVisits() {
    try {
      const stored = localStorage.getItem(USER_VISITS_KEY);
      this.userVisits = stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading user visits:', error);
      this.userVisits = [];
    }
  }

  private loadAllEmails() {
    try {
      const stored = localStorage.getItem(ALL_EMAILS_KEY);
      this.allEmails = stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading all emails:', error);
      this.allEmails = [];
    }
  }

  private saveUsers() {
    try {
      localStorage.setItem(USERS_KEY, JSON.stringify(this.users, null, 2));
      this.saveToAdminFile();
    } catch (error) {
      console.error('Error saving users:', error);
    }
  }

  private saveUserVisits() {
    try {
      localStorage.setItem(USER_VISITS_KEY, JSON.stringify(this.userVisits, null, 2));
    } catch (error) {
      console.error('Error saving user visits:', error);
    }
  }

  private saveAllEmails() {
    try {
      localStorage.setItem(ALL_EMAILS_KEY, JSON.stringify(this.allEmails, null, 2));
    } catch (error) {
      console.error('Error saving all emails:', error);
    }
  }

  private trackUserVisit(user: LocalUser) {
    // Add to all emails if not already present
    if (!this.allEmails.includes(user.email)) {
      this.allEmails.push(user.email);
      this.saveAllEmails();
    }

    // Record visit
    const visit: UserVisit = {
      email: user.email,
      name: user.name,
      visit_time: new Date().toISOString(),
      user_id: user.id
    };
    this.userVisits.push(visit);
    this.saveUserVisits();

    // Update user's last visit and visit count
    const userIndex = this.users.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      this.users[userIndex] = {
        ...this.users[userIndex],
        last_visit: new Date().toISOString(),
        visit_count: (this.users[userIndex].visit_count || 0) + 1,
        updated_at: new Date().toISOString()
      };
      this.saveUsers();
    }
  }

  private saveToAdminFile() {
    try {
      const userData = this.users.map(user => ({
        id: user.id,
        email: user.email,
        name: user.name,
        points: user.points,
        created_at: user.created_at,
        updated_at: user.updated_at,
        last_visit: user.last_visit,
        visit_count: user.visit_count || 0
      }));

      const data = {
        total_users: this.users.length,
        total_visits: this.userVisits.length,
        total_unique_emails: this.allEmails.length,
        export_date: new Date().toISOString(),
        users: userData,
        all_emails: this.allEmails,
        recent_visits: this.userVisits.slice(-50) // Last 50 visits
      };

      // Create a downloadable file
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // Store the URL for admin download
      localStorage.setItem('admin_user_data_url', url);
    } catch (error) {
      console.error('Error saving to admin file:', error);
    }
  }

  async signUp(email: string, password: string, name: string): Promise<LocalAuthResponse> {
    try {
      // Check if user already exists
      const existingUser = this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existingUser) {
        return { user: null, error: 'User with this email already exists' };
      }

      // Create new user
      const newUser: LocalUser = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        email: email.toLowerCase(),
        name,
        password, // In production, hash this password
        points: 100, // Welcome bonus
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_visit: new Date().toISOString(),
        visit_count: 1
      };

      this.users.push(newUser);
      this.saveUsers();

      // Track the visit
      this.trackUserVisit(newUser);

      return { user: newUser, error: null };
    } catch (error) {
      return { user: null, error: 'Failed to create account' };
    }
  }

  async signIn(email: string, password: string): Promise<LocalAuthResponse> {
    try {
      const user = this.users.find(u => 
        u.email.toLowerCase() === email.toLowerCase() && 
        u.password === password
      );

      if (!user) {
        return { user: null, error: 'Invalid email or password' };
      }

      // Track the visit
      this.trackUserVisit(user);

      // Store current user
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));

      return { user, error: null };
    } catch (error) {
      return { user: null, error: 'Failed to sign in' };
    }
  }

  async signOut(): Promise<void> {
    localStorage.removeItem(CURRENT_USER_KEY);
  }

  getCurrentUser(): LocalUser | null {
    try {
      const stored = localStorage.getItem(CURRENT_USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      return null;
    }
  }

  async updateUser(userId: string, updates: Partial<LocalUser>): Promise<LocalAuthResponse> {
    try {
      const userIndex = this.users.findIndex(u => u.id === userId);
      if (userIndex === -1) {
        return { user: null, error: 'User not found' };
      }

      this.users[userIndex] = {
        ...this.users[userIndex],
        ...updates,
        updated_at: new Date().toISOString()
      };

      this.saveUsers();

      // Update current user if it's the same user
      const currentUser = this.getCurrentUser();
      if (currentUser && currentUser.id === userId) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(this.users[userIndex]));
      }

      return { user: this.users[userIndex], error: null };
    } catch (error) {
      return { user: null, error: 'Failed to update user' };
    }
  }

  // Admin functions
  getAllUsers(): LocalUser[] {
    return [...this.users];
  }

  getAllUserVisits(): UserVisit[] {
    return [...this.userVisits];
  }

  getAllEmails(): string[] {
    return [...this.allEmails];
  }

  downloadUserData(): void {
    const url = localStorage.getItem('admin_user_data_url');
    if (url) {
      const a = document.createElement('a');
      a.href = url;
      a.download = `user_data_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }

  // Demo user for testing
  createDemoUser(): LocalUser {
    const demoUser: LocalUser = {
      id: 'demo-user',
      email: 'demo@rewear.com',
      name: 'Demo User',
      password: 'demo123',
      points: 250,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_visit: new Date().toISOString(),
      visit_count: 1
    };

    // Add demo user if not exists
    if (!this.users.find(u => u.email === demoUser.email)) {
      this.users.push(demoUser);
      this.saveUsers();
      this.trackUserVisit(demoUser);
    }

    return demoUser;
  }
}

export const localAuth = new LocalAuth(); 