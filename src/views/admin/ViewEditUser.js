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
import { initDatePicker, initSelect, getLoggedUser } from '../../common/helpers';

// the reduxForm name
const formName = 'viewEditUser';

// #region basic react Form
class UserForm extends Component {
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
  // to initialize the datepicker and to mount all realtime updates db listeners
  componentDidMount() {
    const { dispatch, match: { params } } = this.props;
    // init the select [dropdown]
    initSelect();
    // init Materialize datePicker
    const currentYear = (new Date()).getFullYear();
    initDatePicker({
      format: 'dd/mm/yyyy',
      yearRange: [currentYear-70,currentYear-7],
      onSelect: (selectedDate) => {
        dispatch(change(formName, 'birthDate', selectedDate.toLocaleDateString('en-gb') ));
      }
    });
    // get db state
    dbActions.mountListeners([
      { key: "userTypes",       path: "lookup/userTypes" },
      { key: "genders",         path: "lookup/genders" },
      { key: "maritalStatuses", path: "lookup/maritalStatuses" },
      { key: "user", path: `users/${params.id}` }
    ]);
  }
  // to reInitialize the materializecss select component after the state changes
  componentDidUpdate(prevProps, prevState) {
    if ( Array.isArray(prevState.genders) && prevState.genders.length !== this.state.genders.length &&
          Array.isArray(prevState.maritalStatuses) && prevState.maritalStatuses.length !== this.state.maritalStatuses.length )
      // init the select [dropdown]
      initSelect();
  }
  componentWillUnmount() {
    // to remove all firebase db realtime updates listeners
    dbActions.clearListeners();
  }
  // react render
  render() {
    const { handleSubmit, pristine, submitting } = this.props;
    const { genders, maritalStatuses } = this.state;
    return (
      <form className="rtl" onSubmit={handleSubmit(console.log)}>
        {/* form title */}
        <h4 className="orange-text">عرض - تعديل بيانات مستخدم</h4>
        <div className="divider orange" />
        {/* displayName */}
        <Field name="displayName"
                label="الاسم بالكامل"
                required={true}
                component={renderInput} />
        {/* email */}
        <Field name="email"
                label="البريد الالكتروني"
                required={true}
                component={renderInput} />
      {/* photoURL */}
      <Field name="photoURL"
              label="رابط الصورة الشخصية"
              component={renderInput} />
        {/* nId */}
        <Field name="nId"
                label="الرقم القومي"
                required={true}
                component={renderInput} />
        {/* phone */}
        <Field name="phoneNumber"
                label="رقم المحمول"
                required={true}
                component={renderInput} />
        {/* birthDate */}
        <Field name="birthDate"
                type="datepicker"
                label="اختر تاريخ الميلاد"
                required={true}
                component={renderDatepicker} />
      {/* birthLocation */}
      <Field name="birthLocation"
              label="محل الميلاد"
              component={renderInput} />
        {/* address */}
        <Field name="address"
                label="العنوان"
                required={true}
                component={renderInput} />
        {/* gender */}
        <Field name="gender"
                label="النوع"
                required={true}
                options={genders}
                component={renderSelect} />
        {/* maritalStatus */}
        <Field name="maritalStatus"
                label="الحالة الاجتماعية"
                required={true}
                options={maritalStatuses}
                component={renderSelect} />
        {/* qualification */}
        <Field name="qualification"
                label="المؤهل"
                required={true}
                component={renderInput} />
        {/* Action Button */}
        <Button classes="primary darken-3"
                  name="updateUser"
                  icon="send"
                  label="حفظ التعديل"
                  disabled={pristine || submitting}
        />
      </form>
    );
  }
}
// #endregion

// #region the Form validations
const validateDisplayName = (displayName, errors) => {
  if (!displayName)
    errors.displayName = "يجب ادخال اسم المستخدم";
  else if ( !displayName.alpha('ar') )
    errors.displayName = "يجب ان يحتوي اسم المستخدم علي حروف عربية فقط";
  else if ( !isLength(displayName, { min: 10, max: 80 }) )
    errors.displayName = "يجب الا يقل اسم المستخدم عن 10 احرف والا يزيد عن 80 حرف ...";
}
const validateEmail = (email, errors) => {
  if (!email)
    errors.email = "يجب ادخال البريد الالكتروني";
  else if ( !isEmail(email) )
    errors.email = "بريد الكتروني غير صحيح";
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
const validateBirthDate = (birthDate, errors) => {
  if (!birthDate)
    errors.birthDate = "يجب اختيار تاريخ الميلاد ...";
}
const validateGender = (gender, errors) => {
  if (!gender)
    errors.gender = "يجب اختيار النوع ...";
}
const validateMaritalStatus = (maritalStatus, errors) => {
  if (!maritalStatus)
    errors.maritalStatus = "يجب اختيار الحالة الاجتماعية ...";
}
const validate = (values) => {
  const { displayName, email, password, confirmPassword, nId, phoneNumber, gender, maritalStatus, birthDate } = values;
  const errors = {};
  validateDisplayName(displayName, errors);
  validateEmail(email, errors);
  validateNId(nId, errors);
  validatePhoneNumber(phoneNumber, errors);
  validateBirthDate(birthDate, errors);
  validateGender(gender, errors);
  validateMaritalStatus(maritalStatus, errors);
  return errors;
}
// #endregion

// compose reactForm with reduxForm [define the reduxForm]
const UserReduxForm = reduxForm({
  form: formName,
  enableReinitialize: true,
  validate
})(UserForm);

// get the db values from redux state
const mapStateToProps = (state) => ({
  ...state.db,
  "initialValues": {
    ...getLoggedUser(),
    ...state.db.user
  }
});

// exporting the composed Form with the redux state
export default connect(mapStateToProps)(UserReduxForm);