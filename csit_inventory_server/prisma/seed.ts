import "dotenv/config";
import bcrypt from "bcrypt";
import { prisma } from "../src/lib/prisma";
import { UserRole } from "../generated/prisma/enums";
import { config } from "../src/config";
import { courses } from "./courses";
import { teachers } from "./teachers";
import { students } from "./students";
import { proposalsData } from "./proposals";

async function main() {
  const adminEmail = "arfan.exprovia@gmail.com";
  const adminPassword = "Arfan@13";
  const saltRounds = Number(config.salt_rounds) || 12;

  console.log("Seeding super admin...");

  const existingUser = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingUser) {
    console.log("⚠️ Admin already exists in database with email:", adminEmail);
  } else {
    const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);

    await prisma.$transaction(async (tx) => {
      await tx.user.create({
        data: {
          email: adminEmail,
          password: hashedPassword,
          role: UserRole.ADMIN,
          isEmailVerified: true,
        },
      });

      await tx.admin.create({
        data: {
          email: adminEmail,
          name: "Super Admin",
          phoneNumber: "01700000000",
          photoUrl: "https://i.ibb.co/3sW328K/admin-avatar.png",
        },
      });
    });

    console.log("✅ Admin seeded successfully!");
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
  }

  console.log("Seeding courses...");
  const createdCourses = await prisma.courses.createMany({
    data: courses,
    skipDuplicates: true,
  });
  console.log(`✅ Seeded ${createdCourses.count} courses successfully!`);

  console.log("Seeding teachers...");
  let teachersSeededCount = 0;
  for (const teacherData of teachers) {
    const existingTeacherUser = await prisma.user.findUnique({
      where: { email: teacherData.email },
    });

    if (!existingTeacherUser) {
      const hashedTeacherPassword = await bcrypt.hash(teacherData.password, saltRounds);

      await prisma.$transaction(async (tx) => {
        await tx.user.create({
          data: {
            email: teacherData.email,
            password: hashedTeacherPassword,
            role: UserRole.TEACHER,
            isEmailVerified: true,
          },
        });

        await tx.teacher.create({
          data: {
            email: teacherData.email,
            name: teacherData.name,
            phoneNumber: teacherData.phoneNumber,
            address: teacherData.address,
            faculty: teacherData.faculty,
            department: teacherData.department,
            joinedAt: teacherData.joinedAt,
            designation: teacherData.designation,
            isChairman: teacherData.isChairman,
            photoUrl: teacherData.photoUrl,
          },
        });
      });
      teachersSeededCount++;
    } else {
      console.log(`⚠️ Teacher user already exists with email: ${teacherData.email}`);
    }
  }
  console.log(`✅ Seeded ${teachersSeededCount} teachers successfully!`);
  console.log("Seeding students...");
  let studentsSeededCount = 0;
  for (const studentData of students) {
    const existingStudentUser = await prisma.user.findUnique({
      where: { email: studentData.email },
    });

    if (!existingStudentUser) {
      try {
        const hashedStudentPassword = await bcrypt.hash(studentData.password, saltRounds);

        await prisma.$transaction(async (tx) => {
          await tx.user.create({
            data: {
              email: studentData.email,
              password: hashedStudentPassword,
              role: UserRole.STUDENT,
              isEmailVerified: true,
            },
          });

          // @ts-ignore - bypassing strict type checking for semester enum if needed
          await tx.student.create({
            data: {
              email: studentData.email,
              name: studentData.name,
              phoneNumber: studentData.phoneNumber,
              address: studentData.address,
              studentId: studentData.studentId,
              registrationNumber: studentData.registrationNumber,
              dateOfBirth: studentData.dateOfBirth,
              session: studentData.session,
              schoolName: studentData.schoolName,
              collageName: studentData.collageName,
              semester: studentData.semester as any,
            },
          });
        });
        studentsSeededCount++;
      } catch (err: any) {
        console.error(`❌ Failed to seed student ${studentData.email}: ${err.message}`);
      }
    } else {
      console.log(`⚠️ Student user already exists with email: ${studentData.email}`);
    }
  }
  console.log(`✅ Seeded ${studentsSeededCount} students successfully!`);

  console.log("Seeding project proposals...");
  let proposalsSeededCount = 0;
  for (const proposal of proposalsData) {
    const existingProposal = await prisma.projectThesis.findFirst({
      where: { projectTitle: proposal.projectTitle }
    });

    if (!existingProposal) {
      try {
        const student = await prisma.student.findFirst({ where: { studentId: proposal.studentId } });
        const teacher = await prisma.teacher.findUnique({ where: { email: proposal.teacherEmail } });
        const course = await prisma.courses.findFirst({ where: { courseCode: proposal.courseCode } });

        if (student && teacher && course) {
          await prisma.projectThesis.create({
            data: {
              projectTitle: proposal.projectTitle,
              abstract: proposal.abstract,
              projectObjectives: proposal.projectObjectives,
              methodology: proposal.methodology,
              expectedOutcomes: proposal.expectedOutcomes,
              technologiesTools: proposal.technologiesTools,
              estimatedTimeline: proposal.estimatedTimeline,
              attachments: proposal.attachments,
              type: proposal.type as any,
              status: proposal.status as any,
              semester: proposal.semester as any,
              courseId: course.id,
              studentId: student.id,
              supervisorId: teacher.id
            }
          });
          proposalsSeededCount++;
        } else {
          console.error(`❌ Failed to seed proposal: Missing student, teacher, or course for ${proposal.projectTitle}`);
        }
      } catch (err: any) {
        console.error(`❌ Failed to seed proposal ${proposal.projectTitle}: ${err.message}`);
      }
    } else {
      console.log(`⚠️ Proposal already exists: ${proposal.projectTitle}`);
    }
  }
  console.log(`✅ Seeded ${proposalsSeededCount} proposals successfully!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
