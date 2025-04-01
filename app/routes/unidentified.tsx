import type { MetaFunction, LoaderFunction } from "@remix-run/node";
import { useEffect } from "react";
import "datatables.net-bs5"; // Import Bootstrap 5 DataTables
import DataTable from "datatables.net";
import { useLoaderData } from "@remix-run/react";
import { supabase } from "~/utils/supabaseClient";

export const meta: MetaFunction = () => {
  return [
    { title: "Unidentified Persons" },
    { name: "description", content: "Welcome to FindMe!" },
  ];
};


// Fetch unidentified persons data from supabase
export const loader: LoaderFunction = async () => {
  const { data, error } = await supabase
    .from("unidentified_persons")
    .select("tracking_number, description, found_location, date_found, gender, current_status, found_location");

  if (error) {
    // This is for debugging remove in prod and handle errors properly
    console.error("Error fecthing unidentified persons:", error.message);
    return [];
  }

  return data;
};

export default function UnidentifiedPersonsTable() {
  useEffect(() => {
    // Initialize DataTable once the component mounts
    const table = new DataTable("#unidentifiedPersonsTable", {
      paging: true,
      autoWidth: false,
    });
    return () => {
      table.destroy();
    }; // Cleanup when unmounting
  }, []);

  return (
    <div className="container mt-5">
      <div className="table-responsive"> {/* Ensures the table is scrollable on small screens */}
      <h2 className="mt-5">Unidentifed Persons</h2>
      <table id="unidentifiedPersonsTable" className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>Case #</th>
            <th>Legal Last Name</th>
            <th>Legal First Name</th>
            <th>Missing Age</th>
            <th>Gender</th>
            <th>Town</th>
            <th>Date of Last Contact</th>
            <th>Date Modified</th>
          </tr>
        </thead>
        <tbody>
          {/* Sample Row */}
          
          

          
        </tbody>
      </table>
      </div>
    </div>
  );
}


