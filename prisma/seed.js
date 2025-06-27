import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

const createMockMembers = (count = 10) =>
  Array.from({ length: count }).map(() => {
    const firstname = faker.person.firstName();
    const lastname = faker.person.lastName();

    return {
      membername: `${firstname} ${lastname}`,
      firstname,
      lastname,
      email: faker.internet.email({ firstName: firstname, lastName: lastname }),
      phone: faker.phone.number("+233 2## ### ###"),
      position: faker.person.jobTitle(),
      dateofbirth: faker.date.birthdate({ min: 18, max: 65, mode: "age" }),
      occupation: faker.person.jobType(),
      otherskills: faker.word.words(3),
      profilepicture: faker.image.avatar(),
      emergencycontactphone: faker.phone.number("+233 2## ### ###"),
      emergencycontactname: faker.person.fullName(),
      emergencycontactrelationship: "Sibling",
      joindate: faker.date.past({ years: 3 }),
      membershiptype: faker.helpers.arrayElement([
        "regular",
        "honorary",
        "student",
      ]),
      status: faker.helpers.arrayElement(["active", "inactive"]),
    };
  });

async function main() {
  const members = createMockMembers(10);
  await prisma.member.createMany({ data: members });
  console.log("✅ Seeded 10 mock members.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
