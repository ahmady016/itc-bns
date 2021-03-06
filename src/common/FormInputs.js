import React from 'react'
import { change, touch } from 'redux-form'
import Select from 'react-select'
import { WithContext as ReactTags } from 'react-tag-input'
import store from '../common/reduxStore'

// #region show validations messages
export const renderError = (error) => (
  <div className="red-text text-darken-4 valign-wrapper validate error">
      <i className="material-icons">error_outline</i>
      <span>{error}</span>
    </div>
);
export const showError = ( { error, touched } ) => (
  (touched && error)
  ? <div className="red-text text-darken-4 valign-wrapper validate error">
      <i className="material-icons">error_outline</i>
      <span>{error}</span>
    </div>
  : null
)
// #endregion

// #region Action Button
export const Button = (props) => {
  const { name, hidden = false, disabled = false, classes = "", icon = "send", label, type = "submit", iconClasses = "", onClick = null } = props;
  let btnClasses = `waves-effect waves-light ${classes} `;
  if (hidden) btnClasses += "hidden";
  return (
    <button id={name}
            name={name}
            type={type}
            className={btnClasses}
            onClick={onClick}
            disabled={disabled}
      >
      <i className={`material-icons ${iconClasses || 'left'}`}>{icon}</i>
      {label}
    </button>
  );
};
// #endregion

// #region Inputs and Textarea
export const renderInput = ({
  meta,
  input,
  label,
  required = false,
  onChange = null,
  type = 'text',
  icon = 'edit',
  hidden = false,
  disabled = false
}) => (
    <div className="input-field" hidden={hidden}>
      <i className="material-icons prefix">{icon}</i>
      { type === "textarea"
        ? <textarea
            id={input.name}
            className="materialize-textarea"
            disabled={disabled}
            {...input}
          />
        : <input
            id={input.name}
            type={type === "autocomplete" ? "text" : type}
            className={type === "autocomplete" ? "autocomplete" : ""}
            disabled={disabled}
            {...input}
            onChange={onChange || input.onChange}
          />
      }
      <label className={input.value ? "active" : ""} htmlFor={input.name}>
        {label}
        {(required)? <i className="material-icons required">grade</i> : null}
      </label>
      {showError(meta)}
    </div>
  );
// #endregion

// #region materialize [date - time] pickers
export const renderDatepicker = ({
  input,
  icon,
  type,
  label,
  required = false,
  meta,
  hidden = false,
  disabled = false
}) => (
    <div className="input-field" hidden={hidden}>
      <i className="material-icons prefix">{icon || "edit"}</i>
      <input
        id={input.name}
        type="text"
        className={type}
        disabled={disabled}
        {...input}
      />
      <label className={input.value ? "active" : ""} htmlFor={input.name}>
        {label}
        {(required)? <i className="material-icons required">grade</i> : null}
      </label>
      {showError(meta)}
    </div>
);
// #endregion

// #region Switch
export const renderSwitch = ({
  input,
  meta,
  icon,
  label,
  on,
  off,
  hidden = false,
  disabled = false
}) => (
  <div className="input-field" hidden={hidden}>
    <i className="material-icons prefix">{icon || "edit"}</i>
    <label className="active">{label}</label>
    <div className="switch">
      <label>
        {off && <span>{off}</span>}
        <input
          id="isActive"
          type="checkbox"
          disabled={disabled}
          checked={input.value}
          {...input}
        />
        <span className="lever" />
        {on && <span>{on}</span>}
      </label>
    </div>
    {showError(meta)}
  </div>
);
// #endregion

