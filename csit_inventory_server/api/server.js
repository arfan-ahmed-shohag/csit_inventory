var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/app/modules/dashboardData/dashboardData.router.ts
import express from "express";

// src/shared/catchAsync.ts
var catchAsync = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

// generated/prisma/enums.ts
var CourseStatus = {
  ACTIVE: "ACTIVE",
  ARCHIVED: "ARCHIVED"
};
var ProjectThesisStatus = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  in_PROGRESS: "in_PROGRESS",
  COMPLETED: "COMPLETED"
};
var StudentStatus = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  GRADUATED: "GRADUATED"
};
var TaskStatus = {
  TODO: "TODO",
  IN_PROGRESS: "IN_PROGRESS",
  REVIEW: "REVIEW",
  DONE: "DONE",
  FAILED: "FAILED"
};
var TeacherStatus = {
  ACTIVE: "ACTIVE",
  STUDY_LEAVE: "STUDY_LEAVE",
  RETIRED: "RETIRED"
};
var UserRole = {
  ADMIN: "ADMIN",
  TEACHER: "TEACHER",
  STUDENT: "STUDENT"
};
var UserStatus = {
  ACTIVE: "ACTIVE",
  BLOCKED: "BLOCKED",
  DELETED: "DELETED"
};

// src/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.3.0",
  "engineVersion": "9d6ad21cbbceab97458517b147a6a09ff43aa735",
  "activeProvider": "postgresql",
  "inlineSchema": 'model Admin {\n  id          String   @id @default(uuid())\n  email       String   @unique\n  name        String\n  phoneNumber String\n  photoUrl    String?\n  isDeleted   Boolean  @default(false)\n  createdAt   DateTime @default(now())\n  updatedAt   DateTime @updatedAt\n\n  user User @relation(fields: [email], references: [email])\n\n  @@map("admins")\n}\n\nmodel CourseTeacher {\n  id        String   @id @default(uuid())\n  courseId  String\n  course    Courses  @relation(fields: [courseId], references: [id])\n  teacherId String\n  teacher   Teacher  @relation(fields: [teacherId], references: [id])\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([courseId, teacherId])\n  @@map("course_teachers")\n}\n\nmodel Courses {\n  id          String       @id @default(uuid())\n  courseCode  String       @unique\n  courseName  String\n  description String?\n  credits     Float\n  semester    SemesterType\n  status      CourseStatus @default(ACTIVE)\n  createdAt   DateTime     @default(now())\n  updatedAt   DateTime     @updatedAt\n\n  projectTheses  ProjectThesis[]\n  courseTeachers CourseTeacher[]\n\n  @@map("courses")\n}\n\nenum CourseStatus {\n  ACTIVE\n  ARCHIVED\n}\n\nmodel ProjectThesis {\n  id                String              @id @default(uuid())\n  projectTitle      String\n  abstract          String\n  projectObjectives String\n  methodology       String\n  expectedOutcomes  String\n  technologiesTools String[]\n  estimatedTimeline String\n  attachments       String[]\n  finalReport       String?\n  feedback          String?\n  type              ProjectThesisType\n  status            ProjectThesisStatus @default(PENDING)\n  courseId          String\n  course            Courses             @relation(fields: [courseId], references: [id])\n  studentId         String\n  student           Student             @relation(fields: [studentId], references: [id])\n  supervisorId      String\n  supervisor        Teacher             @relation(fields: [supervisorId], references: [id])\n  semester          SemesterType        @default(FIRST)\n  evaluatedMark     Float?\n  obtainedMark      Float?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  tasks                   Task[]\n  projectThesisUpdateLogs ProjectThesisUpdateLog[]\n\n  @@map("projectThesis")\n}\n\nenum ProjectThesisType {\n  PROJECT\n  THESIS\n}\n\nenum ProjectThesisStatus {\n  PENDING\n  APPROVED\n  REJECTED\n  in_PROGRESS\n  COMPLETED\n}\n\nenum SemesterType {\n  FIRST   @map("1st")\n  SECOND  @map("2nd")\n  THIRD   @map("3rd")\n  FOURTH  @map("4th")\n  FIFTH   @map("5th")\n  SIXTH   @map("6th")\n  SEVENTH @map("7th")\n  EIGHTH  @map("8th")\n}\n\nmodel ProjectThesisUpdateLog {\n  id                 String        @id @default(uuid())\n  supervisorFeedback String?\n  projectThesisId    String\n  projectThesis      ProjectThesis @relation(fields: [projectThesisId], references: [id])\n  taskId             String\n  task               Task          @relation(fields: [taskId], references: [id])\n  liveLink           String?\n  fileUrl            String\n  updatedAt          DateTime      @default(now())\n\n  @@map("project_thesis_update_logs")\n}\n\nmodel Student {\n  id                 String       @id @default(uuid())\n  email              String       @unique\n  name               String\n  phoneNumber        String\n  address            String\n  studentId          String       @unique\n  registrationNumber String       @unique\n  profilePhoto       String?\n  dateOfBirth        DateTime\n  session            String\n  schoolName         String\n  collageName        String\n  semester           SemesterType @default(FIRST)\n  status             UserStatus   @default(ACTIVE)\n  isApproved         Boolean      @default(false)\n  isDeleted          Boolean      @default(false)\n  createdAt          DateTime     @default(now())\n  updatedAt          DateTime     @updatedAt\n\n  user          User            @relation(fields: [email], references: [email])\n  projectTheses ProjectThesis[]\n\n  @@map("students")\n}\n\nenum StudentStatus {\n  ACTIVE\n  INACTIVE\n  GRADUATED\n}\n\nmodel Task {\n  id                      String                   @id @default(uuid())\n  title                   String\n  description             String\n  dueDate                 DateTime\n  status                  TaskStatus               @default(TODO)\n  ratting                 Int                      @default(0)\n  feedback                String?\n  progressPercentage      Int                      @default(0)\n  projectThesisId         String\n  projectThesis           ProjectThesis            @relation(fields: [projectThesisId], references: [id])\n  requirements            String[]\n  referenceMaterials      String[]\n  createdAt               DateTime                 @default(now())\n  updatedAt               DateTime                 @updatedAt\n  projectThesisUpdateLogs ProjectThesisUpdateLog[]\n\n  @@map("tasks")\n}\n\nenum TaskStatus {\n  TODO\n  IN_PROGRESS\n  REVIEW\n  DONE\n  FAILED\n}\n\nmodel Teacher {\n  id          String             @id @default(uuid())\n  email       String             @unique\n  name        String\n  phoneNumber String\n  address     String\n  photoUrl    String?\n  faculty     String\n  department  Department\n  designation TeacherDesignation @default(LECTURER)\n  isChairman  Boolean            @default(false)\n  joinedAt    DateTime\n  status      TeacherStatus      @default(ACTIVE)\n  isDeleted   Boolean            @default(false)\n  createdAt   DateTime           @default(now())\n  updatedAt   DateTime           @updatedAt\n\n  user           User            @relation(fields: [email], references: [email])\n  projectTheses  ProjectThesis[]\n  courseTeachers CourseTeacher[]\n\n  @@map("teachers")\n}\n\nenum TeacherStatus {\n  ACTIVE\n  STUDY_LEAVE\n  RETIRED\n}\n\nenum TeacherDesignation {\n  LECTURER\n  ASSISTANT_PROFESSOR\n  ASSOCIATE_PROFESSOR\n  PROFESSOR\n}\n\nenum Department {\n  Computer_Science_And_Information_Technology\n  Computer_science_And_Communication_Engineering\n  Electrical_And_Electronic_Engineering\n  Physics_And_Mechanical_Engineering\n  Mathematics\n}\n\nmodel User {\n  id              String     @id @default(uuid())\n  email           String     @unique\n  password        String\n  role            UserRole   @default(STUDENT)\n  userStatus      UserStatus @default(ACTIVE)\n  isEmailVerified Boolean    @default(false)\n  otp             String?\n  otpExpiry       DateTime?\n  createdAt       DateTime   @default(now())\n  updatedAt       DateTime   @updatedAt\n\n  student  Student?\n  admins   Admin?\n  teachers Teacher?\n\n  @@map("users")\n}\n\nenum UserRole {\n  ADMIN\n  TEACHER\n  STUDENT\n}\n\nenum UserStatus {\n  ACTIVE\n  BLOCKED\n  DELETED\n}\n\n// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?\n// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"Admin":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"phoneNumber","kind":"scalar","type":"String"},{"name":"photoUrl","kind":"scalar","type":"String"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"AdminToUser"}],"dbName":"admins"},"CourseTeacher":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"courseId","kind":"scalar","type":"String"},{"name":"course","kind":"object","type":"Courses","relationName":"CourseTeacherToCourses"},{"name":"teacherId","kind":"scalar","type":"String"},{"name":"teacher","kind":"object","type":"Teacher","relationName":"CourseTeacherToTeacher"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"course_teachers"},"Courses":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"courseCode","kind":"scalar","type":"String"},{"name":"courseName","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"credits","kind":"scalar","type":"Float"},{"name":"semester","kind":"enum","type":"SemesterType"},{"name":"status","kind":"enum","type":"CourseStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"projectTheses","kind":"object","type":"ProjectThesis","relationName":"CoursesToProjectThesis"},{"name":"courseTeachers","kind":"object","type":"CourseTeacher","relationName":"CourseTeacherToCourses"}],"dbName":"courses"},"ProjectThesis":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"projectTitle","kind":"scalar","type":"String"},{"name":"abstract","kind":"scalar","type":"String"},{"name":"projectObjectives","kind":"scalar","type":"String"},{"name":"methodology","kind":"scalar","type":"String"},{"name":"expectedOutcomes","kind":"scalar","type":"String"},{"name":"technologiesTools","kind":"scalar","type":"String"},{"name":"estimatedTimeline","kind":"scalar","type":"String"},{"name":"attachments","kind":"scalar","type":"String"},{"name":"finalReport","kind":"scalar","type":"String"},{"name":"feedback","kind":"scalar","type":"String"},{"name":"type","kind":"enum","type":"ProjectThesisType"},{"name":"status","kind":"enum","type":"ProjectThesisStatus"},{"name":"courseId","kind":"scalar","type":"String"},{"name":"course","kind":"object","type":"Courses","relationName":"CoursesToProjectThesis"},{"name":"studentId","kind":"scalar","type":"String"},{"name":"student","kind":"object","type":"Student","relationName":"ProjectThesisToStudent"},{"name":"supervisorId","kind":"scalar","type":"String"},{"name":"supervisor","kind":"object","type":"Teacher","relationName":"ProjectThesisToTeacher"},{"name":"semester","kind":"enum","type":"SemesterType"},{"name":"evaluatedMark","kind":"scalar","type":"Float"},{"name":"obtainedMark","kind":"scalar","type":"Float"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"tasks","kind":"object","type":"Task","relationName":"ProjectThesisToTask"},{"name":"projectThesisUpdateLogs","kind":"object","type":"ProjectThesisUpdateLog","relationName":"ProjectThesisToProjectThesisUpdateLog"}],"dbName":"projectThesis"},"ProjectThesisUpdateLog":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"supervisorFeedback","kind":"scalar","type":"String"},{"name":"projectThesisId","kind":"scalar","type":"String"},{"name":"projectThesis","kind":"object","type":"ProjectThesis","relationName":"ProjectThesisToProjectThesisUpdateLog"},{"name":"taskId","kind":"scalar","type":"String"},{"name":"task","kind":"object","type":"Task","relationName":"ProjectThesisUpdateLogToTask"},{"name":"liveLink","kind":"scalar","type":"String"},{"name":"fileUrl","kind":"scalar","type":"String"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"project_thesis_update_logs"},"Student":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"phoneNumber","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"studentId","kind":"scalar","type":"String"},{"name":"registrationNumber","kind":"scalar","type":"String"},{"name":"profilePhoto","kind":"scalar","type":"String"},{"name":"dateOfBirth","kind":"scalar","type":"DateTime"},{"name":"session","kind":"scalar","type":"String"},{"name":"schoolName","kind":"scalar","type":"String"},{"name":"collageName","kind":"scalar","type":"String"},{"name":"semester","kind":"enum","type":"SemesterType"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"isApproved","kind":"scalar","type":"Boolean"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"StudentToUser"},{"name":"projectTheses","kind":"object","type":"ProjectThesis","relationName":"ProjectThesisToStudent"}],"dbName":"students"},"Task":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"dueDate","kind":"scalar","type":"DateTime"},{"name":"status","kind":"enum","type":"TaskStatus"},{"name":"ratting","kind":"scalar","type":"Int"},{"name":"feedback","kind":"scalar","type":"String"},{"name":"progressPercentage","kind":"scalar","type":"Int"},{"name":"projectThesisId","kind":"scalar","type":"String"},{"name":"projectThesis","kind":"object","type":"ProjectThesis","relationName":"ProjectThesisToTask"},{"name":"requirements","kind":"scalar","type":"String"},{"name":"referenceMaterials","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"projectThesisUpdateLogs","kind":"object","type":"ProjectThesisUpdateLog","relationName":"ProjectThesisUpdateLogToTask"}],"dbName":"tasks"},"Teacher":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"phoneNumber","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"photoUrl","kind":"scalar","type":"String"},{"name":"faculty","kind":"scalar","type":"String"},{"name":"department","kind":"enum","type":"Department"},{"name":"designation","kind":"enum","type":"TeacherDesignation"},{"name":"isChairman","kind":"scalar","type":"Boolean"},{"name":"joinedAt","kind":"scalar","type":"DateTime"},{"name":"status","kind":"enum","type":"TeacherStatus"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"TeacherToUser"},{"name":"projectTheses","kind":"object","type":"ProjectThesis","relationName":"ProjectThesisToTeacher"},{"name":"courseTeachers","kind":"object","type":"CourseTeacher","relationName":"CourseTeacherToTeacher"}],"dbName":"teachers"},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"role","kind":"enum","type":"UserRole"},{"name":"userStatus","kind":"enum","type":"UserStatus"},{"name":"isEmailVerified","kind":"scalar","type":"Boolean"},{"name":"otp","kind":"scalar","type":"String"},{"name":"otpExpiry","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"student","kind":"object","type":"Student","relationName":"StudentToUser"},{"name":"admins","kind":"object","type":"Admin","relationName":"AdminToUser"},{"name":"teachers","kind":"object","type":"Teacher","relationName":"TeacherToUser"}],"dbName":"users"}},"enums":{},"types":{}}');
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// generated/prisma/internal/prismaNamespace.ts
var prismaNamespace_exports = {};
__export(prismaNamespace_exports, {
  AdminScalarFieldEnum: () => AdminScalarFieldEnum,
  AnyNull: () => AnyNull2,
  CourseTeacherScalarFieldEnum: () => CourseTeacherScalarFieldEnum,
  CoursesScalarFieldEnum: () => CoursesScalarFieldEnum,
  DbNull: () => DbNull2,
  Decimal: () => Decimal2,
  JsonNull: () => JsonNull2,
  ModelName: () => ModelName,
  NullTypes: () => NullTypes2,
  NullsOrder: () => NullsOrder,
  PrismaClientInitializationError: () => PrismaClientInitializationError2,
  PrismaClientKnownRequestError: () => PrismaClientKnownRequestError2,
  PrismaClientRustPanicError: () => PrismaClientRustPanicError2,
  PrismaClientUnknownRequestError: () => PrismaClientUnknownRequestError2,
  PrismaClientValidationError: () => PrismaClientValidationError2,
  ProjectThesisScalarFieldEnum: () => ProjectThesisScalarFieldEnum,
  ProjectThesisUpdateLogScalarFieldEnum: () => ProjectThesisUpdateLogScalarFieldEnum,
  QueryMode: () => QueryMode,
  SortOrder: () => SortOrder,
  Sql: () => Sql2,
  StudentScalarFieldEnum: () => StudentScalarFieldEnum,
  TaskScalarFieldEnum: () => TaskScalarFieldEnum,
  TeacherScalarFieldEnum: () => TeacherScalarFieldEnum,
  TransactionIsolationLevel: () => TransactionIsolationLevel,
  UserScalarFieldEnum: () => UserScalarFieldEnum,
  defineExtension: () => defineExtension,
  empty: () => empty2,
  getExtensionContext: () => getExtensionContext,
  join: () => join2,
  prismaVersion: () => prismaVersion,
  raw: () => raw2,
  sql: () => sql
});
import * as runtime2 from "@prisma/client/runtime/client";
var PrismaClientKnownRequestError2 = runtime2.PrismaClientKnownRequestError;
var PrismaClientUnknownRequestError2 = runtime2.PrismaClientUnknownRequestError;
var PrismaClientRustPanicError2 = runtime2.PrismaClientRustPanicError;
var PrismaClientInitializationError2 = runtime2.PrismaClientInitializationError;
var PrismaClientValidationError2 = runtime2.PrismaClientValidationError;
var sql = runtime2.sqltag;
var empty2 = runtime2.empty;
var join2 = runtime2.join;
var raw2 = runtime2.raw;
var Sql2 = runtime2.Sql;
var Decimal2 = runtime2.Decimal;
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var prismaVersion = {
  client: "7.3.0",
  engine: "9d6ad21cbbceab97458517b147a6a09ff43aa735"
};
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var DbNull2 = runtime2.DbNull;
var JsonNull2 = runtime2.JsonNull;
var AnyNull2 = runtime2.AnyNull;
var ModelName = {
  Admin: "Admin",
  CourseTeacher: "CourseTeacher",
  Courses: "Courses",
  ProjectThesis: "ProjectThesis",
  ProjectThesisUpdateLog: "ProjectThesisUpdateLog",
  Student: "Student",
  Task: "Task",
  Teacher: "Teacher",
  User: "User"
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var AdminScalarFieldEnum = {
  id: "id",
  email: "email",
  name: "name",
  phoneNumber: "phoneNumber",
  photoUrl: "photoUrl",
  isDeleted: "isDeleted",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var CourseTeacherScalarFieldEnum = {
  id: "id",
  courseId: "courseId",
  teacherId: "teacherId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var CoursesScalarFieldEnum = {
  id: "id",
  courseCode: "courseCode",
  courseName: "courseName",
  description: "description",
  credits: "credits",
  semester: "semester",
  status: "status",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ProjectThesisScalarFieldEnum = {
  id: "id",
  projectTitle: "projectTitle",
  abstract: "abstract",
  projectObjectives: "projectObjectives",
  methodology: "methodology",
  expectedOutcomes: "expectedOutcomes",
  technologiesTools: "technologiesTools",
  estimatedTimeline: "estimatedTimeline",
  attachments: "attachments",
  finalReport: "finalReport",
  feedback: "feedback",
  type: "type",
  status: "status",
  courseId: "courseId",
  studentId: "studentId",
  supervisorId: "supervisorId",
  semester: "semester",
  evaluatedMark: "evaluatedMark",
  obtainedMark: "obtainedMark",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ProjectThesisUpdateLogScalarFieldEnum = {
  id: "id",
  supervisorFeedback: "supervisorFeedback",
  projectThesisId: "projectThesisId",
  taskId: "taskId",
  liveLink: "liveLink",
  fileUrl: "fileUrl",
  updatedAt: "updatedAt"
};
var StudentScalarFieldEnum = {
  id: "id",
  email: "email",
  name: "name",
  phoneNumber: "phoneNumber",
  address: "address",
  studentId: "studentId",
  registrationNumber: "registrationNumber",
  profilePhoto: "profilePhoto",
  dateOfBirth: "dateOfBirth",
  session: "session",
  schoolName: "schoolName",
  collageName: "collageName",
  semester: "semester",
  status: "status",
  isApproved: "isApproved",
  isDeleted: "isDeleted",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var TaskScalarFieldEnum = {
  id: "id",
  title: "title",
  description: "description",
  dueDate: "dueDate",
  status: "status",
  ratting: "ratting",
  feedback: "feedback",
  progressPercentage: "progressPercentage",
  projectThesisId: "projectThesisId",
  requirements: "requirements",
  referenceMaterials: "referenceMaterials",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var TeacherScalarFieldEnum = {
  id: "id",
  email: "email",
  name: "name",
  phoneNumber: "phoneNumber",
  address: "address",
  photoUrl: "photoUrl",
  faculty: "faculty",
  department: "department",
  designation: "designation",
  isChairman: "isChairman",
  joinedAt: "joinedAt",
  status: "status",
  isDeleted: "isDeleted",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var UserScalarFieldEnum = {
  id: "id",
  email: "email",
  password: "password",
  role: "role",
  userStatus: "userStatus",
  isEmailVerified: "isEmailVerified",
  otp: "otp",
  otpExpiry: "otpExpiry",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SortOrder = {
  asc: "asc",
  desc: "desc"
};
var QueryMode = {
  default: "default",
  insensitive: "insensitive"
};
var NullsOrder = {
  first: "first",
  last: "last"
};
var defineExtension = runtime2.Extensions.defineExtension;

// generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/lib/prisma.ts
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/app/modules/dashboardData/dashboardData.service.ts
var getAdminDashboardData = async () => {
  const totalStudents = await prisma.student.count({
    where: { isDeleted: false }
  });
  const totalTeachers = await prisma.teacher.count({
    where: { isDeleted: false }
  });
  const totalCourses = await prisma.courses.count({
    where: { status: "ACTIVE" }
  });
  const totalProjectTheses = await prisma.projectThesis.count({
    where: { status: ProjectThesisStatus.in_PROGRESS }
  });
  const pendingProposals = await prisma.projectThesis.count({
    where: { status: ProjectThesisStatus.PENDING }
  });
  const projectStatusCounts = await prisma.projectThesis.groupBy({
    by: ["status"],
    _count: {
      status: true
    }
  });
  const projectDepartments = await prisma.projectThesis.findMany({
    select: {
      supervisor: true
    }
  });
  const pieChartData = projectStatusCounts.map((item) => ({
    name: item.status,
    value: item._count.status
  }));
  const deptCounts = {};
  const deptAcronymMap = {
    Computer_Science_And_Engineering: "CSE",
    Computer_Science_And_Information_Technology: "CSIT",
    Electrical_And_Electronic_Engineering: "EEE",
    Civil_Engineering: "CE",
    Business_Administration: "BBA"
  };
  projectDepartments.forEach((project) => {
    const enumDept = project.supervisor?.department;
    if (enumDept) {
      const shortName = deptAcronymMap[enumDept] || enumDept;
      deptCounts[shortName] = (deptCounts[shortName] || 0) + 1;
    }
  });
  const barChartData = Object.entries(deptCounts).map(([key, value]) => ({
    department: key,
    count: value
  }));
  return {
    counts: {
      totalStudents,
      totalTeachers,
      totalCourses,
      totalProjectTheses,
      pendingProposals
    },
    charts: {
      pieChartData,
      barChartData
    }
  };
};
var teacherDashboardData = async (email) => {
  const isTeacherExist = await prisma.teacher.findUniqueOrThrow({
    where: { email }
  });
  const teacherId = isTeacherExist.id;
  const [
    totalActiveProjects,
    pendingRequests,
    completedProjects,
    projectStatusCounts,
    recentProposals
  ] = await Promise.all([
    prisma.projectThesis.count({
      where: {
        supervisorId: teacherId,
        status: ProjectThesisStatus.in_PROGRESS
      }
    }),
    prisma.projectThesis.count({
      where: {
        supervisorId: teacherId,
        status: ProjectThesisStatus.PENDING
      }
    }),
    prisma.projectThesis.count({
      where: {
        supervisorId: teacherId,
        status: ProjectThesisStatus.COMPLETED
      }
    }),
    prisma.projectThesis.groupBy({
      by: ["status"],
      where: {
        supervisorId: teacherId
      },
      _count: {
        status: true
      }
    }),
    prisma.projectThesis.findMany({
      where: {
        supervisorId: teacherId,
        status: ProjectThesisStatus.PENDING
      },
      take: 5,
      orderBy: {
        createdAt: "desc"
      },
      select: {
        id: true,
        projectTitle: true,
        createdAt: true,
        student: {
          select: { name: true, id: true }
        }
      }
    })
  ]);
  const pieChartData = projectStatusCounts.map((item) => ({
    name: item.status,
    value: item._count.status
  }));
  const recentProposalsData = recentProposals.map((prop) => ({
    id: prop.id,
    title: prop.projectTitle,
    date: prop.createdAt,
    studentName: prop.student?.name || "N/A"
  }));
  return {
    counts: {
      totalActiveProjects,
      pendingRequests,
      completedProjects
    },
    charts: {
      pieChartData
    },
    tables: {
      recentProposals: recentProposalsData
    }
  };
};
var studentDashboardData = async (email) => {
  console.log(email);
  const student = await prisma.student.findUniqueOrThrow({
    where: { email }
  });
  const studentId = student.id;
  const myProject = await prisma.projectThesis.findFirst({
    where: {
      studentId
    },
    include: {
      supervisor: {
        select: {
          name: true,
          email: true,
          department: true,
          designation: true
        }
      },
      tasks: {
        select: {
          id: true,
          status: true
        }
      }
    }
  });
  if (!myProject) {
    return {
      hasProject: false,
      message: "You haven't submitted any proposal yet."
    };
  }
  const totalTasks = myProject.tasks.length;
  const completedTasks = myProject.tasks.filter(
    (t) => t.status === "DONE"
  ).length;
  const progressPercentage = totalTasks === 0 ? 0 : Math.round(
    myProject.tasks.reduce(
      (acc, t) => acc + (t.progressPercentage ?? t.ratting ?? 0),
      0
    ) / totalTasks
  );
  const pendingTasksCount = totalTasks - completedTasks;
  return {
    hasProject: true,
    overview: {
      projectTitle: myProject.projectTitle,
      status: myProject.status,
      progress: progressPercentage,
      totalTasks,
      completedTasks,
      pendingTasksCount
    },
    supervisor: {
      name: myProject.supervisor?.name || "Not Assigned",
      email: myProject.supervisor?.email,
      designation: myProject.supervisor?.designation
    },
    recentTasks: await prisma.task.findMany({
      where: { projectThesisId: myProject.id },
      take: 3,
      orderBy: { createdAt: "desc" },
      select: { title: true, status: true, dueDate: true }
    })
  };
};
var DashboardService = {
  getAdminDashboardData,
  teacherDashboardData,
  studentDashboardData
};

// src/shared/responser.ts
var sendResponse = (res, statusCode, message, result) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data: result
  });
};

// src/app/modules/dashboardData/dashboardData.controller.ts
var getAdminDashboardData2 = catchAsync(
  async (req, res) => {
    const result = await DashboardService.getAdminDashboardData();
    sendResponse(res, 200, "Dashboard data retrieved successfully", result);
  }
);
var getTeacherDashboardData = catchAsync(
  async (req, res) => {
    const user = req.user;
    const result = await DashboardService.teacherDashboardData(
      user.email
    );
    sendResponse(res, 200, "Dashboard data retrieved successfully", result);
  }
);
var getStudentDashboardData = catchAsync(
  async (req, res) => {
    const user = req.user;
    const result = await DashboardService.studentDashboardData(
      user.email
    );
    sendResponse(res, 200, "Dashboard data retrieved successfully", result);
  }
);
var DashboardDataController = {
  getAdminDashboardData: getAdminDashboardData2,
  getTeacherDashboardData,
  getStudentDashboardData
};

// src/shared/jwtGenerator.ts
import jwt from "jsonwebtoken";
var jwtGenerator = ({ userInfo, createSecretKey, expiresIn }) => {
  const token = jwt.sign({ email: userInfo.email, role: userInfo.role }, createSecretKey, { expiresIn });
  return token;
};
var jwtVerifier = ({ token, secretKey }) => {
  const decoded = jwt.verify(token, secretKey);
  return decoded;
};

// src/config/index.ts
import dotenv from "dotenv";
import path2 from "path";
dotenv.config({ path: path2.join(process.cwd(), ".env") });
var config2 = {
  node_env: process.env.NODE_ENV || "development",
  port: process.env.PORT || 5e3,
  salt_rounds: process.env.SALT_ROUNDS,
  email: process.env.EMAIL,
  email_password: process.env.EMAIL_PASSWORD,
  email_host: process.env.EMAIL_HOST,
  email_port: process.env.EMAIL_PORT,
  jwt: {
    token_secret: process.env.TOKEN_SECRET,
    token_expires_in: process.env.TOKEN_EXPIRES_IN,
    refresh_token_secret: process.env.REFRESH_TOKEN_SECRET,
    refresh_token_expires_in: process.env.REFRESH_TOKEN_EXPIRES_IN,
    email_verification_token: process.env.EMAIL_VERIFICATION_TOKEN,
    email_verification_token_expires_in: process.env.EMAIL_VERIFICATION_TOKEN_EXPIRES_IN
  }
};

// src/app/errors/appErrors.ts
var AppError = class extends Error {
  statusCode;
  constructor(statusCode, message, stack) {
    super(message);
    this.statusCode = statusCode;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
};
var appErrors_default = AppError;

// src/app/middlewares/auth.ts
var auth = (...roles) => {
  return async (req, res, next) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        throw new appErrors_default(401, "Invalid signature");
      }
      const bearerToken = token.split(" ")[1];
      let decoded;
      try {
        decoded = jwtVerifier({
          token: bearerToken,
          secretKey: config2.jwt.token_secret
        });
      } catch (err) {
        if (err.name === "TokenExpiredError") {
          throw new appErrors_default(401, "Access token expired");
        }
        if (err.name === "JsonWebTokenError") {
          throw new appErrors_default(401, "Invalid token");
        }
        throw new appErrors_default(401, "Unauthorized");
      }
      const user = await prisma.user.findUnique({
        where: {
          email: decoded.email,
          userStatus: UserStatus.ACTIVE
        }
      });
      if (!user) {
        throw new appErrors_default(404, "User not found");
      }
      if (roles.length && !roles.includes(user.role)) {
        throw new appErrors_default(403, "You are not authorized to access this route");
      }
      req.user = decoded;
      next();
    } catch (error) {
      next(error);
    }
  };
};
var auth_default = auth;

// src/app/modules/dashboardData/dashboardData.router.ts
var router = express.Router();
router.get(
  "/admin",
  auth_default(UserRole.ADMIN),
  DashboardDataController.getAdminDashboardData
);
router.get(
  "/teacher",
  auth_default(UserRole.TEACHER),
  DashboardDataController.getTeacherDashboardData
);
router.get(
  "/student",
  auth_default(UserRole.STUDENT),
  DashboardDataController.getStudentDashboardData
);
var DashboardDataRoutes = router;

// src/app.ts
import express11 from "express";

// src/app/modules/student/student.route.ts
import express2 from "express";

// src/shared/searching.ts
var searching = (inputFilter, searchFields, searchTerm) => {
  const orConditions = searchFields.map((field) => {
    if (field.includes(".")) {
      const parts = field.split(".");
      let currentStructure = {
        contains: String(searchTerm),
        mode: "insensitive"
      };
      for (let i = parts.length - 1; i >= 0; i--) {
        const key = parts[i];
        currentStructure = { [key]: currentStructure };
      }
      return currentStructure;
    }
    return { [field]: { contains: String(searchTerm), mode: "insensitive" } };
  });
  return inputFilter.push({ OR: orConditions });
};

// src/shared/filtering.ts
var filtering = (inputFilter, filterData) => {
  const filterConditions = Object.keys(filterData).map((key) => {
    let value = filterData[key];
    if (typeof value === "string" && value.includes(",")) {
      value = value.split(",");
    }
    if (value === "true") {
      value = true;
    } else if (value === "false") {
      value = false;
    }
    const isArray = Array.isArray(value);
    const filterCondition = isArray ? { in: value } : { equals: value };
    if (key.includes(".")) {
      const parts = key.split(".");
      let nestedFilter = filterCondition;
      for (let i = parts.length - 1; i >= 0; i--) {
        const partKey = parts[i];
        nestedFilter = { [partKey]: nestedFilter };
      }
      return nestedFilter;
    }
    return { [key]: filterCondition };
  });
  if (filterConditions.length > 0) {
    inputFilter.push({ AND: filterConditions });
  }
};

// src/shared/pagination.ts
var pagination = (skip = 0, take, sortBy, sortOrder) => {
  const currentPage = Number(skip) ? Number(skip) + 1 : 1;
  const takeValue = Number(take) || 10;
  const skipValue = Number(skip) * takeValue || 0;
  const sortByField = sortBy || "createdAt";
  const sortOrderValue = sortOrder || "desc";
  return {
    currentPage,
    skipValue,
    takeValue,
    sortByField,
    sortOrderValue
  };
};

// src/app/modules/student/student.service.ts
var getAllStudentFromDB = async (query) => {
  const { searchTerm, skip, take, sortBy, sortOrder, ...filterData } = query;
  const searchFields = [
    "name",
    "email",
    "address",
    "studentId",
    "registrationNumber"
  ];
  let inputFilter = [];
  if (searchTerm) {
    searching(inputFilter, searchFields, searchTerm);
  }
  if (Object.keys(filterData).length > 0) {
    filtering(inputFilter, filterData);
  }
  const { currentPage, skipValue, takeValue, sortByField, sortOrderValue } = pagination(Number(skip), Number(take), sortBy, sortOrder);
  const whereCondition = { AND: inputFilter };
  const students = await prisma.student.findMany({
    where: whereCondition,
    skip: skipValue,
    take: takeValue,
    orderBy: { [sortByField]: sortOrderValue }
  });
  const total = await prisma.student.count({ where: whereCondition });
  const totalPages = Math.ceil(total / takeValue);
  return {
    meta: {
      currentPage,
      limit: takeValue,
      total,
      totalPages
    },
    data: students
  };
};
var getSingleStudentFromDB = async (id) => {
  const student = await prisma.student.findUniqueOrThrow({
    where: { id }
  });
  return student;
};
var updateStudentIntoDB = async (id, updateData) => {
  const isStudentExist = await prisma.student.findUniqueOrThrow({
    where: { id }
  });
  if (isStudentExist) {
    const updateStudent = await prisma.student.update({
      where: { id: isStudentExist.id },
      data: updateData
    });
    return updateStudent;
  }
};
var deleteStudentFromDB = async (id) => {
  const isStudentExist = await prisma.student.findUniqueOrThrow({
    where: { id }
  });
  if (isStudentExist.isDeleted) {
    throw new Error("Student already deleted");
  }
  const isUserExist = await prisma.user.findUniqueOrThrow({
    where: { email: isStudentExist.email }
  });
  if (isUserExist.userStatus === UserStatus.DELETED) {
    throw new Error("User already deleted");
  }
  if (isStudentExist) {
    await prisma.$transaction(async (transactionClient) => {
      await transactionClient.student.update({
        where: { id: isStudentExist.id },
        data: { isDeleted: true }
      });
      await transactionClient.user.updateMany({
        where: { email: isStudentExist.email },
        data: { userStatus: UserStatus.DELETED }
      });
    });
  }
  return null;
};
var approveStudentInDB = async (id) => {
  const isStudentExist = await prisma.student.findUnique({
    where: { id }
  });
  if (!isStudentExist) {
    throw new appErrors_default(404, "Student not found");
  }
  if (isStudentExist.isApproved) {
    throw new appErrors_default(400, "Student already approved");
  }
  if (isStudentExist.isDeleted) {
    throw new appErrors_default(400, "Deleted student cannot be approved");
  }
  const approvedStudent = await prisma.student.update({
    where: { id: isStudentExist.id },
    data: { isApproved: true }
  });
  return approvedStudent;
};
var reActivateStudentInDB = async (id) => {
  const isStudentExist = await prisma.student.findUnique({
    where: { id }
  });
  if (!isStudentExist) {
    throw new appErrors_default(404, "Student not found");
  }
  if (!isStudentExist.isDeleted) {
    throw new appErrors_default(400, "Account is already active");
  }
  const isUserExist = await prisma.user.findUnique({
    where: { email: isStudentExist.email }
  });
  if (!isUserExist) {
    throw new appErrors_default(404, "User not found");
  }
  if (isUserExist.userStatus !== UserStatus.DELETED) {
    throw new appErrors_default(400, "User account is already active");
  }
  const reActivatedStudent = await prisma.$transaction(
    async (transactionClient) => {
      const student = await transactionClient.student.update({
        where: { id: isStudentExist.id },
        data: { isDeleted: false }
      });
      const user = await transactionClient.user.updateMany({
        where: { email: isStudentExist.email },
        data: { userStatus: UserStatus.ACTIVE }
      });
      return { student, user };
    }
  );
  return reActivatedStudent;
};
var generateReportForStudent = async (query) => {
  const { searchTerm, skip, take, sortBy, sortOrder, ...filterData } = query;
  let inputFilter = [];
  if (searchTerm) {
    const searchFields = [
      "name",
      "email",
      "address",
      "studentId",
      "registrationNumber"
    ];
    searching(inputFilter, searchFields, searchTerm);
  }
  if (Object.keys(filterData).length > 0) {
    filtering(inputFilter, filterData);
  }
  const whereCondition = { AND: inputFilter };
  const { currentPage, skipValue, takeValue, sortByField, sortOrderValue } = pagination(skip, take, sortBy, sortOrder);
  const students = await prisma.student.findMany({
    where: whereCondition,
    orderBy: { [sortBy || "name"]: sortOrder === "desc" ? "desc" : "asc" }
  });
  const total = await prisma.student.count({ where: whereCondition });
  const totalPages = Math.ceil(total / (takeValue || total));
  return {
    meta: {
      currentPage,
      limit: takeValue,
      total,
      totalPages
    },
    data: students
  };
};
var StudentService = {
  getAllStudentFromDB,
  updateStudentIntoDB,
  getSingleStudentFromDB,
  deleteStudentFromDB,
  approveStudentInDB,
  reActivateStudentInDB,
  generateReportForStudent
};

// src/shared/pdfService.ts
import path3 from "path";
import fs from "fs-extra";
import hbs from "handlebars";
import { fileURLToPath as fileURLToPath2 } from "url";
var __filename = fileURLToPath2(import.meta.url);
var __dirname = path3.dirname(__filename);
var getBase64FromUrl = async (url) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5e3);
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (!response.ok) return "";
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer).toString("base64");
  } catch (error) {
    console.error("Error fetching logo:", error);
    return "";
  }
};
var generatePdf = async (templateName, data) => {
  let browser = null;
  try {
    if (process.env.VERCEL || process.env.NODE_ENV === "production") {
      const chromium = (await import("@sparticuz/chromium")).default;
      const puppeteerCore = (await import("puppeteer-core")).default;
      browser = await puppeteerCore.launch({
        args: chromium.args,
        executablePath: await chromium.executablePath(),
        headless: true
      });
    } else {
      const puppeteer = (await import("puppeteer")).default;
      try {
        browser = await puppeteer.launch({
          channel: "chrome",
          headless: true,
          args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-gpu",
            "--disable-web-security"
          ]
        });
      } catch (chromeLaunchErr) {
        console.warn("Could not launch system Chrome, trying bundled Chromium...", chromeLaunchErr);
        browser = await puppeteer.launch({
          headless: true,
          args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-gpu",
            "--disable-web-security"
          ]
        });
      }
    }
    const page = await browser.newPage();
    const logoUrl = "https://res.cloudinary.com/dwduymu1l/image/upload/v1769187917/Patuakhali_Science_and_Technology_University_logo_rv2zwu.png";
    const base64Logo = await getBase64FromUrl(logoUrl);
    const logoTag = base64Logo ? `<img src="data:image/png;base64,${base64Logo}" style="width: 50px; height: 50px; margin-bottom: 5px;" />` : "";
    let templatePath = path3.join(
      process.cwd(),
      "src",
      "templates",
      templateName
    );
    if (!await fs.pathExists(templatePath)) {
      templatePath = path3.join(__dirname, "../templates", templateName);
    }
    if (!await fs.pathExists(templatePath)) {
      templatePath = path3.join(__dirname, "../../src/templates", templateName);
    }
    if (!await fs.pathExists(templatePath)) {
      throw new Error(`Template file not found: ${templateName}`);
    }
    const content = await fs.readFile(templatePath, "utf-8");
    const template = hbs.compile(content);
    const html = template(data);
    await page.setContent(html, {
      waitUntil: "domcontentloaded",
      timeout: 6e4
    });
    const headerTemplate = `
            <div style="width: 100%; text-align: center; border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-bottom: 0;">
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
                    ${logoTag}
                    <div style="text-align: center;">
                        <h2 style="margin: 0; font-size: 16px; color: #003366; font-family: Helvetica, sans-serif; font-weight: bold;">Patuakhali Science and Technology University</h2>
                        <span style="font-size: 10px; color: #555; font-family: Helvetica, sans-serif;">Dumki, Patuakhali-8602, Bangladesh</span>
                    </div>
                </div>
            </div>
        `;
    const footerTemplate = `
            <div style="font-size: 8px; width: 100%; text-align: center; border-top: 1px solid #ddd; padding-top: 5px; color: #777; font-family: sans-serif;">
                Page <span class="pageNumber"></span> of <span class="totalPages"></span>
            </div>
        `;
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate,
      footerTemplate,
      margin: {
        top: "120px",
        bottom: "50px",
        left: "20px",
        right: "20px"
      }
    });
    return Buffer.from(pdfBuffer);
  } catch (error) {
    console.error(`\u274C Error generating PDF for template ${templateName}:`, error);
    throw error;
  } finally {
    if (browser) {
      await browser.close().catch(() => {
      });
    }
  }
};

