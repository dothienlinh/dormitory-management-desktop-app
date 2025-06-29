export type SecurityIncident = {
  id: string;
  title: string;
  description: string;
  type:
    | "curfew"
    | "theft"
    | "noise"
    | "fire_hazard"
    | "trespassing"
    | "rule_violation";
  status: "pending" | "investigating" | "resolved";
  severity: "low" | "medium" | "high";
  reportDate: string;
  location: string;
  reportedBy: string;
  involvedStudents: { id: string; name: string }[];
};

export type VisitorLog = {
  id: string;
  visitorName: string;
  visitorId: string;
  purpose: string;
  visitingStudent: {
    id: string;
    name: string;
    room: string;
  } | null;
  checkInTime: string;
  checkOutTime: string | null;
  status: "active" | "completed";
};

export type SecurityAlert = {
  id: number;
  title: string;
  description: string;
  severity: "low" | "medium" | "high";
  dateCreated: string;
  expiryDate: string;
  isActive: boolean;
};
