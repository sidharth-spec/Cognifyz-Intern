document.addEventListener("DOMContentLoaded", () => {
  const productForm = document.getElementById("product-form");
  const productTable = document.getElementById("product-table");
  const statusMessage = document.getElementById("status-message");
  const loadingSpinner = document.getElementById("loading-spinner");

  // Load products on page load
  fetchProducts();

  // Form submission handler
  productForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(productForm);
    const productData = {
      name: formData.get("name"),
      price: formData.get("price"),
      category: formData.get("category"),
    };

    const productId = productForm.dataset.editId;

    try {
      showLoading();
      const response = await fetch(
        productId ? `/api/products/${productId}` : "/api/products",
        {
          method: productId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData),
        }
      );

      if (!response.ok) throw new Error(await response.text());

      showStatus("success", productId ? "Product updated!" : "Product added!");
      productForm.reset();
      delete productForm.dataset.editId;
      fetchProducts();
    } catch (error) {
      console.error("Error:", error);
      showStatus("danger", "Operation failed. Please try again.");
    } finally {
      hideLoading();
    }
  });

  // Fetch all products
  async function fetchProducts() {
    try {
      showLoading();
      const response = await fetch("/api/products");
      if (!response.ok) throw new Error("Failed to load products");

      const { data } = await response.json();
      renderProducts(data);
    } catch (error) {
      console.error("Error:", error);
      showStatus("danger", "Failed to load products");
    } finally {
      hideLoading();
    }
  }

  // Render products in table
  function renderProducts(products) {
    productTable.innerHTML = `
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Category</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${products
                  .map(
                    (product) => `
                    <tr>
                        <td>${product.name}</td>
                        <td>$${product.price}</td>
                        <td>${product.category}</td>
                        <td>
                            <button class="btn btn-sm btn-warning edit-btn" data-id="${product.id}">
                                Edit
                            </button>
                            <button class="btn btn-sm btn-danger delete-btn" data-id="${product.id}">
                                Delete
                            </button>
                        </td>
                    </tr>
                `
                  )
                  .join("")}
            </tbody>
        `;

    // Add event listeners to buttons
    document.querySelectorAll(".edit-btn").forEach((btn) => {
      btn.addEventListener("click", () => loadProductForEdit(btn.dataset.id));
    });

    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", () => deleteProduct(btn.dataset.id));
    });
  }

  // Load product for editing
  async function loadProductForEdit(id) {
    try {
      showLoading();
      const response = await fetch(`/api/products/${id}`);
      if (!response.ok) throw new Error("Failed to load product");

      const { data: product } = await response.json();

      document.getElementById("name").value = product.name;
      document.getElementById("price").value = product.price;
      document.getElementById("category").value = product.category;
      productForm.dataset.editId = product.id;

      showStatus("info", `Editing: ${product.name}`);
      productForm.scrollIntoView({ behavior: "smooth" });
    } catch (error) {
      console.error("Error:", error);
      showStatus("danger", "Failed to load product");
    } finally {
      hideLoading();
    }
  }

  // Delete product
  async function deleteProduct(id) {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      showLoading();
      const response = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete product");

      showStatus("success", "Product deleted successfully!");
      fetchProducts();
    } catch (error) {
      console.error("Error:", error);
      showStatus("danger", "Failed to delete product");
    } finally {
      hideLoading();
    }
  }

  // UI Helpers
  function showLoading() {
    loadingSpinner.style.display = "block";
  }

  function hideLoading() {
    loadingSpinner.style.display = "none";
  }

  function showStatus(type, message) {
    statusMessage.textContent = message;
    statusMessage.className = `alert alert-${type}`;
    statusMessage.style.display = "block";

    setTimeout(() => {
      statusMessage.style.opacity = "0";
      setTimeout(() => (statusMessage.style.display = "none"), 300);
    }, 3000);
  }
});