// src/app/modules/student/student.controller.ts
var getAllStudentFromDB2 = catchAsync(async (req, res) => {
  const query = req.query;
  const result = await StudentService.getAllStudentFromDB(query);
  sendResponse(res, 200, "Students retrieved successfully", result);
});
var getSingleStudentFromDB2 = catchAsync(
  async (req, res) => {
    const id = req.params.id;
    const result = await StudentService.getSingleStudentFromDB(id);
    sendResponse(res, 200, "Student retrieved successfully", result);
  }
);
var updateStudentIntoDB2 = catchAsync(async (req, res) => {
  const studentId = req.params.id;
  const updateData = req.body;
  const result = await StudentService.updateStudentIntoDB(
    studentId,
    updateData
  );
  sendResponse(res, 200, "Student updated successfully", result);
});
var deleteStudentFromDB2 = catchAsync(async (req, res) => {
  const studentId = req.params.id;
  const result = await StudentService.deleteStudentFromDB(studentId);
  sendResponse(res, 200, "Student deleted successfully", result);
});
var approveStudentInDB2 = catchAsync(async (req, res) => {
  const studentId = req.params.id;
  const result = await StudentService.approveStudentInDB(studentId);
  sendResponse(res, 200, "Student approved successfully", result);
});
var reActivateStudentInDB2 = catchAsync(
  async (req, res) => {
    const studentId = req.params.id;
    const result = await StudentService.reActivateStudentInDB(
      studentId
    );
    sendResponse(res, 200, "Student re-activated successfully", result);
  }
);
var generateReportForStudent2 = catchAsync(
  async (req, res) => {
    const result = await StudentService.generateReportForStudent(req.query);
    const pdfContext = {
      generatedDate: (/* @__PURE__ */ new Date()).toLocaleDateString(),
      students: result.data,
      meta: result.meta
    };
    const pdfBuffer = await generatePdf(
      "all-students-report.hbs",
      pdfContext
    );
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="all-students-report.pdf"`,
      "Content-Length": pdfBuffer.length,
      "Cache-Control": "no-cache"
    });
    res.end(pdfBuffer);
  }
);
var StudentController = {
  getAllStudentFromDB: getAllStudentFromDB2,
  updateStudentIntoDB: updateStudentIntoDB2,
  getSingleStudentFromDB: getSingleStudentFromDB2,
  deleteStudentFromDB: deleteStudentFromDB2,
  approveStudentInDB: approveStudentInDB2,
  reActivateStudentInDB: reActivateStudentInDB2,
  generateReportForStudent: generateReportForStudent2
};

// src/app/modules/student/student.route.ts
var router2 = express2.Router();
router2.get(
  "/",
  auth_default(UserRole.TEACHER, UserRole.ADMIN),
  StudentController.getAllStudentFromDB
);
router2.get(
  "/generate-report",
  auth_default(UserRole.ADMIN, UserRole.TEACHER),
  StudentController.generateReportForStudent
);
router2.get(
  "/:id",
  auth_default(UserRole.ADMIN, UserRole.STUDENT, UserRole.TEACHER),
  StudentController.getSingleStudentFromDB
);
router2.patch(
  "/:id",
  auth_default(UserRole.ADMIN, UserRole.STUDENT),
  StudentController.updateStudentIntoDB
);
router2.patch(
  "/delete-student/:id",
  auth_default(UserRole.ADMIN),
  StudentController.deleteStudentFromDB
);
router2.patch(
  "/approve-student/:id",
  auth_default(UserRole.ADMIN),
  StudentController.approveStudentInDB
);
router2.patch(
  "/re-activate-student/:id",
  auth_default(UserRole.ADMIN),
  StudentController.reActivateStudentInDB
);
var StudentRoutes = router2;

// src/app/modules/user/user.route.ts
import express3 from "express";

// src/app/modules/user/user.service.ts
import bcrypt from "bcrypt";

// src/shared/mailSender.ts
import nodemailer from "nodemailer";
var transporter = nodemailer.createTransport({
  host: config2.email_host,
  port: Number(config2.email_port),
  secure: false,
  auth: {
    user: config2.email,
    pass: config2.email_password
  }
});
var sendEmail = async (options) => {
  await transporter.sendMail({
    from: `"Department of CSIT" <${config2.email}>`,
    to: options.to,
    subject: options.subject,
    html: options.html
  });
};
var mailSender_default = sendEmail;

// src/utils/emailTemplates/verifyEmailTemplate.ts
var verifyEmailTemplate = (verifyUrl) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            /* Responsive styles for mobile */
            @media only screen and (max-width: 600px) {
                .container { width: 100% !important; }
                .button { width: 100% !important; display: block !important; text-align: center !important; }
            }
        </style>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f7; margin: 0; padding: 0;">
        
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f4f7; padding: 20px;">
            <tr>
                <td align="center">
                    
                    <table border="0" cellpadding="0" cellspacing="0" width="600" class="container" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.05); overflow: hidden;">
                        
                        <tr>
                            <td style="background-color: #2c3e50; padding: 20px; text-align: center; color: #ffffff; font-size: 24px; font-weight: bold;">
                                Department of Computer Science & Information Technology
                            </td>
                        </tr>

                        <tr>
                            <td style="padding: 40px 30px; text-align: left; color: #333333;">
                                <h2 style="margin: 0 0 20px 0; font-size: 20px; color: #2c3e50;">Hello,</h2>
                                <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.5;">
                                    Thank you for registering with the University Thesis & Project Management System. 
                                    To activate your account and access your dashboard, please verify your email address.
                                </p>
                                
                                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 30px 0;">
                                    <tr>
                                        <td align="center">
                                            <a href="${verifyUrl}" class="button" style="background-color: #3b82f6; color: #ffffff; padding: 14px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px; display: inline-block;">
                                                Verify Now
                                            </a>
                                        </td>
                                    </tr>
                                </table>

                                <p style="margin: 0 0 10px 0; font-size: 14px; color: #666666;">
                                    This link will expire in 24 hours. If you did not create an account, you can safely ignore this email.
                                </p>
                            </td>
                        </tr>

                        <tr>
                            <td style="background-color: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #999999; border-top: 1px solid #eeeeee;">
                                <p style="margin: 0 0 10px 0;">Button not working? Copy and paste the link below into your browser:</p>
                                <p style="margin: 0; word-break: break-all;">
                                    <a href="${verifyUrl}" style="color: #3b82f6;">${verifyUrl}</a>
                                </p>
                                <br>
                                <p style="margin: 0;">&copy; ${(/* @__PURE__ */ new Date()).getFullYear()} University Project System. All rights reserved.</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>

    </body>
    </html>
    `;
};

// src/app/modules/user/user.service.ts
var verifyEmail = async (info) => {
  const generateEmailVerificationToken = jwtGenerator({
    userInfo: { email: info.email, role: info.role },
    createSecretKey: config2.jwt.email_verification_token,
    expiresIn: config2.jwt.email_verification_token_expires_in
  });
  const verifyUrl = `http://localhost:3000/verify-email?token=${generateEmailVerificationToken}&email=${info.email}`;
  await mailSender_default({
    to: info.email,
    subject: "Email Verification",
    html: verifyEmailTemplate(verifyUrl)
  });
};
var createStudentIntoDB = async (studentInfo) => {
  const hashedPassword = await bcrypt.hash(
    studentInfo.password,
    Number(config2.salt_rounds)
  );
  const userData = {
    email: studentInfo.email,
    password: hashedPassword,
    role: UserRole.STUDENT
  };
  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({ data: userData });
    const student = await transactionClient.student.create({
      data: studentInfo.student
    });
    return student;
  });
  const info = {
    email: studentInfo.email,
    role: UserRole.STUDENT
  };
  await verifyEmail(info);
  return result;
};
var createAdminIntoDB = async (adminInfo) => {
  const hashedPassword = await bcrypt.hash(
    adminInfo.password,
    Number(config2.salt_rounds)
  );
  const userData = {
    email: adminInfo.email,
    password: hashedPassword,
    role: UserRole.ADMIN
  };
  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: userData
    });
    const createAdmin = await transactionClient.admin.create({
      data: adminInfo.admin
    });
    return createAdmin;
  });
  const info = {
    email: adminInfo.email,
    role: UserRole.ADMIN
  };
  await verifyEmail(info);
  return result;
};
var createTeacherIntoDB = async (teacherInfo) => {
  const hashedPassword = await bcrypt.hash(
    teacherInfo.password,
    Number(config2.salt_rounds)
  );
  const userData = {
    email: teacherInfo.email,
    password: hashedPassword,
    role: UserRole.TEACHER
  };
  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: userData
    });
    const createTeacher = await transactionClient.teacher.create({
      data: teacherInfo.teacher
    });
    return createTeacher;
  });
  const info = {
    email: teacherInfo.email,
    role: UserRole.TEACHER
  };
  await verifyEmail(info);
  return result;
};
var verifyEmailInDB = async (token, email) => {
  if (!token) {
    throw new Error("Token is required");
  }
  const decoded = jwtVerifier({
    token,
    secretKey: config2.jwt.email_verification_token
  });
  if (decoded.email !== email) {
    throw new Error("Invalid token");
  }
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error("User not found");
  }
  const result = await prisma.user.update({
    where: { email },
    data: { isEmailVerified: true }
  });
  return result;
};
var UserService = {
  createStudentIntoDB,
  createAdminIntoDB,
  createTeacherIntoDB,
  verifyEmailInDB
};

