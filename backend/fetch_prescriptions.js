async function run() {
  try {
    const res = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'makejoh518@heavty.com', password: 'password123' })
    });
    const data = await res.json();
    const token = data.token;
    console.log("Logged in");
    
    const prescRes = await fetch('http://localhost:3001/api/patient/prescriptions', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const prescData = await prescRes.json();
    console.log("Prescriptions:", prescData.length);
    console.log(prescData);
  } catch(e) {
    console.error(e.message);
  }
}
run();
