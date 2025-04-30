import { json } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { supabase } from "~/utils/supabaseClient";

export async function loader({ params }: { params: { caseId: string } }) {
  const { caseId } = params;

  const { data, error } = await supabase
    .from("missing_persons")
    .select("*")
    .eq("case_number", caseId)
    .single();

  if (error || !data) {
    throw new Response("Case not found", { status: 404 });
  }

  return json(data);
}

export default function CaseDetails() {
  const caseData = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  return (
    <div className="container pt-5 mt-5 d-flex justify-content-center align-items-center">
      <div className="card shadow-lg" style={{ maxWidth: "600px", width: "100%" }}>
        {caseData.photo_url ? (
          <img
            src={caseData.photo_url}
            alt={`${caseData.legal_first_name} ${caseData.legal_last_name}`}
            className="card-img-top"
            style={{ objectFit: "cover", height: "600px" }}
          />
        ) : (
          <div
            className="bg-secondary d-flex justify-content-center align-items-center"
            style={{ height: "400px", color: "white", fontSize: "1.5rem" }}
          >
            No Photo Available
          </div>
        )}
        
        <div className="card-body">
          <h2 className="card-title text-center mb-4">
            {caseData.legal_first_name} {caseData.legal_last_name}
          </h2>

          <div className="row g-3">
            <div className="col-md-6">
              <p><strong>Age:</strong> {caseData.age}</p>
            </div>
            <div className="col-md-6">
              <p><strong>Gender:</strong> {caseData.gender}</p>
            </div>
            <div className="col-md-6">
              <p><strong>Town/Location:</strong> {caseData.town_location}</p>
            </div>
            <div className="col-md-6">
              <p><strong>Last of Contact Date:</strong> {caseData.date_of_last_contact}</p>
            </div>
            {caseData.reporter_name && (
              <div className="col-md-6">
                <p><strong>Reported By:</strong> {caseData.reporter_name}</p>
              </div>
            )}
            {caseData.reporter_contact && (
              <div className="col-md-6">
                <p><strong>Reporter Contact:</strong> {caseData.reporter_contact}</p>
              </div>
            )}
          </div>

          <hr />

          {caseData.physical_description && (
            <div className="mb-3">
              <h5>Physical Description</h5>
              <p>{caseData.physical_description}</p>
            </div>
          )}
          {caseData.last_seen_wearing && (
            <div className="mb-3">
              <h5>Last Seen Wearing</h5>
              <p>{caseData.last_seen_wearing}</p>
            </div>
          )}
          {caseData.medical_conditions && (
            <div className="mb-3">
              <h5>Medical Conditions</h5>
              <p>{caseData.medical_conditions}</p>
            </div>
          )}
          {caseData.emergency_contacts && (
            <div className="mb-3">
              <h5>Emergency Contacts</h5>
              <p>{caseData.emergency_contacts}</p>
            </div>
          )}
          {caseData.possible_locations && (
            <div className="mb-3">
              <h5>Possible Locations</h5>
              <p>{caseData.possible_locations}</p>
            </div>
          )}
          {caseData.circumstances && (
            <div className="mb-3">
              <h5>Circumstances</h5>
              <p>{caseData.circumstances}</p>
            </div>
          )}

          
        </div>
        <div className="card-footer text-center">
            <button className="btn btn-outline-primary" onClick={() => navigate(-1)}>
            ← Back
            </button>
        </div>
      </div>
    </div>
  );
}
