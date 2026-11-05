import {createHash} from 'node:crypto';
import type {D1Database} from '@cloudflare/workers-types';
const windowMs=15*60_000;
export async function reservePasswordAttempt(db:D1Database,login:string,ip:string,now=Date.now()):Promise<boolean> {
 await db.prepare('DELETE FROM account_password_attempts WHERE expires_at<=?').bind(now).run();
 for(const [scope,value,limit] of [['address',ip,30],['login',login,12]] as const){
  const bucket=scope+':'+createHash('sha256').update(value).digest('hex');
  const row=await db.prepare('INSERT INTO account_password_attempts(bucket,attempts,expires_at) '
   +'SELECT ?,1,? WHERE (SELECT count(*) FROM account_password_attempts)<10000 '
   +'ON CONFLICT(bucket) DO UPDATE SET attempts=attempts+1 WHERE attempts<? RETURNING attempts')
   .bind(bucket,now+windowMs,limit).first<{attempts:number}>();
  if(!row)return false;
 }
 return true;
}
