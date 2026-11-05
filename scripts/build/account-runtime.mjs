import {build} from 'esbuild';
import {mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import {isBuiltin} from 'node:module';
import {createHash} from 'node:crypto';
mkdirSync('.runtime/account/hetzner',{recursive:true});
const result=await build({entryPoints:['hetzner/server.mjs'],outfile:'.runtime/account/hetzner/server.mjs',bundle:true,minifySyntax:true,define:{'process.env.WS_NO_BUFFER_UTIL':'"1"','process.env.WS_NO_UTF_8_VALIDATE':'"1"'},format:'esm',platform:'node',target:'node22',metafile:true,banner:{js:'import {createRequire as accountRequire} from "node:module";const require=accountRequire(import.meta.url);'}});
const imports=[...new Set(Object.values(result.metafile.outputs).flatMap(output=>output.imports.filter(item=>item.external).map(item=>item.path)))];
if(imports.some(name=>!isBuiltin(name)))throw Error('The account server has an undeclared runtime dependency: '+imports.filter(name=>!isBuiltin(name)).join(', '));
writeFileSync('.runtime/account/proof.json',JSON.stringify({externalImports:imports,sha256:createHash('sha256').update(readFileSync('.runtime/account/hetzner/server.mjs')).digest('hex')},null,2)+'\n');
