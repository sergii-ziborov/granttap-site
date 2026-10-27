import {statSync} from 'node:fs';
import {ManagedSubscriptions} from '../../worker/account/subscriptions/index.ts';
import {capacityReporter} from './client.mjs';

/** @param {string | null} [databasePath] */
export async function authoritySnapshot(db,tag,now=Date.now(),databasePath=null){
 const ledger=new ManagedSubscriptions(db,()=>now),inventory=[];
 const rows=(await db.prepare('SELECT id FROM accounts ORDER BY created_at LIMIT 4097').bind().all()).results;
 for(const row of rows.slice(0,4096)){
  const right=await ledger.entitlement(row.id);
  let inactive=false;
  if(!right){
   const receipt=await db.prepare('SELECT expires_at,revoked FROM account_subscriptions WHERE account_id=? ORDER BY purchase_date DESC,signed_date DESC LIMIT 1').bind(row.id).first();
   const beta=receipt?null:await db.prepare('SELECT expires_at,revoked_at FROM account_beta_relay_grants WHERE account_id=?').bind(row.id).first();
   inactive=receipt?Boolean(receipt.revoked)||receipt.expires_at<=now:beta?beta.revoked_at!=null||beta.expires_at<=now:false;
  }
  inventory.push({tag:tag('account',row.id),tier:right?.source==='beta'?'beta':right?.source==='subscription'?right.isTrial?'trial':'paid':inactive?'expired':'unknown',synthetic:false});
 }
 const computers=(await db.prepare(`SELECT m.id,m.account_id,max(coalesce(m.last_seen_at,0),coalesce(e.updated_at,0)) AS last_seen
  FROM account_machines m LEFT JOIN account_machine_endpoints e ON e.machine_id=m.id
  WHERE m.revoked_at IS NULL LIMIT 4097`).bind().all()).results;
 const fileBytes=(path,missing=null)=>{try{return path?statSync(path).size:null;}catch(error){return error.code==='ENOENT'?missing:null;}};
 const databaseBytes=fileBytes(databasePath);
 return {inventory,computerRegistry:computers.slice(0,4096).map(x=>({tag:tag('computer',`${x.account_id}:${x.id}`),account:tag('account',x.account_id)})),complete:rows.length<=4096&&computers.length<=4096,
  entities:computers.slice(0,4096).filter(x=>x.last_seen>now-86400000&&x.last_seen<=now).map(x=>({tag:tag('computer',`${x.account_id}:${x.id}`),account:tag('account',x.account_id),kind:'computer',online:false,lastSeen:new Date(x.last_seen).toISOString()})),
  gauges:{registeredComputers:computers.length<=4096?computers.length:null,registeredControllers:null,
   databaseBytes,walBytes:databaseBytes==null?null:fileBytes(databasePath+'-wal',0)},counters:{},latencies:{}};
}
export function startAuthorityCapacity(db,env=process.env,controlSockets=()=>null){
 const seen=new Map();
 const reporter=capacityReporter({env,source:'authority',snapshot:async tag=>{
  const value=await authoritySnapshot(db,tag,Date.now(),env.GRANTTAP_ACCOUNT_DB);
  for(const [key,e] of seen){if(Date.now()-Date.parse(e.lastSeen)>86400000)seen.delete(key);else value.entities.push(e);}
  value.gauges.webControlSockets=controlSockets();return value;
 }});
 if(!reporter)return null;
 return {...reporter,accountSeen(account){
  const tag=reporter.identity('account',account);seen.delete(tag);
  seen.set(tag,{tag,account:tag,kind:'account',online:false,lastSeen:new Date().toISOString()});if(seen.size>4096)seen.delete(seen.keys().next().value);
 }};
}
