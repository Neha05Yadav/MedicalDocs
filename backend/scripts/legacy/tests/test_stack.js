async function test() {
  const doctors = [{ id: 1 }, null];
  const hospital = { id: 2 };
  await Promise.all(doctors.map(async d => {
    console.log(d.id, hospital.id);
  }));
}

async function main() {
  try {
    await test();
  } catch(e) {
    console.error(e.stack);
  }
}
main();