// src/app/modules/user/user.controller.ts
var createStudentIntoDB2 = catchAsync(async (req, res) => {
  const result = await UserService.createStudentIntoDB(req.body);
  sendResponse(res, 201, "Account created successfully. Please check your email for email verification.", result);
});
var createAdminIntoDB2 = catchAsync(async (req, res) => {
  const result = await UserService.createAdminIntoDB(req.body);
  sendResponse(res, 201, "Admin created successfully. Please check your email for email verification.", result);
});
var createTeacherIntoDB2 = catchAsync(async (req, res) => {
  const result = await UserService.createTeacherIntoDB(req.body);
  sendResponse(res, 201, "Teacher created successfully. Please check your email for email verification.", result);
});
var verifyEmail2 = catchAsync(async (req, res) => {
  const { token, email } = req.body;
  const result = await UserService.verifyEmailInDB(token, email);
  sendResponse(res, 200, "Email verified successfully", result);
});
var UserController = {
  createStudentIntoDB: createStudentIntoDB2,
  createAdminIntoDB: createAdminIntoDB2,
  createTeacherIntoDB: createTeacherIntoDB2,
  verifyEmail: verifyEmail2
};

// src/app/modules/user/user.route.ts
var router3 = express3.Router();
router3.post("/create-student", UserController.createStudentIntoDB);
router3.post(
  "/create-admin",
  auth_default(UserRole.ADMIN),
  UserController.createAdminIntoDB
);
router3.post(
  "/create-teacher",
  auth_default(UserRole.ADMIN),
  UserController.createTeacherIntoDB
);
router3.post("/verify-email", UserController.verifyEmail);
var UserRoutes = router3;

