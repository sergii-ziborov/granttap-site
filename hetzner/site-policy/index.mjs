import {canonicalRedirect,siteHeaders} from '../../worker/site-policy/index.ts';

/** Apply the same public HTTP contract to Node pages, files and downloads. */
export function installSitePolicy(server) {
  const listeners=server.listeners('request');
  server.removeAllListeners('request');
  server.on('request',(request,response)=>{
    const forwarded=request.headers['x-forwarded-proto']?.split(',')[0].trim();
    const protocol=forwarded==='https'?'https':'http';
    let url;
    try {url=new URL(request.url,`${protocol}://${request.headers.host||'localhost'}`);}
    catch {response.writeHead(400);response.end();return;}
    siteHeaders(protocol==='https').forEach((value,key)=>response.setHeader(key,value));
    const redirect=canonicalRedirect(url);
    if(redirect){response.writeHead(308,{Location:redirect.href});response.end();return;}
    for(const listener of listeners)listener.call(server,request,response);
  });
}