// #region Select [Dropdown list]
export const renderSelect = ({
  meta,
  input,
  label,
  options,
  defaultOption,
  icon = "input",
  className = "validate",
  required = false,
  hidden = false,
  disabled = false
}) => (
  <div className="input-field" hidden={hidden}>
    <i className="material-icons prefix">{icon}</i>
    <div className={className}>
      <label className={input.value ? "active" : ""} htmlFor={input.name}>
        {label}
        {(required)? <i className="material-icons required">grade</i> : null}
      </label>
      <select id={input.name} disabled={disabled} {...input}>
        <option value="">{ (defaultOption)? defaultOption : ` اختر ${label} ...` }</option>
        {options.map( (opt,i) => (
          (typeof opt === 'object')
            ? <option key={opt.value} value={opt.value}>{opt.text}</option>
            : <option key={i+1} value={opt}>{opt}</option>
        ))}
      </select>
      {/* <label htmlFor={input.name}>{label || input.name}</label> */}
      {showError(meta)}
    </div>
  </div>
);
// #endregion

// #region Radios and Checkboxes
export const renderCheck = ({
  meta,
  input,
  label,
  options,
  formName,
  type = "radio",
  icon = "edit",
  labelClassName = "",
  itemsClassName = "",
  itemClassName = "",
  inputClassName = "",
  hidden = false,
  disabled = false
}) => (
    <div className="input-field" hidden={hidden}>
      <i className="material-icons prefix">{icon}</i>
      <label className={labelClassName} htmlFor={input.name}>
        {label || input.name}
      </label>
      <div className={itemsClassName}>
        {options.map(opt => (
          <label key={opt.value} htmlFor={opt.value} className={itemClassName}>
            <input
              type={type}
              name={input.name}
              id={opt.value}
              className={inputClassName}
              disabled={disabled}
              value={
                (type === 'radio')
                  ? opt.value
                  : input.value.includes(opt.value)
              }
              onChange={ ({ target }) => {
                if(type === 'radio')
                  store.dispatch(change(formName, input.name, target.value))
                else {
                  const values = target.checked
                    ? [...input.value, opt.value]
                    : input.value.filter(val => val !== opt.value)
                  store.dispatch(change(formName, input.name, values ))
                }
              } }
              onBlur={ () => store.dispatch(touch(formName, input.name)) }
              onFocus={input.onFocus}
            />
            <span>{opt.text}</span>
          </label>
        ))}
      </div>
      {showError(meta)}
    </div>
  );
// #endregion

// #region React Select [Select - Autocomplete [single-multi] ]
export const renderAutoComplete = ({
  meta,
  input,
  label,
  formName,
  defaultValue = null,
  options = {},
  settings = {},
  icon = "edit",
  className = "validate",
  hidden = false,
  disabled = false
}) => (
  <div className="input-field" hidden={hidden}>
    <i className="material-icons prefix">{icon}</i>
    <Select
      className={className}
      isDisabled={disabled}
      placeholder={label}
      defaultValue={defaultValue}
      options={options}
      name={input.name}
      onChange={ selectedOption => store.dispatch(change(formName, input.name, selectedOption && selectedOption.value)) }
      onBlur={ () => store.dispatch(touch(formName, input.name)) }
      onFocus={input.onFocus}
      {...settings}
    />
    {showError(meta)}
  </div>
);
// #endregion

// #region react-tag-input [tags input - autocomplete]
export const renderTagsInput = ({
  meta,
  input,
  label,
  placeholder,
  formName,
  autofocus = false,
  options = [],
  icon = "input",
  className = "validate",
  required = false,
  hidden = false,
  disabled = false
}) => (
  <div className="input-field" hidden={hidden}>
    <i className="material-icons prefix">{icon}</i>
    <div className={className}>
      <label className={input.value ? "active" : ""} htmlFor={input.name}>
        {label}
        {(required)? <i className="material-icons required">grade</i> : null}
      </label>
      <ReactTags
        id={input.name}
        placeholder={placeholder || label}
        tags={input.value || []}
        suggestions={options}
        handleAddition={tag => store.dispatch( change(formName, input.name, [...input.value, tag]) ) }
        handleDelete={i =>  store.dispatch( change(formName, input.name, input.value.filter( (tag, index) => index !== i) ) ) }
        handleInputBlur={ () => store.dispatch(touch(formName, input.name)) }
        handleInputFocus={input.onFocus}
        allowDragDrop={false}
        inline={true}
        autofocus={autofocus}
        disabled={disabled}
      />
      {showError(meta)}
    </div>
  </div>
);
// #endregion
