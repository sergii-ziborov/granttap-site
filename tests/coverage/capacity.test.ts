// @vitest-environment node
import {expect,it} from 'vitest';
import {SqliteD1} from './account-sqlite';
import {authoritySnapshot} from '../../hetzner/capacity/index.mjs';
import {capacityIdentity} from '../../hetzner/capacity/client.mjs';
import {mkdtempSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
it('authority exports only keyed identities and verified current tiers, keeping devices unknown where no registry exists',async()=>{
 const db=new SqliteD1(),id='12345678-1234-4123-8123-123456789012';
 db.sqlite.prepare('INSERT INTO accounts(id,created_at) VALUES(?,?)').run(id,1);
 db.sqlite.prepare('INSERT INTO account_beta_relay_grants(account_id,expires_at) VALUES(?,?)').run(id,Date.now()+60000);
 const value=await authoritySnapshot(db,capacityIdentity(Buffer.from('k'.repeat(64))));
 expect(value.inventory[0].tier).toBe('beta');expect(JSON.stringify(value)).not.toContain(id);
 expect(value.gauges.registeredControllers).toBeNull();expect(value.gauges.registeredComputers).toBe(0);
 db.sqlite.prepare('UPDATE account_beta_relay_grants SET revoked_at=1').run();
 expect((await authoritySnapshot(db,capacityIdentity(Buffer.from('k'.repeat(64))))).inventory[0].tier).toBe('expired');
 db.sqlite.close();
});
it('measures an absent WAL as zero only when the configured database itself is measurable',async()=>{
 const db=new SqliteD1(),directory=mkdtempSync(join(tmpdir(),'granttap-capacity-')),path=join(directory,'accounts.sqlite');
 try{
  const tag=capacityIdentity(Buffer.from('k'.repeat(64)));
  expect((await authoritySnapshot(db,tag,Date.now(),path)).gauges.walBytes).toBeNull();
  writeFileSync(path,Buffer.alloc(32));
  const value=await authoritySnapshot(db,tag,Date.now(),path);
  expect(value.gauges.databaseBytes).toBe(32);expect(value.gauges.walBytes).toBe(0);
  writeFileSync(path+'-wal',Buffer.alloc(64));
  expect((await authoritySnapshot(db,tag,Date.now(),path)).gauges.walBytes).toBe(64);
 }finally{db.sqlite.close();rmSync(directory,{recursive:true,force:true});}
});
