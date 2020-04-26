import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

//Components
import DeleteModal from './DeleteModal';

//React Router DOM
import { Link } from 'react-router-dom';

//Redux
import { connect } from 'react-redux';

//Actions
import { setCurrentSection, setCurrentId } from '../redux/actions/userActions';

function BugPreview(props) {
  const { bug, index, projectId } = props;

  return (
    <div className="bug-preview-container">
      <div>
        <div
          className="bug-preview"
          onClick={() => {
            props.setCurrentSection('bug');
            props.setCurrentId(bug._id);
          }}
        >
          <p className="bug-name">{bug.name}</p>
          <div
            style={{ background: `${bug.label.color}` }}
            className="bug-label"
            id={`bug-label-${index}`}
          >
            {bug.label.name}
          </div>
          {bug.status.name === 'New Bug' ? (
            <span className="bug-status" id={`bug-status-${index}`}>
              <i
                style={{ color: `${bug.status.color}` }}
                className="fas fa-exclamation"
              ></i>
            </span>
          ) : bug.status.name === 'Work In Progress' ? (
            <span className="bug-status" id={`bug-status-${index}`}>
              <i
                style={{ color: `${bug.status.color}` }}
                className="fas fa-truck-loading"
              ></i>
            </span>
          ) : (
            <span className="bug-status" id={`bug-status-${index}`}>
              <i
                style={{ color: `${bug.status.color}` }}
                className="fas fa-check"
              ></i>
            </span>
          )}
          <p className="bug-description">{bug.description}</p>
          <i
            className="far fa-trash-alt"
            onClick={() => {
              const element = document.createElement('div');
              element.classList.add('modal-element');
              document.querySelector('#modal-root').appendChild(element);
              ReactDOM.render(<DeleteModal item={bug} type={'bug'} />, element);
            }}
          ></i>
        </div>
      </div>
    </div>
  );
}

const mapDispatchToProps = {
  setCurrentSection,
  setCurrentId,
};

export default connect(null, mapDispatchToProps)(BugPreview);