// src/app/modules/admin/admin.route.ts
import express4 from "express";

// src/app/modules/admin/admin.service.ts
var getAllAdminFromDB = async (query) => {
  const { searchTerm, skip, take, sortBy, sortOrder, ...filterData } = query;
  const searchFields = ["name", "email"];
  let inputFilter = [];
  if (searchTerm) {
    searching(inputFilter, searchFields, searchTerm);
  }
  if (Object.keys(filterData).length > 0) {
    filtering(inputFilter, filterData);
  }
  const { currentPage, skipValue, takeValue, sortByField, sortOrderValue } = pagination(Number(skip), Number(take), sortBy, sortOrder);
  const whereCondition = { AND: inputFilter };
  const admins = await prisma.admin.findMany({ where: whereCondition, skip: skipValue, take: takeValue, orderBy: { [sortByField]: sortOrderValue } });
  const total = await prisma.admin.count({ where: whereCondition });
  const totalPages = Math.ceil(total / takeValue);
  return {
    meta: {
      currentPage,
      limit: takeValue,
      total,
      totalPages
    },
    data: admins
  };
};
var getSingleAdminFromDB = async (id) => {
  const admin = await prisma.admin.findUniqueOrThrow({
    where: { id }
  });
  return admin;
};
var updateAdminIntoDB = async (id, updateData) => {
  const isAdminExist = await prisma.admin.findUniqueOrThrow({
    where: { id }
  });
  if (isAdminExist) {
    const updateAdmin = await prisma.admin.update({
      where: { id: isAdminExist.id },
      data: updateData
    });
    return updateAdmin;
  }
};
var deleteAdminFromDB = async (id) => {
  const isAdminExist = await prisma.admin.findUniqueOrThrow({
    where: { id }
  });
  if (isAdminExist.isDeleted) {
    throw new Error("Admin already deleted");
  }
  const isUserExist = await prisma.user.findUniqueOrThrow({
    where: { email: isAdminExist.email }
  });
  if (isUserExist.userStatus === UserStatus.DELETED) {
    throw new Error("User already deleted");
  }
  if (isAdminExist) {
    await prisma.$transaction(async (transactionClient) => {
      await transactionClient.admin.update({
        where: { id: isAdminExist.id },
        data: { isDeleted: true }
      });
      await transactionClient.user.updateMany({
        where: { email: isAdminExist.email },
        data: { userStatus: UserStatus.DELETED }
      });
    });
  }
  return null;
};
var AdminService = {
  getAllAdminFromDB,
  updateAdminIntoDB,
  getSingleAdminFromDB,
  deleteAdminFromDB
};

// src/app/modules/admin/admin.controller.ts
var getAllAdminFromDB2 = catchAsync(async (req, res) => {
  const query = req.query;
  const result = await AdminService.getAllAdminFromDB(query);
  sendResponse(res, 200, "Admins retrieved successfully", result);
});
var getSingleAdminFromDB2 = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await AdminService.getSingleAdminFromDB(id);
  sendResponse(res, 200, "Admin retrieved successfully", result);
});
var updateAdminIntoDB2 = catchAsync(async (req, res) => {
  const adminId = req.params.id;
  const updateData = req.body;
  const result = await AdminService.updateAdminIntoDB(adminId, updateData);
  sendResponse(res, 200, "Admin updated successfully", result);
});
var deleteAdminFromDB2 = catchAsync(async (req, res) => {
  const adminId = req.params.id;
  const result = await AdminService.deleteAdminFromDB(adminId);
  sendResponse(res, 200, "Admin deleted successfully", result);
});
var AdminController = {
  getAllAdminFromDB: getAllAdminFromDB2,
  updateAdminIntoDB: updateAdminIntoDB2,
  getSingleAdminFromDB: getSingleAdminFromDB2,
  deleteAdminFromDB: deleteAdminFromDB2
};

// src/app/modules/admin/admin.route.ts
var router4 = express4.Router();
router4.get("/", auth_default(UserRole.ADMIN), AdminController.getAllAdminFromDB);
router4.get("/:id", auth_default(UserRole.ADMIN), AdminController.getSingleAdminFromDB);
router4.patch("/:id", auth_default(UserRole.ADMIN), AdminController.updateAdminIntoDB);
router4.patch("/delete-admin/:id", auth_default(UserRole.ADMIN), AdminController.deleteAdminFromDB);
var adminRouter = router4;

// src/app/modules/teacher/teacher.route.ts
import express5 from "express";

// src/app/modules/teacher/teacher.service.ts
var getAllTeacherFromDB = async (query) => {
  const { searchTerm, skip, take, sortBy, sortOrder, ...filterData } = query;
  const searchFields = ["name", "email"];
  let inputFilter = [];
  if (searchTerm) {
    searching(inputFilter, searchFields, searchTerm);
  }
  if (Object.keys(filterData).length > 0) {
    filtering(inputFilter, filterData);
  }
  const { currentPage, skipValue, takeValue, sortByField, sortOrderValue } = pagination(Number(skip), Number(take), sortBy, sortOrder);
  const whereCondition = { AND: inputFilter };
  const teachers = await prisma.teacher.findMany({
    where: whereCondition,
    skip: skipValue,
    take: takeValue,
    orderBy: { [sortByField]: sortOrderValue }
  });
  const total = await prisma.teacher.count({ where: whereCondition });
  const totalPages = Math.ceil(total / takeValue);
  return {
    meta: {
      currentPage,
      limit: takeValue,
      total,
      totalPages
    },
    data: teachers
  };
};
var getAllTeacherForAssignCourse = async () => {
  const result = await prisma.teacher.findMany();
  return result;
};
var getSingleTeacherFromDB = async (id) => {
  const teacher = await prisma.teacher.findUniqueOrThrow({
    where: { id },
    include: {
      projectTheses: true
    }
  });
  return teacher;
};
var updateTeacherIntoDB = async (id, updateData) => {
  const isTeacherExist = await prisma.teacher.findUniqueOrThrow({
    where: { id }
  });
  if (isTeacherExist) {
    const updateTeacher = await prisma.teacher.update({
      where: { id: isTeacherExist.id },
      data: updateData
    });
    return updateTeacher;
  }
};
var deleteTeacherFromDB = async (id) => {
  const isTeacherExist = await prisma.teacher.findUniqueOrThrow({
    where: { id }
  });
  if (isTeacherExist.isDeleted) {
    throw new appErrors_default(410, "Teacher already deleted");
  }
  const isUserExist = await prisma.user.findUniqueOrThrow({
    where: { email: isTeacherExist.email }
  });
  if (isUserExist.userStatus === UserStatus.DELETED) {
    throw new appErrors_default(410, "User already deleted");
  }
  if (isTeacherExist) {
    await prisma.$transaction(async (transactionClient) => {
      await transactionClient.teacher.update({
        where: { id: isTeacherExist.id },
        data: { isDeleted: true }
      });
      await transactionClient.user.updateMany({
        where: { email: isTeacherExist.email },
        data: { userStatus: UserStatus.DELETED }
      });
    });
  }
  return null;
};
var reActivateTeacherInDB = async (id) => {
  const isTeacherExist = await prisma.teacher.findUnique({
    where: { id }
  });
  if (!isTeacherExist) {
    throw new appErrors_default(404, "Teacher not found");
  }
  const isUserExist = await prisma.user.findUnique({
    where: { email: isTeacherExist.email }
  });
  if (!isUserExist) {
    throw new appErrors_default(404, "User not found");
  }
  if (isUserExist.userStatus !== UserStatus.DELETED) {
    throw new appErrors_default(400, "User account is already active");
  }
  await prisma.$transaction(async (transactionClient) => {
    await transactionClient.teacher.update({
      where: { id: isTeacherExist.id },
      data: { isDeleted: false }
    });
    await transactionClient.user.updateMany({
      where: { email: isTeacherExist.email },
      data: { userStatus: UserStatus.ACTIVE }
    });
  });
  return null;
};
var generateReportForTeacher = async (query) => {
  const { searchTerm, skip, take, sortBy, sortOrder, ...filterData } = query;
  let inputFilter = [];
  const searchFields = ["name", "email"];
  if (searchTerm) {
    searching(inputFilter, searchFields, searchTerm);
  }
  if (Object.keys(filterData).length > 0) {
    filtering(inputFilter, filterData);
  }
  const whereCondition = { AND: inputFilter };
  const { currentPage, skipValue, takeValue, sortByField, sortOrderValue } = pagination(skip, take, sortBy, sortOrder);
  const result = await prisma.teacher.findMany({
    where: whereCondition,
    orderBy: { [sortByField]: sortOrderValue }
  });
  const total = await prisma.teacher.count({ where: whereCondition });
  const totalPages = Math.ceil(total / takeValue);
  return {
    meta: {
      currentPage,
      limit: takeValue,
      total,
      totalPages
    },
    data: result
  };
};
var TeacherService = {
  getAllTeacherFromDB,
  updateTeacherIntoDB,
  getSingleTeacherFromDB,
  deleteTeacherFromDB,
  getAllTeacherForAssignCourse,
  reActivateTeacherInDB,
  generateReportForTeacher
};

