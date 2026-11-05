"use client";
import {useState,type FormEvent} from 'react';
class PasswordFeedback extends Error {}
export function AccountPassword({locale,onSignedIn,onBusyChange,disabled=false}:{locale:'en'|'ru';onSignedIn:(accountId:string)=>void;onBusyChange:(value:boolean)=>void;disabled?:boolean}){
 const ru=locale==='ru';const [register,setRegister]=useState(false);const [login,setLogin]=useState('');
 const [password,setPassword]=useState('');const [confirmation,setConfirmation]=useState('');
 const [busy,setBusy]=useState(false);const [error,setError]=useState('');
 const normalized=login.trim().toLowerCase();const length=Array.from(password.normalize('NFC')).length;
 const valid=/^[a-z0-9][a-z0-9._-]{2,63}$/.test(normalized)&&length>0&&length<=128&&(!register||length>=15&&password===confirmation);
 async function submit(event:FormEvent){
  event.preventDefault();if(!valid||busy||disabled)return;setBusy(true);onBusyChange(true);setError('');
  try{
   const response=await fetch('/api/account/password/'+(register?'register':'sign-in'),{method:'POST',credentials:'same-origin',headers:{'content-type':'application/json'},body:JSON.stringify({login:normalized,password})});
   if(response.status===401)throw new PasswordFeedback(ru?'Неверный логин или пароль.':'The login or password is incorrect.');
   if(response.status===409)throw new PasswordFeedback(ru?'Этот логин недоступен. Выберите другой.':'This login is unavailable. Choose another login.');
   if(response.status===429)throw new PasswordFeedback(ru?'Слишком много попыток. Повторите через 15 минут.':'Too many attempts. Try again in 15 minutes.');
   if(!response.ok)throw new PasswordFeedback(ru?'Вход временно недоступен. Повторите позже.':'Sign-in is temporarily unavailable. Try again later.');
   const body=await response.json();if(!body||typeof body.accountId!=='string'||!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(body.accountId))throw new PasswordFeedback(ru?'Не удалось подтвердить вход.':'The sign-in response could not be confirmed.');
   setPassword('');setConfirmation('');onSignedIn(body.accountId);
  }catch(cause){setError(cause instanceof PasswordFeedback?cause.message:(ru?'Вход временно недоступен. Повторите позже.':'Sign-in is temporarily unavailable. Try again later.'));}
  finally{setBusy(false);onBusyChange(false);}
 }
 return <form className="account-password-form" onSubmit={event=>void submit(event)} aria-busy={busy}>
  <h2>{register?(ru?'Создать аккаунт':'Create account'):(ru?'Вход с паролем':'Sign in with password')}</h2>
  <fieldset disabled={busy||disabled}>
   <legend>{ru?'Аккаунт GrantTap':'GrantTap account'}</legend>
   <label>
    {ru?'Логин GrantTap':'GrantTap login'}
    <input autoComplete="username" autoCapitalize="none" spellCheck={false} required maxLength={64}
     value={login} onChange={event=>setLogin(event.target.value)} />
   </label>
   <label>
    {ru?'Пароль':'Password'}
    <input type="password" autoComplete={register?'new-password':'current-password'} required maxLength={256}
     value={password} onChange={event=>setPassword(event.target.value)} />
   </label>
   {register&&<label>
    {ru?'Повторите пароль':'Confirm password'}
    <input type="password" autoComplete="new-password" required maxLength={256}
     value={confirmation} onChange={event=>setConfirmation(event.target.value)} />
   </label>}
   {register&&<p className="account-password-hint">
    {ru?'15–128 символов. Можно использовать пробелы и длинную фразу.':'15–128 characters. Spaces and passphrases are welcome.'}
   </p>}
   {error&&<p role="alert" className="account-error">{error}</p>}
   <button type="submit" disabled={!valid}>
    {register?(ru?'Создать аккаунт':'Create account'):(ru?'Войти':'Sign in')}
   </button>
   <label className="account-password-register">
    <input type="checkbox" checked={register} onChange={event=>{
     setRegister(event.target.checked);setPassword('');setConfirmation('');setError('');
    }} />
    {ru?'Создать новый аккаунт':'Create a new account'}
   </label>
  </fieldset>
  {busy&&<p role="status" className="account-password-status">{ru?'Входим…':'Signing in…'}</p>}
  <p className="account-password-boundary">
   {ru?'Аккаунты coding-провайдеров подключаются отдельно.':'Coding-provider accounts are connected separately.'}
  </p>
 </form>;
}
