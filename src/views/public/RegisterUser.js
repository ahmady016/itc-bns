// react and redux Form
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm, change } from 'redux-form'
// validators helpers
import isEmail from 'validator/lib/isEmail'
import isLength from 'validator/lib/isLength'
import isNumeric from 'validator/lib/isNumeric'
// redux db [firebase] actions
import { dbActions } from '../../redux/db'
// reusable Form Inputs
import {
  renderInput,
  renderDatepicker,
  renderSelect,
  Button
} from '../../common/FormInputs';
// from custom helpers
import { registerUser, initDatePicker, initSelect } from '../../common/helpers';

// the reduxForm name
const formName = 'register';

// #region basic react Form
class RegisterForm extends Component {
  // do the user registeration
  doRegisterUser = async (values) => {
    const { match: { params }, userTypes, history } = this.props;
    // append the needed values
    values = {
      ...values,
      "accountStatus": "انتظار",
      "accountRole": userTypes.value[params.userType],
      "userType": userTypes.value[params.userType]
    }
    // do register the user
    await registerUser(values);
    // go to the root route
    history.push('/admin');
  }
  // hold the select options
  state = {
    genders: [],
    maritalStatuses: []
  };
  // update the state [select options] from props [redux db]
  static getDerivedStateFromProps(nextProps, prevState) {
    if( (nextProps.genders && nextProps.genders.value.length) &&
        (nextProps.maritalStatuses && nextProps.maritalStatuses.value.length) )
      return {
        genders: nextProps.genders.value,
        maritalStatuses: nextProps.maritalStatuses.value
      };
    return null;
  }
  // to reInitialize the materializecss select component after the state changes
  componentDidUpdate(prevProps, prevState) {
    if ( Array.isArray(prevState.genders) && prevState.genders.length !== this.state.genders.length &&
         Array.isArray(prevState.maritalStatuses) && prevState.maritalStatuses.length !== this.state.maritalStatuses.length )
      // init the select [dropdown]
      initSelect();
  }
  // to initialize the datepicker and to mount all realtime updates db listeners
  componentDidMount() {
    const { dispatch } = this.props;
    // init the select [dropdown]
    initSelect();
    // init Materialize datePicker
    const currentYear = (new Date()).getFullYear();
    initDatePicker({
      format: 'dd/mm/yyyy',
      yearRange: [currentYear-70,currentYear+30],
      defaultDate: new Date(),
      onSelect: (selectedDate) => {
        dispatch(change(formName, 'birthDate', selectedDate.toLocaleDateString('en-gb') ));
      }
    });
    // get db state
    dbActions.mountListeners([
      { key: "userTypes",       path: "lookup/userTypes" },
      { key: "genders",         path: "lookup/genders" },
      { key: "maritalStatuses", path: "lookup/maritalStatuses" }
    ]);
  }
  // to remove all realtime updates db listeners
  componentWillUnmount() {
		console.log("​------------------------------------------------------------------------------")
		console.log("​Register -> componentWillUnmount -> clearListeners")
		console.log("​------------------------------------------------------------------------------")
    dbActions.clearListeners();
  }
  // react render
  render() {
    const { handleSubmit, pristine, submitting } = this.props;
    const { genders, maritalStatuses } = this.state;
    return (
      <form className="rtl" onSubmit={handleSubmit(this.doRegisterUser)}>
        {/* form title */}
        <h4 className="orange-text">إنشاء حساب</h4>
        <div className="divider orange" />
        {/* displayName */}
        <Field name="displayName"
                label="الاسم بالكامل"
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
        {/* nId */}
        <Field name="nId"
                label="الرقم القومي"
                component={renderInput} />
        {/* birthDate */}
        <Field name="birthDate"
                type="datepicker"
                label="تاريخ الميلاد"
                component={renderDatepicker} />
        {/* address */}
        <Field name="address"
                label="العنوان"
                component={renderInput} />
        {/* phone */}
        <Field name="phoneNumber"
                label="رقم المحمول"
                component={renderInput} />
        {/* gender */}
        <Field name="gender"
                label="النوع"
                options={genders}
                component={renderSelect} />
        {/* maritalStatus */}
        <Field name="maritalStatus"
                label="الحالة الاجتماعية"
                options={maritalStatuses}
                component={renderSelect} />
        {/* qualification */}
        <Field name="qualification"
                label="المؤهل"
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
}
// #endregion

// #region the Form validations
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
const validateNId = (nId, errors) => {
  if (!nId)
    errors.nId = "يجب ادخال رقم البطاقة ...";
  else if ( !isLength(nId, { min: 14, max: 14 }) )
    errors.nId = "يجب ألا يزيد وألا يقل رقم البطاقة عن 14 رقم ...";
  else if ( !isNumeric(nId, { no_symbols: true }) )
    errors.nId = "يجب أن يحتوي رقم البطاقة علي أرقام فقط ...";    
}
const validatePhoneNumber = (phoneNumber, errors) => {
  if (!phoneNumber)
    errors.phoneNumber = "يجب ادخال رقم المحمول ...";
  else if ( !isLength(phoneNumber, { min: 11, max: 11 }) )
    errors.phoneNumber = "يجب ألا يزيد وألا يقل رقم المحمول عن 11 رقم ...";
  else if ( !isNumeric(phoneNumber, { no_symbols: true }) )
    errors.phoneNumber = "يجب أن يحتوي رقم المحمول علي أرقام فقط ...";    
}
const validate = ({ displayName, email, password, confirmPassword, nId, phoneNumber }) => {
  const errors = {};
  validateDisplayName(displayName, errors);
  validateEmail(email, errors);
  validatePassword(password, errors);
  validateConfirmPassword(password, confirmPassword, errors);
  validateNId(nId, errors);
  validatePhoneNumber(phoneNumber, errors);
  return errors;
}
// #endregion

// compose reactForm with reduxForm [define the reduxForm]
const RegisterReduxForm = reduxForm({
  form: formName,
  enableReinitialize: true,
  validate
})(RegisterForm);

// get the db values from redux state
const mapStateToProps = (state) => ({
  ...state.db
});

// exporting the composed Form with the redux state
export default connect(mapStateToProps)(RegisterReduxForm);