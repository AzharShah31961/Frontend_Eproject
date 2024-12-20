import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";

const Foodread = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [foodData, setFoodData] = useState({
    _id: "",
    name: "",
    type: "breakfast",
    price: "",
    quantity: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false); // Add/Update modal
  const [isViewModalOpen, setIsViewModalOpen] = useState(false); // View modal
  const [isUpdate, setIsUpdate] = useState(false); // Track if the modal is for update

  // Fetch foods data
  const fetchFoods = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/food");
      setFoods(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching foods:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFoodData({ ...foodData, [name]: value });
  };

  // Submit to add new food item
  const handleAddFood = async (e) => {
    e.preventDefault();

    // Convert the name (foodData.name) to lowercase
    const lowerCaseFoodData = {
      name: foodData.name.toLowerCase(),
      type: foodData.type, // Keep type as it is
      price: foodData.price, // Keep price as it is
      quantity: foodData.quantity, // Keep quantity as it is
    };

    try {
      // Check if the food already exists in the current list of foods (assuming fetchFoods loads the list)
      const duplicateFood = foods.find(
        (item) =>
          item.name === lowerCaseFoodData.name && item.type === foodData.type
      );

      if (duplicateFood) {
        toast.error("This food item already exists!");
        return; // Prevent add operation if duplicate is found
      }

      // Send request to the server to add the new food
      const response = await axios.post(
        "http://localhost:5000/api/food/create",
        lowerCaseFoodData
      );

      // Check if there's a message in the response and display it
      if (response.data && response.data.message) {
        toast.success(response.data.message); // Show success message from the response
      } else {
        toast.success("Food added successfully!");
      }

      // Reset the form fields
      setFoodData({ name: "", type: "breakfast", price: "", quantity: "" });

      // Refresh the food list
      fetchFoods();

      // Close the modal
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding food:", error);

      // Check if the error response contains a message and display it
      const errorMessage =
        error.response?.data?.message || "Failed to add food."; // Fallback message if no error message is available
      toast.error(errorMessage); // Show the error message from the server or fallback message
    }
  };

  const handleUpdateFood = async (e) => {
    e.preventDefault();

    // Ensure the food name exists
    if (!foodData.name) {
      toast.error("Food name is required.");
      return;
    }

    // Convert the food name to lowercase before sending it
    const lowerCaseFoodData = {
      ...foodData,
      name: foodData.name.toLowerCase(), // Convert the name to lowercase
    };

    // Check if the food name already exists in the list (client-side check)
    const existingFood = foods.find(
      (food) => food.name === lowerCaseFoodData.name
    );
    if (existingFood && existingFood._id !== lowerCaseFoodData._id) {
      toast.error("Food name already exists.");
      return;
    }

    try {
      // Destructure _id and __v to exclude them from the updated data
      const { _id, __v, ...updatedData } = lowerCaseFoodData;

      // Send request to the server to update the food
      const response = await axios.put(
        `http://localhost:5000/api/food/update/${_id}`,
        updatedData
      );

      // Check if there's a message in the response and display it
      if (response.data && response.data.message) {
        toast.success(response.data.message); // Show success message from the response
      } else {
        toast.success("Food updated successfully!");
      }

      // Reset the form fields
      setFoodData({ name: "", type: "breakfast", price: "", quantity: "" });

      // Refresh the food list
      fetchFoods();

      // Close the modal
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating food:", error);

      // Check if the error response contains a message and display it
      const errorMessage =
        error.response?.data?.message || "Failed to update food."; // Fallback message if no error message is available
      toast.error(errorMessage); // Show the error message from the server or fallback message
    }
  };

  // Handle delete
  const handleDelete = async (foodId) => {
    if (window.confirm("Are you sure you want to delete this food item?")) {
      try {
        await axios.delete(`http://localhost:5000/api/food/delete/${foodId}`);
        toast.success("Food item deleted successfully!");
        setFoods(foods.filter((food) => food._id !== foodId));
      } catch (error) {
        console.error("Error deleting food:", error);
        toast.error("Failed to delete food.");
      }
    }
  };

  // Open modal to add new food
  const openAddModal = () => {
    setIsUpdate(false);
    setFoodData({ name: "", type: "breakfast", price: "", quantity: "" });
    setIsModalOpen(true);
  };

  // Open modal to update food
  const openUpdateModal = (food) => {
    setIsUpdate(true);
    setFoodData({ ...food });
    setIsModalOpen(true);
  };

  // Open modal to view food details
  const openViewModal = (food) => {
    setFoodData(food);
    setIsViewModalOpen(true);
  };

  return (
    <>
      <div className="card mb-3" id="foodsTable">
        <div className="card-header">
          <div className="row flex-between-center">
            <div className="col-3 col-sm-auto d-flex align-items-center pe-0">
              <h5 className="fs-9 mb-0 text-nowrap py-2 py-xl-0">Foods</h5>
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
                />
                <span className="fas fa-search search-box-icon" />
              </form>
            </div>
            <div className="col-3 col-sm-auto ms-auto text-end ps-0">
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
                  <th>Name</th>
                  <th>Type</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center">
                      Loading...
                    </td>
                  </tr>
                ) : foods.length > 0 ? (
                  foods.map((food, index) => (
                    <tr key={food._id}>
                      <td>{index + 1}</td>
                      <td>{food.name}</td>
                      <td>{food.type}</td>
                      <td>{food.price}</td>
                      <td>{food.quantity}</td>
                      <td className="py-2 align-middle white-space-nowrap text-end">
                        <div className="dropdown font-sans-serif position-static">
                          <button
                            className="btn btn-link text-600 btn-sm dropdown-toggle btn-reveal"
                            type="button"
                            id="food-dropdown-0"
                            data-bs-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="false"
                          >
                            <span className="fas fa-ellipsis-h fs-10"></span>
                          </button>
                          <div
                            className="dropdown-menu dropdown-menu-end border py-0"
                            aria-labelledby="food-dropdown-0"
                          >
                            <div className="py-2">
                              <Link
                                className="dropdown-item"
                                onClick={() => openUpdateModal(food)} // Open update modal
                              >
                                Update
                              </Link>
                              <Link
                                className="dropdown-item"
                                onClick={() => openViewModal(food)} // Open view modal
                              >
                                View
                              </Link>
                              <div className="dropdown-divider"></div>
                              <Link
                                className="dropdown-item text-danger"
                                onClick={() => handleDelete(food._id)} // Delete food item
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
                    <td colSpan="6" className="text-center">
                      No foods found.
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
                  {isUpdate ? "Update Food" : "Add New Food"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setIsModalOpen(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={isUpdate ? handleUpdateFood : handleAddFood}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                      Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={foodData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="type" className="form-label">
                      Type
                    </label>
                    <select
                      className="form-control"
                      id="type"
                      name="type"
                      value={foodData.type}
                      onChange={handleChange}
                      required
                    >
                      <option value="breakfast">Breakfast</option>
                      <option value="starter">Starter</option>
                      <option value="main">Main</option>
                      <option value="deserts">Deserts</option>
                      <option value="beverages">Beverages</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="price" className="form-label">
                      Price
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="price"
                      name="price"
                      value={foodData.price}
                      onChange={handleChange}
                      required
                      min={1}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="quantity" className="form-label">
                      Quantity
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="quantity"
                      name="quantity"
                      value={foodData.quantity}
                      onChange={handleChange}
                      required
                      min={1}
                    />
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setIsModalOpen(false)}
                    >
                      Close
                    </button>
                    <button type="submit" className="btn btn-primary">
                      {isUpdate ? "Update" : "Add"} Food
                    </button>
                  </div>
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
                <h5 className="modal-title">Food Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setIsViewModalOpen(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  <strong>Name:</strong> {foodData.name}
                </p>
                <p>
                  <strong>Type:</strong> {foodData.type}
                </p>
                <p>
                  <strong>Price:</strong> {foodData.price}
                </p>
                <p>
                  <strong>Quantity:</strong> {foodData.quantity}
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsViewModalOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast notifications */}
      <ToastContainer />
    </>
  );
};

export default Foodread;
