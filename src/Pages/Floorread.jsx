import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
const Floorread = () => {
  const [floors, setFloors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [floorData, setFloorData] = useState({
    number: "",
    available: "yes",
    limit: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [viewFloor, setViewFloor] = useState(null); // State for viewing floor details

  // Fetch floors from the backend
  const fetchFloors = async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/floor/");
    console.log("Fetched floors:", response.data); // Add this line for debugging
    setFloors(response.data);
    setLoading(false);

    // Automatically set the next floor number
    if (response.data.length > 0) {
      const lastFloor = response.data[response.data.length - 1];
      setFloorData((prevData) => ({
        ...prevData,
        number: lastFloor.number + 1, // Automatically set to the next sequential number
      }));
    } else {
      setFloorData((prevData) => ({
        ...prevData,
        number: 1, // If no floors exist, set the first floor as number 1
      }));
    }
  } catch (error) {
    console.error("Error fetching floors:", error);
    setLoading(false);
  }
};


  useEffect(() => {
    fetchFloors();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFloorData({ ...floorData, [name]: value });
  };
  const addFloor = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/floor/create",
        floorData
      );
      toast.success("Floor added successfully!");
      fetchFloors(); // Refetch floors to get the updated list
      setFloorData({ number: "", available: "yes", limit: "" }); // Reset form fields
      setIsModalOpen(false); // Close modal
    } catch (error) {
      console.error("Error creating floor:", error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || "An error occurred while adding the floor.";
      toast.error(errorMessage);
    }
  };
  


  
  

  // Update existing floor
  const updateFloor = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:5000/api/floor/update/${floorData._id}`, // Make sure _id is passed
        floorData
      );
      toast.success("Floor updated successfully!");
      fetchFloors(); // Refetch updated floors list
      setFloorData({ number: "", available: "yes", limit: "" }); // Reset form fields
      setIsModalOpen(false); // Close modal
    } catch (error) {
      console.error("Error updating floor:", error);
      toast.error("An error occurred while updating the floor.");
    }
  };
  

  // Delete floor
  const handleDelete = async (floorId) => {
    if (window.confirm("Are you sure you want to delete this floor?")) {
      try {
        await axios.delete(`http://localhost:5000/api/floor/delete/${floorId}`);
        toast.success("Floor deleted successfully!");
        setFloors(floors.filter((floor) => floor._id !== floorId));
      } catch (error) {
        console.error("Error deleting floor:", error);
        toast.error("An error occurred while deleting the floor.");
      }
    }
  };

  // Open modal for adding or updating a floor
  const openModal = (floor = null) => {
    if (floor) {
      setIsUpdate(true); // Set update mode to true
      setFloorData(floor); // Set floor data for updating
    } else {
      setIsUpdate(false); // Set to add mode
      setFloorData({ number: "", available: "yes", limit: "" });
    }
    setIsModalOpen(true); // Open modal
  };
  

  // Open modal for viewing floor details
  const openViewModal = (floor) => {
    setViewFloor(floor);
  };

  // Close the view modal
  const closeViewModal = () => {
    setViewFloor(null);
  };

  return (
    <>
      <div className="card mb-3" id="floorsTable">
        <div className="card-header">
          <div className="row flex-between-center">
            <div className="col-4 col-sm-auto d-flex align-items-center pe-0">
              <h5 className="fs-9 mb-0 text-nowrap py-2 py-xl-0">Floors</h5>
            </div>
            <div className="col-8 col-sm-auto ms-auto text-end ps-0">
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
                  <th>Floor No</th>
                  <th>Available</th>
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
                ) : floors.length > 0 ? (
                  floors.map((floor, index) => (
                    <tr key={floor._id}>
                      <td>{index + 1}</td>
                      <td>{floor.number}</td>
                      <td>{floor.available}</td>
                      <td>{floor.limit}</td>
                      <td className="py-2 align-middle white-space-nowrap text-end">
                        <div className="dropdown font-sans-serif position-static">
                          <button
                            className="btn btn-link text-600 btn-sm dropdown-toggle btn-reveal"
                            type="button"
                            id="floor-dropdown-0"
                            data-bs-toggle="dropdown"
                            data-boundary="viewport"
                            aria-haspopup="true"
                            aria-expanded="false"
                          >
                            <span className="fas fa-ellipsis-h fs-10"></span>
                          </button>
                          <div
                            className="dropdown-menu dropdown-menu-end border py-0"
                            aria-labelledby="floor-dropdown-0"
                          >
                            <div className="py-2">
                              <Link
                                className="dropdown-item"
                                href="#!"
                                onClick={() => openModal(floor)}
                              >
                                Update
                              </Link>
                              <Link
                                className="dropdown-item"
                                href="#!"
                                onClick={() => openViewModal(floor)} // Open view modal
                              >
                                View
                              </Link>
                              <div className="dropdown-divider"></div>
                              <Link
                                className="dropdown-item text-danger"
                                href="#!"
                                onClick={() => handleDelete(floor._id)}
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
                      No floors found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal for adding or updating a floor */}
      {isModalOpen && (
        <div className="modal show" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {isUpdate ? "Update Floor" : "Add New Floor"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setIsModalOpen(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={isUpdate ? updateFloor : addFloor}>
                  <div className="mb-3">
                    <label htmlFor="number" className="form-label">
                      Floor No
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="number"
                      name="number"
                      value={floorData.number}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="available" className="form-label">
                      Available
                    </label>
                    <select
                      className="form-control"
                      id="available"
                      name="available"
                      value={floorData.available}
                      onChange={handleChange}
                      required
                    >
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
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
                      name="limit"
                      value={floorData.limit}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    {isUpdate ? "Update Floor" : "Add Floor"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal for viewing floor details */}
      {viewFloor && (
        <div className="modal show" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">View Floor Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeViewModal}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  <strong>Floor No:</strong> {viewFloor.number}
                </p>
                <p>
                  <strong>Available:</strong> {viewFloor.available}
                </p>
                <p>
                  <strong>Limit:</strong> {viewFloor.limit}
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

export default Floorread;
