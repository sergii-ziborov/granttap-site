import {pbkdf2,randomBytes,timingSafeEqual} from 'node:crypto';
import {promisify} from 'node:util';
const derive=promisify(pbkdf2);
const iterations=600_000;
const dummy='pbkdf2-sha256:600000:'+Buffer.alloc(16).toString('base64url')+':'+Buffer.alloc(32).toString('base64url');
export function normalizeLogin(value:unknown):string|null {
 if(typeof value!=='string')return null;
 const login=value.trim().toLowerCase();
 return /^[a-z0-9][a-z0-9._-]{2,63}$/.test(login)?login:null;
}
export function validPassword(value:unknown):value is string {
 return typeof value==='string'&&Array.from(value.normalize('NFC')).length>=15&&Array.from(value.normalize('NFC')).length<=128;
}
export async function hashPassword(password:string):Promise<string> {
 const salt=randomBytes(16);const hash=await derive(password.normalize('NFC'),salt,iterations,32,'sha256');
 return ['pbkdf2-sha256',iterations,salt.toString('base64url'),hash.toString('base64url')].join(':');
}
export async function verifyPassword(password:string,encoded:string|null):Promise<boolean> {
 const parts=(encoded??dummy).split(':');
 const valid=parts.length===4&&parts[0]==='pbkdf2-sha256'&&parts[1]===String(iterations)
  &&/^[A-Za-z0-9_-]{22}$/.test(parts[2])&&/^[A-Za-z0-9_-]{43}$/.test(parts[3]);
 const record=valid?parts:dummy.split(':');
 const hash=await derive(password.normalize('NFC'),Buffer.from(record[2],'base64url'),iterations,32,'sha256');
 const matches=timingSafeEqual(hash,Buffer.from(record[3],'base64url'));
 return valid&&encoded!==null&&matches;
}