// src/app/modules/teacher/teacher.controller.ts
var getAllTeacherFromDB2 = catchAsync(async (req, res) => {
  const query = req.query;
  const result = await TeacherService.getAllTeacherFromDB(query);
  sendResponse(res, 200, "Teachers retrieved successfully", result);
});
var getAllTeacherForCourseAssign = catchAsync(
  async (req, res) => {
    const result = await TeacherService.getAllTeacherForAssignCourse();
    sendResponse(res, 200, "Teachers retrieved successfully", result);
  }
);
var getSingleTeacherFromDB2 = catchAsync(
  async (req, res) => {
    const id = req.params.id;
    const result = await TeacherService.getSingleTeacherFromDB(id);
    sendResponse(res, 200, "Teacher retrieved successfully", result);
  }
);
var updateTeacherIntoDB2 = catchAsync(async (req, res) => {
  const teacherId = req.params.id;
  const updateData = req.body;
  const result = await TeacherService.updateTeacherIntoDB(
    teacherId,
    updateData
  );
  sendResponse(res, 200, "Teacher updated successfully", result);
});
var deleteTeacherFromDB2 = catchAsync(async (req, res) => {
  const teacherId = req.params.id;
  const result = await TeacherService.deleteTeacherFromDB(teacherId);
  sendResponse(res, 200, "Teacher deleted successfully", result);
});
var reActivateTeacherInDB2 = catchAsync(
  async (req, res) => {
    const teacherId = req.params.id;
    const result = await TeacherService.reActivateTeacherInDB(
      teacherId
    );
    sendResponse(res, 200, "Teacher re-activated successfully", result);
  }
);
var generateAllTeachersReport = catchAsync(
  async (req, res) => {
    const result = await TeacherService.generateReportForTeacher(req.query);
    const pdfContext = {
      generatedDate: (/* @__PURE__ */ new Date()).toLocaleDateString(),
      teachers: result.data,
      meta: result.meta
    };
    const pdfBuffer = await generatePdf(
      "all-teachers-report.hbs",
      pdfContext
    );
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="all-teachers-report.pdf"`,
      "Content-Length": pdfBuffer.length,
      "Cache-Control": "no-cache"
    });
    res.end(pdfBuffer);
  }
);
var TeacherController = {
  getAllTeacherFromDB: getAllTeacherFromDB2,
  updateTeacherIntoDB: updateTeacherIntoDB2,
  getSingleTeacherFromDB: getSingleTeacherFromDB2,
  deleteTeacherFromDB: deleteTeacherFromDB2,
  getAllTeacherForCourseAssign,
  reActivateTeacherInDB: reActivateTeacherInDB2,
  generateAllTeachersReport
};

// src/app/modules/teacher/teacher.route.ts
var router5 = express5.Router();
router5.get("/", auth_default(UserRole.ADMIN), TeacherController.getAllTeacherFromDB);
router5.get("/teacher-list", auth_default(UserRole.ADMIN), TeacherController.getAllTeacherForCourseAssign);
router5.get("/generate-report", auth_default(UserRole.ADMIN), TeacherController.generateAllTeachersReport);
router5.get("/:id", auth_default(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT), TeacherController.getSingleTeacherFromDB);
router5.patch("/delete-teacher/:id", auth_default(UserRole.ADMIN), TeacherController.deleteTeacherFromDB);
router5.patch("/re-activate-teacher/:id", auth_default(UserRole.ADMIN), TeacherController.reActivateTeacherInDB);
router5.patch("/:id", auth_default(UserRole.ADMIN, UserRole.TEACHER), TeacherController.updateTeacherIntoDB);
var teacherRouter = router5;

// src/app/modules/projectThesis/projectThesis.route.ts
import express6 from "express";

// src/utils/emailTemplates/projectThesisApprovalTemplete.ts
var projectThesisApprovalTemplate = (studentName, projectThesisTitle, note) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Project/Thesis Approved</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6f8; font-family: Arial, Helvetica, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding: 30px 10px;">
        <table width="100%" max-width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background-color: #16a34a; padding: 20px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 22px;">
                \u{1F389} Project / Thesis Approved
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 24px; color: #333333;">
              <p style="margin-top: 0; font-size: 16px;">
                Dear <strong>${studentName}</strong>,
              </p>

              <p style="font-size: 15px; line-height: 1.6;">
                We are pleased to inform you that your <strong>Project/Thesis</strong> has been
                <span style="color: #16a34a; font-weight: bold;">successfully approved</span>.
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0;">
                <tr>
                  <td style="background-color: #f0fdf4; border-left: 4px solid #16a34a; padding: 14px;">
                    <p style="margin: 0; font-size: 14px;">
                      <strong>Feedback from Supervisor:</strong>
                    </p>
                    <p style="margin: 8px 0 0; font-size: 14px; color: #374151;">
                      ${note}
                    </p>
                  </td>
                </tr>
              </table>

              <p style="font-size: 14px; line-height: 1.6;">
                You may now proceed to the next steps according to the academic guidelines.
                Please ensure that you follow all instructions carefully.
              </p>

              <p style="font-size: 14px;">
                If you have any questions, feel free to contact your supervisor or the department office.
              </p>

              <p style="margin-bottom: 0;">
                Best regards,<br />
                <strong>Academic Management System</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 14px; text-align: center; font-size: 12px; color: #6b7280;">
              \xA9 ${(/* @__PURE__ */ new Date()).getFullYear()} Academic Management System. All rights reserved.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
};

// src/utils/emailTemplates/projectThesisRejectionTemplate.ts
var projectThesisRejectionTemplate = (studentName, projectTitle, note) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Project / Thesis Rejected</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f6f8; font-family: Arial, Helvetica, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:30px 10px;">
        <table width="100%" style="max-width:600px; background:#ffffff; border-radius:8px; overflow:hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background:#dc2626; padding:20px; text-align:center;">
              <h1 style="margin:0; color:#ffffff; font-size:22px;">
                \u274C Project / Thesis Rejected
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:24px; color:#374151;">
              <p style="font-size:16px; margin-top:0;">
                Dear <strong>${studentName}</strong>,
              </p>

              <p style="font-size:15px; line-height:1.6;">
                After careful review, your <strong>Project/Thesis</strong> titled
                <strong>\u201C${projectTitle}\u201D</strong> has been
                <span style="color:#dc2626; font-weight:bold;">rejected</span>.
              </p>

              <!-- Feedback -->
              <table width="100%" style="margin:20px 0;">
                <tr>
                  <td style="background:#fef2f2; border-left:4px solid #dc2626; padding:14px;">
                    <p style="margin:0; font-size:14px;">
                      <strong>Reviewer Feedback:</strong>
                    </p>
                    <p style="margin:8px 0 0; font-size:14px; color:#4b5563;">
                      ${note || "No additional feedback was provided."}
                    </p>
                  </td>
                </tr>
              </table>

              <p style="font-size:14px; line-height:1.6;">
                You are encouraged to carefully review the feedback and make the necessary improvements
                before submitting a revised proposal in the future.
              </p>

              <p style="font-size:14px;">
                If you need clarification, please contact your supervisor or department coordinator.
              </p>

              <p style="margin-bottom:0;">
                Best wishes,<br />
                <strong>Academic Management System</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb; padding:14px; text-align:center; font-size:12px; color:#6b7280;">
              \xA9 ${(/* @__PURE__ */ new Date()).getFullYear()} Academic Management System. All rights reserved.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
};

// src/app/modules/projectThesis/projectThesis.service.ts
var calculateOverall = (tasks) => {
  if (!tasks.length) return 0;
  return Math.round(
    tasks.reduce(
      (sum, t) => sum + (t.progressPercentage ?? t.ratting ?? 0),
      0
    ) / tasks.length
  );
};
var createProjectThesisIntoDB = async (email, projectThesisInfo) => {
  const isStudentExist = await prisma.student.findUnique({
    where: { email }
  });
  if (!isStudentExist) {
    throw new appErrors_default(404, "Student not found");
  }
  const result = await prisma.projectThesis.create({
    data: { ...projectThesisInfo, studentId: isStudentExist.id }
  });
  return result;
};
var getAllProjectThesesFromDB = async (query) => {
  const { searchTerm, skip, take, sortBy, sortOrder, ...filterData } = query;
  console.log(filterData);
  let inputFields = [];
  if (searchTerm) {
    searching(inputFields, ["projectTitle"], searchTerm);
  }
  if (Object.keys(filterData).length) {
    filtering(inputFields, filterData);
  }
  const whereCondition = { AND: inputFields };
  const { currentPage, skipValue, takeValue, sortByField, sortOrderValue } = pagination(skip, take, sortBy, sortOrder);
  const result = await prisma.projectThesis.findMany({
    where: whereCondition,
    include: {
      tasks: {
        include: {
          projectThesisUpdateLogs: true
        }
      },
      student: true,
      supervisor: true
    },
    skip: skipValue,
    take: takeValue,
    orderBy: { [sortByField]: sortOrderValue }
  });
  const total = await prisma.projectThesis.count({ where: whereCondition });
  const totalPages = Math.ceil(total / takeValue);
  const proposalsWithProgress = result.map((proposal) => {
    const progress = calculateOverall(proposal.tasks);
    return {
      ...proposal,
      overallProgress: progress
    };
  });
  return {
    meta: {
      currentPage,
      limit: takeValue,
      total,
      totalPages
    },
    data: proposalsWithProgress
  };
};
var getSingleProjectThesisFromDB = async (id) => {
  const result = await prisma.projectThesis.findUniqueOrThrow({
    where: { id },
    include: {
      tasks: {
        include: {
          projectThesisUpdateLogs: true
        }
      },
      student: true,
      supervisor: true,
      course: true
    }
  });
  const overallProgress = result.tasks.length === 0 ? 0 : Math.round(
    result.tasks.reduce(
      (acc, t) => acc + (t.progressPercentage ?? t.ratting ?? 0),
      0
    ) / result.tasks.length
  );
  const taskCompleted = result.tasks.filter(
    (t) => t.status === TaskStatus.DONE
  ).length;
  const totalTasks = result.tasks.length;
  return { ...result, overallProgress, taskCompleted, totalTasks };
};
var updateProjectThesisInDB = async (id, updateInfo) => {
  const isProjectThesisExist = await prisma.projectThesis.findUnique({
    where: { id }
  });
  if (!isProjectThesisExist) {
    throw new Error("Project or Thesis not found");
  }
  const updateData = {
    ...updateInfo,
    status: ProjectThesisStatus.PENDING
  };
  const result = await prisma.projectThesis.update({
    where: { id },
    data: updateData
  });
  return result;
};
var submitFinalReportInDB = async (id, finalReportUrl) => {
  const isProjectThesisExist = await prisma.projectThesis.findUnique({
    where: { id }
  });
  if (!isProjectThesisExist) {
    throw new appErrors_default(404, "Project or Thesis not found");
  }
  const result = await prisma.projectThesis.update({
    where: { id },
    data: { finalReport: finalReportUrl }
  });
  return result;
};
var approveProjectThesisInDB = async (id, note) => {
  const isProjectThesisExist = await prisma.projectThesis.findUnique({
    where: { id },
    include: {
      student: true
    }
  });
  if (!isProjectThesisExist) {
    throw new appErrors_default(404, "Project or Thesis not found");
  }
  if (isProjectThesisExist.status === ProjectThesisStatus.APPROVED) {
    throw new appErrors_default(400, "Project or Thesis is already approved");
  }
  if (isProjectThesisExist.status === ProjectThesisStatus.REJECTED) {
    throw new appErrors_default(400, "Project or Thesis is already rejected");
  }
  const approveStatus = ProjectThesisStatus.APPROVED;
  const result = await prisma.projectThesis.update({
    where: { id },
    data: { status: approveStatus, feedback: note }
  });
  await mailSender_default({
    to: isProjectThesisExist.student.email,
    subject: "Project/Thesis Approved",
    html: projectThesisApprovalTemplate(
      isProjectThesisExist.student.name,
      isProjectThesisExist.projectTitle,
      note
    )
  });
  return result;
};
var rejectProjectThesisInDB = async (id, note) => {
  const isProjectThesisExist = await prisma.projectThesis.findUnique({
    where: { id },
    include: {
      student: true
    }
  });
  if (!isProjectThesisExist) {
    throw new appErrors_default(404, "Project or Thesis not found");
  }
  if (isProjectThesisExist.status === ProjectThesisStatus.REJECTED) {
    throw new appErrors_default(400, "Project or Thesis is already rejected");
  }
  if (isProjectThesisExist.status === ProjectThesisStatus.APPROVED) {
    throw new appErrors_default(400, "Project or Thesis is already approved");
  }
  const rejectionStatus = ProjectThesisStatus.REJECTED;
  const result = await prisma.projectThesis.update({
    where: { id },
    data: { status: rejectionStatus, feedback: note }
  });
  await mailSender_default({
    to: isProjectThesisExist.student.email,
    subject: "Project/Thesis Rejected",
    html: projectThesisRejectionTemplate(
      isProjectThesisExist.student.name,
      isProjectThesisExist.projectTitle,
      note
    )
  });
  return result;
};
var startProjectThesisInDB = async (id) => {
  const isProjectThesisExist = await prisma.projectThesis.findUnique({
    where: { id }
  });
  if (!isProjectThesisExist) {
    throw new Error("Project or Thesis not found");
  }
  if (isProjectThesisExist.status !== ProjectThesisStatus.APPROVED) {
    throw new Error("Only approved Project or Thesis can be started");
  }
  const result = await prisma.projectThesis.update({
    where: { id },
    data: { status: ProjectThesisStatus.in_PROGRESS }
  });
  return result;
};
var completeProjectThesisInDB = async (id, evaluatedMark) => {
  const isProjectThesisExist = await prisma.projectThesis.findUnique({
    where: { id },
    include: { tasks: true }
  });
  if (!isProjectThesisExist) {
    throw new Error("Project or Thesis not found");
  }
  if (isProjectThesisExist.status !== ProjectThesisStatus.in_PROGRESS) {
    throw new Error("Only in-progress Project or Thesis can be completed");
  }
  const isTasksIncomplete = await prisma.task.findFirst({
    where: {
      projectThesisId: id,
      status: { not: TaskStatus.DONE }
    }
  });
  if (isTasksIncomplete) {
    throw new Error("Cannot complete Project or Thesis with incomplete tasks");
  }
  const overallProgress = calculateOverall(isProjectThesisExist.tasks);
  let obtainedMark = void 0;
  if (evaluatedMark !== void 0) {
    obtainedMark = evaluatedMark * overallProgress / 100;
  }
  const result = await prisma.projectThesis.update({
    where: { id },
    data: {
      status: ProjectThesisStatus.COMPLETED,
      evaluatedMark,
      obtainedMark
    }
  });
  return result;
};
var getSingleStudentProjectThesisFromDB = async (email, query) => {
  const { searchTerm, skip, take, sortBy, sortOrder, ...filterData } = query;
  let inputFields = [];
  if (searchTerm) {
    searching(inputFields, ["projectTitle"], searchTerm);
  }
  if (Object.keys(filterData).length) {
    filtering(inputFields, filterData);
  }
  const whereCondition = { AND: inputFields };
  const { currentPage, skipValue, takeValue, sortByField, sortOrderValue } = pagination(skip, take, sortBy, sortOrder);
  const student = await prisma.student.findUnique({
    where: {
      email,
      status: StudentStatus.ACTIVE
    }
  });
  if (!student) {
    throw new appErrors_default(404, "Student not found");
  }
  const result = await prisma.projectThesis.findMany({
    where: { studentId: student.id, ...whereCondition },
    include: { tasks: true, student: true, supervisor: true, course: true },
    skip: skipValue,
    take: takeValue,
    orderBy: { [sortByField]: sortOrderValue }
  });
  const total = await prisma.projectThesis.count({
    where: { studentId: student.id, ...whereCondition }
  });
  const totalPages = Math.ceil(total / takeValue);
  const proposalsWithProgress = result.map((proposal) => {
    const progress = calculateOverall(proposal.tasks);
    return {
      ...proposal,
      overallProgress: progress
    };
  });
  return {
    meta: {
      currentPage,
      total,
      limit: takeValue,
      totalPages
    },
    data: proposalsWithProgress
  };
};
var getSingleSupervisorProjectThesisFromDB = async (email, query) => {
  const { searchTerm, skip, take, sortBy, sortOrder, ...filterData } = query;
  let inputFields = [];
  if (searchTerm) {
    searching(inputFields, ["projectTitle"], searchTerm);
  }
  if (Object.keys(filterData).length) {
    filtering(inputFields, filterData);
  }
  const whereCondition = { AND: inputFields };
  const { currentPage, skipValue, takeValue, sortByField, sortOrderValue } = pagination(skip, take, sortBy, sortOrder);
  const teacher = await prisma.teacher.findUnique({
    where: {
      email,
      status: TeacherStatus.ACTIVE
    }
  });
  if (!teacher) {
    throw new appErrors_default(404, "teacher not found");
  }
  const result = await prisma.projectThesis.findMany({
    where: { supervisorId: teacher.id, ...whereCondition },
    include: { tasks: true, student: true, supervisor: true },
    skip: skipValue,
    take: takeValue,
    orderBy: { [sortByField]: sortOrderValue }
  });
  const total = await prisma.projectThesis.count({
    where: { supervisorId: teacher.id, ...whereCondition }
  });
  const totalPages = Math.ceil(total / takeValue);
  const proposalsWithProgress = result.map((proposal) => {
    const progress = calculateOverall(proposal.tasks);
    return {
      ...proposal,
      overallProgress: progress
    };
  });
  return {
    meta: {
      currentPage,
      total,
      limit: takeValue,
      totalPages
    },
    data: proposalsWithProgress
  };
};
var generateStudentProposalReport = async (email, query) => {
  const student = await prisma.student.findUnique({
    where: {
      email,
      status: StudentStatus.ACTIVE
    }
  });
  if (!student) {
    throw new appErrors_default(404, "Student not found");
  }
  const studentId = student.id;
  const { searchTerm, skip, take, sortBy, sortOrder, ...filterData } = query;
  let inputFields = [];
  if (searchTerm) {
    searching(inputFields, ["projectTitle"], searchTerm);
  }
  if (Object.keys(filterData).length) {
    filtering(inputFields, filterData);
  }
  const whereCondition = { AND: inputFields };
  const { currentPage, skipValue, takeValue, sortByField, sortOrderValue } = pagination(skip, take, sortBy, sortOrder);
  const result = await prisma.projectThesis.findMany({
    where: { studentId, ...whereCondition },
    include: { tasks: true, student: true, supervisor: true, course: true },
    orderBy: { [sortByField]: sortOrderValue }
  });
  const total = await prisma.projectThesis.count({
    where: { studentId, ...whereCondition }
  });
  const totalPages = Math.ceil(total / takeValue);
  const proposalsWithProgress = result.map((proposal) => {
    const progress = calculateOverall(proposal.tasks);
    return {
      ...proposal,
      overallProgress: progress
    };
  });
  return {
    meta: {
      currentPage,
      total,
      limit: takeValue,
      totalPages
    },
    data: proposalsWithProgress
  };
};
var generateTeacherProposalReport = async (email, query) => {
  const teacher = await prisma.teacher.findUnique({
    where: {
      email,
      status: TeacherStatus.ACTIVE
    }
  });
  if (!teacher) {
    throw new appErrors_default(404, "Teacher not found");
  }
  const teacherId = teacher.id;
  const { searchTerm, skip, take, sortBy, sortOrder, ...filterData } = query;
  let inputFields = [];
  if (searchTerm) {
    searching(inputFields, ["projectTitle"], searchTerm);
  }
  if (Object.keys(filterData).length) {
    filtering(inputFields, filterData);
  }
  const whereCondition = { AND: inputFields };
  const { currentPage, skipValue, takeValue, sortByField, sortOrderValue } = pagination(skip, take, sortBy, sortOrder);
  const result = await prisma.projectThesis.findMany({
    where: { supervisorId: teacherId, ...whereCondition },
    include: { tasks: true, student: true, supervisor: true, course: true },
    orderBy: { [sortByField]: sortOrderValue }
  });
  const total = await prisma.projectThesis.count({
    where: { supervisorId: teacherId, ...whereCondition }
  });
  const totalPages = Math.ceil(total / takeValue);
  const proposalsWithProgress = result.map((proposal) => {
    const progress = calculateOverall(proposal.tasks);
    return {
      ...proposal,
      overallProgress: progress
    };
  });
  return {
    meta: {
      currentPage,
      total,
      limit: takeValue,
      totalPages
    },
    data: proposalsWithProgress
  };
};
var generateProjectThesisReportForAdmin = async (query) => {
  const { searchTerm, skip, take, sortBy, sortOrder, ...filterData } = query;
  let inputFields = [];
  if (searchTerm) {
    searching(inputFields, ["projectTitle"], searchTerm);
  }
  if (Object.keys(filterData).length) {
    filtering(inputFields, filterData);
  }
  const whereCondition = { AND: inputFields };
  const { currentPage, skipValue, takeValue, sortByField, sortOrderValue } = pagination(skip, take, sortBy, sortOrder);
  const result = await prisma.projectThesis.findMany({
    where: whereCondition,
    include: { tasks: true, student: true, supervisor: true, course: true },
    orderBy: { [sortByField]: sortOrderValue }
  });
  const total = await prisma.projectThesis.count({ where: whereCondition });
  const totalPages = Math.ceil(total / takeValue);
  const proposalsWithProgress = result.map((proposal) => {
    const progress = calculateOverall(proposal.tasks);
    return {
      ...proposal,
      overallProgress: progress
    };
  });
  return {
    meta: {
      currentPage,
      total,
      limit: takeValue,
      totalPages
    },
    data: proposalsWithProgress
  };
};
var ProjectThesisService = {
  createProjectThesisIntoDB,
  getAllProjectThesesFromDB,
  getSingleProjectThesisFromDB,
  getSingleStudentProjectThesisFromDB,
  getSingleSupervisorProjectThesisFromDB,
  updateProjectThesisInDB,
  approveProjectThesisInDB,
  rejectProjectThesisInDB,
  startProjectThesisInDB,
  completeProjectThesisInDB,
  generateStudentProposalReport,
  generateTeacherProposalReport,
  generateProjectThesisReportForAdmin,
  submitFinalReportInDB
};

// src/app/modules/projectThesis/projectThesis.controller.ts
var createProjectThesisIntoDB2 = catchAsync(
  async (req, res) => {
    const user = req.user;
    const result = await ProjectThesisService.createProjectThesisIntoDB(
      user.email,
      req.body
    );
    sendResponse(res, 201, "Project or Thesis created successfully", result);
  }
);
var getAllProjectThesesFromDB2 = catchAsync(
  async (req, res) => {
    const result = await ProjectThesisService.getAllProjectThesesFromDB(
      req.query
    );
    sendResponse(res, 200, "Project and Thesis fetched successfully", result);
  }
);
var getSingleProjectThesisFromDB2 = catchAsync(
  async (req, res) => {
    const { id } = req.params;
    const result = await ProjectThesisService.getSingleProjectThesisFromDB(
      id
    );
    sendResponse(res, 200, "Project or Thesis fetched successfully", result);
  }
);
var updateProjectThesisInDB2 = catchAsync(
  async (req, res) => {
    const { id } = req.params;
    const result = await ProjectThesisService.updateProjectThesisInDB(
      id,
      req.body
    );
    sendResponse(res, 200, "Project or Thesis updated successfully", result);
  }
);
var submitFinalReport = catchAsync(
  async (req, res) => {
    const { id } = req.params;
    const result = await ProjectThesisService.submitFinalReportInDB(
      id,
      req.body.finalReportUrl
    );
    sendResponse(res, 200, "Final report submitted successfully", result);
  }
);
var approveProjectThesis = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ProjectThesisService.approveProjectThesisInDB(
    id,
    req.body.note
  );
  sendResponse(res, 200, "Project or Thesis approved successfully", null);
});
var rejectProjectThesis = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ProjectThesisService.rejectProjectThesisInDB(
    id,
    req.body.note
  );
  sendResponse(res, 200, "Project or Thesis rejected successfully", result);
});
var startProjectThesisInDB2 = catchAsync(
  async (req, res) => {
    const { id } = req.params;
    const result = await ProjectThesisService.startProjectThesisInDB(
      id
    );
    sendResponse(
      res,
      200,
      "Your request to assign the task has been sent successfully.",
      result
    );
  }
);
var completeProjectThesisInDB2 = catchAsync(
  async (req, res) => {
    const { id } = req.params;
    const { evaluatedMark } = req.body;
    const result = await ProjectThesisService.completeProjectThesisInDB(
      id,
      evaluatedMark ? Number(evaluatedMark) : void 0
    );
    sendResponse(res, 200, "Project or Thesis completed successfully", result);
  }
);
var getSingleStudentProjectThesisFromDB2 = catchAsync(
  async (req, res) => {
    const user = req.user;
    const result = await ProjectThesisService.getSingleStudentProjectThesisFromDB(
      user.email,
      req.query
    );
    sendResponse(
      res,
      200,
      "Student's Project or Thesis fetched successfully",
      result
    );
  }
);
var getSingleSupervisorProjectThesisFromDB2 = catchAsync(
  async (req, res) => {
    const user = req.user;
    const result = await ProjectThesisService.getSingleSupervisorProjectThesisFromDB(
      user.email,
      req.query
    );
    sendResponse(
      res,
      200,
      "Supervisor's Project or Thesis fetched successfully",
      result
    );
  }
);
var generateStudentProposalReport2 = catchAsync(
  async (req, res) => {
    const user = req.user;
    const email = user.email;
    const result = await ProjectThesisService.generateStudentProposalReport(
      email,
      req.query
    );
    const pdfContext = {
      generatedDate: (/* @__PURE__ */ new Date()).toLocaleDateString(),
      proposals: result.data,
      meta: result.meta
    };
    const pdfBuffer = await generatePdf("proposal-report.hbs", pdfContext);
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="student-report-${email}.pdf"`,
      "Content-Length": pdfBuffer.length,
      "Cache-Control": "no-cache"
    });
    res.end(pdfBuffer);
  }
);
var generateTeacherProposalReport2 = catchAsync(
  async (req, res) => {
    const user = req.user;
    const email = user.email;
    const result = await ProjectThesisService.generateTeacherProposalReport(
      email,
      req.query
    );
    const pdfContext = {
      generatedDate: (/* @__PURE__ */ new Date()).toLocaleDateString(),
      proposals: result.data,
      meta: result.meta
    };
    const pdfBuffer = await generatePdf(
      "proposal-report-teacher.hbs",
      pdfContext
    );
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="teacher-report-${email}.pdf"`,
      "Content-Length": pdfBuffer.length,
      "Cache-Control": "no-cache"
    });
    res.end(pdfBuffer);
  }
);
var generateProjectThesisReportForAdmin2 = catchAsync(
  async (req, res) => {
    const result = await ProjectThesisService.generateProjectThesisReportForAdmin(req.query);
    const pdfContext = {
      generatedDate: (/* @__PURE__ */ new Date()).toLocaleDateString(),
      proposals: result.data,
      meta: result.meta
    };
    const pdfBuffer = await generatePdf(
      "project-thesis-report-admin.hbs",
      pdfContext
    );
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="project-thesis-report-admin.pdf"`,
      "Content-Length": pdfBuffer.length,
      "Cache-Control": "no-cache"
    });
    res.end(pdfBuffer);
  }
);
var ProjectThesisController = {
  createProjectThesisIntoDB: createProjectThesisIntoDB2,
  getAllProjectThesesFromDB: getAllProjectThesesFromDB2,
  getSingleProjectThesisFromDB: getSingleProjectThesisFromDB2,
  getSingleStudentProjectThesisFromDB: getSingleStudentProjectThesisFromDB2,
  getSingleSupervisorProjectThesisFromDB: getSingleSupervisorProjectThesisFromDB2,
  updateProjectThesisInDB: updateProjectThesisInDB2,
  approveProjectThesis,
  rejectProjectThesis,
  startProjectThesisInDB: startProjectThesisInDB2,
  completeProjectThesisInDB: completeProjectThesisInDB2,
  generateStudentProposalReport: generateStudentProposalReport2,
  generateTeacherProposalReport: generateTeacherProposalReport2,
  generateProjectThesisReportForAdmin: generateProjectThesisReportForAdmin2,
  submitFinalReport
};

