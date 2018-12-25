// react and redux Form
import React from 'react'
import { Field, reduxForm } from 'redux-form'
// validators helpers
import isEmail from 'validator/lib/isEmail'
import isLength from 'validator/lib/isLength'
// reusable Form Inputs
import { renderInput, Button } from '../../common/FormInputs';
// do Login from custom helpers
import { doRegister } from '../../common/helpers';

// basic react Form
let Register = (props) => {
  const { handleSubmit, pristine, submitting } = props;
  const _doRegister = (values) => doRegister(values);
  return (
    <form className="rtl" onSubmit={handleSubmit(_doRegister)}>
      {/* form title */}
      <h4 className="orange-text">إنشاء حساب</h4>
      <div className="divider orange" />
      {/* displayName */}
      <Field name="displayName"
              label="اسم المستخدم"
              component={renderInput} />
      {/* email */}
      <Field name="email"
              label="البريد الالكتروني"
              component={renderInput} />
      {/* password */}
      <Field name="password"
              type="password"
              label="كلمة المرور"
              component={renderInput} />
      {/* confirm password */}
      <Field name="confirmPassword"
              type="password"
              label="تأكيد كلمة المرور"
              component={renderInput} />
      {/* photoURL */}
      <Field name="photoURL"
              label="رابط الصورة الشخصية"
              component={renderInput} />
      {/* Action Button */}
      <Button classes="primary darken-3"
                name="login"
                icon="send"
                label="إنشاء حساب"
                disabled={pristine || submitting}
      />
    </form>
  );
}
// the Form validations
// displayName
const validateDisplayName = (displayName, errors) => {
  if (!displayName)
    errors.displayName = "يجب ادخال اسم المستخدم";
  else if ( !displayName.alpha('ar') )
    errors.displayName = "يجب ان يحتوي اسم المستخدم علي حروف عربية فقط";
}
// email
const validateEmail = (email, errors) => {
  if (!email)
    errors.email = "يجب ادخال البريد الالكتروني";
  else if ( !isEmail(email) )
    errors.email = "بريد الكتروني غير صحيح";
}
// password
const validatePassword = (password, errors) => {
  if (!password)
    errors.password = "يجب ادخال كلمة المرور";
  else if ( !isLength(password, { min: 8, max: 32 }) )
    errors.password = "كلمة المرور يجب الا تقل عن 8 خانات ولا تزيد عن 32 خانة";
}
const validateConfirmPassword = (password, confirmPassword, errors) => {
  if (!confirmPassword)
    errors.confirmPassword = "يجب ادخال كلمة المرور";
  else if ( password !== confirmPassword )
    errors.confirmPassword = "تأكيد كلمة المرور غير متطابقة ...";
}
const validate = ({ displayName, email, password, confirmPassword }) => {
  const errors = {};
  validateDisplayName(displayName, errors);
  validateEmail(email, errors);
  validatePassword(password, errors);
  validateConfirmPassword(password, confirmPassword,errors);
  return errors;
}

// compose reactForm with reduxForm [define the reduxForm]
Register = reduxForm({
  form: 'register',
  enableReinitialize: true,
  validate
})(Register);

// exporting the composed Form
export default Register;