import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";

const Roleread = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleData, setRoleData] = useState({
    name: "",
    status: "active",
    limit: 0,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [viewRole, setViewRole] = useState(null); // State for viewing role details
  const [searchTerm, setSearchTerm] = useState(""); 
  // Fetch roles from the backend
  const fetchRoles = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/role/");
      setRoles(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching roles:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setRoleData({ ...roleData, [name]: value });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Add new role
  const addRole = async (e) => {
    e.preventDefault();

    const preparedRoleData = {
      ...roleData,
      name: roleData.name.trim().toLowerCase(),
    };

    const alphaRegex = /^[a-zA-Z]+$/;
    if (!alphaRegex.test(preparedRoleData.name)) {
      toast.error("Role name must only contain alphabets.");
      return;
    }

    try {
      const existingRolesResponse = await axios.get("http://localhost:5000/api/role/");
      const existingRoles = existingRolesResponse.data;

      const duplicateRole = existingRoles.find(
        (role) => role.name === preparedRoleData.name
      );

      if (duplicateRole) {
        toast.error("A role with the same name already exists.");
        return;
      }

      const response = await axios.post("http://localhost:5000/api/role/create", preparedRoleData);
      toast.success("Role created successfully!");

      fetchRoles();
      setRoleData({ name: "", status: "active", limit: "" });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error creating role:", error);
      toast.error("An error occurred while creating the role.");
    }
  };

  // Update existing role
  const updateRole = async (e) => {
    e.preventDefault();
  
    const { _id, __v, ...roleUpdateData } = roleData;
  
    // Convert role name to lowercase and trim whitespace
    roleUpdateData.name = roleUpdateData.name.trim().toLowerCase();
  
    // Validate that the role name contains only alphabets
    const alphaRegex = /^[a-zA-Z]+$/;
    if (!alphaRegex.test(roleUpdateData.name)) {
      toast.error("Role name must only contain alphabets (no numbers or special characters).");
      return;
    }
  
    try {
      // Fetch existing roles
      const existingRolesResponse = await axios.get("http://localhost:5000/api/role/");
      const existingRoles = existingRolesResponse.data;
  
      // Check if a role with the same name exists (excluding the current role being updated)
      const duplicateRole = existingRoles.find(
        (role) => role.name === roleUpdateData.name && role._id !== _id
      );
  
      if (duplicateRole) {
        toast.error("A role with the same name already exists.");
        return;
      }
  
      // Send update request
      const response = await axios.put(
        `http://localhost:5000/api/role/update/${_id}`,
        roleUpdateData
      );
  
      toast.success("Role updated successfully!");
      fetchRoles(); // Refresh roles
      setRoleData({ name: "", status: "active", limit: 0 }); // Reset form
      setIsModalOpen(false); // Close modal
    } catch (error) {
      console.error("Error updating role:", error.response || error);
      toast.error(
        error.response?.data?.message || "An error occurred while updating the role."
      );
    }
  };
  


  // Delete role
  const handleDelete = async (roleId) => {
    if (window.confirm("Are you sure you want to delete this role?")) {
      try {
        // First, check if the role is assigned to a staff member
        const roleResponse = await axios.get(`http://localhost:5000/api/role/${roleId}`);
        const role = roleResponse.data;
  
        // If the role is assigned to a staff member, prevent deletion
        if (role.assignedToStaff && role.assignedToStaff.length > 0) {
          toast.error("This role is currently assigned to a staff member and cannot be deleted.");
          return; // Stop further deletion process
        }
  
        // If the role is not assigned to anyone, proceed with deletion
        await axios.delete(`http://localhost:5000/api/role/delete/${roleId}`);
        toast.success("Role deleted successfully!");
  
        setRoles(roles.filter((role) => role._id !== roleId)); // Update local state
      } catch (error) {
        // Handle errors if any
        if (error.response && error.response.data && error.response.data.message) {
          toast.error(error.response.data.message); // Show the error message from the server
        } else {
          console.error("Error deleting role:", error);
          toast.error("An error occurred while deleting the role.");
        }
      }
    }
  };
  
  

  // Open modal for adding or updating a role
  const openModal = (role = null) => {
    if (role) {
      setIsUpdate(true);
      setRoleData(role);
    } else {
      setIsUpdate(false);
      setRoleData({ name: "", status: "active", limit: "" });
    }
    setIsModalOpen(true);
  };

  // Open modal for viewing role details
  const openViewModal = (role) => {
    setViewRole(role);
  };

  // Close the view modal
  const closeViewModal = () => {
    setViewRole(null);
  };

  return (
    <>
      <div className="card mb-3" id="rolesTable">
        <div className="card-header">
          <div className="row flex-between-center">
            <div className="col-3 col-sm-auto d-flex align-items-center pe-0">
              <h5 className="fs-9 mb-0 text-nowrap py-2 py-xl-0">Roles</h5>
            </div>
            <div
              className="col-3 col-sm-auto ms-auto text-end ps-0 d-none d-sm-inline-block ms-1 search-box"
              data-list='{"valueNames":["title"]}'
            >
              <form
                className="position-relative"
                data-bs-toggle="search"
                data-bs-display="static"
              >
                <input
                  className="form-control search-input fuzzy-search"
                  type="search"
                  placeholder="Search..."
                  aria-label="Search"
                  value={searchTerm}
                onChange={handleSearchChange}
                />
                <span className="fas fa-search search-box-icon" />
              </form>
            </div>
            <div className="col-3 col-sm-auto ms-auto text-end ps-0">
              <button
                className="btn btn-falcon-default btn-sm"
                type="button"
                onClick={() => openModal()}
              >
                <span className="fas fa-plus" />
                <span className="d-none d-sm-inline-block ms-1">New</span>
              </button>
            </div>
          </div>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive scrollbar">
            <table className="table table-sm table-striped fs-10 mb-0 overflow-hidden">
              <thead className="bg-200">
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Limit</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
              {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center">
                      Loading...
                    </td>
                  </tr>
                ) : filteredRoles.length > 0 ? (
                  filteredRoles.map((role, index) => (
                    <tr key={role._id}>
                      <td>{index + 1}</td>
                      <td>{role.name}</td>
                      <td>{role.status}</td>
                      <td>{role.limit}</td>
                      <td className="py-2 align-middle white-space-nowrap text-end">
                        <div className="dropdown font-sans-serif position-static">
                          <button
                            className="btn btn-link text-600 btn-sm dropdown-toggle btn-reveal"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="false"
                          >
                            <span className="fas fa-ellipsis-h fs-10"></span>
                          </button>
                          <div className="dropdown-menu dropdown-menu-end border py-0">
                            <div className="py-2">
                              <Link
                                className="dropdown-item"
                                onClick={() => openModal(role)}
                              >
                                Update
                              </Link>
                              <Link
                                className="dropdown-item"
                                onClick={() => openViewModal(role)}
                              >
                                View
                              </Link>
                              <div className="dropdown-divider"></div>
                              <Link
                                className="dropdown-item text-danger"
                                onClick={() => handleDelete(role._id)}
                              >
                                Delete
                              </Link>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">
                      No roles found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal for adding or updating a role */}
      {isModalOpen && (
        <div className="modal show" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {isUpdate ? "Update Role" : "Add New Role"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setIsModalOpen(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={isUpdate ? updateRole : addRole}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                      Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={roleData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="status" className="form-label">
                      Status
                    </label>
                    <select
                      className="form-control"
                      id="status"
                      name="status"
                      value={roleData.status}
                      onChange={handleChange}
                      required
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="limit" className="form-label">
                      Limit
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="limit"
                      min="1"
                      name="limit"
                      value={roleData.limit}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    {isUpdate ? "Update Role" : "Add Role"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal for viewing role details */}
      {viewRole && (
        <div className="modal show" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">View Role Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeViewModal}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  <strong>Name:</strong> {viewRole.name}
                </p>
                <p>
                  <strong>Status:</strong> {viewRole.status}
                </p>
                <p>
                  <strong>Limit:</strong> {viewRole.limit}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-center" autoClose={3000} />
    </>
  );
};

export default Roleread;