// src/app/modules/projectThesis/projectThesis.route.ts
var router6 = express6.Router();
router6.post("/", auth_default(UserRole.STUDENT), ProjectThesisController.createProjectThesisIntoDB);
router6.get("/", ProjectThesisController.getAllProjectThesesFromDB);
router6.get("/student", auth_default(UserRole.STUDENT), ProjectThesisController.getSingleStudentProjectThesisFromDB);
router6.get("/supervisor", auth_default(UserRole.TEACHER), ProjectThesisController.getSingleSupervisorProjectThesisFromDB);
router6.get("/proposal-report", auth_default(UserRole.STUDENT), ProjectThesisController.generateStudentProposalReport);
router6.get("/proposal-report-teacher", auth_default(UserRole.TEACHER), ProjectThesisController.generateTeacherProposalReport);
router6.get("/project-thesis-report-admin", auth_default(UserRole.ADMIN), ProjectThesisController.generateProjectThesisReportForAdmin);
router6.get("/:id", auth_default(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT), ProjectThesisController.getSingleProjectThesisFromDB);
router6.patch("/approve-project-thesis/:id", auth_default(UserRole.TEACHER), ProjectThesisController.approveProjectThesis);
router6.patch("/reject-project-thesis/:id", auth_default(UserRole.TEACHER), ProjectThesisController.rejectProjectThesis);
router6.patch("/start-project-thesis/:id", auth_default(UserRole.STUDENT), ProjectThesisController.startProjectThesisInDB);
router6.patch("/complete-project-thesis/:id", auth_default(UserRole.TEACHER), ProjectThesisController.completeProjectThesisInDB);
router6.patch("/submit-final-report/:id", auth_default(UserRole.STUDENT), ProjectThesisController.submitFinalReport);
router6.patch("/:id", ProjectThesisController.updateProjectThesisInDB);
var ProjectThesisRoutes = router6;

// src/app/modules/auth/auth.route.ts
import express7 from "express";

// src/app/modules/auth/auth.service.ts
import bcrypt2 from "bcrypt";

// src/utils/emailTemplates/resetPasswordTemplate.ts
var resetPasswordTemplate = (resetLink) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            @media only screen and (max-width: 600px) {
                .container { width: 100% !important; }
            }
        </style>
    </head>
    <body style="font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f7; margin: 0; padding: 0;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f4f7; padding: 20px;">
            <tr>
                <td align="center">
                    <table border="0" cellpadding="0" cellspacing="0" width="600" class="container" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.05); overflow: hidden;">
                        <tr>
                            <td style="background-color: #4f46e5; padding: 20px; text-align: center; color: #ffffff; font-size: 20px; font-weight: bold; letter-spacing: 1px;">
                                Password Reset Request
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 40px 30px; color: #333333;">
                                <p style="margin: 0 0 20px 0; font-size: 16px; color: #555;">Hello,</p>
                                <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.5;">
                                    We received a request to reset your password. Please click the button below to set up a new password for your account.
                                </p>
                                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 30px 0;">
                                    <tr>
                                        <td align="center">
                                            <a href="${resetLink}" style="background-color: #4f46e5; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block;">
                                                Reset Password
                                            </a>
                                        </td>
                                    </tr>
                                </table>
                                <p style="margin: 0 0 10px 0; font-size: 14px; color: #d9534f; font-weight: bold; text-align: center;">
                                    This link is valid for 15 minutes only.
                                </p>
                                <p style="margin: 0 0 0 0; font-size: 14px; color: #777; text-align: center;">
                                    If you did not request a password reset, please ignore this email.
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td style="background-color: #f9f9f9; padding: 15px; text-align: center; font-size: 12px; color: #999;">
                                <p style="margin: 0;">Patuakhali Science and Technology University</p>
                                <p style="margin: 5px 0 0 0;">Do not reply to this email.</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;
};

// src/app/modules/auth/auth.service.ts
var loginUser = async (payload) => {
  const { email, password } = payload;
  const user = await prisma.user.findUnique({
    where: { email, userStatus: UserStatus.ACTIVE }
  });
  if (!user) {
    throw new appErrors_default(404, "User not found");
  }
  if (!user.isEmailVerified) {
    throw new appErrors_default(400, "Email is not verified");
  }
  const isPasswordMatch = await bcrypt2.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new appErrors_default(400, "Invalid password");
  }
  if (user.role === UserRole.STUDENT) {
    const student = await prisma.student.findUnique({
      where: { email: user.email }
    });
    if (!student) {
      throw new appErrors_default(404, "Student not found");
    }
    if (student && !student.isApproved) {
      throw new appErrors_default(400, "Please wait for admin approval");
    }
  }
  if (user.userStatus !== UserStatus.ACTIVE) {
    throw new appErrors_default(400, "User does not exist in the system");
  }
  const jwtInfo = {
    email: user.email,
    role: user.role
  };
  const token = jwtGenerator({
    userInfo: jwtInfo,
    createSecretKey: config2.jwt.token_secret,
    expiresIn: config2.jwt.token_expires_in
  });
  const refreshToken = jwtGenerator({
    userInfo: jwtInfo,
    createSecretKey: config2.jwt.refresh_token_secret,
    expiresIn: config2.jwt.refresh_token_expires_in
  });
  return {
    token,
    refreshToken
  };
};
var generateNewToken = async (refreshToken) => {
  console.log("refresh token", refreshToken);
  const decoded = jwtVerifier({
    token: refreshToken,
    secretKey: config2.jwt.refresh_token_secret
  });
  const user = await prisma.user.findUnique({
    where: { email: decoded.email, userStatus: UserStatus.ACTIVE }
  });
  if (!user) {
    throw new appErrors_default(404, "User not found");
  }
  const jwtInfo = {
    email: user.email,
    role: user.role
  };
  const newToken = jwtGenerator({
    userInfo: jwtInfo,
    createSecretKey: config2.jwt.token_secret,
    expiresIn: config2.jwt.token_expires_in
  });
  return newToken;
};
var forgotPassword = async (email) => {
  const user = await prisma.user.findUnique({
    where: { email, userStatus: UserStatus.ACTIVE }
  });
  if (!user) {
    throw new appErrors_default(404, "User not found with this email");
  }
  const resetToken = jwtGenerator({
    userInfo: { email: user.email, role: user.role },
    createSecretKey: config2.jwt.token_secret,
    expiresIn: "15m"
  });
  const clientBaseUrl = process.env.CLIENT_URL || "http://localhost:3000";
  const resetLink = `${clientBaseUrl}/reset-password?token=${resetToken}&email=${user.email}`;
  try {
    await mailSender_default({
      to: user.email,
      subject: "Reset your password",
      html: resetPasswordTemplate(resetLink)
    });
  } catch (err) {
    console.error("Email dispatch failed (SMTP error):", err.message);
  }
  return { message: "Password reset link sent to your email", resetLink };
};
var resetPassword = async (payload) => {
  const { email, token, newPassword } = payload;
  const decoded = jwtVerifier({
    token,
    secretKey: config2.jwt.token_secret
  });
  if (decoded.email !== email) {
    throw new appErrors_default(400, "Invalid reset token or email mismatch");
  }
  const user = await prisma.user.findUnique({
    where: { email, userStatus: UserStatus.ACTIVE }
  });
  if (!user) {
    throw new appErrors_default(404, "User not found");
  }
  const hashedPassword = await bcrypt2.hash(newPassword, Number(config2.salt_rounds) || 12);
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword }
  });
  return { message: "Password reset successfully" };
};
var logout = async () => {
  return null;
};
var AuthService = {
  loginUser,
  generateNewToken,
  forgotPassword,
  resetPassword,
  logout
};

// src/app/modules/auth/auth.controller.ts
var cookieOptions = {
  httpOnly: true,
  secure: config2.node_env === "production",
  sameSite: "lax",
  path: "/"
};
var dayToMs = (days) => days * 24 * 60 * 60 * 1e3;
var login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const result = await AuthService.loginUser({ email, password });
  const { refreshToken, token } = result;
  res.cookie("accessToken", token, {
    ...cookieOptions,
    maxAge: dayToMs(Number(config2.jwt.token_expires_in?.split("d")[0]))
  });
  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: dayToMs(Number(config2.jwt.refresh_token_expires_in?.split("d")[0]))
  });
  sendResponse(res, 200, "Login successful", result);
});
var generateNewToken2 = catchAsync(async (req, res) => {
  const { refreshToken } = req.body;
  const result = await AuthService.generateNewToken(refreshToken);
  res.cookie("accessToken", result, {
    ...cookieOptions,
    maxAge: dayToMs(Number(config2.jwt.token_expires_in?.split("d")[0]))
  });
  sendResponse(res, 200, "New token generated successfully", { data: result });
});
var forgotPassword2 = catchAsync(async (req, res) => {
  const { email } = req.body;
  const result = await AuthService.forgotPassword(email);
  sendResponse(res, 200, "Password reset link sent to your email", result);
});
var resetPassword2 = catchAsync(async (req, res) => {
  const { email, token, newPassword } = req.body;
  const result = await AuthService.resetPassword({ email, token, newPassword });
  sendResponse(res, 200, "Password reset successfully", result);
});
var logout2 = catchAsync(async (req, res) => {
  const result = await AuthService.logout();
  res.clearCookie("refreshToken", cookieOptions);
  res.clearCookie("accessToken", cookieOptions);
  sendResponse(res, 200, "Logout successful", result);
});
var AuthController = {
  login,
  generateNewToken: generateNewToken2,
  forgotPassword: forgotPassword2,
  resetPassword: resetPassword2,
  logout: logout2
};

// src/app/modules/auth/auth.route.ts
var router7 = express7.Router();
router7.post("/login", AuthController.login);
router7.post("/forget-password", AuthController.forgotPassword);
router7.post("/reset-password", AuthController.resetPassword);
router7.post("/generate-new-token", AuthController.generateNewToken);
router7.get("/logout", AuthController.logout);
var AuthRoutes = router7;

// src/app/errors/globalErrorHandler.ts
import jwt2 from "jsonwebtoken";
var { JsonWebTokenError, TokenExpiredError } = jwt2;
var globalErrorHandler = (error, req, res, next) => {
  let statusCode = 500;
  let message = "Something went wrong!";
  let errorMessage = error.message;
  if (error instanceof prismaNamespace_exports.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      statusCode = 409;
      message = "Duplicate Entry";
      errorMessage = `Duplicate entry found.`;
    } else if (error.code === "P2025") {
      statusCode = 404;
      message = "Record not found";
    }
  } else if (error instanceof prismaNamespace_exports.PrismaClientValidationError) {
    statusCode = 400;
    message = "Validation Error";
  } else if (error instanceof TokenExpiredError) {
    statusCode = 401;
    message = "Unauthorized";
    errorMessage = "Access token expired. Please log in again.";
  } else if (error instanceof JsonWebTokenError) {
    statusCode = 401;
    message = "Unauthorized";
    errorMessage = "Invalid token provided.";
  } else if (error.statusCode) {
    statusCode = error.statusCode;
    message = error.message;
    errorMessage = error.message;
  }
  console.log("\u{1F6A8} Error Handler Caught:", error.statusCode, error.message);
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errorMessage
    // error, // প্রোডাকশনে এটি অফ রাখাই ভালো
  });
};

// src/app.ts
import cors from "cors";

// src/app/modules/course/course.route.ts
import express8 from "express";

