import React from 'react'
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <>
      <nav className="navbar navbar-light navbar-vertical navbar-expand-xl">
        <div className="d-flex align-items-center">
          <div className="toggle-icon-wrapper">
            <button
              className="btn navbar-toggler-humburger-icon navbar-vertical-toggle"
              data-bs-toggle="tooltip"
              data-bs-placement="left"
              title="Toggle Navigation"
            >
              <span className="navbar-toggle-icon">
                <span className="toggle-line" />
              </span>
            </button>
          </div>
          <Link className="navbar-brand" to="/">
            <div className="d-flex align-items-center py-3">
              <img
                className="me-2"
                src="./assets/img/icons/spot-illustrations/falcon.png"
                alt=""
                width={40}
              />
              <span className="font-sans-serif text-primary">falcon</span>
            </div>
          </Link>
        </div>
        <div className="collapse navbar-collapse" id="navbarVerticalCollapse">
          <div className="navbar-vertical-content scrollbar">
            <ul className="navbar-nav flex-column mb-3" id="navbarVerticalNav">
              <li className="nav-item">
                {/* parent pages*/}
                <Link
                  className="nav-link dropdown-indicator"
                  to="#dashboard"
                  role="button"
                  data-bs-toggle="collapse"
                  aria-expanded="true"
                  aria-controls="dashboard"
                >
                  <div className="d-flex align-items-center">
                    <span className="nav-link-icon">
                      <span className="fas fa-chart-pie" />
                    </span>
                    <span className="nav-link-text ps-1">Dashboard</span>
                  </div>
                </Link>
                <ul className="nav collapse show" id="dashboard">
              <li className="nav-item">
                {/* label*/}
                <div className="row navbar-vertical-label-wrapper mt-3 mb-2">
                  <div className="col-auto navbar-vertical-label">Pages</div>
                  <div className="col ps-0">
                    <hr className="mb-0 navbar-vertical-divider" />
                  </div>
                </div>
                {/* parent pages*/}
                <Link className="nav-link" to="/Admin" role="button">
                  <div className="d-flex align-items-center">
                    <span className="nav-link-icon">
                      <span className="fas fa-user" />
                    </span>
                    <span className="nav-link-text ps-1">Admin</span>
                  </div>
                </Link>
                {/* parent pages*/}
                <Link className="nav-link" to="/Staff" role="button">
                  <div className="d-flex align-items-center">
                    <span className="nav-link-icon">
                      <span className="fas fa-users" />
                    </span>
                    <span className="nav-link-text ps-1">Staff</span>
                  </div>
                </Link>
                {/* parent pages*/}
                <Link className="nav-link" to="/Guest" role="button">
                  <div className="d-flex align-items-center">
                    <span className="nav-link-icon">
                      <span className="fas fa-user-circle" />
                    </span>
                    <span className="nav-link-text ps-1">Guest</span>
                  </div>
                </Link>
                {/* parent pages*/}
                <Link className="nav-link" to="/Laundry" role="button">
                  <div className="d-flex align-items-center">
                    <span className="nav-link-icon">
                      <span className="fas fa-flag" />
                    </span>
                    <span className="nav-link-text ps-1">Laundry</span>
                  </div>
                </Link>
                {/* parent pages*/}
                <Link className="nav-link" to="/Food" role="button">
                  <div className="d-flex align-items-center">
                    <span className="nav-link-icon">
                      <span className="fas fa-lemon" />
                    </span>
                    <span className="nav-link-text ps-1">Food</span>
                  </div>
                </Link>
                {/* parent pages*/}
                <Link className="nav-link" to="/RoomType" role="button">
                  <div className="d-flex align-items-center">
                    <span className="nav-link-icon">
                      <span className="fas fa-history" />
                    </span>
                    <span className="nav-link-text ps-1">Room Type</span>
                  </div>
                </Link>
                {/* parent pages*/}
                <Link className="nav-link" to="/Role" role="button">
                  <div className="d-flex align-items-center">
                    <span className="nav-link-icon">
                      <span className="fas fa-list" />
                    </span>
                    <span className="nav-link-text ps-1">Role</span>
                  </div>
                </Link>
                {/* parent pages*/}
                <Link className="nav-link" to="/Feedback" role="button">
                  <div className="d-flex align-items-center">
                    <span className="nav-link-icon">
                      <span className="fas fa-comments" />
                    </span>
                    <span className="nav-link-text ps-1">Feedback</span>
                  </div>
                </Link>
                {/* parent pages*/}
              </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Sidebar