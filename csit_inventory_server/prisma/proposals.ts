import { ProjectThesisType, ProjectThesisStatus, SemesterType } from "../generated/prisma/enums";

export const proposalsData = [
  {
    projectTitle: "AI-based Inventory Management",
    abstract: "An AI system to predict inventory needs and manage stock automatically.",
    projectObjectives: "To automate inventory tracking and reduce stockouts.",
    methodology: "Using Deep Learning for prediction and computer vision for stock analysis.",
    expectedOutcomes: "A working prototype of a predictive inventory system.",
    technologiesTools: ["Python", "TensorFlow", "React", "Node.js"],
    estimatedTimeline: "6 Months",
    attachments: ["https://example.com/proposal1.pdf"],
    type: ProjectThesisType.PROJECT,
    status: ProjectThesisStatus.PENDING,
    semester: SemesterType.EIGHTH,
    courseCode: "CSE420",
    studentId: "2002027",
    teacherEmail: "jamalpstu07@gmail.com"
  },
  {
    projectTitle: "Blockchain for Supply Chain Transparency",
    abstract: "A decentralized supply chain management system to track products from origin to consumer.",
    projectObjectives: "To ensure transparency and trust in supply chain networks.",
    methodology: "Using Ethereum smart contracts to log every transaction in the supply chain.",
    expectedOutcomes: "A secure and transparent supply chain DApp.",
    technologiesTools: ["Solidity", "Node.js", "Web3.js", "React"],
    estimatedTimeline: "6 Months",
    attachments: ["https://example.com/proposal2.pdf"],
    type: ProjectThesisType.THESIS,
    status: ProjectThesisStatus.PENDING,
    semester: SemesterType.EIGHTH,
    courseCode: "CSE420",
    studentId: "2002003",
    teacherEmail: "masud@pstu.ac.bd"
  },
  {
    projectTitle: "IoT based Smart Agriculture System",
    abstract: "Automating irrigation and monitoring crop health using IoT sensors.",
    projectObjectives: "To reduce water wastage and increase crop yield.",
    methodology: "Deploying moisture and temperature sensors with Arduino and ESP32.",
    expectedOutcomes: "An automated irrigation system with a monitoring dashboard.",
    technologiesTools: ["Arduino", "IoT", "C++", "Vue.js"],
    estimatedTimeline: "6 Months",
    attachments: ["https://example.com/proposal3.pdf"],
    type: ProjectThesisType.PROJECT,
    status: ProjectThesisStatus.PENDING,
    semester: SemesterType.EIGHTH,
    courseCode: "CSE420",
    studentId: "2002008",
    teacherEmail: "chinmay.cse@pstu.ac.bd"
  },
  {
    projectTitle: "Automated Cybersecurity Vulnerability Scanner",
    abstract: "A tool to automatically scan web applications for common vulnerabilities.",
    projectObjectives: "To detect XSS, SQLi, and CSRF automatically in web apps.",
    methodology: "Using static and dynamic analysis techniques with headless browsers.",
    expectedOutcomes: "A comprehensive vulnerability scanning tool with report generation.",
    technologiesTools: ["Python", "OWASP ZAP API", "Docker", "Go"],
    estimatedTimeline: "6 Months",
    attachments: ["https://example.com/proposal4.pdf"],
    type: ProjectThesisType.THESIS,
    status: ProjectThesisStatus.PENDING,
    semester: SemesterType.EIGHTH,
    courseCode: "CSE420",
    studentId: "2002051",
    teacherEmail: "atik.csit@pstu.ac.bd"
  }
];
