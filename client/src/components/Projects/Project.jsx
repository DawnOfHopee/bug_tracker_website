import React, { useEffect, useState } from "react";

import ReactMarkdown from "react-markdown";

//Axios
import axios from "axios";

//Tostify
import { toast } from "react-toastify";

//React Router DOM
import { Link } from "react-router-dom";

//Redux
import { connect } from "react-redux";

//Actions
import {
  getUserProjects,
  setProjectUpdated,
} from "../../redux/actions/projectActions";
import { setErrors, clearErrors } from "../../redux/actions/userActions";

import {
  showModal,
  setDeleteItem,
  setItemType,
  setCurrentLocation,
} from "../../redux/actions/modalActions";

//SVG
import ArchiveSVG from "../SVG/ArchiveSVG";
import UnarchiveSVG from "../SVG/UnarchiveSVG";
import TrashSVG from "../SVG/TrashSVG";
import EditSVG from "../SVG/EditSVG";
import CaretDownNoFillSVG from "../SVG/CaretDownNoFillSVG";

//Components
import SearchBar from "../SearchBar";
import IssuePreview from "../Preview/IssuePreview";

const Project = (props) => {
  const filterTypes = {
    All: "All",
    "New Issue": "New Issue",
    "Work In Progress": "Work In Progress",
    Fixed: "Fixed",
  };
  const [project, setProject] = useState({});
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [showDescription, setShowDescription] = useState(false);
  const projectId = props.match.params.projectId;

  const handleSearchChange = (e) => {
    sessionStorage.setItem("project-search", e.target.value);
    setSearch(e.target.value);
  };

  const handleFilterChange = (e) => {
    sessionStorage.setItem("project-filter", e.target.value);
    setFilter(e.target.value);
  };

  useEffect(() => {
    props.getUserProjects(localStorage.getItem("token"));

    if (sessionStorage.getItem("project-search") !== null) {
      setSearch(sessionStorage.getItem("project-search"));
    }

    if (sessionStorage.getItem("project-filter") !== null) {
      setFilter(sessionStorage.getItem("project-filter"));
    }

    getProjectData();
  }, []);

  useEffect(() => {
    if (props.projectUpdated === true) {
      axios
        .get(`/api/project/${projectId}`, {
          headers: { Authorization: localStorage.getItem("token") },
        })
        .then((response) => {
          if (response && response.data) {
            setProject(response.data);
          } else {
            props.setErrors(["Something went wrong"]);
          }
        })
        .catch((error) => {
          props.setErrors(error);
          props.history.push("/projects");
        });

      props.setProjectUpdated(false);
    }
  }, [props.projectUpdated]);

  const getProjectData = () => {
    console.log("Get Project data called");
    axios
      .get(`/api/project/${projectId}`, {
        headers: { Authorization: localStorage.getItem("token") },
      })
      .then((response) => {
        if (response && response.data) {
          setProject(response.data);
          if (
            props.match.params &&
            props.match.params.toString().indexOf("team" > -1)
          ) {
            props.setCurrentTeam(response.data.team);
          }
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data) {
          props.setErrors(error);
          props.history.push(
            props.location.pathname.toString().indexOf("team") > -1
              ? `/team/${props.match.params.teamId}`
              : "/projects"
          );
        }
      });
  };

  const deleteModal = () => {
    props.setDeleteItem(project);
    props.setItemType("project");
    props.setCurrentLocation(props.history.location.pathname.split("/"));
    props.showModal();
  };

  const archiveProject = () => {
    axios
      .put(`/api/project/${project._id}/archive/add`, null, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then(() => {
        axios
          .get(`/api/project/${projectId}`, {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          })
          .then((response) => {
            setProject(response.data);
          })
          .catch((error) => {
            props.setErrors(error);
            props.history.push("/projects");
          });
      })
      .catch((error) => {
        props.setErrors(error);
        props.history.push("/projects");
      });
  };

  const unarchiveProject = () => {
    axios
      .put(`/api/project/${project._id}/archive/remove`, null, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then(() => {
        axios
          .get(`/api/project/${projectId}`, {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          })
          .then((response) => {
            setProject(response.data);
          })
          .catch((error) => {
            props.setErrors(error);
            props.history.push("/projects");
          });
      })
      .catch((error) => {
        props.setErrors(error);
        props.history.push("/projects");
      });
  };

  const renderIssues = () => {
    var projectIssues = [];

    if (project.issues && project.issues.length > 0) {
      project.issues.map((issue, index) => {
        if (filter === filterTypes.All) {
          if (search === "") {
            projectIssues.push(
              <IssuePreview
                issue={issue}
                labels={project.labels}
                index={index}
                pathname={props.location.pathname}
                key={index}
                getProjectData={getProjectData}
              />
            );
          } else if (
            issue.name.toLowerCase().indexOf(search.toLowerCase()) > -1
          ) {
            projectIssues.push(
              <IssuePreview
                issue={issue}
                labels={project.labels}
                index={index}
                pathname={props.location.pathname}
                key={index}
                getProjectData={getProjectData}
              />
            );
          }
        } else {
          if (issue.status.name === filter) {
            if (search === "") {
              projectIssues.push(
                <IssuePreview
                  issue={issue}
                  index={index}
                  labels={project.labels}
                  pathname={props.location.pathname}
                  key={index}
                  getProjectData={getProjectData}
                />
              );
            } else if (
              issue.name.toLowerCase().indexOf(search.toLowerCase()) > -1
            ) {
              projectIssues.push(
                <IssuePreview
                  issue={issue}
                  index={index}
                  labels={project.labels}
                  pathname={props.location.pathname}
                  key={index}
                  getProjectData={getProjectData}
                />
              );
            }
          }
        }
      });
    }
    return projectIssues;
  };

  return (
    <div className="project__wrapper">
      {Object.keys(project).length > 0 && (
        <React.Fragment>
          <div className="project__header">
            <div className="project__name">{project.name}</div>
            {project.createdBy.toString() === props.user._id.toString() && (
              <div className="project__action-buttons-container">
                <div
                  onClick={() => {
                    if (project.archived === false) {
                      archiveProject();
                    } else {
                      unarchiveProject();
                    }
                  }}
                >
                  {project.archived ? <UnarchiveSVG /> : <ArchiveSVG />}
                </div>
                <div>
                  <Link to={`/project/${project._id}/edit`}>
                    <EditSVG />
                  </Link>
                </div>

                <div onClick={deleteModal}>
                  {" "}
                  <TrashSVG />
                </div>
              </div>
            )}
          </div>
          <div className="project__creation-date">
            Created By
            <span> {project.createdBy.username} </span>
            <span> &middot; </span>
            {new Date(project.createdAt).toDateString()}
          </div>
          <div className="project__description">
            <div
              className="project__description-name"
              onClick={() => setShowDescription(!showDescription)}
            >
              <span>Description</span> <CaretDownNoFillSVG />
            </div>
            <div
              className={`project__description-dropdown ${
                showDescription && "visible"
              }`}
            >
              <ReactMarkdown>{project.description}</ReactMarkdown>
            </div>
          </div>

          <div className="project__action-bar">
            <Link
              to={`${project.team !== null ? "/team/project/" : "/project/"}${
                project._id
              }/project/labels`}
            >
              Labels <i className="fas fa-tags"></i>
            </Link>
            <Link
              to={`${project.team !== null ? "/team/project/" : "/project/"}${
                project._id
              }/new/issue`}
            >
              New Issue
            </Link>
          </div>
          <div className="project__search-bar-container">
            <SearchBar
              onChange={handleSearchChange}
              search={search}
              placeholder="Search by Issue name"
              extraClass="search-extra-info"
            />
            <div className="project__filter-selector">
              <select
                name="filter-selector"
                id="filter-selector"
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="All" hidden selected>
                  All
                </option>
                {Object.keys(filterTypes).map((filterType, index) => (
                  <option value={filterType} key={index}>
                    {filterType}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="project__issues-container">{renderIssues()}</div>
        </React.Fragment>
      )}
    </div>
  );
};

const mapDispatchToProps = {
  getUserProjects,
  setErrors,
  clearErrors,
  setProjectUpdated,
  showModal,
  setDeleteItem,
  setItemType,
  setCurrentLocation,
};

const mapStateToProps = (state) => ({
  user: state.user.user,
  projects: state.projects.projects,
  projectUpdated: state.projects.projectUpdated,
  errors: state.user.errors,
});

export default connect(mapStateToProps, mapDispatchToProps)(Project);
