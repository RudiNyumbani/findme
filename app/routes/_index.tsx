import type { MetaFunction } from "@remix-run/node";
import { useEffect } from "react";
import "datatables.net-bs5"; // Import Bootstrap 5 DataTables
import DataTable from "datatables.net";

export const meta: MetaFunction = () => {
  return [
    { title: "Missing Persons" },
    { name: "description", content: "Welcome to FindMe!" },
  ];
};

export default function MissingPersonsTable() {
  useEffect(() => {
    // Initialize DataTable once the component mounts
    const table = new DataTable("#missingPersonsTable", {
      paging: false,
      autoWidth: false,
    });
    return () => {
      table.destroy();
    }; // Cleanup when unmounting
  }, []);

  return (
    <div className="container mt-5">
      <div className="table-responsive"> {/* Ensures the table is scrollable on small screens */}
      <h2 className="mt-5">Missing Persons</h2>
      <table id="missingPersonsTable" className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>Case</th>
            <th>DLC</th>
            <th>Legal Last Name</th>
            <th>Legal First Name</th>
            <th>Missing Age</th>
            <th>Gender</th>
            <th>Town</th>
          </tr>
        </thead>
        <tbody>
          {/* Sample Row */}
          <tr>
            <td>001</td>
            <td>01/03/2024</td>
            <td>Doe</td>
            <td>John</td>
            <td>30</td>
            <td>Male</td>
            <td>Nairobi</td>
          </tr>
          <tr>
            <td>001</td>
            <td>01/03/2024</td>
            <td>Doe</td>
            <td>John</td>
            <td>30</td>
            <td>Male</td>
            <td>Nairobi</td>
          </tr>
        </tbody>
      </table>
      </div>
    </div>
  );
}


