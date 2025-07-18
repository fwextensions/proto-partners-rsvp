export interface Applicant {
	id: number;
	rank: string;
	applicationId: string;
	firstName: string;
	lastName: string;
	hh: number;
	requests: string;
	updated: string;
	latestSubstatus: string;
}

const page1: Applicant[] = [
	{ id: 1, rank: "COP 1", applicationId: "APP-00474767", firstName: "Emma", lastName: "Jones", hh: 1, requests: "", updated: "", latestSubstatus: "" },
	{ id: 2, rank: "COP 2", applicationId: "APP-00474768", firstName: "Noah", lastName: "Williams", hh: 2, requests: "", updated: "", latestSubstatus: "" },
	{ id: 3, rank: "COP 3", applicationId: "APP-00474769", firstName: "Olivia", lastName: "Brown", hh: 1, requests: "Hearing/Vision", updated: "", latestSubstatus: "" },
	{ id: 4, rank: "DTHP 1", applicationId: "APP-00474773", firstName: "Ethan", lastName: "Lopez", hh: 2, requests: "Hearing/Vision", updated: "", latestSubstatus: "" },
	{ id: 5, rank: "DTHP 2", applicationId: "APP-00474771", firstName: "Mason", lastName: "Martinez", hh: 4, requests: "", updated: "", latestSubstatus: "" },
	{ id: 6, rank: "DTHP 3", applicationId: "APP-00474774", firstName: "Ava", lastName: "Gonzalez", hh: 3, requests: "", updated: "", latestSubstatus: "" },
	{ id: 7, rank: "DTHP 4", applicationId: "APP-00474772", firstName: "Isabella", lastName: "Hernandez", hh: 4, requests: "", updated: "", latestSubstatus: "" },
	{ id: 8, rank: "DTHP 5", applicationId: "APP-00474766", firstName: "Liam", lastName: "Smith", hh: 3, requests: "Hearing/Vision", updated: "", latestSubstatus: "" },
	{ id: 9, rank: "DTHP 6", applicationId: "APP-00474770", firstName: "Sophia", lastName: "Garcia", hh: 2, requests: "", updated: "", latestSubstatus: "" },
	{ id: 10, rank: "DTHP 7", applicationId: "APP-00474776", firstName: "Mia", lastName: "Anderson", hh: 5, requests: "Hearing/Vision", updated: "", latestSubstatus: "" },
	{ id: 11, rank: "DTHP 8", applicationId: "APP-00474775", firstName: "Lucas", lastName: "Wilson", hh: 4, requests: "", updated: "", latestSubstatus: "" },
	{ id: 12, rank: "NRHP 1", applicationId: "APP-00474784", firstName: "Evelyn", lastName: "Thompson", hh: 3, requests: "", updated: "", latestSubstatus: "" },
	{ id: 13, rank: "NRHP 2", applicationId: "APP-00474778", firstName: "Charlotte", lastName: "Taylor", hh: 4, requests: "", updated: "", latestSubstatus: "" },
	{ id: 14, rank: "NRHP 3", applicationId: "APP-00474779", firstName: "Benjamin", lastName: "Moore", hh: 3, requests: "", updated: "", latestSubstatus: "" },
	{ id: 15, rank: "NRHP 4", applicationId: "APP-00474785", firstName: "Henry", lastName: "Garcia", hh: 4, requests: "", updated: "", latestSubstatus: "" },
	{ id: 16, rank: "NRHP 5", applicationId: "APP-00474783", firstName: "Oliver", lastName: "Martin", hh: 1, requests: "", updated: "", latestSubstatus: "" },
	{ id: 17, rank: "NRHP 6", applicationId: "APP-00474782", firstName: "Harper", lastName: "Harris", hh: 5, requests: "Mobility", updated: "", latestSubstatus: "" },
	{ id: 18, rank: "NRHP 7", applicationId: "APP-00474777", firstName: "James", lastName: "Thomas", hh: 1, requests: "", updated: "", latestSubstatus: "" },
	{ id: 19, rank: "NRHP 8", applicationId: "APP-00474781", firstName: "Elijah", lastName: "White", hh: 3, requests: "", updated: "", latestSubstatus: "" },
	{ id: 20, rank: "NRHP 9", applicationId: "APP-00474780", firstName: "Amelia", lastName: "Jackson", hh: 2, requests: "", updated: "", latestSubstatus: "" },
];

