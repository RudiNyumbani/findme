import type { MetaFunction, LoaderFunction } from "@remix-run/node";
import { useEffect } from "react";
import DashNavbar from "~/components/dash-navbar"; // Import Navbar
import "datatables.net-bs5"; // Import Bootstrap 5 DataTables
import DataTable from "datatables.net";
import { useLoaderData } from "@remix-run/react";
import { supabase } from "~/utils/supabaseClient"; // Get the supabase client

export const meta: MetaFunction = () => {
  return [
    { title: "Unclaimed Persons" },
    { name: "description", content: "Welcome to FindMe!" },
  ];
};


// Fetch unclaimed persons data from supabase
export const loader: LoaderFunction = async () => {
  const { data, error } = await supabase
    .from("unclaimed_persons")
    .select("tracking_number, date_of_death, age, legal_last_name, legal_first_name, gender, current_status, found_location");

  if (error) {
    // This is for debugging remove in prod and handle errors properly
    console.error("Error fecthing unclaimed persons:", error.message);
    return [];
  }

  return data;
};


/**
 * Renders a table displaying unclaimed persons data.
 *
 * This component fetches data from a Supabase database using the `useLoaderData` hook.
 * It initializes a DataTable for enhanced table functionalities like sorting 
 * and filtering. The table is made responsive for small screens.
 *
 * @returns {JSX.Element} A responsive table of unclaimed persons data.
 */
export default function UnclaimedPersonsTable() {
  const unclaimedPersons = useLoaderData<typeof loader>();
  useEffect(() => {
    // Initialize DataTable once the component mounts
    const table = new DataTable("#unclaimedPersonsTable", {
      paging: false, // set to true if you want pagination on your table
      autoWidth: false,
    });
    return () => {
      table.destroy();
    }; // Cleanup when unmounting
  }, []);

  return (
    <>
     <DashNavbar />
    <div className="container mt-5">
      <div className="table-responsive"> {/* Ensures the table is scrollable on small screens */}
      <h2 className="mt-5">Unclaimed Persons</h2>
      <table id="unclaimedPersonsTable" className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>Tracking Number</th>
            <th>Date of Death</th>
            <th>Legal Last Name</th>
            <th>Legal First Name</th>
            <th>Estimated Age</th>
            <th>Gender</th>
            <th>Current Status</th>
            <th>Found Location</th>
          </tr>
        </thead>

        <tbody>
          {/**  Iterates over the `unclaimedPersons` array and renders a table row for each person.
            * Each `person` object is expected to have non-nullable properties corresponding 
            * to the unclaimed persons data fetched from Supabase. It maps over the unclaimedPersons` array 
            * and extracts relevant details for each person.
            * The provided inline type definition ensures proper type checking for each `person` object.
            * This helps prevent TypeScript errors by explicitly defining the expected properties.
        */}
          {unclaimedPersons.map((person: {
            tracking_number: string;
            date_of_death: string;
            legal_last_name: string;
            legal_first_name: string;
            age: number;
            gender: string;
            current_status: string;
            found_location: string;
          }) => {
            // Format date to DD/MM/YYYY
            const formattedDate = person.date_of_death
            ? new Date(person.date_of_death).toLocaleDateString("en-GB").replace(/\//g, "/")
            : "N/A"
            return(
              <tr key={person.tracking_number}>
                <td>{person.tracking_number}</td>
                <td>{formattedDate}</td>
                <td>{person.legal_last_name}</td>
                <td>{person.legal_first_name}</td>
                <td>{person.age}</td>
                <td>{person.gender}</td>
                <td>{person.current_status}</td>
                <td>{person.found_location}</td>
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