// src/app/modules/course/course.service.ts
var createCourseIntoDB = async (data) => {
  const result = await prisma.courses.create({
    data
  });
  return result;
};
var getAllCoursesFromDB = async (query) => {
  const { searchTerm, skip, take, sortBy, sortOrder, ...filterData } = query;
  let filterInput = [];
  if (searchTerm) {
    searching(filterInput, ["courseCode", "courseName"], searchTerm);
  }
  if (Object.keys(filterData).length) {
    filtering(filterInput, filterData);
  }
  const { currentPage, skipValue, takeValue, sortByField, sortOrderValue } = pagination(skip, take, sortBy, sortOrder);
  const whereCondition = { AND: filterInput };
  const result = await prisma.courses.findMany({
    where: whereCondition,
    skip: skipValue,
    take: takeValue,
    orderBy: { [sortByField]: sortOrderValue }
  });
  const total = await prisma.courses.count({ where: whereCondition });
  const totalPages = Math.ceil(total / takeValue);
  return {
    meta: {
      currentPage,
      limit: takeValue,
      total,
      totalPages
    },
    data: result
  };
};
var updateCoursesIntoDB = async (id, data) => {
  const isCourseExist = await prisma.courses.findUnique({ where: { id } });
  if (!isCourseExist) {
    throw new Error("Course not found");
  }
  const result = await prisma.courses.update({
    where: { id },
    data
  });
  return result;
};
var courseSetInTrashInDB = async (id) => {
  const isCourseExist = await prisma.courses.findUnique({ where: { id } });
  if (!isCourseExist) {
    throw new Error("Course not found");
  }
  const result = await prisma.courses.update({
    where: { id },
    data: { status: "ARCHIVED" }
  });
  return result;
};
var reActivateCourseInDB = async (id) => {
  const isCourseExist = await prisma.courses.findUnique({ where: { id } });
  if (!isCourseExist) {
    throw new Error("Course not found");
  }
  const result = await prisma.courses.update({
    where: { id },
    data: { status: "ACTIVE" }
  });
  return result;
};
var getSingleCourseFromDB = async (id) => {
  const result = await prisma.courses.findUniqueOrThrow({
    where: { id }
  });
  return result;
};
var getAllCourseForProjectThesis = async () => {
  const result = await prisma.courses.findMany({
    where: {
      status: CourseStatus.ACTIVE
    }
  });
  return result;
};
var getMyAssignedCourses = async (email, query) => {
  const teacher = await prisma.teacher.findUnique({
    where: { email }
  });
  if (!teacher) {
    throw new appErrors_default(404, "Teacher not found");
  }
  const { searchTerm, skip, take, sortBy, sortOrder, ...filterData } = query;
  let filterDateInput = [];
  if (searchTerm) {
    searching(filterDateInput, ["courseCode", "courseName"], searchTerm);
  }
  if (Object.keys(filterData).length) {
    filtering(filterDateInput, filterData);
  }
  const { currentPage, skipValue, takeValue, sortByField, sortOrderValue } = pagination(skip, take, sortBy, sortOrder);
  const whereCondition = {
    AND: filterDateInput,
    courseTeachers: { some: { teacherId: teacher.id } }
  };
  const result = await prisma.courses.findMany({
    where: whereCondition,
    skip: skipValue,
    take: takeValue,
    orderBy: { [sortByField]: sortOrderValue }
  });
  const total = await prisma.courses.count({ where: whereCondition });
  const totalPages = Math.ceil(total / takeValue);
  return {
    meta: {
      currentPage,
      limit: takeValue,
      total,
      totalPages
    },
    data: result
  };
};
var generateReportForCourse = async (query) => {
  const { searchTerm, skip, take, sortBy, sortOrder, ...filterData } = query;
  let filterInput = [];
  if (searchTerm) {
    searching(filterInput, ["courseCode", "courseName"], searchTerm);
  }
  if (Object.keys(filterData).length) {
    filtering(filterInput, filterData);
  }
  const { currentPage, skipValue, takeValue, sortByField, sortOrderValue } = pagination(skip, take, sortBy, sortOrder);
  const whereCondition = {
    AND: filterInput
  };
  const result = await prisma.courses.findMany({
    where: whereCondition,
    orderBy: { [sortByField]: sortOrderValue }
  });
  const total = await prisma.courses.count({ where: whereCondition });
  const totalPages = Math.ceil(total / takeValue);
  return {
    meta: {
      currentPage,
      limit: takeValue,
      total,
      totalPages
    },
    data: result
  };
};
var CourseService = {
  createCourseIntoDB,
  getAllCoursesFromDB,
  updateCoursesIntoDB,
  courseSetInTrashInDB,
  reActivateCourseInDB,
  getSingleCourseFromDB,
  getAllCourseForProjectThesis,
  getMyAssignedCourses,
  generateReportForCourse
};

