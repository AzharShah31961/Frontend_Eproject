import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";

const Adminread = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    _id: "",
    username: "",
    email: "",
    phone: "",
    password: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false); // Add/Update modal
  const [isViewModalOpen, setIsViewModalOpen] = useState(false); // View modal
  const [isUpdate, setIsUpdate] = useState(false); // Track if the modal is for update

  // Fetch users data
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/admin/");
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle input changes0
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      // Allow only numeric values
      const numericValue = value.replace(/\D/g, ""); // Remove non-numeric characters
      if (numericValue.length > 11) return; // Prevent more than 11 digits
      setUserData({ ...userData, [name]: numericValue });
      return;
    }

    if (name === "username" && !isValidUsername(value)) {
      toast.warn("Number & special character is not allowed in username.");
    }

    setUserData({ ...userData, [name]: value });
  };

  const isValidUsername = (username) => {
    const regex = /^[a-zA-Z\s]+$/; // Allows only letters and spaces
    return regex.test(username);
  };

  // Validate phone number
  const isValidPhoneNumber = (phone) => {
    const regex = /^03\d{9}$/; // Must start with "03" and be 11 digits long
    return regex.test(phone);
  };

  // Check for duplicate phone number in users list
  const isUniquePhoneNumber = (phone, userId) => {
    return !users.some((user) => user.phone === phone && user._id !== userId);
  };
  // Check for duplicate username in users list
  const isUniqueUsername = (username, userId) => {
    return !users.some(
      (user) => user.username === username && user._id !== userId
    );
  };

  // Handle Add Admin with validation
  const handleAddAdmin = async (e) => {
    e.preventDefault();

    // Validate username
    if (!isValidUsername(userData.username)) {
      toast.error("Number & special character is not allowed in username.");
      return;
    }

    // Validate phone number
    if (!isValidPhoneNumber(userData.phone)) {
      toast.error("Phone number must start with '03' and be 11 digits long.");
      return;
    }

    // Check for unique phone number
    if (!isUniquePhoneNumber(userData.phone)) {
      toast.error("This phone number is already associated with another user.");
      return;
    }
    if (
      !isUniqueUsername(userData.username.trim().toLowerCase(), userData._id)
    ) {
      toast.error("This username is already associated with another user.");
      return;
    }

    try {
      const preparedUserData = {
        ...userData,
        username: userData.username.trim().toLowerCase(),
        email: userData.email.trim().toLowerCase(),
      };

      await axios.post(
        "http://localhost:5000/api/admin/create",
        preparedUserData
      );
      toast.success("Admin added successfully!");

      setUserData({ username: "", email: "", phone: "", password: "" });
      fetchUsers();
      setIsModalOpen(false);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to add admin.";
      console.error("Error adding admin:", errorMessage);
      toast.error(errorMessage);
    }
  };

  // Handle Update Admin with validation

  const handleUpdateAdmin = async (e) => {
    e.preventDefault();

    // Validate phone number
    if (!isValidPhoneNumber(userData.phone)) {
      toast.error("Phone number must start with '03' and be 11 digits long.");
      return;
    }
    if (!isValidUsername(userData.username)) {
      toast.error("Number & special character is not allowed in username.");
      return;
    }
    // Check for unique phone number
    if (!isUniquePhoneNumber(userData.phone, userData._id)) {
      toast.error("This phone number is already associated with another user.");
      return;
    }

    // Check for unique username
    if (
      !isUniqueUsername(userData.username.trim().toLowerCase(), userData._id)
    ) {
      toast.error("This username is already associated with another user.");
      return;
    }

    try {
      const { _id, __v, password, ...updatedData } = userData;

      const preparedUserData = {
        ...updatedData,
        username: updatedData.username.trim().toLowerCase(),
        email: updatedData.email.trim().toLowerCase(),
      };

      if (password) {
        preparedUserData.password = password;
      }

      await axios.put(
        `http://localhost:5000/api/admin/update/${_id}`,
        preparedUserData
      );
      toast.success("Admin updated successfully!");

      setUserData({ username: "", email: "", phone: "", password: "" });
      fetchUsers();
      setIsModalOpen(false);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to update admin.";
      console.error("Error updating admin:", errorMessage);
      toast.error(errorMessage);
    }
  };

  // Handle delete
  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/delete/${userId}`);
        toast.success("User deleted successfully!");
        setUsers(users.filter((user) => user._id !== userId));
      } catch (error) {
        console.error("Error deleting user:", error);
        toast.error("Failed to delete user.");
      }
    }
  };

  // Open modal to add new admin
  const openAddModal = () => {
    setIsUpdate(false);
    setUserData({ username: "", email: "", phone: "", password: "" });
    setIsModalOpen(true);
  };

  // Open modal to update admin
  const openUpdateModal = (user) => {
    setIsUpdate(true);
    setUserData({ ...user, password: "" });
    setIsModalOpen(true);
  };

  // Open modal to view admin details
  const openViewModal = (user) => {
    setUserData(user);
    setIsViewModalOpen(true);
  };

  return (
    <>
      <div className="card mb-3" id="ordersTable">
        <div className="card-header">
          <div className="row flex-between-center">
            <div className="col-4 col-sm-auto d-flex align-items-center pe-0">
              <h5 className="fs-9 mb-0 text-nowrap py-2 py-xl-0">Admin</h5>
            </div>
            <div className="col-8 col-sm-auto ms-auto text-end ps-0">
              <button
                className="btn btn-falcon-default btn-sm"
                type="button"
                onClick={openAddModal}
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
                  <th>Username</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center">
                      Loading...
                    </td>
                  </tr>
                ) : users.length > 0 ? (
                  users.map((user, index) => (
                    <tr key={user._id}>
                      <td>{index + 1}</td>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td>{user.phone}</td>
                      <td>
                        <span className="badge badge-subtle-success">
                          Active
                        </span>
                      </td>
                      <td className="py-2 align-middle white-space-nowrap text-end">
                        <div className="dropdown font-sans-serif position-static">
                          <button
                            className="btn btn-link text-600 btn-sm dropdown-toggle btn-reveal"
                            type="button"
                            id="order-dropdown-0"
                            data-bs-toggle="dropdown"
                            data-boundary="viewport"
                            aria-haspopup="true"
                            aria-expanded="false"
                          >
                            <span className="fas fa-ellipsis-h fs-10"></span>
                          </button>
                          <div
                            className="dropdown-menu dropdown-menu-end border py-0"
                            aria-labelledby="order-dropdown-0"
                          >
                            <div className="py-2">
                              <Link
                                className="dropdown-item"
                                onClick={() => openUpdateModal(user)} // Open update modal
                              >
                                Update
                              </Link>
                              <Link
                                className="dropdown-item"
                                onClick={() => openViewModal(user)}
                              >
                                View
                              </Link>
                              <div className="dropdown-divider"></div>
                              <Link
                                className="dropdown-item text-danger"
                                onClick={() => handleDelete(user._id)} // Delete user on click
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
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Update Modal */}
      {isModalOpen && (
        <div className="modal fade show" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {isUpdate ? "Update Admin" : "Add New Admin"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setIsModalOpen(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={isUpdate ? handleUpdateAdmin : handleAddAdmin}>
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label">
                      Username
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="username"
                      name="username"
                      value={userData.username}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={userData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="phone" className="form-label">
                      Phone
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="phone"
                      name="phone"
                      value={userData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  {!isUpdate && (
                    <div className="mb-3">
                      <label htmlFor="password" className="form-label">
                        Password
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        id="password"
                        name="password"
                        value={userData.password}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  )}
                  <button type="submit" className="btn btn-primary">
                    {isUpdate ? "Update Admin" : "Add Admin"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {isViewModalOpen && (
        <div className="modal fade show" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">View Admin Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setIsViewModalOpen(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  <strong>Username:</strong> {userData.username}
                </p>
                <p>
                  <strong>Email:</strong> {userData.email}
                </p>
                <p>
                  <strong>Phone:</strong> {userData.phone}
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

export default Adminread;
