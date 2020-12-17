import React, { Component } from "react";

//Tostify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// import Breadcrumbs from './components/Breadcrumbs';
// import IsNotAuthenticated from './components/IsNotAuthenticated.jsx';

//React Router Dom
import { Route, withRouter, Switch } from "react-router-dom";

//Components
import Homepage from "./components/Homepage";
import Login from "./components/Login";
import Signup from "./components/Signup";
import IsAuthenticated from "./components/IsAuthenticated";
import Navbar from "./components/Navigation/Navbar";
import { connect } from "react-redux";
// import Team from "./components/Teams/Team";
// import CreateTeam from "./components/Teams/CreateTeam";
// import Project from "./components/Projects/Project";
// import CreateProject from "./components/Projects/CreateProject";
// import Labels from "./components/Labels/Labels";
// import EditLabel from "./components/Labels/EditLabel";
// import AddLabel from "./components/Labels/AddLabel";
// import Issue from "./components/Issues/Issue";
// import NewIssue from "./components/Issues/NewIssue";
// import EditIssue from "./components/Issues/EditIssue";
import ProjectDashboard from "./components/Projects/ProjectDashboard";
import ArchivedProjects from "./components/Projects/ArchivedProjects";
import ArchivedTeamProjects from "./components/Projects/ArchivedTeamProjects";
import CreateTeamProject from "./components/Teams/CreateTeamProject";
// import JoinTeam from "./components/Teams/JoinTeam";
// import EditProject from "./components/Projects/EditProject";
import TeamChat from "./components/Chat/TeamChat";
// import DeleteModal from "./components/DeleteModal";
import ErrorBoundary from "./components/ErrorBoundary";
import TeamChatLandingPage from "./components/Chat/TeamChatLandingPage";
import ToastComponent from "./components/Toast/ToastComponent";
import Profile from "./components/Profile/Profile";
import TeamDashboard from "./components/Teams/TeamDashboard";

class App extends Component {
  // toast.configure({
  //   position: toast.POSITION.TOP_CENTER,
  //   autoClose: 4000,

  // });
  render() {
    return (
      <div className="App">
        <ToastContainer />
        <Navbar />
        <ToastComponent />
        {/* <Breadcrumbs /> */}
        <Switch>
          <Route exact path="/" component={Homepage} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={Signup} />
          <Route exact path="/profile" component={Profile} />

          <IsAuthenticated>
            {/* Team */}
            {/* <Route exact path="/create/team" component={CreateTeam} /> */}
            <Route path="/team" component={TeamDashboard} />
            <Route exact path="/teams/chat" component={TeamChatLandingPage} />
            <ErrorBoundary>
              <Route exact path="/teams/chat/:teamID" component={TeamChat} />
            </ErrorBoundary>

            <Route
              exact
              path="/team/:teamId/archived"
              component={ArchivedTeamProjects}
            />
            {/* <Route exact path="/join/team" component={JoinTeam} /> */}

            {/* Project */}
            <ErrorBoundary>
              <Route path="/project" component={ProjectDashboard} />
            </ErrorBoundary>
            {/* <Route exact path="/project/:projectId" component={Project} /> */}
            {/* <Route
              exact
              path="/project/:projectId/edit"
              component={EditProject}
            /> */}
            {/* <Route exact path="/create/project" component={CreateProject} /> */}
            {/* <Route
              exact
              path="/projects/archived"
              component={ArchivedProjects}
            /> */}

            {/* Labels */}
            {/* <Route exact path="/project/:projectId/labels" component={Labels} /> */}
            {/* <Route
              exact
              path="/project/:projectId/label/:labelId/edit"
              component={EditLabel}
            /> */}
            {/* <Route
              exact
              path="/project/:projectId/label/add"
              component={AddLabel}
            /> */}

            {/* Issue */}
            {/* <Route
              exact
              path="/project/:projectId/issue/:issueId"
              component={Issue}
            /> */}
            {/* <Route
              exact
              path="/project/:projectId/new/issue"
              component={NewIssue}
            /> */}
            {/* <Route
              exact
              path="/project/:projectId/issue/:issueId/edit"
              component={EditIssue}
            /> */}
          </IsAuthenticated>
        </Switch>
        {/* {this.props.showModal && <DeleteModal />} */}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user.user,
  showModal: state.modal.showModal,
});

export default connect(mapStateToProps)(withRouter(App));
