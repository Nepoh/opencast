import React from 'react';
import {connect} from "react-redux";
import dompurify from 'dompurify';
import {
    getWorkflowDefById,
    makeGetWorkflowDefById
} from "../../../../selectors/workflowSelectors";

/**
 * This component renders the configuration panel for the selected workflow in the processing step of the new event
 * wizard chosen via dropdown.
 * Here, props is used instead of {} containing name of each prop because props are needed in the selector for finding
 * the workflow definition with the matching id. In this case props need to be considered in mapStateToProps and
 * therefore {} containing names of props not works.
 */
const RenderWorkflowConfig = (props) => {
    // Get html for configuration panel
    const configurationPanel = props.configuration_panel;
    const description = props.description;

    // Use sanitizer that sanitize html used in dangerouslySetInnerHTML
    // In order to it is protected against XSS attacks
    const sanitizer = dompurify.sanitize;

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
            {description.length > 0 && (
                <div className="collapsible-box" style={descriptionBoxStyle}>
                    <div style={descriptionTextStyle}>{description}</div>
                </div>
            )}
            <div id="testing_something" dangerouslySetInnerHTML={{__html: sanitizer(configurationPanel)}} ref={ref} />

        </>

    );
}

// Getting state data out of redux store
const mapStateToProps = () => {
    getWorkflowDefById()
    return (state, props) => makeGetWorkflowDefById(state, props)
};

export default connect(mapStateToProps)(RenderWorkflowConfig);
