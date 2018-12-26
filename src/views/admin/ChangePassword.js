// react and redux Form
import React from 'react'
import { Field, reduxForm } from 'redux-form'
// validators helpers
import isLength from 'validator/lib/isLength'
// reusable Form Inputs
import { renderInput, Button } from '../../common/FormInputs';
// do ChangePassword from custom helpers
import { changePassword } from '../../common/helpers';

// basic react Form
let ChangePassword = (props) => {
  const { handleSubmit, pristine, submitting } = props;
  const _changePassword = (values) => changePassword(values);
  return (
    <form className="rtl" onSubmit={handleSubmit(_changePassword)}>
      {/* form title */}
      <h4 className="orange-text">تغيير كلمة المرور</h4>
      <div className="divider orange" />
      {/* oldPassword */}
      <Field name="oldPassword"
              type="password"
              label="كلمة المرور السابقة"
              required={true}
              component={renderInput} />
      {/* newPassword */}
      <Field name="newPassword"
              type="password"
              label="كلمة المرور الجديدة"
              required={true}
              component={renderInput} />
      {/* confirm password */}
      <Field name="confirmPassword"
              type="password"
              label="تأكيد كلمة المرور الجديدة"
              required={true}
              component={renderInput} />
      {/* Action Button */}
      <Button classes="primary darken-3"
                name="changePassword"
                icon="send"
                label="تغيير كلمة المرور"
                disabled={pristine || submitting}
      />
    </form>
  );
}
// the Form validations
// password
const validatePassword = (key, password, errors) => {
  if (!password)
    errors[key] = "يجب ادخال كلمة المرور";
  else if ( !isLength(password, { min: 8, max: 32 }) )
    errors[key] = "كلمة المرور يجب الا تقل عن 8 خانات ولا تزيد عن 32 خانة";
}
const validateConfirmPassword = (password, confirmPassword, errors) => {
  if (!confirmPassword)
    errors.confirmPassword = "يجب ادخال كلمة المرور";
  else if ( password !== confirmPassword )
    errors.confirmPassword = "تأكيد كلمة المرور غير متطابقة ...";
}
const validate = ({ oldPassword, newPassword, confirmPassword }) => {
  const errors = {};
  validatePassword("oldPassword", oldPassword, errors);
  validatePassword("newPassword", newPassword, errors);
  validateConfirmPassword(newPassword, confirmPassword, errors);
  return errors;
}

// compose reactForm with reduxForm [define the reduxForm]
ChangePassword = reduxForm({
  form: 'changePassword',
  enableReinitialize: true,
  validate
})(ChangePassword);

// exporting the composed Form
export default ChangePassword;