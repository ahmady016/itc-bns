// react and redux Form
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { reduxForm, change, Field, FieldArray } from 'redux-form'
// validators helpers
import isLength from 'validator/lib/isLength'
// redux db [firebase] actions
import { dbActions } from '../../redux/db'
// reusable Form Inputs
import {
  renderInput,
  renderDatepicker,
  renderTagsInput,
  renderError,
  Button
} from '../../common/FormInputs';
// from custom helpers
import { initDatePicker, saveDoc } from '../../common/helpers';
// for generate unique ids
import shortid from 'shortid'

// the reduxForm name
const formName = 'trainer';
// the currentFullYear
const currentYear = (new Date()).getFullYear();
// init each course datepicker
const initCourseDatepicker = (fieldId, dispatch) => {
  initDatePicker({
    id: fieldId,
    format: 'dd/mm/yyyy',
    yearRange: [currentYear - 50, currentYear],
    onSelect: (selectedDate) => dispatch(change(formName, fieldId, selectedDate.toLocaleDateString('en-gb')))
  });
}

// #region render each Course Fields
const renderCourse = (editMode, trainer) => (course, i, fields) => (
  <li key={i} className="collection-item">
    <h6 className="card-header grey darken-4">
      كورس {i + 1}
      <i className="material-icons sm red-text left pointer" onClick={() => fields.remove(i)}>delete_forever</i>
    </h6>
    <div className="card-panel">
      {/* courseTitle */}
      <Field name={`${course}.courseTitle`}
        label="الكورس"
        required={true}
        disabled={!editMode && trainer}
        component={renderInput} />
      {/* obtainedDate */}
      <Field name={`${course}.obtainedDate`}
        type="datepicker"
        label="اختر تاريخ الحصول عليه"
        required={true}
        disabled={!editMode && trainer}
        component={renderDatepicker} />
      {/* courseOrganizer */}
      <Field name={`${course}.courseOrganizer`}
        label="الجهة المنظمة"
        required={true}
        disabled={!editMode && trainer}
        component={renderInput} />
      {/* courseGrade */}
      <Field name={`${course}.courseGrade`}
        label="التقدير"
        required={true}
        disabled={!editMode && trainer}
        component={renderInput} />
      {/* certificateURL */}
      <Field name={`${course}.certificateURL`}
        label="رابط صورة الشهادة"
        required={true}
        disabled={!editMode && trainer}
        component={renderInput} />
    </div>
  </li>
);
// #endregion

// #region render ObtainedCourses FieldArray
const renderObtainedCourses = ({ fields, meta: { error, submitFailed }, label, required, editMode, trainer, dispatch }) => (
  <ul className="collection with-header">
    <li className="collection-header">
      <h6>
        {label}
        {(required)? <i className="material-icons required">grade</i> : null}
      </h6>
    </li>
    { fields.map(renderCourse(editMode, trainer)) }
    <li className="collection-item flex-center">
      <Button type="button"
        classes="btn primary darken-3"
        name="addCourseField"
        icon="playlist_add"
        label="اضف كورس"
        hidden={!editMode && trainer}
        onClick={ () => {
          fields.push({});
          // init Materialize datePicker after pushing and registering the fields
          setTimeout(() => initCourseDatepicker(`obtainedCourses[${fields.length}].obtainedDate`, dispatch), 100);
        } }
      />
      { submitFailed && error && renderError(error) }
    </li>
  </ul>
);
// #endregion

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
      pSelector: 'form',
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
      ? saveDoc({ path: 'trainers', type: 'add',     doc: values, message: "لقد تم حفظ بيانات المدرب بنجاح ..." })
      : saveDoc({ path: 'trainers', type: 'update',  doc: values, message: "لقد تم حفظ بيانات المدرب بنجاح ..." });
  }
  // react render
  render() {
    const { handleSubmit, pristine, submitting, trainer, dispatch } = this.props;
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
        {/* obtainedCourses */}
        <FieldArray name="obtainedCourses"
                label="الكورسات الحاصل عليها"
                required={true}
                editMode={editMode}
                trainer={trainer}
                dispatch={dispatch}
                component={renderObtainedCourses} />
        {/* offeredCourses */}
        <Field name="offeredCourses"
                formName={formName}
                label="الكورسات التي تقوم بتدريبها"
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
const validateCurrentJob = (currentJob, errors) => {
  if (!currentJob)
    errors.currentJob = "يجب ادخال الوظيفة ...";
  else if ( !isLength(currentJob, { min: 4, max: 80 }) )
    errors.currentJob = "يجب الا تقل الوظيفة عن 4 احرف والا تزيد عن 80 حرف ...";
}
const validateCurrentEmployer = (currentEmployer, errors) => {
  if (!currentEmployer)
    errors.currentEmployer = "يجب ادخال جهة العمل ...";
  else if ( !isLength(currentEmployer, { min: 4, max: 80 }) )
    errors.currentEmployer = "يجب الا تقل جهة العمل عن 4 احرف والا تزيد عن 80 حرف ...";
}
const validateJobHireDate = (jobHireDate, errors) => {
  if (!jobHireDate)
    errors.jobHireDate = "يجب اختيار تاريخ التعيين ...";
}
const validateOfferedCourses = (offeredCourses, errors) => {
  if (!offeredCourses || !offeredCourses.length)
    errors.offeredCourses = "يجب إضافة كورس أو أكثر ...";
}
const validateObtainedCourse = (course) => {
  const courseErrors = {};
  if (!course || !course.courseTitle)
    courseErrors.courseTitle = "يجب إدخال اسم الكورس ...";
  if (!course || !course.obtainedDate)
    courseErrors.obtainedDate = "يجب اختيار تاريخ  الحصول علي الكورس ...";
  if (!course || !course.courseOrganizer)
    courseErrors.courseOrganizer = "يجب إدخال الجهة المنفذة للكورس ...";
  if (!course || !course.courseGrade)
    courseErrors.courseGrade = "يجب إدخال التقدير العام للكورس ...";
  if (!course || !course.certificateURL)
    courseErrors.certificateURL = "يجب إدخال رابط صورة شهادة الكورس ...";
  return courseErrors;
}
const validateObtainedCourses = (obtainedCourses, errors) => {
  if(!obtainedCourses || !obtainedCourses.length)
    errors.obtainedCourses = { _error: "يجب إضافة كورس أو أكثر ..." };
  else {
    const obtainedCoursesErrors = obtainedCourses.map(validateObtainedCourse);
    if(obtainedCoursesErrors.length)
      errors.obtainedCourses = obtainedCoursesErrors;
  }
}
const validate = ({ currentJob, currentEmployer, jobHireDate, obtainedCourses, offeredCourses }) => {
  const errors = {};
  validateCurrentJob(currentJob, errors);
  validateCurrentEmployer(currentEmployer,errors);
  validateJobHireDate(jobHireDate, errors);
  validateObtainedCourses(obtainedCourses, errors);
  validateOfferedCourses(offeredCourses, errors);
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
  "initialValues": { ...state.db.trainer }
});

// exporting the composed Form with the redux state
export default connect(mapStateToProps)(TrainerReduxForm);