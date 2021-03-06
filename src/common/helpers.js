import React from 'react'
import { Redirect } from "react-router-dom";
import { toast } from 'react-toastify';
import isEmail from 'validator/lib/isEmail';
import M from 'materialize-css';
import LS from './localStorage';
import {
  USER_KEYS,
  add,
  update,
  login,
  register,
  signIn,
  signOut,
  updatePassword,
  sendRestPasswordMail,
  updateEmail,
  updateProfile
} from './firebase';

const LOGIN = "LOGGED_USER";
// pick sub object based on given key(s) from an object
export const pick = (obj, fields) => {
  if(!obj || !fields)
    return null;
  if(typeof fields === 'string')
    fields = fields.split(',');
  return fields.reduce((picked, key) => {
    picked[key] = obj[key];
    return picked;
  }, {});
}
// delete not needed key(s) from an object
export const clear = (obj, fields) => {
  if(!obj || !fields)
    return null;
  if(typeof fields === 'string')
    fields = fields.split(',');
  fields.forEach(key => delete obj[key]);
}
// fixed format any date field => [toLocaleDateString('en-gb')]
export const formatDate = (key,format = true) => (item) => ({
  ...item,
  [key]: (format)? new Date(item[key]).toLocaleDateString('en-gb') : new Date(item[key])
});
// isAuth or not
export const isAuth = () => LS.get(LOGIN) ? true : false;
// get the user from local Storage
export const getLoggedUser = () => LS.get(LOGIN);
// reset the local storage login key [used onAuthChanged]
export const resetLSUser = (user) => LS.set(LOGIN, pick(user, USER_KEYS));
// route guard
export const routeGuard = ({ component: Component, auth: isAuthRoute, loginPath, rootAuthPath, props }) => {
  if (!isAuth() && isAuthRoute)
    return <Redirect to={loginPath} />;
  if (isAuth() && !isAuthRoute)
    return <Redirect to={rootAuthPath} />;
  return <Component {...props} />;
}
// logout by remove the login key from local storage
export const logout = async () => {
  await signOut();
  LS.remove(LOGIN);
}
// do firebase signIn and set local storage login key
export const doLogin = async ({ email, password }) => {
  try {
    let _user = await login(email, password);
    LS.set(LOGIN, _user);
    toast.info("تم تسجيل الدخول بنجاح ...");
  } catch(err) {
    toast.error(err.message);
  }
}
// do firebase signUp and set local storage login key
export const doRegister = async ({ email, password, displayName, photoURL = "" }) => {
  try {
    let _user = await register({ email, password, displayName, photoURL });
    LS.set(LOGIN, _user);
    toast.info("تم إنشاء حساب المستخدم وتسجيل الدخول بنجاح ...");
  } catch(err) {
    toast.error(err.message);
  }
}
// do firebase signUp and and add user doc and set local storage login key
export const registerUser = async (user) => {
  const { email, password, displayName, photoURL = "" } = user;
  try {
    // register user in firebase Auth
    let _user = await register({ email, password, displayName, photoURL });
    // add the other fields in the users collection by user.uid [from Auth]
    add(`users/${_user.uid}`, pick(user, 'accountStatus,accountRole,userType,nId,birthDate,address,phone,gender,maritalStatus,qualification'));
    // set the local Storage key
    LS.set(LOGIN, _user);
    // display success message to the user
    toast.info("تم إنشاء حساب المستخدم وتسجيل الدخول بنجاح ...");
  } catch(err) {
    toast.error(err.message);
  }
}
// do change user password
export const changePassword = async ({ oldPassword, newPassword }) => {
  const _user = LS.get(LOGIN);
  if(!_user)
    return toast.error("يجب تسجيل الدخول أولاً");
  try {
    await signIn(_user.email, oldPassword);
    await updatePassword(newPassword);
    toast.info("تم تغيير كلمة المرور بنجاح ...");
  } catch(err) {
    toast.error(err.message);
  }
}
// do send forget user password mail
export const forgetPassword = async (email) => {
  if (!email)
    return toast.error("يجب ادخال البريد الالكتروني");
  else if ( !isEmail(email) )
    return toast.error("بريد الكتروني غير صحيح");
  try {
    await sendRestPasswordMail(email);
    toast.info("تم ارسال رسالة لاعادة تعيين كلمة المرور إلي بريدك الالكتروني ...");
  } catch(err) {
    toast.error(err.message);
  }
}
// do update the user
export const updateUser = async ({ prevValues, newValues }) => {
  try {
    // if email changed then updateEmail
    if(newValues.email !== prevValues.email)
      await updateEmail(newValues.email);
    // if displayName and/or photoURL changed then updateProfile
    if( newValues.displayName !== prevValues.displayName || newValues.photoURL !== prevValues.photoURL )
      await updateProfile(newValues.displayName,newValues.photoURL);
    // remove the auth, meta keys from the user newValues
    let keys = [ 'id','createdAt','createdBy', ...USER_KEYS];
    clear(newValues, keys );
    // if any user value is changed then update user with its uid
    if( Object.keys(newValues).some(key => newValues[key] != prevValues[key] ) )
      await update(`users/${prevValues.uid}`, newValues);
    toast.info("تم تعديل بيانات المستخدم بنجاح ...");
  } catch(err) {
    toast.error(err.message);
  }
}
// do save a doc [add or update]
export const saveDoc = async ({ type, path, doc, message }) => {
  if(!type || !doc)
    return;
  const docId = doc.id || '';
  try {
    switch (type) {
      case 'add':
        clear(doc,['id']);
        await add(`${path}/${docId}`, doc );
        break;
      case 'update':
        clear(doc,['id','createdAt','createdBy','modifiedAt','modifiedBy']);
        await update(`${path}/${docId}`, doc );
        break;
    }
    toast.info(message);
  } catch(err) {
    toast.error(err.message);
  }
}
// do save employee [add or update]
export const saveEmployee = async ({ type, employee }) => {
  if(!type || !employee)
    return;
  const empId = employee.id;
  clear(employee,'id');
  try {
    switch (type) {
      case 'add':
        await add(`employees/${empId}`, employee );
        break;
      case 'update':
        await update(`employees/${empId}`, employee );
        break;
    }
    toast.info("لقد تم حفظ بيانات الموظف بنجاح ...");
  } catch(err) {
    toast.error(err.message);
  }
}
// initialize tabs element
export const initTabs = () => {
  M.Tabs.init(document.querySelectorAll('.tabs'), {});
}
// initialize a datepicker [one element] with the given options
export const initDatePicker = ({ pSelector = '', id= '', format, yearRange, defaultDate, onSelect }) => {
  const picker = (id)
    ? document.getElementById(id)
    : (pSelector)
      ? document.querySelector(pSelector + ' .datepicker')
      : document.querySelector('.datepicker');
  const options = {
    setDefaultDate: true,
    defaultDate,
    format,
    yearRange,
    onSelect
  }
  M.Datepicker.init(picker, options);
}
// initialize AutoComplete [elements] with the given options
// options is an Object where each key represents elementId
// and the value hold the element Autocomplete options
export const initAutoComplete = (options) => {
  const autoCompleteLists = document.querySelectorAll('.autocomplete');
  autoCompleteLists.forEach(elem => {
    M.Autocomplete.init(autoCompleteLists, options[elem.id]);
  });
}
// initialize a sideNav [elements] with empty options
export const initSideNav = ({ edge }) => {
  const elems = document.querySelectorAll('.sidenav');
  M.Sidenav.init(elems, { edge });
}
// initialize a Select [elements] with empty options
export const initSelect = () => {
  const selectLists = document.querySelectorAll('select');
  M.FormSelect.init(selectLists, {});
  // to put the selected valued if existed into the select-dropdown input
  setTimeout(() => {
    document.querySelectorAll('.select-dropdown.dropdown-trigger')
            .forEach(input => input.click());
    document.body.click();
  }, 0);
}
// hold tooltips Instances
let tooltipsIns = [];
// initialize a Tooltip [elements] with fixed options
// and store all Tooltips Instances in [tooltipsIns]
export const initTooltips = () => {
  const elems = document.querySelectorAll('.tooltipped');
  tooltipsIns = M.Tooltip.init(elems, {position: 'top'});
}
// loop through all Tooltips Instances and close them
export const closeTooltips = (instances) => {
  tooltipsIns.forEach( instance => instance.close() );
}