import { nhost } from './nhost';

export async function signUpUser(email, password) {
  const res = await nhost.auth.signUpEmailPassword({
    email,
    password
  });
  
  if (res.error) throw new Error(res.error.message);
  return res.session;
}

export async function loginUser(email, password) {
  const res = await nhost.auth.signInEmailPassword({ 
    email, 
    password 
  });
  
  if (res.error) throw new Error(res.error.message);
  return res.session;
}