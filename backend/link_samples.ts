import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const hospital = await prisma.hospital.findFirst();
  if (!hospital) {
    console.error("No hospital found!");
    return;
  }

  // Find samples
  const samples = await prisma.sample.findMany();
  
  // Find test requests
  const testRequests = await prisma.testRequest.findMany();

  if (samples.length === 0 || testRequests.length === 0) {
    console.log("Not enough data to link.");
    return;
  }

  // Link samples to test requests
  for (let i = 0; i < samples.length; i++) {
    const tr = testRequests[i % testRequests.length];
    await prisma.sample.update({
      where: { id: samples[i].id },
      data: { testRequestId: tr.id }
    });
    console.log(`Linked sample ${samples[i].sampleType} to test ${tr.testType}`);
  }
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
