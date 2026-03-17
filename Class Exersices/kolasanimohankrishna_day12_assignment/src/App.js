import React, { useState, Suspense } from "react";
import "./App.css";
import Dashboard from "./challenge2/Dashboard";
import ErrorBoundary from "./challenge3/ErrorBoundary";
import ProductCard from "./challenge3/ProductCard";
import Modal from "./challenge4/Modal";

const CourseDetails = React.lazy(() =>
  import("./challenge1/CourseDetails")
);

const InstructorProfile = React.lazy(() =>
  import("./challenge1/InstructorProfile")
);

function App() {
  const [activePage, setActivePage] = useState("challenge1");
  const [showCourse, setShowCourse] = useState(false);
  const [showInstructor, setShowInstructor] = useState(false);
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <div className="navbar">
        <button
          className={activePage === "challenge1" ? "active" : ""}
          onClick={() => setActivePage("challenge1")}
        >
          Challenge 1
        </button>

        <button
          className={activePage === "challenge2" ? "active" : ""}
          onClick={() => setActivePage("challenge2")}
        >
          Challenge 2
        </button>

        <button
          className={activePage === "challenge3" ? "active" : ""}
          onClick={() => setActivePage("challenge3")}
        >
          Challenge 3
        </button>

        <button
          className={activePage === "challenge4" ? "active" : ""}
          onClick={() => setActivePage("challenge4")}
        >
          Challenge 4
        </button>
      </div>

      {activePage === "challenge1" && (
        <div className="section" id = 'section'>
          <h2>Lazy Loading & Code Splitting</h2>

          <button onClick={() => setShowCourse(true)}>
            View Course Details
          </button>

          <button
            onClick={() => setShowInstructor(true)}
            style={{ marginLeft: "10px" }}
          >
            View Instructor Profile
          </button>

          <Suspense
            fallback={
              <div style={{ marginTop: "10px" }}>
                <div className="loader"></div>
              </div>
            }
          >
            {showCourse && <CourseDetails />}
            {showInstructor && <InstructorProfile />}
          </Suspense>
        </div>
      )}

      {activePage === "challenge2" && (
        <div className="section" id = 'section'>
          <Dashboard />
        </div>
      )}

      {activePage === "challenge3" && (
        <div className="section" id = 'section'>
          <h2>Error Boundary Example</h2>
          <ErrorBoundary>
            <ProductCard />
          </ErrorBoundary>
        </div>
      )}

      {activePage === "challenge4" && (
        <div className="section" id = 'section'>
          <h2>Portal Modal Example</h2>

          <button onClick={() => setShowModal(true)}>
            Show Notification
          </button>

          {showModal && (
            <Modal closeModal={() => setShowModal(false)}>
              <h3>Notification</h3>
              <p>This modal is rendered using React Portal.</p>
            </Modal>
          )}
        </div>
      )}
    </div>
  );
}

export default App;