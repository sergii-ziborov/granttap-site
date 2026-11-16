// @vitest-environment node
import { expect, it } from "vitest";
import { accountClientAccess } from "../../hetzner/client-access.mjs";
import { SqliteD1 } from "./account-sqlite";
type AccessContext = { category: string; account?: string; device?: string; clientIp?: string };
it("uses verified account entitlement and a session-bound device, not public claims", async () => {
 const db = new SqliteD1(), account="12345678-1234-4123-8123-123456789012", token="t".repeat(43);
 db.sqlite.prepare("INSERT INTO accounts(id,created_at) VALUES(?,?)").run(account,1);
 db.sqlite.prepare("INSERT INTO account_beta_relay_grants(account_id,expires_at) VALUES(?,?)").run(account,Date.now()+60000);
 const contexts:AccessContext[]=[];
 const service=accountClientAccess({db,auth:{accountForToken:async(t:string)=>t===token?account:null},machines:{identity:async()=>null},
 env:{NODE_ENV:"test",HOSTWATCH_TRUSTED_PROXY_IPS:"127.0.0.1"},adapter:{close:async()=>{},admit:async(c:AccessContext)=>{contexts.push(c);return{allowed:true,category:c.category}}}});
 const response={setHeader(){}};
 const req={url:"/api/account/profile",headers:{cookie:`granttap_session=${token}`,"x-real-ip":"203.0.113.1","x-hostwatch-client-category":"subscriber"},socket:{remoteAddress:"127.0.0.1"}};
 expect(await service!.http(req,response)).toBe(true);
 expect(contexts[0]).toMatchObject({category:"beta",account,clientIp:"203.0.113.1"});
 expect(contexts[0].device).not.toContain(token);
 db.sqlite.prepare("UPDATE account_beta_relay_grants SET revoked_at=1 WHERE account_id=?").run(account);
 await service!.http(req,response); expect(contexts[1].category).toBe("registered");
 db.sqlite.prepare(`INSERT INTO account_sandbox_subscriptions(original_id,account_id,transaction_id,product_id,seat_limit,purchase_date,signed_date,expires_at)
  VALUES('o',?,'t','com.ziborov.granttap.personal.solo.monthly',2,1,1,?)`).run(account,Date.now()+60000);
 await service!.http(req,response); expect(contexts[2].category).toBe("beta");
 db.sqlite.prepare("DELETE FROM account_sandbox_subscriptions").run();
 contexts.splice(2,1);
 req.headers.cookie="";await service!.http(req,response);expect(contexts[2].category).toBe("anonymous");
 db.sqlite.close();
});
