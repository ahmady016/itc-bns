// react and redux Form
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm, change } from 'redux-form'
// validators helpers
import isLength from 'validator/lib/isLength'
// redux db [firebase] actions
import { dbActions } from '../../redux/db'
// reusable Form Inputs
import { renderInput, renderDatepicker, renderTagsInput, Button } from '../../common/FormInputs';
// from custom helpers
import { initDatePicker, saveDoc } from '../../common/helpers';

// the reduxForm name
const formName = 'trainer';

// #region basic react Form
class TrainerForm extends Component {
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
      yearRange: [currentYear-50,currentYear],
      onSelect: (selectedDate) => dispatch(change(formName, 'jobHireDate', selectedDate.toLocaleDateString('en-gb') ))
    });
    // get db state
    dbActions.mountListeners([
      { key: "user", path: `users/${params.id}` },
      { key: "trainer", path: `trainers/${params.id}` }
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
    const { trainer, match: { params } } = this.props;
    values.id = values.id || params.id;
    (!trainer)
      ? saveDoc({ path: 'trainer', type: 'add',     doc: values, message: "لقد تم حفظ بيانات المدرب بنجاح ..." })
      : saveDoc({ path: 'trainer', type: 'update',  doc: values, message: "لقد تم حفظ بيانات المدرب بنجاح ..." });
  }
  // react render
  render() {
    const { handleSubmit, pristine, submitting, trainer } = this.props;
    const { editMode } = this.state;
    return (
      <form className="rtl" onSubmit={handleSubmit(this.save)}>
        {/* form title */}
        <h4 className="orange-text">
          { (!trainer)
            ? 'حفظ بيانات مدرب'
            : <>
                <Button classes="btn-floating primary darken-3"
                  name="viewEdit"
                  type="button"
                  icon={(editMode) ? "edit" : "speaker_notes"}
                  iconClasses="right"
                  label={(editMode) ? 'تعديل' : 'عرض'}
                  onClick={this.toggleViewEdit}
                />
                {(editMode)? 'تعديل' : 'عرض'} بيانات مدرب
              </>
          }
        </h4>
        <div className="divider orange" />
        {/* currentJob */}
        <Field name="currentJob"
                label="الوظيفة الحالية"
                required={true}
                disabled={!editMode && trainer}
                component={renderInput} />
        {/* currentEmployer */}
        <Field name="currentEmployer"
                label="جهة العمل"
                required={true}
                disabled={!editMode && trainer}
                component={renderInput} />
        {/* jobHireDate */}
        <Field name="jobHireDate"
                type="datepicker"
                label="اختر تاريخ التعيين"
                required={true}
                disabled={!editMode && trainer}
                component={renderDatepicker} />
        {/* offeredCourses */}
        <Field name="offeredCourses"
                label="الكورسات التي يدربها"
                placeholder="اضف كورس ..."
                required={true}
                disabled={!editMode && trainer}
                component={renderTagsInput} />
        {/* Action Button */}
        <Button classes="btn primary darken-3"
                  name="saveEmployee"
                  icon="send"
                  label="حفظ"
                  hidden={!editMode && trainer}
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

const validateJoinDate = (jobHireDate, errors) => {
  if (!jobHireDate)
    errors.jobHireDate = "يجب اختيار تاريخ التعيين ...";
}
const validate = ({ joinDate, jobTitle }) => {
  const errors = {};
  validateJobTitle(jobTitle, errors);
  validateJoinDate(joinDate, errors);
  return errors;
}
// #endregion

// compose reactForm with reduxForm [define the reduxForm]
const TrainerReduxForm = reduxForm({
  form: formName,
  enableReinitialize: true,
  validate
})(TrainerForm);

// get the db values from redux state
const mapStateToProps = (state) => ({
  ...state.db,
  "initialValues": { ...state.db.employee }
});

// exporting the composed Form with the redux state
export default connect(mapStateToProps)(TrainerReduxForm);