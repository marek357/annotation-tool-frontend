import React from "react";
import { Routes, Route } from "react-router-dom";

import "./App.css";
import SignIn from "./PublicAnnotator/pages/Authentication/SignIn";
import SignUp from "./PublicAnnotator/pages/Authentication/SignUp";
import BrowseProjects from "./PublicAnnotator/pages/BrowseProjects";
import CreateProject from "./PublicAnnotator/pages/CreateProject";
import LandingPage from "./PublicAnnotator/pages/LandingPage";
import PrivateAnnotatorAnnotate from "./PrivateAnnotator/pages/Annotate";
import PublicAnnotatorAnnotate from "./PublicAnnotator/pages/Project/Annotate";
import PrivateAnnotatorCompletedAnnotations from "./PrivateAnnotator/pages/CompletedAnnotations";
import AnnotatedData from "./PublicAnnotator/pages/Project/AnnotatedData";
import Categories from "./PublicAnnotator/pages/Project/Categories";
import Description from "./PublicAnnotator/pages/Project/Description";
import ExportData from "./PublicAnnotator/pages/Project/ExportData";
import ProjectHome from "./PublicAnnotator/pages/Project/Home";
import ImportUnannotated from "./PublicAnnotator/pages/Project/ImportData";
import UnannotatedData from "./PublicAnnotator/pages/Project/UnannotatedData";
import ContributorProjects from "./PublicAnnotator/pages/ContributorProjects";

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
