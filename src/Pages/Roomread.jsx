import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";

const Roomread = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roomData, setRoomData] = useState({
    type: "",
    available: "yes",
    status: "available",
    floor: "",
    roomno: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [viewRoom, setViewRoom] = useState(null); // State for viewing room details

  // Fetch rooms from the backend
  const fetchRooms = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/room/");
      setRooms(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // Fetch room types and floors for dropdowns
  const fetchRoomTypesAndFloors = async () => {
    try {
      const roomtypesResponse = await axios.get(
        "http://localhost:5000/api/roomtype/"
      );
      const floorsResponse = await axios.get(
        "http://localhost:5000/api/floor/"
      );
      return { roomtypes: roomtypesResponse.data, floors: floorsResponse.data };
    } catch (error) {
      console.error("Error fetching room types or floors:", error);
      return { roomtypes: [], floors: [] };
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setRoomData({ ...roomData, [name]: value });
  };

  // Add new room
  const addRoom = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/room/create",
        roomData
      );
      toast.success("Room added successfully!");
      fetchRooms();
      setRoomData({
        type: "",
        available: "yes",
        status: "available",
        floor: "",
        roomno: "",
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error creating room:", error);
      toast.error("An error occurred while adding the room.");
    }
  };

  // Update existing room
  const updateRoom = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:5000/api/room/update/${roomData._id}`,
        roomData
      );
      toast.success("Room updated successfully!");
      fetchRooms();
      setRoomData({
        type: "",
        available: "yes",
        status: "available",
        floor: "",
        roomno: "",
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating room:", error);
      toast.error("An error occurred while updating the room.");
    }
  };

  // Delete room
  const handleDelete = async (roomId) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      try {
        await axios.delete(`http://localhost:5000/api/room/delete/${roomId}`);
        toast.success("Room deleted successfully!");
        setRooms(rooms.filter((room) => room._id !== roomId));
      } catch (error) {
        console.error("Error deleting room:", error);
        toast.error("An error occurred while deleting the room.");
      }
    }
  };

  // Open modal for adding or updating a room
  const openModal = (room = null) => {
    if (room) {
      setIsUpdate(true);
      setRoomData(room);
    } else {
      setIsUpdate(false);
      setRoomData({
        type: "",
        available: "yes",
        status: "available",
        floor: "",
        roomno: "",
      });
    }
    setIsModalOpen(true);
  };

  // Open modal for viewing room details
  const openViewModal = (room) => {
    setViewRoom(room);
  };

  // Close the view modal
  const closeViewModal = () => {
    setViewRoom(null);
  };

  return (
    <>
      <div className="card mb-3" id="roomsTable">
        <div className="card-header">
          <div className="row flex-between-center">
            <div className="col-4 col-sm-auto d-flex align-items-center pe-0">
              <h5 className="fs-9 mb-0 text-nowrap py-2 py-xl-0">Rooms</h5>
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
                  <th>Room No</th>
                  <th>Status</th>
                  <th>Available</th>
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
                ) : rooms.length > 0 ? (
                  rooms.map((room, index) => (
                    <tr key={room._id}>
                      <td>{index + 1}</td>
                      <td>{room.roomno}</td>
                      <td>{room.status}</td>
                      <td>{room.available}</td>
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
                                onClick={() => openModal(room)}
                              >
                                Update
                              </Link>
                              <Link
                                className="dropdown-item"
                                href="#!"
                                onClick={() => openViewModal(room)} // Open view modal
                              >
                                View
                              </Link>
                              <div className="dropdown-divider"></div>
                              <Link
                                className="dropdown-item text-danger"
                                href="#!"
                                onClick={() => handleDelete(room._id)}
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
                      No rooms found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal for adding or updating a room */}
      {isModalOpen && (
        <div className="modal show" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {isUpdate ? "Update Room" : "Add New Room"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setIsModalOpen(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={isUpdate ? updateRoom : addRoom}>
                  <div className="mb-3">
                    <label htmlFor="roomno" className="form-label">
                      Room No
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="roomno"
                      name="roomno"
                      value={roomData.roomno}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="type" className="form-label">
                      Room Type
                    </label>
                    <select
                      className="form-control"
                      id="type"
                      name="type"
                      value={roomData.type}
                      onChange={handleChange}
                      required
                    >
                      {/* Fetch room types dynamically */}
                      <option value="">Select Room Type</option>
                      {fetchRoomTypesAndFloors().roomtypes.map((roomtype) => (
                        <option key={roomtype._id} value={roomtype._id}>
                          {roomtype.type}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="floor" className="form-label">
                      Floor
                    </label>
                    <select
                      className="form-control"
                      id="floor"
                      name="floor"
                      value={roomData.floor}
                      onChange={handleChange}
                      required
                    >
                      {/* Fetch floors dynamically */}
                      <option value="">Select Floor</option>
                      {fetchRoomTypesAndFloors().floors.map((floor) => (
                        <option key={floor._id} value={floor._id}>
                          {floor.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="available" className="form-label">
                      Available
                    </label>
                    <select
                      className="form-control"
                      id="available"
                      name="available"
                      value={roomData.available}
                      onChange={handleChange}
                      required
                    >
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="status" className="form-label">
                      Status
                    </label>
                    <select
                      className="form-control"
                      id="status"
                      name="status"
                      value={roomData.status}
                      onChange={handleChange}
                      required
                    >
                      <option value="occupied">Occupied</option>
                      <option value="cleaning">Cleaning</option>
                      <option value="available">Available</option>
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary">
                    {isUpdate ? "Update Room" : "Add Room"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal for viewing room details */}
      {viewRoom && (
        <div className="modal show" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">View Room Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeViewModal}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  <strong>Room No:</strong> {viewRoom.roomno}
                </p>
                <p>
                  <strong>Room Type:</strong> {viewRoom.type}
                </p>
                <p>
                  <strong>Status:</strong> {viewRoom.status}
                </p>
                <p>
                  <strong>Available:</strong> {viewRoom.available}
                </p>
                <p>
                  <strong>Floor:</strong> {viewRoom.floor}
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

export default Roomread;
