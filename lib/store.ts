import { Application, Interview } from './types';

// Simple in-memory storage with localStorage persistence
class Store {
  private applications: Application[] = [];
  private interviews: Interview[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      this.loadFromStorage();
    }
  }

  private loadFromStorage() {
    const appsData = localStorage.getItem('applications');
    const interviewsData = localStorage.getItem('interviews');
    
    if (appsData) {
      this.applications = JSON.parse(appsData);
    }
    if (interviewsData) {
      this.interviews = JSON.parse(interviewsData);
    }
  }

  private saveToStorage() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('applications', JSON.stringify(this.applications));
      localStorage.setItem('interviews', JSON.stringify(this.interviews));
    }
  }

  // Application methods
  getAllApplications(): Application[] {
    return [...this.applications];
  }

  getApplicationById(id: string): Application | undefined {
    return this.applications.find(app => app.id === id);
  }

  addApplication(app: Application): Application {
    this.applications.push(app);
    this.saveToStorage();
    return app;
  }

  updateApplication(id: string, updates: Partial<Application>): Application | null {
    const index = this.applications.findIndex(app => app.id === id);
    if (index === -1) return null;
    
    this.applications[index] = { ...this.applications[index], ...updates };
    this.saveToStorage();
    return this.applications[index];
  }

  deleteApplication(id: string): boolean {
    const index = this.applications.findIndex(app => app.id === id);
    if (index === -1) return false;
    
    this.applications.splice(index, 1);
    // Also delete related interviews
    this.interviews = this.interviews.filter(interview => interview.applicationId !== id);
    this.saveToStorage();
    return true;
  }

  searchApplications(query: string): Application[] {
    const lowerQuery = query.toLowerCase();
    return this.applications.filter(app => 
      app.companyName.toLowerCase().includes(lowerQuery) ||
      app.jobRole.toLowerCase().includes(lowerQuery) ||
      app.location.toLowerCase().includes(lowerQuery)
    );
  }

  filterApplications(status?: string, jobType?: string): Application[] {
    return this.applications.filter(app => {
      const matchesStatus = !status || app.status === status;
      const matchesType = !jobType || app.jobType === jobType;
      return matchesStatus && matchesType;
    });
  }

  // Interview methods
  getInterviewsByApplicationId(applicationId: string): Interview[] {
    return this.interviews.filter(interview => interview.applicationId === applicationId);
  }

  addInterview(interview: Interview): Interview {
    this.interviews.push(interview);
    this.saveToStorage();
    return interview;
  }

  updateInterview(id: string, updates: Partial<Interview>): Interview | null {
    const index = this.interviews.findIndex(interview => interview.id === id);
    if (index === -1) return null;
    
    this.interviews[index] = { ...this.interviews[index], ...updates };
    this.saveToStorage();
    return this.interviews[index];
  }

  deleteInterview(id: string): boolean {
    const index = this.interviews.findIndex(interview => interview.id === id);
    if (index === -1) return false;
    
    this.interviews.splice(index, 1);
    this.saveToStorage();
    return true;
  }

  getAllInterviews(): Interview[] {
    return [...this.interviews];
  }
}

export const store = new Store();
