import type {D1Database} from '@cloudflare/workers-types';
import type {AccountAuth} from '../auth';
import {boundedJSON,json,sessionCookie,sessionToken} from '../http';
import {hashPassword,normalizeLogin,validPassword,verifyPassword} from './passwords';
import {reservePasswordAttempt} from './rate-limit';
import {AccountPasswords} from './store';

/** Ordinary account authentication; this route has no reviewer-specific bypass. */
export async function routePasswordAccess(request:Request,db:D1Database,auth:AccountAuth):Promise<Response|null>{
 try{return await passwordRoute(request,db,auth);}
 catch{return json(503,{error:"Account sign-in is temporarily unavailable."});}
}

async function passwordRoute(request:Request,db:D1Database,auth:AccountAuth):Promise<Response|null>{
 const path=new URL(request.url).pathname;
 if(!path.startsWith('/api/account/password/'))return null;
 const origin=request.headers.get('origin');
 if(origin&&origin!=='https://granttap.com')return json(403,{error:'Origin not allowed.'});
 if(request.headers.get('sec-fetch-site')==='cross-site')return json(403,{error:'Origin not allowed.'});
 const action=path.slice('/api/account/password/'.length);const credentials=new AccountPasswords(db);
 if(action==='credential')return manageCredential(request,db,auth,credentials);
 if(request.method!=='POST'||!['register','sign-in'].includes(action))return json(405,{error:'Method not allowed.'});
 const body=await boundedJSON(request);const login=normalizeLogin(body?.login);const password=body?.password;
 if(!login||typeof password!=='string'||Array.from(password).length>128
  ||(action==='register'&&!validPassword(password)))return json(400,{error:'Use a 3–64 character login and a password of 15–128 characters.'});
 const ip=request.headers.get('x-real-ip')||request.headers.get('cf-connecting-ip')||'unavailable';
 if(!await reservePasswordAttempt(db,login,ip))return limited();
 if(action==='register'){
  const accountId=await credentials.create(login,await hashPassword(password));
  return accountId?sessionResponse(request,await auth.createSession(accountId),201):json(409,{error:'This login is unavailable.'});
 }
 const credential=await credentials.byLogin(login);
 if(!await verifyPassword(password,credential?.password_hash??null))return json(401,{error:'The login or password is incorrect.'});
 const session=await auth.createSession(credential!.account_id);
 if((await credentials.byAccount(credential!.account_id))?.password_hash!==credential!.password_hash){await auth.logout(session.token);return json(401,{error:'The login or password is incorrect.'});}
 return sessionResponse(request,session);
}

async function manageCredential(request:Request,db:D1Database,auth:AccountAuth,credentials:AccountPasswords):Promise<Response>{
 const token=sessionToken(request);const accountId=await auth.accountForToken(token);
 if(!accountId)return json(401,{error:'Sign in required.'});
 if(!await auth.canManageCredentials(token))return json(403,{error:'Sign in directly with a passkey or password to manage credentials.'});
 const existing=await credentials.byAccount(accountId);
 if(request.method==='GET')return json(200,{login:existing?.login??null});
 if(request.method!=='POST')return json(405,{error:'Method not allowed.'});
 const body=await boundedJSON(request);const login=normalizeLogin(body?.login);
 if(!login||!validPassword(body?.password))return json(400,{error:'Choose a valid login and a password of 15–128 characters.'});
 const ip=request.headers.get('x-real-ip')||request.headers.get('cf-connecting-ip')||'unavailable';
 if(!await reservePasswordAttempt(db,login,ip))return limited();
 if(existing&&(typeof body?.currentPassword!=='string'||body.currentPassword.length>512
  ||!await verifyPassword(body.currentPassword,existing.password_hash)))return json(401,{error:'The current password is incorrect.'});
 const passwordHash=await hashPassword(body!.password as string);
 const saved=await credentials.set(accountId,login,passwordHash,existing?.password_hash??null);
 if(saved==='unavailable')return json(409,{error:'This login is unavailable.'});
 if(saved==='stale')return json(401,{error:'The current password is incorrect.'});
 const session=await auth.createSession(accountId);
 if((await credentials.byAccount(accountId))?.password_hash!==passwordHash){await auth.logout(session.token);return json(401,{error:'The current password is incorrect.'});}
 return sessionResponse(request,session);
}
function sessionResponse(request:Request,session:{accountId:string;token:string},status=200):Response{
 const native=!request.headers.has('origin')&&!request.headers.has('sec-fetch-site');
 return json(status,native?session:{accountId:session.accountId},{'set-cookie':sessionCookie(session.token)});
}
function limited():Response{return json(429,{error:'Too many sign-in attempts. Try again later.'},{'retry-after':'900'});}
