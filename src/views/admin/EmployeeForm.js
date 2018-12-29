// react and redux Form
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm, change } from 'redux-form'
// validators helpers
import isLength from 'validator/lib/isLength'
// redux db [firebase] actions
import { dbActions } from '../../redux/db'
// reusable Form Inputs
import { renderInput, renderDatepicker, Button } from '../../common/FormInputs';
// from custom helpers
import { initDatePicker, saveEmployee } from '../../common/helpers';

// the reduxForm name
const formName = 'employee';

// #region basic react Form
class EmployeeForm extends Component {
  // hold the select options
  state = {
    editMode: false
  };
  // update the state [select options] from props [redux db]
  static getDerivedStateFromProps(nextProps, prevState) {
    return null;
  }
  // to initialize the datepicker and to mount all realtime updates db listeners
  componentDidMount() {
    const { dispatch, match: { params } } = this.props;
    // init Materialize datePicker
    const currentYear = (new Date()).getFullYear();
    initDatePicker({
      format: 'dd/mm/yyyy',
      yearRange: [currentYear-30,currentYear],
      onSelect: (selectedDate) => dispatch(change(formName, 'joinDate', selectedDate.toLocaleDateString('en-gb') ))
    });
    // get db state
    dbActions.mountListeners([
      { key: "user", path: `users/${params.id}` },
      { key: "employee", path: `employees/${params.id}` }
    ]);
  }
  // to reInitialize the materializecss select component after the state changes
  componentDidUpdate(prevProps, prevState) {
    // listen to firebase Auth Changed and reset the local storage login key
    // onAuthChanged(resetLSUser);
  }
  componentWillUnmount() {
    // to remove all firebase db realtime updates listeners
    dbActions.clearListeners();
  }
  toggleViewEdit = () => {
    this.setState( state => ({
      editMode: !state.editMode
    }));
    // scroll smoothly to top
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }
  save = (values) => {
    const { employee, match: { params } } = this.props;
    values.id = params.id;
    (!employee)
      ? saveEmployee({ type: 'add', employee: values})
      : saveEmployee({ type: 'update', employee: values});
  }
  // react render
  render() {
    const { handleSubmit, pristine, submitting, employee } = this.props;
    const { editMode } = this.state;
    return (
      <form className="rtl" onSubmit={handleSubmit(this.save)}>
        {/* form title */}
        <h4 className="orange-text">
          { (!employee)
            ? 'حفظ بيانات موظف'
            : <>
                <Button classes="btn-floating primary darken-3"
                  name="viewEdit"
                  type="button"
                  icon={(editMode) ? "edit" : "speaker_notes"}
                  iconClasses="right"
                  label={(editMode) ? 'تعديل' : 'عرض'}
                  onClick={this.toggleViewEdit}
                />
                {(editMode)? 'تعديل' : 'عرض'} بيانات موظف
              </>
          }
        </h4>
        <div className="divider orange" />
        {/* displayName */}
        <Field name="jobTitle"
                label="الوظيفة"
                required={true}
                disabled={!editMode && employee}
                component={renderInput} />
        {/* birthDate */}
        <Field name="joinDate"
                type="datepicker"
                label="اختر تاريخ الالتحاق"
                required={true}
                disabled={!editMode && employee}
                component={renderDatepicker} />
        {/* Action Button */}
        <Button classes="btn primary darken-3"
                  name="saveEmployee"
                  icon="send"
                  label="حفظ"
                  hidden={!editMode && employee}
                  disabled={pristine || submitting}
        />
      </form>
    );
  }
}
// #endregion

// #region the Form validations
const validateJobTitle = (jobTitle, errors) => {
  if (!jobTitle)
    errors.jobTitle = "يجب ادخال الوظيفة ...";
  else if ( !jobTitle.alpha('ar') )
    errors.jobTitle = "يجب ان تحتوي الوظيفة علي حروف عربية فقط";
  else if ( !isLength(jobTitle, { min: 4, max: 80 }) )
    errors.jobTitle = "يجب الا تقل الوظيفة عن 4 احرف والا تزيد عن 80 حرف ...";
}

const validateJoinDate = (joinDate, errors) => {
  if (!joinDate)
    errors.joinDate = "يجب اختيار تاريخ الالتحاق ...";
}
const validate = ({ joinDate, jobTitle }) => {
  const errors = {};
  validateJobTitle(jobTitle, errors);
  validateJoinDate(joinDate, errors);
  return errors;
}
// #endregion

// compose reactForm with reduxForm [define the reduxForm]
const EmployeeReduxForm = reduxForm({
  form: formName,
  enableReinitialize: true,
  validate
})(EmployeeForm);

// get the db values from redux state
const mapStateToProps = (state) => ({
  ...state.db,
  "initialValues": { ...state.db.employee }
});

// exporting the composed Form with the redux state
export default connect(mapStateToProps)(EmployeeReduxForm);