const page2: Applicant[] = [
	{ id: 21, rank: "LW 1", applicationId: "APP-00474785", firstName: "Zander", lastName: "Kumar", hh: 4, requests: "", updated: "", latestSubstatus: "" },
	{ id: 22, rank: "LW 2", applicationId: "APP-00474780", firstName: "Elara", lastName: "Nguyen", hh: 2, requests: "", updated: "", latestSubstatus: "" },
	{ id: 23, rank: "LW 3", applicationId: "APP-00474777", firstName: "Finn", lastName: "Patel", hh: 1, requests: "", updated: "", latestSubstatus: "" },
	{ id: 24, rank: "LW 4", applicationId: "APP-00474782", firstName: "Lyra", lastName: "Garcia", hh: 5, requests: "Hearing/Vision", updated: "", latestSubstatus: "" },
	{ id: 25, rank: "LW 5", applicationId: "APP-00474784", firstName: "Sienna", lastName: "Kim", hh: 3, requests: "", updated: "", latestSubstatus: "" },
	{ id: 26, rank: "LW 6", applicationId: "APP-00474776", firstName: "Nia", lastName: "Chen", hh: 5, requests: "Hearing/Vision", updated: "", latestSubstatus: "" },
	{ id: 27, rank: "LW 7", applicationId: "APP-00474783", firstName: "Jasper", lastName: "Ali", hh: 1, requests: "", updated: "", latestSubstatus: "" },
	{ id: 28, rank: "LW 8", applicationId: "APP-00474779", firstName: "Kian", lastName: "Singh", hh: 3, requests: "", updated: "", latestSubstatus: "" },
	{ id: 29, rank: "LW 9", applicationId: "APP-00474775", firstName: "Theo", lastName: "Lopez", hh: 4, requests: "", updated: "", latestSubstatus: "" },
	{ id: 30, rank: "LW 10", applicationId: "APP-00474770", firstName: "Aria", lastName: "Zhang", hh: 2, requests: "", updated: "", latestSubstatus: "" },
	{ id: 31, rank: "LW 11", applicationId: "APP-00474771", firstName: "Dante", lastName: "Hernandez", hh: 4, requests: "", updated: "", latestSubstatus: "" },
	{ id: 32, rank: "LW 12", applicationId: "APP-00474766", firstName: "Mira", lastName: "Smith", hh: 3, requests: "Hearing/Vision", updated: "", latestSubstatus: "" },
	{ id: 33, rank: "LW 13", applicationId: "APP-00474781", firstName: "Ronan", lastName: "Johnson", hh: 3, requests: "", updated: "", latestSubstatus: "" },
	{ id: 34, rank: "LW 14", applicationId: "APP-00474772", firstName: "Zara", lastName: "Martinez", hh: 4, requests: "", updated: "", latestSubstatus: "" },
	{ id: 35, rank: "LW 15", applicationId: "APP-00474778", firstName: "Cleo", lastName: "Taylor", hh: 4, requests: "", updated: "", latestSubstatus: "" },
	{ id: 36, rank: "LW 16", applicationId: "APP-00474767", firstName: "Ivy", lastName: "Jones", hh: 1, requests: "", updated: "", latestSubstatus: "" },
	{ id: 37, rank: "LW 17", applicationId: "APP-00474773", firstName: "Orion", lastName: "Brown", hh: 2, requests: "Vision", updated: "", latestSubstatus: "" },
	{ id: 38, rank: "LW 18", applicationId: "APP-00474769", firstName: "Luna", lastName: "Wilson", hh: 1, requests: "Hearing/Vision", updated: "", latestSubstatus: "" },
	{ id: 39, rank: "LW 19", applicationId: "APP-00474768", firstName: "Asher", lastName: "Williams", hh: 2, requests: "", updated: "", latestSubstatus: "" },
	{ id: 40, rank: "LW 20", applicationId: "APP-00474774", firstName: "Talia", lastName: "Gonzalez", hh: 3, requests: "", updated: "", latestSubstatus: "" },
];

