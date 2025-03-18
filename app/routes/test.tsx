import { LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { supabase } from '~/utils/supabaseClient';

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

export const loader: LoaderFunction = async () => {
  const { data, error } = await supabase
    .from('missing_persons')
    .select('*')
    .limit(10);

  if (error) {
    console.error('Supabase Error:', error.message);
    return Response.json({ error: error.message }, { status: 500 }); // Using Response.json() instead of json()
  }

  return Response.json({ data }); // Using Response.json() instead of json()
};

export function TestRoute() {
  const { data, error } = useLoaderData<typeof loader>();

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mt-5">
        <div className="table-responsive">
            <h1 className="mt-5">Test Data</h1>
        </div>
        <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}



export default function MissingPersonsTable() {
  useEffect(() => {
    // Initialize DataTable once the component mounts
    const table = new DataTable("#missingPersonsTable", {
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
      <h2 className="mt-5">Missing Persons</h2>
      <table id="missingPersonsTable" className="table table-striped table-bordered">
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
          <tr>
            <td>001</td>
            <td>Doe</td>
            <td>John</td>
            <td>30</td>
            <td>Male</td>
            <td>Nairobi</td>
            <td>01/03/2024</td>
            <td>05/03/2024</td>
          </tr>
          <tr>
            <td>001</td>
            <td>Doe</td>
            <td>John</td>
            <td>30</td>
            <td>Male</td>
            <td>Nairobi</td>
            <td>01/03/2024</td>
            <td>05/03/2024</td>
          </tr>
          <tr>
            <td>001</td>
            <td>Doe</td>
            <td>John</td>
            <td>30</td>
            <td>Male</td>
            <td>Nairobi</td>
            <td>01/03/2024</td>
            <td>05/03/2024</td>
          </tr>
          <tr>
            <td>001</td>
            <td>Doe</td>
            <td>John</td>
            <td>30</td>
            <td>Male</td>
            <td>Nairobi</td>
            <td>01/03/2024</td>
            <td>05/03/2024</td>
          </tr>
          <tr>
            <td>001</td>
            <td>Doe</td>
            <td>John</td>
            <td>30</td>
            <td>Male</td>
            <td>Nairobi</td>
            <td>01/03/2024</td>
            <td>05/03/2024</td>
          </tr>
          <tr>
            <td>001</td>
            <td>Doe</td>
            <td>John</td>
            <td>30</td>
            <td>Male</td>
            <td>Nairobi</td>
            <td>01/03/2024</td>
            <td>05/03/2024</td>
          </tr>
          <tr>
            <td>001</td>
            <td>Doe</td>
            <td>James</td>
            <td>30</td>
            <td>Male</td>
            <td>Nairobi</td>
            <td>01/03/2024</td>
            <td>05/03/2024</td>
          </tr>
          <tr>
            <td>001</td>
            <td>Doe</td>
            <td>John</td>
            <td>30</td>
            <td>Male</td>
            <td>Nairobi</td>
            <td>01/03/2024</td>
            <td>05/03/2024</td>
          </tr>
          <tr>
            <td>001</td>
            <td>Doe</td>
            <td>John</td>
            <td>30</td>
            <td>Male</td>
            <td>Nairobi</td>
            <td>01/03/2024</td>
            <td>05/03/2024</td>
          </tr>
          
        </tbody>
      </table>
      </div>
      <TestRoute/>
    </div>
    
  );
}



