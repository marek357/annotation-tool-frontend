import React from "react";
import { Routes, Route } from "react-router-dom";

import "./App.css";
import SignIn from "./pages/Authentication/SignIn";
import SignUp from "./pages/Authentication/SignUp";
import BrowseProjects from "./pages/BrowseProjects";
import CreateProject from "./pages/CreateProject";
import LandingPage from "./pages/LandingPage";
import PrivateAnnotatorAnnotate from "./pages/PrivateAnnotator/Annotate";
import PublicAnnotatorAnnotate from "./pages/Project/Annotate";
import PrivateAnnotatorCompletedAnnotations from "./pages/PrivateAnnotator/CompletedAnnotations";
import AnnotatedData from "./pages/Project/AnnotatedData";
import Categories from "./pages/Project/Categories";
import Description from "./pages/Project/Description";
import ExportData from "./pages/Project/ExportData";
import ProjectHome from "./pages/Project/Home";
import ImportUnannotated from "./pages/Project/ImportData";
import UnannotatedData from "./pages/Project/UnannotatedData";
import ContributorProjects from "./pages/ContributorProjects";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/new-project" element={<CreateProject />} />
        <Route path="/my-projects" element={<ContributorProjects />} />
        <Route path="/community-projects" element={<BrowseProjects />} />
        <Route
          path="/private-annotator/annotate"
          element={<PrivateAnnotatorAnnotate />}
        />
        <Route
          path="/private-annotator/completed-annotations"
          element={<PrivateAnnotatorCompletedAnnotations />}
        />
        <Route path="/project/:projectURL" element={<ProjectHome />} />
        <Route
          path="/project/:projectURL/description"
          element={<Description />}
        />
        <Route
          path="/project/:projectURL/unannotated-data"
          element={<UnannotatedData />}
        />
        <Route
          path="/project/:projectURL/annotated-data"
          element={<AnnotatedData />}
        />
        <Route path="/project/:projectURL/export" element={<ExportData />} />
        <Route
          path="/project/:projectURL/import"
          element={<ImportUnannotated />}
        />
        <Route
          path="/project/:projectURL/categories"
          element={<Categories />}
        />
        <Route
          path="/project/:projectURL/public-annotator/annotate"
          element={<PublicAnnotatorAnnotate />}
        />
      </Routes>
    </>
  );
}

export default App;
