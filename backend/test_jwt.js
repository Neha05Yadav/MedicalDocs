const jwt = require('jsonwebtoken');
const token = jwt.sign({ email: 'hospital@demo.com', role: 'HOSPITAL', sub: 'e9012a1b-d09a-4086-8685-d91ef752a2e7' }, 'medidoc-super-secret-key');
console.log(token);
