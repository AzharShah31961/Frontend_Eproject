import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";

const LaundryRead = () => {
  const [laundryItems, setLaundryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [laundryData, setLaundryData] = useState({
    _id: "",
    object: "",
    category: "Clothing Items",
    pricing: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false); // Add/Update modal
  const [isViewModalOpen, setIsViewModalOpen] = useState(false); // View modal
  const [isUpdate, setIsUpdate] = useState(false); // Track if the modal is for update

  // Fetch laundry items data
  const fetchLaundryItems = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/laundry");
      setLaundryItems(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching laundry items:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLaundryItems();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLaundryData({ ...laundryData, [name]: value });
  };

  // Submit to add new laundry item
  const handleAddLaundry = async (e) => {
    e.preventDefault();

    // Convert the 'object' (name) to lowercase, keep 'pricing' as it is
    const lowerCaseLaundryData = {
      object: laundryData.object.toLowerCase(),
      category: laundryData.category, // Keep category as it is
      pricing: laundryData.pricing, // Keep pricing as it is
    };

    try {
      // Fetch existing laundry items from the server
      const existingItems = await axios.get(
        "http://localhost:5000/api/laundry/"
      );

      // Check if the laundry item already exists (same name and category)
      const isDuplicate = existingItems.data.some(
        (item) =>
          item.object.toLowerCase() === lowerCaseLaundryData.object &&
          item.category.toLowerCase() === lowerCaseLaundryData.category
      );

      if (isDuplicate) {
        toast.error("This laundry item is already added.");
        return;
      }

      // Send request to the server to add the new laundry item
      const response = await axios.post(
        "http://localhost:5000/api/laundry/create",
        lowerCaseLaundryData
      );

      // Check if there's a message in the response and display it
      if (response.data && response.data.message) {
        toast.success(response.data.message); // Show success message from the response
      } else {
        toast.success("Laundry item added successfully!");
      }

      // Reset the form fields
      setLaundryData({ object: "", category: "Clothing Items", pricing: "" });

      // Refresh the laundry items list
      fetchLaundryItems();

      // Close the modal
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding laundry item:", error);

      // Check if the error response contains a message and display it
      const errorMessage =
        error.response?.data?.message || "Failed to add laundry item.";
      toast.error(errorMessage);
    }
  };

 const handleUpdateLaundry = async (e) => {
   e.preventDefault();

   // Convert the 'object' (name) to lowercase, keep 'pricing' as it is
   const lowerCaseLaundryData = {
     object: laundryData.object.toLowerCase(),
     category: laundryData.category, // Keep category as it is
     pricing: laundryData.pricing, // Keep pricing as it is
   };

   try {
     // Check if the item already exists in the laundry items list (using current state or fetched data)
     const duplicateItem = laundryItems.find(
       (item) =>
         item.object === lowerCaseLaundryData.object &&
         item.category === laundryData.category &&
         item._id !== laundryData._id // Make sure it's not the same item being updated
     );

     if (duplicateItem) {
       toast.error("This laundry item already exists!");
       return; // Prevent update if duplicate is found
     }

     // Destructure _id and __v to exclude them from the updated data
     const { _id, __v, ...updatedData } = laundryData;

     // Update the 'object' field with the lowercased value
     updatedData.object = lowerCaseLaundryData.object;

     // Send request to the server to update the laundry item
     const response = await axios.put(
       `http://localhost:5000/api/laundry/update/${_id}`,
       updatedData
     );

     // Check if there's a message in the response and display it
     if (response.data && response.data.message) {
       toast.success(response.data.message); // Show success message from the response
     } else {
       toast.success("Laundry item updated successfully!");
     }

     // Reset the form fields
     setLaundryData({ object: "", category: "Clothing Items", pricing: "" });

     // Refresh the laundry items list
     fetchLaundryItems();

     // Close the modal
     setIsModalOpen(false);
   } catch (error) {
     console.error("Error updating laundry item:", error);

     // Check if the error response contains a message and display it
     const errorMessage =
       error.response?.data?.message || "Failed to update laundry item.";
     toast.error(errorMessage);
   }
 };

  // Handle delete
  const handleDelete = async (laundryId) => {
    if (window.confirm("Are you sure you want to delete this laundry item?")) {
      try {
        await axios.delete(
          `http://localhost:5000/api/laundry/delete/${laundryId}`
        );
        toast.success("Laundry item deleted successfully!");
        setLaundryItems(laundryItems.filter((item) => item._id !== laundryId));
      } catch (error) {
        console.error("Error deleting laundry item:", error);
        toast.error("Failed to delete laundry item.");
      }
    }
  };

  // Open modal to add new laundry item
  const openAddModal = () => {
    setIsUpdate(false);
    setLaundryData({ object: "", category: "Clothing Items", pricing: "" });
    setIsModalOpen(true);
  };

  // Open modal to update laundry item
  const openUpdateModal = (item) => {
    setIsUpdate(true);
    setLaundryData({ ...item });
    setIsModalOpen(true);
  };

  // Open modal to view laundry item details
  const openViewModal = (item) => {
    setLaundryData(item);
    setIsViewModalOpen(true);
  };

  return (
    <>
      <div className="card mb-3" id="laundryTable">
        <div className="card-header">
          <div className="row flex-between-center">
            <div className="col-4 col-sm-auto d-flex align-items-center pe-0">
              <h5 className="fs-9 mb-0 text-nowrap py-2 py-xl-0">
                Laundry Items
              </h5>
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
                  <th>Object</th>
                  <th>Category</th>
                  <th>Pricing</th>
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
                ) : laundryItems.length > 0 ? (
                  laundryItems.map((item, index) => (
                    <tr key={item._id}>
                      <td>{index + 1}</td>
                      <td>{item.object}</td>
                      <td>{item.category}</td>
                      <td>{item.pricing}</td>
                      <td className="py-2 align-middle white-space-nowrap text-end">
                        <div className="dropdown font-sans-serif position-static">
                          <button
                            className="btn btn-link text-600 btn-sm dropdown-toggle btn-reveal"
                            type="button"
                            id="laundry-dropdown-0"
                            data-bs-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="false"
                          >
                            <span className="fas fa-ellipsis-h fs-10"></span>
                          </button>
                          <div
                            className="dropdown-menu dropdown-menu-end border py-0"
                            aria-labelledby="laundry-dropdown-0"
                          >
                            <div className="py-2">
                              <Link
                                className="dropdown-item"
                                onClick={() => openUpdateModal(item)} // Open update modal
                              >
                                Update
                              </Link>
                              <Link
                                className="dropdown-item"
                                onClick={() => openViewModal(item)} // Open view modal
                              >
                                View
                              </Link>
                              <div className="dropdown-divider"></div>
                              <Link
                                className="dropdown-item text-danger"
                                onClick={() => handleDelete(item._id)} // Delete laundry item
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
                      No laundry items found.
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
                  {isUpdate ? "Update Laundry Item" : "Add New Laundry Item"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setIsModalOpen(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form
                  onSubmit={isUpdate ? handleUpdateLaundry : handleAddLaundry}
                >
                  <div className="mb-3">
                    <label htmlFor="object" className="form-label">
                      Object
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="object"
                      name="object"
                      value={laundryData.object}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="category" className="form-label">
                      Category
                    </label>
                    <select
                      className="form-control"
                      id="category"
                      name="category"
                      value={laundryData.category}
                      onChange={handleChange}
                      required
                    >
                      <option value="Clothing Items">Clothing Items</option>
                      <option value="Bed & Bath Linen">Bed & Bath Linen</option>
                      <option value="Special Items">Special Items</option>
                      <option value="Additional Services">
                        Additional Services
                      </option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="pricing" className="form-label">
                      Pricing
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="pricing"
                      name="pricing"
                      value={laundryData.pricing}
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
                      {isUpdate ? "Update" : "Add"} Laundry Item
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
                <h5 className="modal-title">Laundry Item Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setIsViewModalOpen(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  <strong>Object:</strong> {laundryData.object}
                </p>
                <p>
                  <strong>Category:</strong> {laundryData.category}
                </p>
                <p>
                  <strong>Pricing:</strong> {laundryData.pricing}
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

export default LaundryRead;
