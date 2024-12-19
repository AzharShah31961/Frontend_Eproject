import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";

const Guestread = () => {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [guestData, setGuestData] = useState({
    name: "",
    email: "",
    phone: "",
    documenttype: "",
    documentno: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState(null);

  // Fetch guests
  const fetchGuests = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/guest/");
      setGuests(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching guests:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuests();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      // Allow only numbers and ensure phone starts with "03"
      if (
        !/^\d*$/.test(value) ||
        value.length > 11 ||
        (value.length === 2 && value !== "03")
      ) {
        return;
      }
    }

    if (name === "documentno") {
      // Restrict document number length based on document type
      if (guestData.documenttype === "cnic" && value.length > 13) {
        return; // Limit CNIC number to 13 digits
      }
      if (guestData.documenttype === "passport" && value.length > 10) {
        return; // Limit Passport number to 10 digits
      }
    }

    // Update guest data state
    setGuestData({ ...guestData, [name]: value });
  };

  // Validation functions
  const validateName = (name) => {
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(name)) {
      toast.error("Name must contain only alphabets.");
      return false;
    }
    return true;
  };

  const validatePhone = (phone) => {
    if (!/^\d{11}$/.test(phone) || !phone.startsWith("03")) {
      toast.error("Phone number must be exactly 11 digits and start with '03'.");
      return false;
    }
    return true;
  };

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(email)) {
      toast.error("Invalid email format.");
      return false;
    }
    return true;
  };

  const validateDocumentNumber = (documenttype, documentno) => {
    if (documenttype === "cnic") {
      if (!/^\d+$/.test(documentno)) {
        toast.error("CNIC number must contain only digits.");
        return false;
      }
      if (documentno.length !== 13) {
        toast.error("CNIC number must be exactly 13 digits.");
        return false;
      }
    } else if (documenttype === "passport") {
      if (documentno.length < 6 || documentno.length > 10) {
        toast.error("Passport number must be between 6 and 10 characters.");
        return false;
      }
    } else {
      toast.error("Please select a valid document type.");
      return false;
    }
    return true;
  };

  // Add new guest

// Add new guest
let isErrorHandled = false;  // Flag to track if an error is already handled

