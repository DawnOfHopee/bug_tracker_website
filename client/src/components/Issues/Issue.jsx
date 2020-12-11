import React, { useEffect, useState } from "react";

//Axios
import axios from "axios";

//Moment
import moment from "moment";

import ReactMarkdown from "react-markdown";

//React Router DOM
import { Link } from "react-router-dom";

//Redux
import { connect } from "react-redux";

//SVG
import TrashSVG from "../SVG/TrashSVG";
import EditSVG from "../SVG/EditSVG";
import CaretDownNoFillSVG from "../SVG/CaretDownNoFillSVG";

//Actions
import { setErrors, setMessages } from "../../redux/actions/userActions";

//Components
import Modal from "../Modal/Modal";

const Issue = (props) => {
  const modalTypes = {
    "Delete Modal": "Delete Modal",
  };
  const [issue, setIssue] = useState({});
  const [comment, setComment] = useState("");
  const [issueLabels, setIssueLabels] = useState([]);
  const [showDescription, setShowDescription] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");

  useEffect(() => {
    const issueId = props.match.params.issueId;
    axios
      .get(`/api/issue/${issueId}`, {
        headers: { Authorization: localStorage.getItem("token") },
      })
      .then((response) => {
        if (response && response.data) {
          var newLabels = [];
          response.data.project.labels.forEach((label) => {
            if (response.data.labels.includes(label._id)) {
              newLabels.push(label);
            }
          });
          setIssueLabels(newLabels);

          if (props.setCurrentTeam) {
            props.setCurrentTeam(response.data.project.team);
          }
        }
        setIssue(response.data);
      })
      .catch((error) => {
        if (error && error.response && error.response.data) {
          props.setErrors(error);
          props.history.goBack();
        }
      });
  }, []);

  useEffect(() => {
    if (Object.keys(issue).length > 0) {
      if (issue.status.name === "New Issue")
        document.querySelector("#new-issue").classList.add("selected");
      if (issue.status.name === "Work In Progress")
        document.querySelector("#work-in-progress").classList.add("selected");
      if (issue.status.name === "Fixed")
        document.querySelector("#fixed").classList.add("selected");
    }
  }, [issue]);

  const updateIssue = (e) => {
    const childNodes = e.target.parentNode.childNodes;
    childNodes.forEach((child) => child.classList.remove("selected"));

    e.target.classList.add("selected");

    const newStatus = {};
    if (e.target.innerHTML === "New Issue") {
      newStatus.name = "New Issue";
      newStatus.color = "red";
    }
    if (e.target.innerHTML === "Work In Progress") {
      newStatus.name = "Work In Progress";
      newStatus.color = "orange";
    }
    if (e.target.innerHTML === "Fixed") {
      newStatus.name = "Fixed";
      newStatus.color = "#1e90ff";
    }

    axios
      .put(
        `/api/issue/${issue._id}/status`,
        { issue: newStatus },
        { headers: { Authorization: localStorage.getItem("token") } }
      )
      .catch((error) => {
        if (error && error.response && error.response.data) {
          props.setErrors(error);
          props.history.goBack();
        }
      });
  };

  const deleteIssue = () => {
    axios
      .delete(`/api/issue/${issue._id}`, {
        headers: { Authorization: localStorage.getItem("token") },
      })
      .then((res) => {
        if (res && res.data) {
          console.log(res.data);
          props.setMessages(res.data);
          props.history.goBack();
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data) {
          props.setErrors(error);
          props.history.goBack();
        }
      });
  };

  const addComment = () => {
    const newComment = {
      comment: comment,
      issue: issue._id,
    };

    const username = props.user.username;
    axios
      .post(
        "/api/comment",
        {
          comment: newComment,
          issueId: issue._id,
          username: username,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      )
      .then(() => {
        const issueId = props.match.params.issueId;
        axios
          .get(`/api/issue/${issueId}`, {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          })
          .then((response) => {
            setIssue(response.data);
            setComment("");
          })
          .catch((error) => {
            if (error && error.response && error.response.data) {
              props.setErrors(error);
              props.history.goBack();
            }
          });
      })
      .catch((error) => {
        if (error && error.response && error.response.data) {
          props.setErrors(error);
          props.history.goBack();
        }
      });
  };

  const renderModal = () => {
    if (showModal) {
      switch (modalType) {
        case modalTypes["Delete Modal"]:
          return (
            <Modal>
              <div className="modal__delete-modal-body">
                <div className="modal__delete-modal-body__message">
                  Are you sure you want to delete <span>{issue.name}</span>?
                </div>
                <div className="modal__delete-modal-body__action-container">
                  <button
                    onClick={() => {
                      deleteIssue();
                    }}
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => {
                      setShowModal(false);
                    }}
                  >
                    No
                  </button>
                </div>
                <div
                  className="modal__close"
                  onClick={() => {
                    setShowModal(false);
                  }}
                >
                  &times;
                </div>
              </div>
            </Modal>
          );
      }
    }
  };

  return (
    <div className="issue__wrapper">
      {renderModal()}
      {Object.keys(issue).length > 0 && (
        <React.Fragment>
          <div className="issue__header">
            <div className="issue__name">{issue.name}</div>
            <div className="issue__action-buttons-container">
              <div>
                <Link
                  to={`/project/${issue.project._id}/issue/${issue._id}/edit`}
                >
                  <EditSVG />
                </Link>
              </div>

              <div
                onClick={() => {
                  setModalType(modalTypes["Delete Modal"]);
                  setShowModal(true);
                }}
              >
                <TrashSVG />
              </div>
            </div>
          </div>
          <div className="issue__creation-date">
            Created By
            <span> {issue.createdBy.username} </span>
            <span> &middot; </span>
            {new Date(issue.createdAt).toDateString()}
          </div>
          <div className="issue__description">
            <div
              className="issue__description-name"
              onClick={() => setShowDescription(!showDescription)}
            >
              <span>Description</span> <CaretDownNoFillSVG />
            </div>
            <div
              className={`issue__description-dropdown ${
                showDescription && "visible"
              }`}
            >
              <ReactMarkdown>{issue.description}</ReactMarkdown>
            </div>
          </div>
          <div className="issue__label-container">
            {issueLabels.length > 0 &&
              issueLabels.map((label, index) => (
                <span
                  className="issue__label"
                  style={{ background: `${label.color}` }}
                  key={index}
                >
                  {label.name}
                </span>
              ))}
          </div>
          {issue["assignees"] && issue.assignees.length > 0 && (
            <div className="issue-creation-date issue__assignees">
              <span className="mb-2">Assigned to:</span>
              <ul className="list-group">
                {issue.assignees.map((assignee) => (
                  <li className="list-group-item" key={assignee._id}>
                    <div className="issue__assignee-img-container">
                      <img
                        src={assignee.image}
                        alt="Assignee profile picture"
                      />
                    </div>
                    <span>{assignee.username}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="issue__status-container" id="issue__status-container">
            <div id="new-issue" onClick={updateIssue}>
              New Issue
            </div>
            <div id="work-in-progress" onClick={updateIssue}>
              Work In Progress
            </div>
            <div id="fixed" onClick={updateIssue}>
              Fixed
            </div>
          </div>

          <h2 className="issue__comments-title">Comments</h2>
          {/* <Link to={`/issue/${issue._id}/comment/new`} className="add-comment">
            <i className="fas fa-plus"></i>
          </Link> */}
          <div className="issue__comment-container">
            <textarea
              name="newComment"
              id="new-comment"
              cols="30"
              rows="10"
              maxLength="500"
              value={comment}
              placeholder="New Comment"
              className="issue__comment-textarea"
              onChange={(e) => {
                setComment(e.target.value);
              }}
            ></textarea>
            <button
              className="submit-comment"
              onClick={() => {
                addComment();
              }}
            >
              Comment
            </button>
          </div>
          {issue.comments &&
            issue.comments.length > 0 &&
            issue.comments.map((comment) => (
              <div className="issue__comment-container" key={comment._id}>
                <div className="issue__comment">
                  <p className="issue__comment-date">
                    <span>{comment.createdBy}</span> &middot;
                    <span> {moment(comment.createdAt).fromNow()}</span>
                  </p>
                  <p>{comment.comment}</p>
                </div>
                <i
                  className="far fa-trash-alt"
                  onClick={() => {
                    axios
                      .delete(`/api/comment/${comment._id}`, {
                        headers: {
                          Authorization: localStorage.getItem("token"),
                        },
                      })
                      .then(() => {
                        const issueId = props.match.params.issueId;
                        axios
                          .get(`/api/issue/${issueId}`, {
                            headers: {
                              Authorization: localStorage.getItem("token"),
                            },
                          })
                          .then((response) => {
                            setIssue(response.data);
                          })
                          .catch((error) => {
                            if (
                              error &&
                              error.response &&
                              error.response.data
                            ) {
                              props.setErrors(error);
                              props.history.goBack();
                            }
                          });
                      })
                      .catch((error) => {
                        if (error && error.response && error.response.data) {
                          props.setErrors(error);
                          props.history.goBack();
                        }
                      });
                  }}
                ></i>
              </div>
            ))}
        </React.Fragment>
      )}
    </div>
  );
};

const mapDispatchToProps = {
  setErrors,
  setMessages,
};

const mapStateToProps = (state) => ({
  user: state.user.user,
  projects: state.projects.projects,
  errors: state.user.errors,
});

export default connect(mapStateToProps, mapDispatchToProps)(Issue);
