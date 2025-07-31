import { Status } from "./statuses";

export interface Applicant {
  id: number;
  rank: string;
  applicationId: string;
  firstName: string;
  lastName: string;
  hh: number;
  requests: string;
  updated?: string;
  substatus?: string;
  status?: Status;
  hasAlternateContact?: boolean;
  noEmail?: boolean;
}

const page1: Applicant[] = [
  { id: 1, rank: "COP 1", applicationId: "APP-00474767", firstName: "Emma", lastName: "Jones", hh: 1, requests: "" },
  { id: 2, rank: "COP 2", applicationId: "APP-00474768", firstName: "Noah", lastName: "Williams", hh: 2, requests: "", hasAlternateContact: true },
  { id: 3, rank: "COP 3", applicationId: "APP-00474769", firstName: "Olivia", lastName: "Brown", hh: 1, requests: "Hearing/Vision", hasAlternateContact: true },
  { id: 4, rank: "DTHP 1", applicationId: "APP-00474773", firstName: "Ethan", lastName: "Lopez", hh: 2, requests: "Hearing/Vision" },
  { id: 5, rank: "DTHP 2", applicationId: "APP-00474771", firstName: "Mason", lastName: "Martinez", hh: 4, requests: "", hasAlternateContact: true },
  { id: 6, rank: "DTHP 3", applicationId: "APP-00474774", firstName: "Ava", lastName: "Gonzalez", hh: 3, requests: "" },
  { id: 7, rank: "DTHP 4", applicationId: "APP-00474772", firstName: "Isabella", lastName: "Hernandez", hh: 4, requests: "" },
  { id: 8, rank: "DTHP 5", applicationId: "APP-00474766", firstName: "Liam", lastName: "Smith", hh: 3, requests: "Hearing/Vision", hasAlternateContact: true },
  { id: 9, rank: "DTHP 6", applicationId: "APP-00474770", firstName: "Sophia", lastName: "Garcia", hh: 2, requests: "" },
  { id: 10, rank: "DTHP 7", applicationId: "APP-00474776", firstName: "Mia", lastName: "Anderson", hh: 5, requests: "Hearing/Vision" },
  { id: 11, rank: "DTHP 8", applicationId: "APP-00474775", firstName: "Lucas", lastName: "Wilson", hh: 4, requests: "", hasAlternateContact: true },
  { id: 12, rank: "NRHP 1", applicationId: "APP-00474784", firstName: "Evelyn", lastName: "Thompson", hh: 3, requests: "" },
  { id: 13, rank: "NRHP 2", applicationId: "APP-00474778", firstName: "Charlotte", lastName: "Taylor", hh: 4, requests: "", hasAlternateContact: true },
  { id: 14, rank: "NRHP 3", applicationId: "APP-00474779", firstName: "Benjamin", lastName: "Moore", hh: 3, requests: "" },
  { id: 15, rank: "NRHP 4", applicationId: "APP-00474785", firstName: "Henry", lastName: "Garcia", hh: 4, requests: "" },
  { id: 16, rank: "NRHP 5", applicationId: "APP-00474783", firstName: "Oliver", lastName: "Martin", hh: 1, requests: "", hasAlternateContact: true },
  { id: 17, rank: "NRHP 6", applicationId: "APP-00474782", firstName: "Harper", lastName: "Harris", hh: 5, requests: "Mobility" },
  { id: 18, rank: "NRHP 7", applicationId: "APP-00474777", firstName: "James", lastName: "Thomas", hh: 1, requests: "" },
  { id: 19, rank: "NRHP 8", applicationId: "APP-00474781", firstName: "Elijah", lastName: "White", hh: 3, requests: "", hasAlternateContact: true },
  { id: 20, rank: "NRHP 9", applicationId: "APP-00474780", firstName: "Amelia", lastName: "Jackson", hh: 2, requests: "" },
];

