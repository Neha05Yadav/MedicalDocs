const http = require('http');

const data = JSON.stringify({
  email: 'hospital@demo.com',
  password: 'password123'
});

const req = http.request({
  hostname: 'localhost',
  port: 4000,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
}, res => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => {
    console.log("Login Status:", res.statusCode);
    const token = JSON.parse(body).token;
    if (token) {
        // Now fetch doctors
        const req2 = http.request({
          hostname: 'localhost',
          port: 4000,
          path: '/api/hospital/doctors',
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + token
          }
        }, res2 => {
          let body2 = '';
          res2.on('data', d => body2 += d);
          res2.on('end', () => {
            console.log("Doctors Status:", res2.statusCode);
            console.log("Doctors Body:", body2);
          });
        });
        req2.end();
    } else {
        console.log("Login Failed:", body);
    }
  });
});

req.write(data);
req.end();
