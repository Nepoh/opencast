import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import {Formik, Field} from "formik";
import {
  getWorkflowDefById,
  makeGetWorkflowDefById
} from '../../../../selectors/workflowSelectors';

/**
 * This component renders the configuration panel for the selected workflow in the processing step of the new event
 * wizard chosen via dropdown.
 * Here, props is used instead of {} containing name of each prop because props are needed in the selector for finding
 * the workflow definition with the matching id. In this case props need to be considered in mapStateToProps and
 * therefore {} containing names of props not works.
 */
const RenderWorkflowConfig = (props) => {
    // Get html for configuration panel
    const configPanel = props.configuration_panel;
    const description = props.description;
    const displayDescription = props.displayDescription;
    let formik = props.formik;

    const setDefaultValues = () => {
      let defaultConfiguration = {};

      if (configPanel[0].fieldset) {
        configPanel[0].fieldset.forEach(field => {
          defaultConfiguration[field.name] = field.value;
          console.log("in for each");
          console.log(defaultConfiguration);
        });
      }

      console.log("Default Configuration");
      console.log(defaultConfiguration);

      return defaultConfiguration;
    }

    let ref = React.useRef();

     if (ref.current?.childNodes !== undefined) {
         let array = [...ref.current?.childNodes];
     }

    const descriptionBoxStyle = {
        margin: '15px 0 0 0',
        position: 'relative',
        border: 'solid #c9d0d3',
        borderWidth: '1px',
        backgroundColor: '#fafafa',
        overflow: 'hidden',
        borderRadius: '4px'
    };

    const descriptionTextStyle = {
        margin: '10px',
        fontFamily: '"Open sans", Helvetica,sans-serif',
        fontSize: '12px',
        whiteSpace: 'pre-line'
    };

  return (
    <>
      {(displayDescription && description.length) > 0 && (
        <div className="collapsible-box" style={descriptionBoxStyle}>
          <div style={descriptionTextStyle}>{description}</div>
        </div>
      )}

      {configPanel.length > 0 && (
        <form>
          <div id="workflow-configuration">
            {configPanel.map((configOption, key) => (
              <fieldset key={key}>
                {!!configOption.legend && (
                  <legend>{configOption.legend}</legend>
                )}
                {!!configOption.description && (
                  <p>{configOption.description}</p>
                )}
                <ul>
                  {configOption.fieldset?.map((field, keys) => (
                    renderInputByType(field, keys, formik)
                  ))}
                </ul>
              </fieldset>
            ))}
          </div>
        </form>
      )}
    </>

  );
}

const renderInputByType = (field, key, formik) => {
  switch (field.type) {
    case 'checkbox':
      return <RenderCheckbox field={field} key={key} formik={formik}/>;
    case 'radio':
      return <RenderRadio field={field} key={key} formik={formik}/>;
    case 'number':
      return <RenderNumber field={field} key={key} formik={formik}/>;
    case 'text':
      return <RenderText field={field} key={key} formik={formik}/>;
    default:
      return '';
  }
}

const RenderCheckbox = ({ field, key, formik }) => {
  const uuid = uuidv4();

  useEffect(() => {
    //formik.values.configuration[field.name] = field.checked;

    console.log("in useEffect");
    //console.log(formik.values.configuration[field.name]);

  }, []);

  return (
    <li key={key}>
      <Field id={uuid}
             className="configField"
             name={'configuration.' + field.name}
             defaultValue={field.checked}
             type={field.type}/>
      <label htmlFor={uuid}>{field.label}</label>
      {(!!field.fieldset && !!formik.values.configuration[field.name]) && (
        <ul className="workflow-configuration-subpanel">
          {field.fieldset?.map((f, keys) => (
            renderInputByType(f, keys, formik)
          ))}
        </ul>
      )}
    </li>
  );
}

const RenderRadio = ({ field, key, formik }) => {
  const uuid = uuidv4();
  return (
    <li key={key}>
      <Field id={uuid}
             className="configField"
             name={'configuration.' + field.name}
             value={field.value}
             type={field.type}/>
      <label htmlFor={uuid}>{field.label}</label>
      {(!!field.fieldset && formik.values.configuration[field.name] === field.value) && (
        <ul className="workflow-configuration-subpanel">
          {field.fieldset?.map((f, keys) => (
            renderInputByType(f, keys, formik)
          ))}
        </ul>
      )}
    </li>
  );
}

const RenderNumber = ({ field, key, formik }) => {
  const uuid = uuidv4();

  const validate = value => {
    let error;
    if (parseInt(value) > field.max || parseInt(value) < field.min) {
      error = "out of range";
    }
    return error;
  }

  return (
    <li key={key}>
      <Field id={uuid}
             //validate={validate}
             className="configField"
             name={'configuration.' + field.name}
             type={field.type}
             min={field.min}
             max={field.max}/>
      <label htmlFor={uuid}>{field.label}</label>
      {(!!field.fieldset && !!formik.values.configuration[field.name]) && (
        <ul className="workflow-configuration-subpanel">
          {field.fieldset?.map((f, keys) => (
            renderInputByType(f, keys, formik)
          ))}
        </ul>
      )}
    </li>
  );
}

const RenderText = ({ field, key, formik }) => {
  const uuid = uuidv4();
  return (
    <li key={key}>
      <Field id={uuid}
             className="configField"
             name={'configuration.' + field.name}
             type={field.type}/>
      <label htmlFor={uuid}>{field.label}</label>
      {(!!field.fieldset && !!formik.values.configuration[field.name]) && (
        <ul className="workflow-configuration-subpanel">
          {field.fieldset?.map((f, keys) => (
            renderInputByType(f, keys, formik)
          ))}
        </ul>
      )}
    </li>
  );
}

// Getting state data out of redux store
const mapStateToProps = () => {
    getWorkflowDefById()
    return (state, props) => makeGetWorkflowDefById(state, props)
};

export default connect(mapStateToProps)(RenderWorkflowConfig);
