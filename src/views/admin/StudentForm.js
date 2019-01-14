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
  renderSelect,
  renderError,
  Button
} from '../../common/FormInputs';
// from custom helpers
import { initSelect, saveDoc } from '../../common/helpers';
// for generate unique ids
import shortid from 'shortid'

// the reduxForm name
const formName = 'student';

// #region render each Course Fields
const renderCourse = (editMode, student) => (course, i, fields) => (
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
        disabled={!editMode && student}
        component={renderInput} />
      {/* duration */}
      <Field name={`${course}.duration`}
        label="اكتب المدة الزمنية"
        required={true}
        disabled={!editMode && student}
        component={renderInput} />
      {/* courseOrganizer */}
      <Field name={`${course}.courseOrganizer`}
        label="الجهة المنظمة"
        required={true}
        disabled={!editMode && student}
        component={renderInput} />
      {/* courseGrade */}
      <Field name={`${course}.courseGrade`}
        label="التقدير"
        required={true}
        disabled={!editMode && student}
        component={renderInput} />
    </div>
  </li>
);
// #endregion

// #region render ObtainedCourses FieldArray
const renderObtainedCourses = ({ fields, meta: { error, submitFailed }, label, required, editMode, student }) => (
  <ul className="collection with-header">
    <li className="collection-header">
      <h6>
        {label}
        {(required)? <i className="material-icons required">grade</i> : null}
      </h6>
    </li>
    { fields.map(renderCourse(editMode, student)) }
    <li className="collection-item flex-center">
      <Button type="button"
        classes="btn primary darken-3"
        name="addCourseField"
        icon="playlist_add"
        label="اضف كورس"
        hidden={!editMode && student}
        onClick={ () => fields.push({}) }
      />
      { submitFailed && error && renderError(error) }
    </li>
  </ul>
);
// #endregion

// #region basic react Form
class studentForm extends Component {
  // hold the select options
  state = {
    editMode: false,
    locationTypes: [],
    qualificationTypes: [],
    studentTypes: []
  };
  // update the state [select options] from props [redux db]
  static getDerivedStateFromProps(nextProps, prevState) {
    if( (nextProps.locationTypes && nextProps.locationTypes.value.length) &&
        (nextProps.qualificationTypes && nextProps.qualificationTypes.value.length) &&
        (nextProps.studentTypes && nextProps.studentTypes.value.length)
      )
      return {
        locationTypes: nextProps.locationTypes.value,
        qualificationTypes: nextProps.qualificationTypes.value,
        studentTypes: nextProps.studentTypes.value
      };
    return null;
  }
  // to reInitialize the materializecss select component after the state changes
  componentDidUpdate(prevProps, prevState) {
    if ( prevState.locationTypes.length !== this.state.locationTypes.length &&
         prevState.qualificationTypes.length !== this.state.qualificationTypes.length &&
         prevState.studentTypes.length !== this.state.studentTypes.length
      )
      // init the select [dropdown]
      initSelect();
  }
  // to initialize the datepicker and to mount all realtime updates db listeners
  componentDidMount() {
    const { match: { params } } = this.props;
    // init the select [dropdown] inputs
    initSelect();
    // get db state
    dbActions.mountListeners([
      { key: "user",                path: `users/${params.id}` },
      { key: "student",             path: `students/${params.id}` },
      { key: "locationTypes",       path: "lookup/locationTypes" },
      { key: "qualificationTypes",  path: "lookup/qualificationTypes" },
      { key: "studentTypes",        path: "lookup/studentTypes" }
    ]);
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
    const { student, match: { params } } = this.props;
    values.id = values.id || params.id;
    (!student)
      ? saveDoc({ path: 'students', type: 'add',     doc: values, message: "لقد تم حفظ بيانات المتدرب بنجاح ..." })
      : saveDoc({ path: 'students', type: 'update',  doc: values, message: "لقد تم حفظ بيانات المتدرب بنجاح ..." });
  }
  // react render
  render() {
    const { handleSubmit, pristine, submitting, student } = this.props;
    const { locationTypes, qualificationTypes, studentTypes, editMode } = this.state;
    return (
      <form className="rtl" onSubmit={handleSubmit(this.save)}>
        {/* form title */}
        <h4 className="orange-text">
          { (!student)
            ? 'حفظ بيانات متدرب'
            : <>
                <Button classes="btn-floating primary darken-3"
                  name="viewEdit"
                  type="button"
                  icon={(editMode) ? "edit" : "speaker_notes"}
                  iconClasses="right"
                  label={(editMode) ? 'تعديل' : 'عرض'}
                  onClick={this.toggleViewEdit}
                />
                {(editMode)? 'تعديل' : 'عرض'} بيانات متدرب
              </>
          }
        </h4>
        <div className="divider orange" />
        {/* currentJob */}
        <Field name="currentJob"
                label="الوظيفة الحالية"
                required={true}
                disabled={!editMode && student}
                component={renderInput} />
        {/* currentEmployer */}
        <Field name="currentEmployer"
                label="جهة العمل"
                required={true}
                disabled={!editMode && student}
                component={renderInput} />
        {/* obtainedCourses */}
        <FieldArray name="obtainedCourses"
                label="الكورسات الحاصل عليها"
                required={true}
                editMode={editMode}
                student={student}
                component={renderObtainedCourses} />
        {/* locationType */}
        <Field name="locationType"
                label="اختر نوع محل الاقامة"
                required={true}
                options={locationTypes}
                component={renderSelect} />
        {/* qualificationType */}
        <Field name="qualificationType"
                label="اختر نوع المؤهل الدراسي"
                required={true}
                options={qualificationTypes}
                component={renderSelect} />
        {/* studentType */}
        <Field name="studentType"
                label="اختر حالة العمل"
                required={true}
                options={studentTypes}
                component={renderSelect} />
        {/* Action Button */}
        <Button classes="btn primary darken-3"
                  name="saveEmployee"
                  icon="send"
                  label="حفظ"
                  hidden={!editMode && student}
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
const validateObtainedCourse = (course) => {
  const courseErrors = {};
  if (!course || !course.courseTitle)
    courseErrors.courseTitle = "يجب إدخال اسم الكورس ...";
  if (!course || !course.courseOrganizer)
    courseErrors.courseOrganizer = "يجب إدخال الجهة المنفذة للكورس ...";
  if (!course || !course.courseGrade)
    courseErrors.courseGrade = "يجب إدخال التقدير العام للكورس ...";
  if (!course || !course.duration)
    courseErrors.duration = "يجب إدخال المدة الزمنية منذ تاريخ الحصول علي الكورس ...";
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
  validateObtainedCourses(obtainedCourses, errors);
  return errors;
}
// #endregion

// compose reactForm with reduxForm [define the reduxForm]
const studentReduxForm = reduxForm({
  form: formName,
  enableReinitialize: true,
  validate
})(studentForm);

// get the db values from redux state
const mapStateToProps = (state) => ({
  ...state.db,
  "initialValues": { ...state.db.student }
});

// exporting the composed Form with the redux state
export default connect(mapStateToProps)(studentReduxForm);