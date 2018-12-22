import M from 'materialize-css';
import { toast } from 'react-toastify';
import isEmail from 'validator/lib/isEmail';
import LS from './localStorage';
import {
  register,
  login,
  signIn,
  updatePassword,
  sendRestPasswordMail,
  add
} from './firebase';

const LOGIN = "LOGGED_USER";
// pick sub object based on given key(s) from an object
export const pick = (obj, fields) => {
  if(!obj)
    return null;
  return fields.split(',').reduce( (picked,key) => {
    picked[key] = obj[key];
    return picked
  },{});
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
// initailize a datepicker [one element] with the given options
export const initDatePicker = ({ format, yearRange, defaultDate, onSelect }) => {
  const picker = document.querySelector(".datepicker");
  const options = {
    setDefaultDate: true,
    defaultDate,
    format,
    yearRange,
    onSelect
  }
  M.Datepicker.init(picker, options);
}
// initailize AutoComplete [elements] with the given options
// options is an Object where each key represents elementId
// and the value hold the element Autocomplete options
export const initAutoComplete = (options) => {
  const autoCompleteLists = document.querySelectorAll('.autocomplete');
  autoCompleteLists.forEach(elem => {
    M.Autocomplete.init(autoCompleteLists, options[elem.id]);
  });
}
// initailize a Select [elements] with empty options
export const initSelect = () => {
  const selectLists = document.querySelectorAll('select');
  M.FormSelect.init(selectLists, {});
}
// hold tooltips Instances
let tooltipsIns = [];
// initailize a Tooltip [elements] with fixed options
// and store all Tooltips Instances in [tooltipsIns]
export const initTooltips = () => {
  const elems = document.querySelectorAll('.tooltipped');
  tooltipsIns = M.Tooltip.init(elems, {position: 'top'});
}
// loop through all Tooltips Instances and close them
export const closeTooltips = (instances) => {
  tooltipsIns.forEach( instance => instance.close() );
}
// fixed format any date field => [toLocaleDateString('en-gb')]
export const formatDate = (key,format = true) => (item) => ({
  ...item,
  [key]: (format)? new Date(item[key]).toLocaleDateString('en-gb') : new Date(item[key])
});