// Add new guest
const addGuest = async (e) => {
  e.preventDefault();

  let isValid = true;

  // Reset error handled flag
  isErrorHandled = false;

  // Validate each field individually and show specific error messages
  if (!validateName(guestData.name)) {
    if (!isErrorHandled) {
      toast.error("Name must contain only alphabets.");
      isErrorHandled = true;  // Mark error as handled
    }
    isValid = false;
  }
  if (!validatePhone(guestData.phone)) {
    if (!isErrorHandled) {
      toast.error("Phone number must be exactly 11 digits and start with '03'.");
      isErrorHandled = true;  // Mark error as handled
    }
    isValid = false;
  }
  if (!validateEmail(guestData.email)) {
    if (!isErrorHandled) {
      toast.error("Invalid email format.");
      isErrorHandled = true;  // Mark error as handled
    }
    isValid = false;
  }
  if (!validateDocumentNumber(guestData.documenttype, guestData.documentno)) {
    if (!isErrorHandled) {
      toast.error("Invalid document number or type.");
      isErrorHandled = true;  // Mark error as handled
    }
    isValid = false;
  }

  if (!isValid) {
    return; // Stop further execution if any field is invalid
  }

  // Convert email to lowercase without trimming
  guestData.email = guestData.email.toLowerCase();

  // Axios Request to add the guest
  try {
    const response = await axios.post(
      "http://localhost:5000/api/guest/create",
      guestData,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    // Success toast
    toast.success("Guest successfully created!");
    fetchGuests();
    setGuestData({
      name: "",
      email: "",
      phone: "",
      documenttype: "",
      documentno: "",
    });
    setIsModalOpen(false);
  } catch (error) {
    // Handle duplicate email error specifically
    if (error.response?.data?.message?.includes("E11000 duplicate key error") && !isErrorHandled) {
      toast.error("Email already exists.");
      isErrorHandled = true;  // Mark error as handled
      return; // Prevent any further execution for this error
    } else if (!isErrorHandled) {
      // For other errors, show the backend error message only once
      const errorMessage = error.response?.data?.message || error.message || "An error occurred while creating the guest.";
      toast.error(errorMessage);
      isErrorHandled = true;  // Mark error as handled
    }
    console.error("Error:", error.response?.data?.message || error.message);
  }
};




const updateGuest = async (e) => {
  e.preventDefault();

  let isValid = true;

  // Reset error handled flag
  isErrorHandled = false;

  // Validate each field individually and show specific error messages
  if (!validateName(guestData.name)) {
    if (!isErrorHandled) {
      toast.error("Name must contain only alphabets.");
      isErrorHandled = true;  // Mark error as handled
    }
    isValid = false;
  }
  if (!validatePhone(guestData.phone)) {
    if (!isErrorHandled) {
      toast.error("Phone number must be exactly 11 digits and start with '03'.");
      isErrorHandled = true;  // Mark error as handled
    }
    isValid = false;
  }
  if (!validateEmail(guestData.email)) {
    if (!isErrorHandled) {
      toast.error("Invalid email format.");
      isErrorHandled = true;  // Mark error as handled
    }
    isValid = false;
  }
  if (!validateDocumentNumber(guestData.documenttype, guestData.documentno)) {
    if (!isErrorHandled) {
      toast.error("Invalid document number or type.");
      isErrorHandled = true;  // Mark error as handled
    }
    isValid = false;
  }

  if (!isValid) {
    return; // Stop further execution if any field is invalid
  }

  // Convert email to lowercase without trimming
  guestData.email = guestData.email.toLowerCase();

  // Prepare data for the API request (exclude _id and __v)
  const { _id, __v, ...guestUpdateData } = guestData;

  // Make PUT request to update the guest data
  try {
    const response = await axios.put(
      `http://localhost:5000/api/guest/update/${_id}`,
      guestUpdateData
    );
    // Success toast
    toast.success("Guest updated successfully!");
    fetchGuests(); // Refresh the guest list
    setGuestData({
      name: "",
      email: "",
      phone: "",
      documenttype: "",
      documentno: "",
    });
    setIsModalOpen(false); // Close modal
  } catch (error) {
    // Handle duplicate email error specifically
    if (error.response?.data?.message?.includes("E11000 duplicate key error") && !isErrorHandled) {
      toast.error("Email already exists.");
      isErrorHandled = true;  // Mark error as handled
      return; // Prevent further execution for this error
    } else if (!isErrorHandled) {
      // For other errors, show the backend error message only once
      const errorMessage = error.response?.data?.message || error.message || "An error occurred while updating the guest.";
      toast.error(errorMessage);
      isErrorHandled = true;  // Mark error as handled
    }
    console.error("Error:", error.response?.data?.message || error.message);
  }
};








  // Delete guest
  const handleDelete = async (guestId) => {
    if (window.confirm("Are you sure you want to delete this guest?")) {
      try {
        await axios.delete(`http://localhost:5000/api/guest/delete/${guestId}`);
        toast.success("Guest deleted successfully!");
        setGuests(guests.filter((guest) => guest._id !== guestId));
      } catch (error) {
        toast.error("An error occurred while deleting the guest.");
      }
    }
  };

  // Open modal for adding or updating guest
  const openModal = (guest = null) => {
    if (guest) {
      setIsUpdate(true);
      setGuestData({
        ...guest, // Spread the guest data
        documenttype: guest.documenttype || "", // Ensure document type is set correctly
      });
    } else {
      setIsUpdate(false);
      setGuestData({
        name: "",
        email: "",
        phone: "",
        documenttype: "",
        documentno: "",
      });
    }
    setIsModalOpen(true); // Show modal
  };
  const openViewModal = (guest) => {
    setSelectedGuest(guest); // Set the selected guest for viewing
    setViewModalOpen(true); // Open the view modal
  };
  return (
    <>
      <div className="card mb-3" id="guestTable">
        <div className="card-header">
          <div className="row flex-between-center">
            <div className="col-4 col-sm-auto d-flex align-items-center pe-0">
              <h5 className="fs-9 mb-0 text-nowrap py-2 py-xl-0">Guests</h5>
            </div>
            <div className="col-8 col-sm-auto ms-auto text-end ps-0">
              <button
                className="btn btn-falcon-default btn-sm"
                type="button"
                onClick={() => openModal()} // Open the modal to add new guest
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
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Document Type</th>
                  <th>Document No</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center">
                      Loading...
                    </td>
                  </tr>
                ) : guests.length > 0 ? (
                  guests.map((guest, index) => (
                    <tr key={guest._id}>
                      <td>{index + 1}</td>
                      <td>{guest.name}</td>
                      <td>{guest.email}</td>
                      <td>{guest.phone}</td>
                      <td>{guest.documenttype}</td>
                      <td>{guest.documentno}</td>
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
                                href="#!"
                                onClick={() => openModal(guest)}
                              >
                                Update
                              </Link>
                              <Link
                                className="dropdown-item"
                                onClick={() => openViewModal(guest)}
                                // Open view modal
                              >
                                View
                              </Link>
                              <div className="dropdown-divider"></div>
                              <Link
                                className="dropdown-item text-danger"
                                href="#!"
                                onClick={() => handleDelete(guest._id)}
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
                    <td colSpan="7" className="text-center">
                      No guests found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal for adding or updating guest */}
      {isModalOpen && (
        <div className="modal show" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {isUpdate ? "Update Guest" : "Add New Guest"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setIsModalOpen(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={isUpdate ? updateGuest : addGuest}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                      Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={guestData.name}
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
                      value={guestData.email}
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
                      value={guestData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="documenttype" className="form-label">
                      Document Type
                    </label>
                    <select
                      className="form-control"
                      id="documenttype"
                      name="documenttype"
                      value={guestData.documenttype}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Document Type</option>
                      <option value="passport">Passport</option>
                      <option value="cnic">CNIC</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="documentno" className="form-label">
                      Document No
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="documentno"
                      name="documentno"
                      value={guestData.documentno}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    {isUpdate ? "Update" : "Add"} Guest
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
      {viewModalOpen && selectedGuest && (
        <div className="modal show" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">View Guest</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setViewModalOpen(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={selectedGuest.name}
                    disabled
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
                    value={selectedGuest.email}
                    disabled
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
                    value={selectedGuest.phone}
                    disabled
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="documenttype" className="form-label">
                    Document Type
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="documenttype"
                    name="documenttype"
                    value={selectedGuest.documenttype}
                    disabled
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="documentno" className="form-label">
                    Document No
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="documentno"
                    name="documentno"
                    value={selectedGuest.documentno}
                    disabled
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </>
  );
};

export default Guestread;