// src/app/modules/course/course.controller.ts
var createCourseIntoDB2 = catchAsync(async (req, res) => {
  const { accessToken, ...courseData } = req.body;
  const result = await CourseService.createCourseIntoDB(courseData);
  sendResponse(res, 201, "Course created successfully", result);
});
var getAllCoursesFromDB2 = catchAsync(async (req, res) => {
  const result = await CourseService.getAllCoursesFromDB(req.query);
  sendResponse(res, 200, "Courses retrieved successfully", result);
});
var updateCoursesIntoDB2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CourseService.updateCoursesIntoDB(
    id,
    req.body
  );
  sendResponse(res, 200, "Course updated successfully", result);
});
var courseSetInTrashInDB2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CourseService.courseSetInTrashInDB(id);
  sendResponse(res, 200, "Course archived successfully", result);
});
var reActivateCourseInDB2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CourseService.reActivateCourseInDB(id);
  sendResponse(res, 200, "Course reactivated successfully", result);
});
var getSingleCourseFromDB2 = catchAsync(
  async (req, res) => {
    const { id } = req.params;
    const result = await CourseService.getSingleCourseFromDB(id);
    sendResponse(res, 200, "Course retrieved successfully", result);
  }
);
var getAllCourseForProjectThesis2 = catchAsync(
  async (req, res) => {
    const result = await CourseService.getAllCourseForProjectThesis();
    sendResponse(res, 200, "Course retrieved successfully", result);
  }
);
var getMyAssignedCourses2 = catchAsync(
  async (req, res) => {
    const user = req.user;
    const result = await CourseService.getMyAssignedCourses(
      user.email,
      req.query
    );
    sendResponse(res, 200, "Assigned courses retrieved successfully", result);
  }
);
var generateReportForCourse2 = catchAsync(
  async (req, res) => {
    const result = await CourseService.generateReportForCourse(
      req.query
    );
    const pdfContext = {
      generatedDate: (/* @__PURE__ */ new Date()).toLocaleDateString(),
      courses: result.data,
      meta: result.meta
    };
    const pdfBuffer = await generatePdf(
      "course-report.hbs",
      pdfContext
    );
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="course-report.pdf"`,
      "Content-Length": pdfBuffer.length,
      "Cache-Control": "no-cache"
    });
    res.end(pdfBuffer);
  }
);
var CourseController = {
  createCourseIntoDB: createCourseIntoDB2,
  getAllCoursesFromDB: getAllCoursesFromDB2,
  updateCoursesIntoDB: updateCoursesIntoDB2,
  courseSetInTrashInDB: courseSetInTrashInDB2,
  reActivateCourseInDB: reActivateCourseInDB2,
  getSingleCourseFromDB: getSingleCourseFromDB2,
  getAllCourseForProjectThesis: getAllCourseForProjectThesis2,
  getMyAssignedCourses: getMyAssignedCourses2,
  generateReportForCourse: generateReportForCourse2
};

// src/app/modules/course/course.route.ts
var router8 = express8.Router();
router8.post("/", auth_default(UserRole.ADMIN), CourseController.createCourseIntoDB);
router8.get("/", CourseController.getAllCoursesFromDB);
router8.get("/active-courses", CourseController.getAllCourseForProjectThesis);
router8.get(
  "/my-courses",
  auth_default(UserRole.TEACHER),
  CourseController.getMyAssignedCourses
);
router8.get(
  "/generate-report",
  auth_default(UserRole.ADMIN, UserRole.TEACHER),
  CourseController.generateReportForCourse
);
router8.get("/:id", CourseController.getSingleCourseFromDB);
router8.patch(
  "/:id",
  auth_default(UserRole.ADMIN),
  CourseController.updateCoursesIntoDB
);
router8.patch(
  "/trash/:id",
  auth_default(UserRole.ADMIN),
  CourseController.courseSetInTrashInDB
);
router8.patch(
  "/reactivate/:id",
  auth_default(UserRole.ADMIN),
  CourseController.reActivateCourseInDB
);
var CourseRoutes = router8;

// src/app/modules/courseTeacher/courseTeacher.route.ts
import express9 from "express";

// src/app/modules/courseTeacher/courseTeacher.service.ts
var createCourseTeacherIntoDB = async (data) => {
  const result = await prisma.courseTeacher.create({
    data
  });
  return result;
};
var getAllCourseTeachersFromDB = async (query) => {
  const { searchTerm, skip, take, sortBy, sortOrder, ...filterData } = query;
  let courseTeacherInputFields = [];
  if (searchTerm) {
    courseTeacherInputFields.push({
      OR: [
        { course: { courseName: { contains: String(searchTerm), mode: "insensitive" } } },
        { course: { courseCode: { contains: String(searchTerm), mode: "insensitive" } } },
        { teacher: { name: { contains: String(searchTerm), mode: "insensitive" } } }
      ]
    });
  }
  if (Object.keys(filterData).length) {
    Object.entries(filterData).forEach(([field, value]) => {
      if (field === "courseStatus") {
        courseTeacherInputFields.push({ course: { status: { equals: value } } });
      }
      if (field === "teacherStatus") {
        courseTeacherInputFields.push({ teacher: { status: { equals: value } } });
      }
      if (field === "department") {
        courseTeacherInputFields.push({ teacher: { department: { equals: value } } });
      }
      if (field === "designation") {
        courseTeacherInputFields.push({ teacher: { designation: { equals: value } } });
      }
    });
  }
  const { currentPage, skipValue, takeValue, sortByField, sortOrderValue } = pagination(skip, take, sortBy, sortOrder);
  const whereCondition = { AND: courseTeacherInputFields };
  const result = await prisma.courseTeacher.findMany({ where: whereCondition, include: { course: true, teacher: true }, skip: skipValue, take: takeValue, orderBy: { [sortByField]: sortOrderValue } });
  const total = await prisma.courseTeacher.count({ where: whereCondition });
  return {
    meta: {
      currentPage,
      take: takeValue,
      total
    },
    data: result
  };
};
var updateCourseTeacherIntoDB = async (id, data) => {
  const isCourseTeacherExist = await prisma.courseTeacher.findUnique({ where: { id } });
  if (!isCourseTeacherExist) {
    throw new Error("Course Teacher not found");
  }
  const result = await prisma.courseTeacher.update({
    where: { id },
    data
  });
  return result;
};
var getSpecificCourseTeacher = async (courseId) => {
  const courses = await prisma.courseTeacher.findMany({
    where: {
      courseId
    },
    include: { teacher: true }
  });
  return courses;
};
var CourseTeacherService = {
  createCourseTeacherIntoDB,
  getAllCourseTeachersFromDB,
  updateCourseTeacherIntoDB,
  getSpecificCourseTeacher
};

// src/app/modules/courseTeacher/courseTeacher.controller.ts
var createCourseTeacherIntoDB2 = catchAsync(async (req, res) => {
  const result = await CourseTeacherService.createCourseTeacherIntoDB(req.body);
  sendResponse(res, 201, "Course teacher created successfully", result);
});
var getAllCourseTeachersFromDB2 = catchAsync(async (req, res) => {
  const result = await CourseTeacherService.getAllCourseTeachersFromDB(req.query);
  sendResponse(res, 200, "Course teachers retrieved successfully", result);
});
var updateCourseTeacherIntoDB2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CourseTeacherService.updateCourseTeacherIntoDB(id, req.body);
  sendResponse(res, 200, "Course teacher updated successfully", result);
});
var getSpecificCourseTeacher2 = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const result = await CourseTeacherService.getSpecificCourseTeacher(courseId);
  sendResponse(res, 200, "Course teacher retrieved successfully", result);
});
var CourseTeacherController = {
  createCourseTeacherIntoDB: createCourseTeacherIntoDB2,
  getAllCourseTeachersFromDB: getAllCourseTeachersFromDB2,
  updateCourseTeacherIntoDB: updateCourseTeacherIntoDB2,
  getSpecificCourseTeacher: getSpecificCourseTeacher2
};

// src/app/modules/courseTeacher/courseTeacher.route.ts
var router9 = express9.Router();
router9.post("/", auth_default(UserRole.ADMIN), CourseTeacherController.createCourseTeacherIntoDB);
router9.get("/", CourseTeacherController.getAllCourseTeachersFromDB);
router9.get("/:courseId", CourseTeacherController.getSpecificCourseTeacher);
router9.patch("/:id", CourseTeacherController.updateCourseTeacherIntoDB);
var CourseTeacherRoutes = router9;

// src/app/modules/task/task.route.ts
import express10 from "express";

// src/utils/emailTemplates/taskCompletionTemplete.ts
var taskCompletionTemplate = (isTaskExist) => {
  return `<div style="font-family: Arial, Helvetica, sans-serif; background-color: #f9fafb; padding: 24px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e5e7eb;">
        
        <!-- Header -->
        <div style="background-color: #16a34a; color: #ffffff; padding: 20px;">
          <h2 style="margin: 0; font-size: 20px;">Task Completed \u{1F389}</h2>
        </div>

        <!-- Body -->
        <div style="padding: 24px; color: #374151;">
          <p style="font-size: 14px; margin-bottom: 16px;">
            Dear <strong>${isTaskExist.projectThesis.student.name}</strong>,
          </p>

          <p style="font-size: 14px; margin-bottom: 16px;">
            We are happy to inform you that the following task has been successfully
            reviewed and marked as <strong>Completed</strong>.
          </p>

          <!-- Task Info -->
          <div style="background-color: #f0fdf4; border-left: 4px solid #16a34a; padding: 14px; margin: 16px 0;">
            <p style="margin: 0; font-size: 14px;">
              <strong>\u{1F4CC} Task Name:</strong> ${isTaskExist.title}<br />
              <strong>\u{1F4C2} Project:</strong> ${isTaskExist.projectThesis.title}<br />
              <strong>\u2714 Status:</strong> Completed
            </p>
          </div>

          <p style="font-size: 14px; margin-bottom: 16px;">
            Your performance has been evaluated and the project progress has been
            updated accordingly. If feedback is available, please check your dashboard
            for details.
          </p>

          <p style="font-size: 14px;">
            Keep up the great work and continue moving forward with your project.
          </p>

          <p style="margin-top: 24px; font-size: 14px;">
            Best regards,<br />
            <strong>Project Supervision Team</strong>
          </p>
        </div>

        <!-- Footer -->
        <div style="background-color: #f3f4f6; padding: 16px; text-align: center; font-size: 12px; color: #6b7280;">
          This is an automated message. Please do not reply to this email.
        </div>
      </div>
    </div>`;
};

// src/utils/emailTemplates/taskRejectTemplate.ts
var taskFailedTemplate = (isTaskExist, review) => {
  return `
    <div style="font-family: Arial, Helvetica, sans-serif; background-color: #f9fafb; padding: 24px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e5e7eb;">
        
        <!-- Header -->
        <div style="background-color: #dc2626; color: #ffffff; padding: 20px;">
          <h2 style="margin: 0; font-size: 20px;">Task Marked as Failed \u274C</h2>
        </div>

        <!-- Body -->
        <div style="padding: 24px; color: #374151;">
          <p style="font-size: 14px; margin-bottom: 16px;">
            Dear <strong>${isTaskExist.projectThesis.student.name}</strong>,
          </p>

          <p style="font-size: 14px; margin-bottom: 16px;">
            After reviewing your submission, the following task has been
            <strong>marked as failed</strong> as it does not meet the minimum
            evaluation requirements.
          </p>

          <!-- Task Info -->
          <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 14px; margin: 16px 0;">
            <p style="margin: 0; font-size: 14px;">
              <strong>\u{1F4CC} Task Name:</strong> ${isTaskExist.title}<br />
              <strong>\u{1F4C2} Project:</strong> ${isTaskExist.projectThesis.title}<br />
              <strong>\u{1F4DD} Status:</strong> Failed
            </p>
          </div>

          ${review ? `
            <!-- Teacher Review -->
            <div style="margin-top: 16px;">
              <p style="font-size: 14px; font-weight: 600; margin-bottom: 8px;">
                \u{1F9D1}\u200D\u{1F3EB} Teacher Feedback:
              </p>
              <div style="background-color: #f3f4f6; padding: 12px; border-radius: 6px; font-size: 14px;">
                ${review}
              </div>
            </div>
          ` : ""}

          <p style="font-size: 14px; margin-top: 16px;">
            You are advised to carefully review the feedback and improve your
            understanding of the task requirements. For further clarification,
            please contact your supervisor.
          </p>

          <p style="margin-top: 24px; font-size: 14px;">
            Best regards,<br />
            <strong>Project Supervision Team</strong>
          </p>
        </div>

        <!-- Footer -->
        <div style="background-color: #f3f4f6; padding: 16px; text-align: center; font-size: 12px; color: #6b7280;">
          This is an automated message. Please do not reply to this email.
        </div>
      </div>
    </div>
  `;
};

// src/utils/emailTemplates/taskResubmissionTemplate.ts
var taskResubmissionTemplate = (isTaskExist, review) => {
  return `
    <div style="font-family: Arial, Helvetica, sans-serif; background-color: #f9fafb; padding: 24px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e5e7eb;">
        
        <!-- Header -->
        <div style="background-color: #f59e0b; color: #ffffff; padding: 20px;">
          <h2 style="margin: 0; font-size: 20px;">Task Resubmission Allowed \u{1F501}</h2>
        </div>

        <!-- Body -->
        <div style="padding: 24px; color: #374151;">
          <p style="font-size: 14px; margin-bottom: 16px;">
            Dear <strong>${isTaskExist.projectThesis.student.name}</strong>,
          </p>

          <p style="font-size: 14px; margin-bottom: 16px;">
            Your submitted task has been reviewed. Based on the evaluation, you are
            allowed to <strong>resubmit</strong> the task after making the required
            improvements.
          </p>

          <!-- Task Info -->
          <div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 14px; margin: 16px 0;">
            <p style="margin: 0; font-size: 14px;">
              <strong>\u{1F4CC} Task Name:</strong> ${isTaskExist.title}<br />
              <strong>\u{1F4C2} Project:</strong> ${isTaskExist.projectThesis.title}<br />
              <strong>\u{1F4DD} Status:</strong> Resubmission Required
            </p>
          </div>

          <!-- Teacher Review -->
          <div style="background-color: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 14px; margin: 16px 0;">
            <p style="margin: 0 0 6px 0; font-size: 14px;">
              <strong>\u{1F468}\u200D\u{1F3EB} Teacher Feedback:</strong>
            </p>
            <p style="margin: 0; font-size: 14px; line-height: 1.6;">
              ${review || "No additional feedback was provided."}
            </p>
          </div>

          <p style="font-size: 14px; margin-bottom: 16px;">
            Please carefully review the feedback above and update your submission
            accordingly before resubmitting the task.
          </p>

          <p style="font-size: 14px;">
            You can resubmit the task from your dashboard. Make sure to submit it
            within the given timeline.
          </p>

          <p style="margin-top: 24px; font-size: 14px;">
            Best regards,<br />
            <strong>Project Supervision Team</strong>
          </p>
        </div>

        <!-- Footer -->
        <div style="background-color: #f3f4f6; padding: 16px; text-align: center; font-size: 12px; color: #6b7280;">
          This is an automated message. Please do not reply to this email.
        </div>
      </div>
    </div>
  `;
};

// src/app/modules/task/task.service.ts
var createTaskIntoDB = async (taskInfo) => {
  if (taskInfo.dueDate) {
    const dueDate = new Date(taskInfo.dueDate);
    const now = /* @__PURE__ */ new Date();
    if (dueDate < now) {
      throw new appErrors_default(400, "Due date cannot be in the past");
    }
  }
  const result = await prisma.task.create({
    data: taskInfo
  });
  return result;
};
var updateTaskInDB = async (id, taskInfo) => {
  const isTaskExist = await prisma.task.findUniqueOrThrow({ where: { id } });
  if (!isTaskExist) {
    throw new Error("Task not found");
  }
  const result = await prisma.task.update({
    where: { id: isTaskExist.id },
    data: taskInfo
  });
  return result;
};
var updateStatusToInProgressInDB = async (id) => {
  const isTaskExist = await prisma.task.findUniqueOrThrow({ where: { id } });
  if (!isTaskExist) {
    throw new Error("Task not found");
  }
  if (isTaskExist.status !== TaskStatus.TODO) {
    throw new Error("Only todo task can be set to in-progress");
  }
  const result = await prisma.task.update({
    where: { id: isTaskExist.id },
    data: { status: TaskStatus.IN_PROGRESS }
  });
  return result;
};
var updateStatusToReviewInDB = async (id, updateData) => {
  const isTaskExist = await prisma.task.findUniqueOrThrow({ where: { id } });
  if (!isTaskExist) {
    throw new Error("Task not found");
  }
  if (isTaskExist.status !== TaskStatus.IN_PROGRESS) {
    throw new Error("Only in-progress task can be set to review");
  }
  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.task.update({
      where: { id: isTaskExist.id },
      data: { status: TaskStatus.REVIEW }
    });
    const logData = await transactionClient.projectThesisUpdateLog.create({
      data: {
        projectThesisId: isTaskExist.projectThesisId,
        taskId: isTaskExist.id,
        liveLink: updateData.liveLink,
        fileUrl: updateData.fileUrl
      }
    });
    return logData;
  });
  return result;
};
var updateStatusToDoneInDB = async (id, updateData) => {
  const isTaskExist = await prisma.task.findUnique({
    where: { id },
    include: { projectThesis: { include: { student: true } } }
  });
  console.log(updateData);
  if (!isTaskExist) {
    throw new appErrors_default(404, "Task not found");
  }
  if (isTaskExist.status !== TaskStatus.REVIEW) {
    throw new appErrors_default(400, "Only review task can be set to done");
  }
  const score = Math.min(100, Math.max(0, Number(updateData.rating) || 0));
  const data = {
    status: TaskStatus.DONE,
    ratting: score,
    progressPercentage: score,
    feedback: updateData.note !== void 0 ? updateData.note : null
  };
  const result = prisma.$transaction(async (transactionClient) => {
    const updatedTask = await transactionClient.task.update({
      where: { id: isTaskExist.id },
      data
    });
    let updateLog = null;
    if (updateData.updateLogId && updateData.updateLogId.trim() !== "") {
      updateLog = await transactionClient.projectThesisUpdateLog.update({
        where: { id: updateData.updateLogId },
        data: {
          supervisorFeedback: updateData.note !== void 0 ? updateData.note : null
        }
      });
    }
    return updateLog || updatedTask;
  });
  await mailSender_default({
    to: isTaskExist.projectThesis.student.email,
    subject: "\u2705 Task Completed Successfully",
    html: taskCompletionTemplate(isTaskExist)
  });
  return result;
};
var allowResubmit = async (id, note) => {
  const isTaskExist = await prisma.task.findUnique({
    where: { id },
    include: { projectThesis: { include: { student: true } } }
  });
  if (!isTaskExist) {
    throw new appErrors_default(404, "Task not found");
  }
  if (isTaskExist.status !== TaskStatus.REVIEW) {
    throw new appErrors_default(400, "Only review task can be resubmitted");
  }
  const data = {
    ratting: 0,
    progressPercentage: 0,
    feedback: note,
    status: TaskStatus.IN_PROGRESS
  };
  const result = await prisma.task.update({
    where: { id: isTaskExist.id },
    data
  });
  await mailSender_default({
    to: isTaskExist.projectThesis.student.email,
    subject: "\u{1F501} Task Resubmission Allowed",
    html: taskResubmissionTemplate(isTaskExist, note)
  });
  return result;
};
var rejectTask = async (id, updatedData) => {
  const isTaskExist = await prisma.task.findUnique({
    where: { id },
    include: { projectThesis: { include: { student: true } } }
  });
  if (!isTaskExist) {
    throw new appErrors_default(404, "Task not found");
  }
  if (isTaskExist.status !== TaskStatus.REVIEW) {
    throw new appErrors_default(400, "Only review task can be rejected");
  }
  const data = {
    ratting: 0,
    progressPercentage: 0,
    feedback: updatedData.note,
    status: TaskStatus.FAILED
  };
  const result = prisma.$transaction(async (transactionClient) => {
    const updatedTask = await transactionClient.task.update({
      where: { id: isTaskExist.id },
      data
    });
    let updateLog = null;
    if (updatedData.updateLogId && updatedData.updateLogId.trim() !== "") {
      updateLog = await transactionClient.projectThesisUpdateLog.update({
        where: { id: updatedData.updateLogId },
        data: {
          supervisorFeedback: updatedData.note
        }
      });
    }
    return updateLog || updatedTask;
  });
  await mailSender_default({
    to: isTaskExist.projectThesis.student.email,
    subject: "\u274C Task Failed",
    html: taskFailedTemplate(isTaskExist, updatedData.note)
  });
  return result;
};
var getAllTasksForStudent = async (email, query) => {
  const { searchTerm, skip, take, sortBy, sortOrder, ...filterData } = query;
  const isStudentExist = await prisma.student.findUniqueOrThrow({
    where: { email }
  });
  const searchFields = [
    "title",
    "projectThesis.projectTitle",
    "projectThesis.course.courseCode",
    "projectThesis.course.courseName",
    "projectThesis.supervisor.name"
  ];
  let inputFilter = [];
  if (searchTerm) {
    searching(inputFilter, searchFields, searchTerm);
  }
  if (Object.keys(filterData).length > 0) {
    filtering(inputFilter, filterData);
  }
  const { currentPage, skipValue, takeValue, sortByField, sortOrderValue } = pagination(Number(skip), Number(take), sortBy, sortOrder);
  const whereCondition = { AND: inputFilter, projectThesis: { studentId: isStudentExist.id } };
  const tasks = await prisma.task.findMany({
    where: whereCondition,
    skip: skipValue,
    take: takeValue,
    orderBy: { [sortByField]: sortOrderValue },
    include: {
      projectThesis: {
        include: {
          course: true,
          supervisor: true
        }
      },
      projectThesisUpdateLogs: true
    }
  });
  const total = await prisma.task.count({ where: whereCondition });
  const totalPages = Math.ceil(total / takeValue);
  return {
    meta: {
      currentPage,
      limit: takeValue,
      total,
      totalPages
    },
    data: tasks
  };
};
var getTaskForTeacherReview = async (email, query) => {
  const { searchTerm, skip, take, sortBy, sortOrder, ...filterData } = query;
  const isTeacherExist = await prisma.teacher.findUniqueOrThrow({
    where: { email }
  });
  const searchFields = [
    "title",
    "projectThesis.projectTitle",
    "projectThesis.course.courseCode",
    "projectThesis.course.courseName",
    "projectThesis.student.name"
  ];
  let inputFilter = [];
  if (searchTerm) {
    searching(inputFilter, searchFields, searchTerm);
  }
  if (Object.keys(filterData).length > 0) {
    filtering(inputFilter, filterData);
  }
  const { currentPage, skipValue, takeValue, sortByField, sortOrderValue } = pagination(Number(skip), Number(take), sortBy, sortOrder);
  const whereCondition = {
    status: TaskStatus.REVIEW,
    AND: inputFilter,
    projectThesis: { supervisorId: isTeacherExist.id }
  };
  const tasks = await prisma.task.findMany({
    where: whereCondition,
    skip: skipValue,
    take: takeValue,
    orderBy: { [sortByField]: sortOrderValue },
    include: {
      projectThesis: {
        include: {
          course: true,
          student: true
        }
      },
      projectThesisUpdateLogs: true
    }
  });
  const total = await prisma.task.count({ where: whereCondition });
  const totalPages = Math.ceil(total / takeValue);
  return {
    meta: {
      currentPage,
      limit: takeValue,
      total,
      totalPages
    },
    data: tasks
  };
};
var getSingleTaskById = async (id) => {
  const task = await prisma.task.findUnique({
    where: { id },
    include: {
      projectThesis: {
        include: {
          course: true,
          supervisor: true,
          student: true
        }
      },
      projectThesisUpdateLogs: true
    }
  });
  if (!task) {
    throw new appErrors_default(404, "Task not found");
  }
  return task;
};
var TaskService = {
  createTaskIntoDB,
  updateTaskInDB,
  updateStatusToInProgressInDB,
  updateStatusToReviewInDB,
  updateStatusToDoneInDB,
  allowResubmit,
  rejectTask,
  getAllTasksForStudent,
  getTaskForTeacherReview,
  getSingleTaskById
};

// src/app/modules/task/task.controller.ts
var createTaskIntoDB2 = catchAsync(async (req, res) => {
  const result = await TaskService.createTaskIntoDB(req.body);
  sendResponse(res, 201, "Task created successfully", result);
});
var updateTaskInDB2 = catchAsync(async (req, res) => {
  const result = await TaskService.updateTaskInDB(
    req.params.id,
    req.body
  );
  sendResponse(res, 200, "Task updated successfully", result);
});
var updateStatusToInProgressInDB2 = catchAsync(
  async (req, res) => {
    const result = await TaskService.updateStatusToInProgressInDB(
      req.params.id
    );
    sendResponse(
      res,
      200,
      "Task status updated to in progress successfully",
      result
    );
  }
);
var updateStatusToReviewInDB2 = catchAsync(
  async (req, res) => {
    const result = await TaskService.updateStatusToReviewInDB(
      req.params.id,
      req.body
    );
    sendResponse(
      res,
      200,
      "Task status updated to review successfully",
      result
    );
  }
);
var updateStatusToDoneInDB2 = catchAsync(
  async (req, res) => {
    const result = await TaskService.updateStatusToDoneInDB(
      req.params.id,
      req.body
    );
    sendResponse(res, 200, "Task marked as done", result);
  }
);
var allowResubmit2 = catchAsync(
  async (req, res) => {
    const result = await TaskService.allowResubmit(
      req.params.id,
      req.body.note
    );
    sendResponse(
      res,
      200,
      "Student is now allowed to resubmit this task.",
      result
    );
  }
);
var rejectTask2 = catchAsync(async (req, res) => {
  const result = await TaskService.rejectTask(
    req.params.id,
    req.body
  );
  sendResponse(res, 200, "Task rejected successfully", result);
});
var getAllTasksForStudent2 = catchAsync(
  async (req, res) => {
    const user = req.user;
    const query = req.query;
    const result = await TaskService.getAllTasksForStudent(
      user.email,
      query
    );
    sendResponse(res, 200, "Tasks retrieved successfully", result);
  }
);
var getTaskForTeacherReview2 = catchAsync(
  async (req, res) => {
    const user = req.user;
    const query = req.query;
    const result = await TaskService.getTaskForTeacherReview(
      user.email,
      query
    );
    sendResponse(res, 200, "Tasks for review retrieved successfully", result);
  }
);
var getSingleTaskById2 = catchAsync(async (req, res) => {
  const result = await TaskService.getSingleTaskById(req.params.id);
  sendResponse(res, 200, "Task retrieved successfully", result);
});
var TaskController = {
  createTaskIntoDB: createTaskIntoDB2,
  updateTaskInDB: updateTaskInDB2,
  updateStatusToInProgressInDB: updateStatusToInProgressInDB2,
  updateStatusToReviewInDB: updateStatusToReviewInDB2,
  updateStatusToDoneInDB: updateStatusToDoneInDB2,
  allowResubmit: allowResubmit2,
  rejectTask: rejectTask2,
  getAllTasksForStudent: getAllTasksForStudent2,
  getTaskForTeacherReview: getTaskForTeacherReview2,
  getSingleTaskById: getSingleTaskById2
};

// src/app/modules/task/task.route.ts
var router10 = express10.Router();
router10.get(
  "/student-tasks",
  auth_default(UserRole.STUDENT),
  TaskController.getAllTasksForStudent
);
router10.get(
  "/teacher-review-tasks",
  auth_default(UserRole.TEACHER),
  TaskController.getTaskForTeacherReview
);
router10.get(
  "/:id",
  auth_default(UserRole.STUDENT, UserRole.TEACHER),
  TaskController.getSingleTaskById
);
router10.post("/", TaskController.createTaskIntoDB);
router10.patch("/in-progress/:id", TaskController.updateStatusToInProgressInDB);
router10.patch("/submit-task/:id", TaskController.updateStatusToReviewInDB);
router10.patch("/done/:id", TaskController.updateStatusToDoneInDB);
router10.patch("/resubmit/:id", TaskController.allowResubmit);
router10.patch("/reject/:id", TaskController.rejectTask);
router10.patch("/:id", TaskController.updateTaskInDB);
var TaskRoutes = router10;

// src/app.ts
import helmet from "helmet";

// src/utils/limit.ts
import rateLimit from "express-rate-limit";
var limitHandler = (req, res, next, options) => {
  res.status(options.statusCode).json({
    success: false,
    message: options.message,
    errorSources: [
      {
        path: "",
        message: options.message
      }
    ]
  });
};
var globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1e3,
  max: 1e3,
  message: "Too many requests from this IP, please try again after 15 minutes.",
  standardHeaders: true,
  legacyHeaders: false,
  handler: limitHandler
});
var authLimiter = rateLimit({
  windowMs: 15 * 60 * 1e3,
  max: 5,
  message: "Too many login/reset attempts, please try again after 15 minutes.",
  standardHeaders: true,
  legacyHeaders: false,
  handler: limitHandler
});

// src/app.ts
var app = express11();
app.use(helmet());
app.use(express11.json());
app.use(cors({
  origin: ["http://localhost:3000", "http://pstu.meteorologyclub.com"],
  credentials: true
}));
app.use("/api/v1", globalLimiter);
app.use("/api/v1/auth/login", authLimiter);
app.use("/api/v1/auth/forget-password", authLimiter);
app.use("/api/v1/auth/reset-password", authLimiter);
app.use("/api/v1/auth/change-password", authLimiter);
app.use("/api/v1/students", StudentRoutes);
app.use("/api/v1/users", UserRoutes);
app.use("/api/v1/admins", adminRouter);
app.use("/api/v1/teachers", teacherRouter);
app.use("/api/v1/courses", CourseRoutes);
app.use("/api/v1/course-teachers", CourseTeacherRoutes);
app.use("/api/v1/project-thesis", ProjectThesisRoutes);
app.use("/api/v1/tasks", TaskRoutes);
app.use("/api/v1/auth", AuthRoutes);
app.use("/api/v1/dashboard", DashboardDataRoutes);
app.get("/", (req, res) => {
  res.status(200).json({
    message: "CSIT Inventory Server is Running",
    DevelopBy: "Arfan Ahmed",
    version: "1.0.0"
  });
});
app.use(globalErrorHandler);
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Page not found"
  });
});
var app_default = app;

// src/server.ts
app_default.listen(config2.port, () => {
  console.log(`Server is running on http://localhost:${config2.port}`);
});
