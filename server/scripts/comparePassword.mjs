import bcrypt from 'bcryptjs';

(async ()=>{
  const pw = 'Password123!';
  const hash = '$2b$12$gNh2MUdp6d8Qde4MIJ65f.jcvT/6irobZTGFK44iiece7UGQIzb8.';
  try {
    const ok = await bcrypt.compare(pw, hash);
    console.log('bcrypt.compare result:', ok);
  } catch (err) {
    console.error('compare error:', err);
  }
})();