const page2: Applicant[] = [
  { id: 21, rank: "LW 1", applicationId: "APP-00474786", firstName: "Zander", lastName: "Kumar", hh: 4, requests: "" },
  { id: 22, rank: "LW 2", applicationId: "APP-00474787", firstName: "Elara", lastName: "Nguyen", hh: 2, requests: "", hasAlternateContact: true },
  { id: 23, rank: "LW 3", applicationId: "APP-00474788", firstName: "Finn", lastName: "Patel", hh: 1, requests: "" },
  { id: 24, rank: "LW 4", applicationId: "APP-00474789", firstName: "Lyra", lastName: "Garcia", hh: 5, requests: "Hearing/Vision" },
  { id: 25, rank: "LW 5", applicationId: "APP-00474790", firstName: "Sienna", lastName: "Kim", hh: 3, requests: "", hasAlternateContact: true },
  { id: 26, rank: "LW 6", applicationId: "APP-00474791", firstName: "Nia", lastName: "Chen", hh: 5, requests: "Hearing/Vision", noEmail: true },
  { id: 27, rank: "LW 7", applicationId: "APP-00474792", firstName: "Jasper", lastName: "Ali", hh: 1, requests: "" },
  { id: 28, rank: "LW 8", applicationId: "APP-00474793", firstName: "Kian", lastName: "Singh", hh: 3, requests: "", hasAlternateContact: true, noEmail: true },
  { id: 29, rank: "LW 9", applicationId: "APP-00474794", firstName: "Theo", lastName: "Lopez", hh: 4, requests: "" },
  { id: 30, rank: "LW 10", applicationId: "APP-00474795", firstName: "Aria", lastName: "Zhang", hh: 2, requests: "", hasAlternateContact: true },
  { id: 31, rank: "LW 11", applicationId: "APP-00474796", firstName: "Dante", lastName: "Hernandez", hh: 4, requests: "" },
  { id: 32, rank: "LW 12", applicationId: "APP-00474797", firstName: "Mira", lastName: "Smith", hh: 3, requests: "Hearing/Vision", hasAlternateContact: true },
  { id: 33, rank: "LW 13", applicationId: "APP-00474798", firstName: "Ronan", lastName: "Johnson", hh: 3, requests: "", noEmail: true },
  { id: 34, rank: "LW 14", applicationId: "APP-00474799", firstName: "Zara", lastName: "Martinez", hh: 4, requests: "" },
  { id: 35, rank: "LW 15", applicationId: "APP-00474800", firstName: "Cleo", lastName: "Taylor", hh: 4, requests: "", hasAlternateContact: true },
  { id: 36, rank: "LW 16", applicationId: "APP-00474801", firstName: "Ivy", lastName: "Jones", hh: 1, requests: "", noEmail: true },
  { id: 37, rank: "LW 17", applicationId: "APP-00474802", firstName: "Orion", lastName: "Brown", hh: 2, requests: "Vision", hasAlternateContact: true },
  { id: 38, rank: "LW 18", applicationId: "APP-00474803", firstName: "Luna", lastName: "Wilson", hh: 1, requests: "Hearing/Vision" },
  { id: 39, rank: "LW 19", applicationId: "APP-00474804", firstName: "Asher", lastName: "Williams", hh: 2, requests: "" },
  { id: 40, rank: "LW 20", applicationId: "APP-00474805", firstName: "Talia", lastName: "Gonzalez", hh: 3, requests: "" },
];

const page3: Applicant[] = [
  { id: 41, rank: "LW 21", applicationId: "APP-00474806", firstName: "Amina", lastName: "Khan", hh: 3, requests: "Hearing/Vision", hasAlternateContact: true },
  { id: 42, rank: "LW 22", applicationId: "APP-00474807", firstName: "Sofia", lastName: "Li", hh: 2, requests: "" },
  { id: 43, rank: "LW 23", applicationId: "APP-00474808", firstName: "Anaya", lastName: "Rodriguez", hh: 3, requests: "" },
  { id: 44, rank: "LW 24", applicationId: "APP-00474809", firstName: "Yara", lastName: "Patel", hh: 1, requests: "Hearing/Vision", hasAlternateContact: true },
  { id: 45, rank: "LW 25", applicationId: "APP-00474810", firstName: "Nia", lastName: "Martinez", hh: 5, requests: "Mobility" },
  { id: 46, rank: "LW 26", applicationId: "APP-00474811", firstName: "Khalid", lastName: "Nguyen", hh: 2, requests: "Vision" },
  { id: 47, rank: "LW 27", applicationId: "APP-00474812", firstName: "Zara", lastName: "Kim", hh: 3, requests: "", hasAlternateContact: true },
  { id: 48, rank: "LW 28", applicationId: "APP-00474813", firstName: "Laila", lastName: "Singh", hh: 4, requests: "" },
  { id: 49, rank: "LW 29", applicationId: "APP-00474814", firstName: "Dante", lastName: "Hernandez", hh: 4, requests: "", hasAlternateContact: true },
  { id: 50, rank: "LW 30", applicationId: "APP-00474815", firstName: "Ravi", lastName: "Johnson", hh: 3, requests: "" },
  { id: 51, rank: "LW 31", applicationId: "APP-00474816", firstName: "Ivy", lastName: "Chen", hh: 1, requests: "" },
  { id: 52, rank: "LW 32", applicationId: "APP-00474817", firstName: "Finn", lastName: "Patel", hh: 1, requests: "", hasAlternateContact: true },
  { id: 53, rank: "LW 33", applicationId: "APP-00474818", firstName: "Asher", lastName: "Williams", hh: 2, requests: "" },
  { id: 54, rank: "LW 34", applicationId: "APP-00474819", firstName: "Jasper", lastName: "Ali", hh: 1, requests: "" },
  { id: 55, rank: "LW 35", applicationId: "APP-00474820", firstName: "Cleo", lastName: "Taylor", hh: 4, requests: "", hasAlternateContact: true },
  { id: 56, rank: "LW 36", applicationId: "APP-00474821", firstName: "Elara", lastName: "Nguyen", hh: 2, requests: "" },
  { id: 57, rank: "LW 37", applicationId: "APP-00474822", firstName: "Theo", lastName: "Lopez", hh: 4, requests: "" },
  { id: 58, rank: "LW 38", applicationId: "APP-00474823", firstName: "Nia", lastName: "Chen", hh: 5, requests: "Hearing/Vision" },
  { id: 59, rank: "LW 39", applicationId: "APP-00474824", firstName: "Zander", lastName: "Kumar", hh: 4, requests: "" },
  { id: 60, rank: "LW 40", applicationId: "APP-00474825", firstName: "Kian", lastName: "Singh", hh: 3, requests: "" },
];

export const pagedApplicants = [page1, page2, page3];
