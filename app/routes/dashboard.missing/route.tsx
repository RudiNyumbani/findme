import type { MetaFunction, LoaderFunction} from "@remix-run/node";
import { useEffect } from "react";
import DashNavbar from "~/components/dash-navbar"; // Import Navbar
import "datatables.net-bs5"; // Import Bootstrap 5 DataTables
import DataTable from "datatables.net";
import { useLoaderData } from "@remix-run/react";
import { supabase } from "~/utils/supabaseClient";

export const meta: MetaFunction = () => {
  return [
    { title: "Missing Persons" },
    { name: "description", content: "Welcome to FindMe!" },
  ];
};


// Fetch missing persons data from Supabase
export const loader: LoaderFunction = async () => {
  const { data, error } = await supabase
    .from("missing_persons")
    .select("date_of_last_contact, legal_last_name, legal_first_name, age, gender, town_location, tracking_number");

  if (error) {
    console.error("Error fetching missing persons:", error.message);
    return [];
  }

  return data;
};


/**
 * Renders a table displaying missing persons data.
 *
 * This component fetches data from a Supabase database using the `useLoaderData` hook.
 * It initializes a DataTable for enhanced table functionalities like sorting 
 * and filtering. The table is made responsive for small screens.
 *
 * @returns {JSX.Element} A responsive table of missing persons data.
 */

export default function MissingPersonsTable() {
  const missingPersons = useLoaderData<typeof loader>();

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
    <>
    <DashNavbar />
    <div className="container mt-5">
      <div className="table-responsive"> {/* Ensures the table is scrollable on small screens */}
      <h2 className="mt-5">Missing Persons</h2>
      <table id="missingPersonsTable" className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>Tracking Number</th>
            <th title="Date of Last Contact">DLC</th> {/* Tooltip on hover */}
            <th>Legal Last Name</th>
            <th>Legal First Name</th>
            <th>Missing Age</th>
            <th>Gender</th>
            <th>Town</th>
          </tr>
        </thead>

        <tbody>
        {/**  Iterates over the `missingPersons` array and renders a table row for each person.
            * Each `person` object is expected to have non-nullable properties corresponding 
            * to the missing persons data fetched from Supabase. It maps over the `missingPersons` array 
            * and extracts relevant details for each person.
            * The provided inline type definition ensures proper type checking for each `person` object.
            * This helps prevent TypeScript errors by explicitly defining the expected properties.
        */}
          {missingPersons.map((person: {
            tracking_number: string;
            date_of_last_contact: string;
            legal_last_name: string;
            legal_first_name: string;
            age: number;
            gender: string;
            town_location: string;
          }) => {
            // Format date to DD/MM/YYYY
            const formattedDate = person.date_of_last_contact
            ? new Date(person.date_of_last_contact).toLocaleDateString("en-GB").replace(/\//g, "/")
            : "N/A";
            return(
            <tr key={person.tracking_number}>
              <td>{person.tracking_number}</td>
              <td>{formattedDate}</td>
              <td>{person.legal_last_name}</td>
              <td>{person.legal_first_name}</td>
              <td>{person.age}</td>
              <td>{person.gender}</td>
              <td>{person.town_location}</td>
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


