import type { MetaFunction, LoaderFunction } from "@remix-run/node";
import { useEffect } from "react";
import Navbar from "~/components/navbar"; // Import Navbar
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

/**
 * Renders a table displaying unidentified persons data.
 *
 * This component fetches data from a Supabase database using the `useLoaderData` hook.
 * It initializes a DataTable for enhanced table functionalities like sorting 
 * and filtering. The table is made responsive for small screens.
 *
 * @returns {JSX.Element} A responsive table of unidentified persons data.
 */
export default function UnidentifiedPersonsTable() {
  const unidentifiedPersons = useLoaderData<typeof loader>();
  useEffect(() => {
    // Initialize DataTable once the component mounts
    const table = new DataTable("#unidentifiedPersonsTable", {
      paging: false,
      autoWidth: false,
    });
    return () => {
      table.destroy();
    }; // Cleanup when unmounting
  }, []);

  return (
    <>
    <Navbar />
    <div className="container mt-5">
      <div className="table-responsive"> {/* Ensures the table is scrollable on small screens */}
      <h2 className="mt-5">Unidentifed Persons</h2>
      <table id="unidentifiedPersonsTable" className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>Tracking Number</th>
            <th>Date Found</th>
            <th>Description</th>
            <th>Found Location</th>
            <th>Gender</th>
            <th>Current Status</th>
          </tr>
        </thead>

        <tbody>
           {/**  Iterates over the `unidentifiedPersons` array and renders a table row for each person.
            * Each `person` object is expected to have non-nullable properties corresponding 
            * to the unidentified persons data fetched from Supabase. It maps over the unidentifiedPersons` array 
            * and extracts relevant details for each person.
            * The provided inline type definition ensures proper type checking for each `person` object.
            * This helps prevent TypeScript errors by explicitly defining the expected properties.
        */}
          {unidentifiedPersons.map((person : {
            tracking_number: string;
            description: string;
            found_location: string;
            date_found: string;
            gender: string;
            current_status: string;
          }) => {
            // Format date to DD/MM/YYYY
            const formattedDate = person.date_found
            ? new Date(person.date_found).toLocaleDateString("en-GB").replace(/\//g, "/")
            : "N/A"
            return (
            <tr key={person.tracking_number}>
              <td>{person.tracking_number}</td>
              <td>{formattedDate}</td>
              <td>{person.description}</td>
              <td>{person.found_location}</td>
              <td>{person.gender}</td>
              <td>{person.current_status}</td>
            </tr>
            );
          })}
           
        </tbody>
      </table>
      </div>
    </div>
    </>
  );
}