const page3: Applicant[] = [
	{ id: 41, rank: "LW 21", applicationId: "APP-00474766", firstName: "Amina", lastName: "Khan", hh: 3, requests: "Hearing/Vision", updated: "", latestSubstatus: "" },
	{ id: 42, rank: "LW 22", applicationId: "APP-00474770", firstName: "Sofia", lastName: "Li", hh: 2, requests: "", updated: "", latestSubstatus: "" },
	{ id: 43, rank: "LW 23", applicationId: "APP-00474774", firstName: "Anaya", lastName: "Rodriguez", hh: 3, requests: "", updated: "", latestSubstatus: "" },
	{ id: 44, rank: "LW 24", applicationId: "APP-00474769", firstName: "Yara", lastName: "Patel", hh: 1, requests: "Hearing/Vision", updated: "", latestSubstatus: "" },
	{ id: 45, rank: "LW 25", applicationId: "APP-00474782", firstName: "Nia", lastName: "Martinez", hh: 5, requests: "Mobility", updated: "", latestSubstatus: "" },
	{ id: 46, rank: "LW 26", applicationId: "APP-00474773", firstName: "Khalid", lastName: "Nguyen", hh: 2, requests: "Vision", updated: "", latestSubstatus: "" },
	{ id: 47, rank: "LW 27", applicationId: "APP-00474784", firstName: "Zara", lastName: "Kim", hh: 3, requests: "", updated: "", latestSubstatus: "" },
	{ id: 48, rank: "LW 28", applicationId: "APP-00474772", firstName: "Laila", lastName: "Singh", hh: 4, requests: "", updated: "", latestSubstatus: "" },
	{ id: 49, rank: "LW 29", applicationId: "APP-00474771", firstName: "Dante", lastName: "Hernandez", hh: 4, requests: "", updated: "", latestSubstatus: "" },
	{ id: 50, rank: "LW 30", applicationId: "APP-00474781", firstName: "Ravi", lastName: "Johnson", hh: 3, requests: "", updated: "", latestSubstatus: "" },
	{ id: 51, rank: "LW 31", applicationId: "APP-00474767", firstName: "Ivy", lastName: "Chen", hh: 1, requests: "", updated: "", latestSubstatus: "" },
	{ id: 52, rank: "LW 32", applicationId: "APP-00474777", firstName: "Finn", lastName: "Patel", hh: 1, requests: "", updated: "", latestSubstatus: "" },
	{ id: 53, rank: "LW 33", applicationId: "APP-00474768", firstName: "Asher", lastName: "Williams", hh: 2, requests: "", updated: "", latestSubstatus: "" },
	{ id: 54, rank: "LW 34", applicationId: "APP-00474783", firstName: "Jasper", lastName: "Ali", hh: 1, requests: "", updated: "", latestSubstatus: "" },
	{ id: 55, rank: "LW 35", applicationId: "APP-00474778", firstName: "Cleo", lastName: "Taylor", hh: 4, requests: "", updated: "", latestSubstatus: "" },
	{ id: 56, rank: "LW 36", applicationId: "APP-00474780", firstName: "Elara", lastName: "Nguyen", hh: 2, requests: "", updated: "", latestSubstatus: "" },
	{ id: 57, rank: "LW 37", applicationId: "APP-00474775", firstName: "Theo", lastName: "Lopez", hh: 4, requests: "", updated: "", latestSubstatus: "" },
	{ id: 58, rank: "LW 38", applicationId: "APP-00474776", firstName: "Nia", lastName: "Chen", hh: 5, requests: "Hearing/Vision", updated: "", latestSubstatus: "" },
	{ id: 59, rank: "LW 39", applicationId: "APP-00474785", firstName: "Zander", lastName: "Kumar", hh: 4, requests: "", updated: "", latestSubstatus: "" },
	{ id: 60, rank: "LW 40", applicationId: "APP-00474779", firstName: "Kian", lastName: "Singh", hh: 3, requests: "", updated: "", latestSubstatus: "" },
];

export const pagedApplicants = [page1, page2, page3];
