// react and redux Form
import React from 'react';
import { Field, reduxForm } from 'redux-form';
// validators helpers
import isEmail from 'validator/lib/isEmail'
import isLength from 'validator/lib/isLength'
// reusable Form Inputs
import { renderInput, Button } from '../../common/FormInputs';
// do Login from custom helpers
import { doLogin } from '../../common/helpers';

// basic react Form
let Login = (props) => {
  const { handleSubmit, pristine, submitting } = props;
  const _doLogin = (values) => doLogin(values);
  return (
    <form className="rtl" onSubmit={handleSubmit(_doLogin)}>
      {/* form title */}
      <h4 className="orange-text">تسجيل دخول مستخدم</h4>
      <div className="divider orange" />
      {/* email */}
      <Field name="email"
              label="البريد الالكتروني"
              component={renderInput} />
      {/* password */}
      <Field name="password"
              type="password"
              label="كلمة المرور"
              component={renderInput} />
      {/* Action Button */}
      <Button classes="primary darken-3"
                name="login"
                icon="send"
                label="تسجيل دخول"
                disabled={pristine || submitting}
      />
    </form>
  );
}
// the Form validations
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
const validate = ({ email, password }) => {
  const errors = {};
  validateEmail(email, errors);
  validatePassword(password, errors);
  return errors;
}

// compose reactForm with reduxForm [define the reduxForm]
Login = reduxForm({
  form: 'login',
  enableReinitialize: true,
  validate
})(Login);

// exporting the composed Form
export default Login;