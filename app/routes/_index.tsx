import type { MetaFunction } from "@remix-run/node";
import { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "datatables.net-bs5"; // Import Bootstrap 5 DataTables
import DataTable from "datatables.net";

export const meta: MetaFunction = () => {
  return [
    { title: "Missing Persons" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function MissingPersonsTable() {
  useEffect(() => {
    // Initialize DataTable once the component mounts
    const table = new DataTable("#missingPersonsTable", {
      paging: true,
    });
    return () => {
      table.destroy();
    }; // Cleanup when unmounting
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Missing Persons</h2>
      <table id="missingPersonsTable" className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Last Seen</th>
            <th>Contact</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>John Doe</td>
            <td>25</td>
            <td>Nairobi, Kenya</td>
            <td>+254712345678</td>
          </tr>
          <tr>
            <td>Jane Smith</td>
            <td>30</td>
            <td>Mombasa, Kenya</td>
            <td>+254798765432</td>
          </tr>
          <tr>
            <td>Jane Smith</td>
            <td>30</td>
            <td>Mombasa, Kenya</td>
            <td>+254798765432</td>
          </tr>
          <tr>
            <td>John Doe</td>
            <td>25</td>
            <td>Nairobi, Kenya</td>
            <td>+254712345678</td>
          </tr>
          <tr>
            <td>John Doe</td>
            <td>25</td>
            <td>Nairobi, Kenya</td>
            <td>+254712345678</td>
          </tr>
          <tr>
            <td>John Doe</td>
            <td>25</td>
            <td>Nairobi, Kenya</td>
            <td>+254712345678</td>
          </tr>
          <tr>
            <td>John Doe</td>
            <td>25</td>
            <td>Nairobi, Kenya</td>
            <td>+254712345678</td>
          </tr>
          <tr>
            <td>Jane Smith</td>
            <td>30</td>
            <td>Mombasa, Kenya</td>
            <td>+254798765432</td>
          </tr>
          <tr>
            <td>Jane Smith</td>
            <td>30</td>
            <td>Mombasa, Kenya</td>
            <td>+254798765432</td>
          </tr>
          <tr>
            <td>Jane Smith</td>
            <td>30</td>
            <td>Mombasa, Kenya</td>
            <td>+254798765432</td>
          </tr>
          <tr>
            <td>Jane Smith</td>
            <td>30</td>
            <td>Mombasa, Kenya</td>
            <td>+254798765432</td>
          </tr>
          <tr>
            <td>Jane Smith</td>
            <td>30</td>
            <td>Mombasa, Kenya</td>
            <td>+254798765432</td>
          </tr>
          <tr>
            <td>Jane Smith</td>
            <td>30</td>
            <td>Mombasa, Kenya</td>
            <td>+254798765432</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}


