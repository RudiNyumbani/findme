import { LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { supabase } from '~/utils/supabaseClient';

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

export default function TestRoute() {
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
