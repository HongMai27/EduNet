export interface IReport {
    _id: string;
    reporter: {
      _id: string;
      username: string;
      email: string;
    };
    reportedEntity: {
      _id: string;
      content?: string; 
      username?: string; 
    } | null;
    entityType: "Post" | "User";
    reason: string;
    createdAt: string;
    status: string;
  }