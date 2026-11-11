import {fireEvent,render,screen,waitFor} from '@testing-library/react';
import {expect,test,vi} from 'vitest';
import {AccountPassword} from '..';
const password='A dedicated fixture passphrase';
const accountId='00000000-0000-4000-8000-000000000001';
function fill(){fireEvent.change(screen.getByLabelText('GrantTap login'),{target:{value:' Review.Fixture '}});fireEvent.change(screen.getByLabelText('Password'),{target:{value:password}});}

test('submits credentials in the body and adopts only the account identity without browser bearer storage',async()=>{
 const fetch=vi.fn().mockResolvedValue({ok:true,status:200,json:async()=>({accountId})});vi.stubGlobal('fetch',fetch);
 const signed=vi.fn(),busy=vi.fn();render(<AccountPassword locale="en" onSignedIn={signed} onBusyChange={busy}/>);fill();fireEvent.click(screen.getByRole('button',{name:'Sign in'}));
 await waitFor(()=>expect(signed).toHaveBeenCalledWith(accountId));
 const [path,options]=fetch.mock.calls[0];expect(path).toBe('/api/account/password/sign-in');expect(options.credentials).toBe('same-origin');
 expect(JSON.parse(options.body)).toEqual({login:'review.fixture',password});expect(options.headers.authorization).toBeUndefined();
 expect(busy).toHaveBeenCalledWith(true);expect(busy).toHaveBeenLastCalledWith(false);expect(screen.getByLabelText('Password')).toHaveProperty('value','');
 vi.unstubAllGlobals();
});

test('registration requires a long confirmed password and retains the normal passkey route in the parent',async()=>{
 const fetch=vi.fn().mockResolvedValue({ok:true,status:201,json:async()=>({accountId})});vi.stubGlobal('fetch',fetch);
 render(<AccountPassword locale="en" onSignedIn={()=>{}} onBusyChange={()=>{}}/>);
 fireEvent.click(screen.getByRole('radio',{name:'Create account'}));fill();
 expect(screen.getByRole('button',{name:'Create account'})).toHaveProperty('disabled',true);
 fireEvent.change(screen.getByLabelText('Confirm password'),{target:{value:password}});
 fireEvent.click(screen.getByRole('button',{name:'Create account'}));
 await waitFor(()=>expect(fetch).toHaveBeenCalled());expect(fetch.mock.calls[0][0]).toBe('/api/account/password/register');vi.unstubAllGlobals();
});

test.each([401,409,429,503])('shows a bounded localized failure for HTTP %s and never treats it as sign-in',async status=>{
 vi.stubGlobal('fetch',vi.fn().mockResolvedValue({ok:false,status}));const signed=vi.fn();render(<AccountPassword locale="en" onSignedIn={signed} onBusyChange={()=>{}}/>);fill();
 fireEvent.click(screen.getByRole('button',{name:'Sign in'}));expect(await screen.findByRole('alert')).toBeTruthy();expect(signed).not.toHaveBeenCalled();vi.unstubAllGlobals();
});

test('unexpected network and malformed server data never appear as diagnostic details',async()=>{
 const fetch=vi.fn().mockRejectedValueOnce(Error('Private diagnostic fixture')).mockResolvedValue({ok:true,status:200,json:async()=>({accountId:'invalid'})});vi.stubGlobal('fetch',fetch);
 const signed=vi.fn();render(<AccountPassword locale="en" onSignedIn={signed} onBusyChange={()=>{}}/>);fill();fireEvent.click(screen.getByRole('button',{name:'Sign in'}));
 expect(await screen.findByRole('alert')).toHaveProperty('textContent','Sign-in is temporarily unavailable. Try again later.');
 fireEvent.click(screen.getByRole('button',{name:'Sign in'}));await waitFor(()=>expect(screen.getByRole('alert').textContent).toContain('could not be confirmed'));expect(signed).not.toHaveBeenCalled();vi.unstubAllGlobals();
});
