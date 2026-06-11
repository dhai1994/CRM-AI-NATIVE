import { useEffect, useState } from "react";
import API from "../api/axios";
import Sidebar from "../components/Sidebar";

const Customers = () => {
  const [customers, setCustomers] =
    useState([]);

  const [file, setFile] =
    useState(null);

  const [form, setForm] =
    useState({
      name: "",
      email: "",
      phone: "",
      totalSpent: "",
      totalOrders: "",
      segment: "",
    });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers =
    async () => {
      try {
        const { data } =
          await API.get(
            "/customers"
          );

        setCustomers(data);
      } catch (error) {
        console.log(error);
      }
    };

  const addCustomer =
    async (e) => {
      e.preventDefault();

      try {
        await API.post(
          "/customers",
          form
        );

        setForm({
          name: "",
          email: "",
          phone: "",
          totalSpent: "",
          totalOrders: "",
          segment: "",
        });

        fetchCustomers();
      } catch (error) {
        console.log(error);
      }
    };

  const deleteCustomer =
    async (id) => {
      try {
        await API.delete(
          `/customers/${id}`
        );

        fetchCustomers();
      } catch (error) {
        console.log(error);
      }
    };

  const uploadCSV =
    async () => {
      if (!file) return;

      const formData =
        new FormData();

      formData.append(
        "file",
        file
      );

      try {
        await API.post(
          "/csv/upload",
          formData
        );

        alert(
          "CSV Uploaded"
        );

        fetchCustomers();
      } catch (error) {
        console.log(error);
      }
    };

  return (
    <div
      style={{
        display: "flex",
      }}
    >
      <Sidebar />

      <div
        style={{
          flex: 1,
          padding: "20px",
          background:
            "#111827",
          color: "white",
          minHeight:
            "100vh",
        }}
      >
        <h1>
          Customers
        </h1>

        <form
          onSubmit={
            addCustomer
          }
          style={{
            display:
              "grid",
            gap: "10px",
            maxWidth:
              "400px",
            marginTop:
              "20px",
          }}
        >
          <input
            placeholder="Name"
            value={
              form.name
            }
            onChange={(e) =>
              setForm({
                ...form,
                name:
                  e.target
                    .value,
              })
            }
          />

          <input
            placeholder="Email"
            value={
              form.email
            }
            onChange={(e) =>
              setForm({
                ...form,
                email:
                  e.target
                    .value,
              })
            }
          />

          <input
            placeholder="Phone"
            value={
              form.phone
            }
            onChange={(e) =>
              setForm({
                ...form,
                phone:
                  e.target
                    .value,
              })
            }
          />

          <input
            placeholder="Total Spent"
            value={
              form.totalSpent
            }
            onChange={(e) =>
              setForm({
                ...form,
                totalSpent:
                  e.target
                    .value,
              })
            }
          />

          <input
            placeholder="Orders"
            value={
              form.totalOrders
            }
            onChange={(e) =>
              setForm({
                ...form,
                totalOrders:
                  e.target
                    .value,
              })
            }
          />

          <input
            placeholder="Segment"
            value={
              form.segment
            }
            onChange={(e) =>
              setForm({
                ...form,
                segment:
                  e.target
                    .value,
              })
            }
          />

          <button>
            Add Customer
          </button>
        </form>

        <hr />

        <h2>
          CSV Upload
        </h2>

        <input
          type="file"
          onChange={(e) =>
            setFile(
              e.target
                .files[0]
            )
          }
        />

        <button
          onClick={
            uploadCSV
          }
        >
          Upload CSV
        </button>

        <hr />

        <h2>
          Customer List
        </h2>

        <table
          border="1"
          cellPadding="10"
        >
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Spent</th>
              <th>Orders</th>
              <th>Segment</th>
              <th>Delete</th>
            </tr>
          </thead>

          <tbody>
            {customers.map(
              (
                customer
              ) => (
                <tr
                  key={
                    customer._id
                  }
                >
                  <td>
                    {
                      customer.name
                    }
                  </td>

                  <td>
                    {
                      customer.email
                    }
                  </td>

                  <td>
                    {
                      customer.totalSpent
                    }
                  </td>

                  <td>
                    {
                      customer.totalOrders
                    }
                  </td>

                  <td>
                    {
                      customer.segment
                    }
                  </td>

                  <td>
                    <button
                      onClick={() =>
                        deleteCustomer(
                          customer._id
                        )
                      }
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Customers;