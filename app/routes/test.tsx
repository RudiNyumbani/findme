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
    <div>
      <h1>Test Data</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
