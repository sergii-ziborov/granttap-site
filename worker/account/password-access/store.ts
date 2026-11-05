import {randomUUID} from 'node:crypto';
import type {D1Database} from '@cloudflare/workers-types';
export type PasswordCredential={account_id:string;login:string;password_hash:string};
export class AccountPasswords {
 constructor(private readonly db:D1Database){}
 async byLogin(login:string){return this.db.prepare('SELECT account_id,login,password_hash FROM account_password_credentials WHERE login=?').bind(login).first<PasswordCredential>();}
 async byAccount(accountId:string){return this.db.prepare('SELECT account_id,login,password_hash FROM account_password_credentials WHERE account_id=?').bind(accountId).first<PasswordCredential>();}
 async create(login:string,passwordHash:string):Promise<string|null>{
  const accountId=randomUUID();
  try{
   await this.db.batch([
    this.db.prepare('INSERT INTO accounts(id,created_at) VALUES(?,?)').bind(accountId,Date.now()),
    this.db.prepare('INSERT INTO account_password_credentials(account_id,login,password_hash,updated_at) VALUES(?,?,?,?)').bind(accountId,login,passwordHash,Date.now()),
   ]);return accountId;
  }catch(error){if(uniqueLogin(error))return null;throw error;}
 }
 async set(accountId:string,login:string,passwordHash:string,expectedHash:string|null):Promise<'saved'|'unavailable'|'stale'>{
  const write=expectedHash===null
   ?this.db.prepare('INSERT INTO account_password_credentials(account_id,login,password_hash,updated_at) VALUES(?,?,?,?) ON CONFLICT(account_id) DO NOTHING').bind(accountId,login,passwordHash,Date.now())
   :this.db.prepare('UPDATE account_password_credentials SET login=?,password_hash=?,updated_at=? WHERE account_id=? AND password_hash=?').bind(login,passwordHash,Date.now(),accountId,expectedHash);
  try{
   const [updated]=await this.db.batch([
    write,
    this.db.prepare('DELETE FROM sessions WHERE account_id=? AND EXISTS(SELECT 1 FROM account_password_credentials WHERE account_id=? AND password_hash=?)').bind(accountId,accountId,passwordHash),
   ]);
   const count=updated.meta?.changes??(updated as unknown as {changes:number}).changes;
   return count===1?'saved':'stale';
  }catch(error){if(uniqueLogin(error))return 'unavailable';throw error;}
 }

}

function uniqueLogin(error:unknown):boolean{return error instanceof Error&&/UNIQUE constraint failed: account_password_credentials\.(?:login|account_id)/.test(error.message);}
