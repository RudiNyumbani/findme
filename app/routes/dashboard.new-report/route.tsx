import { useState } from "react";
import DashNavbar from "~/components/dash-navbar"; // Import the DashNavbar
import { supabase } from "~/utils/supabaseClient"; // Get the supabaseclient
import { json, useFetcher  } from "@remix-run/react";
import { Form } from "react-bootstrap"; // Import Form from react-bootstrap



export async function action({ request }) {
  const formData = await request.formData();
  const { 
    data: { user },
  } = await supabase.auth.getUser();

  const file = formData.get("photo"); // Get the file from the form data

  // upload the file to supabase storage
  if ( !file || typeof file === "string") {
    return json ({ success: false, error: "Invalid file" }, { status: 400 });
  }

  const fileExt = (file as File).name.split(".").pop();
  const fileName = `${Date.now()}.${fileExt}`;

  const { data:uploadData , error: uploadError } = await supabase.storage
    .from("missing-persons-photos")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    console.error(uploadError);
    return json({ success: false, error: "Failed to upload photo" }, { status: 500 });
  }

  const { data: publicUrlData } = supabase.storage
    .from("missing-persons-photos")
    .getPublicUrl(fileName);

  const photoUrl = publicUrlData?.publicUrl || null;
  if (!photoUrl) {
    return json({ success: false, error: "Failed to get public URL" }, { status: 500 });
  }


  const dataObject = Object.fromEntries(formData.entries());

  const supabaseData = {
    legal_first_name: dataObject.firstname,
    legal_last_name: dataObject.lastname,
    date_of_birth: dataObject.dob,
    age: dataObject.age,
    gender: dataObject.gender,
    town_location: dataObject.location,
    date_of_last_contact: dataObject.dlc,
    physical_description: dataObject.pydesc || null,
    last_seen_wearing: dataObject.lstwear || null,
    medical_conditions: dataObject.medcon || null,
    emergency_contacts: dataObject.emcont || null,
    possible_locations: dataObject.posloc || null,
    circumstances: dataObject.circ || null,
    reporter_id: user.id || null,
    photo_url: photoUrl,
  };

  const { error } = await supabase.from("missing_persons").insert([supabaseData]);

  if (error) {
    return json({ success: false, error: error.message }, { status: 400 });
  }

  return json({ success: true });
}


export default function NewReportForm() {
  const fetcher = useFetcher();
  const [dob, setDob] = useState("");
  const [age, setAge] = useState("");

  const calculateAge = (dob: string): number => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDob(e.target.value);
    setAge(calculateAge(e.target.value).toString());
  };

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  return (
    <>
    <DashNavbar />
    <div className="container pt-5 mt-5">
      <h2 className="mb-4">New Missing Person Report</h2>
      <fetcher.Form method="post" encType="multipart/form-data">
        {/* Basic Info Section */}
        <div className="mb-3">
          <label htmlFor="firstname" className="form-label">Legal First Name</label>
          <input type="text" name="firstname" id="firstname" className="form-control" required />
        </div>
        <div className="mb-3">
          <label htmlFor="lastname" className="form-label">Legal Last Name</label>
          <input type="text" name="lastname" id="lastname" className="form-control" required />
        </div>
        <div className="mb-3">
          <label htmlFor="dob" className="form-label">Date of Birth</label>
          <input
            type="date"
            name="dob"
            id="dob"
            className="form-control"
            value={dob}
            onChange={handleDobChange}
            style={{ cursor: "pointer" }}
            onClick={(e) => (e.target as HTMLInputElement).showPicker()}
            max={today}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="age" className="form-label">Age</label>
          <input type="text" name="age" id="age" className="form-control" value={age} readOnly placeholder="Age should appear here" />
        </div>
        <div className="mb-3">
          <label htmlFor="gender" className="form-label">Gender</label>
          <select name="gender" id="gender" className="form-control" required>
            <option value="">Select...</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="location" className="form-label">Town/Location</label>
          <input type="text" name="location" id="location" className="form-control" required placeholder="Last seen location" />
        </div>
        <div className="mb-3">
          <label htmlFor="dlc" className="form-label">Date of Last Contact</label>
          <input
            type="date"
            name="dlc"
            id="dlc"
            className="form-control"
            style={{ cursor: "pointer" }}
            onClick={(e) => (e.target as HTMLInputElement).showPicker()}
            max={today}
            required
          />
        </div>

        <Form.Group controlId="photo" className="mb-3">
          <Form.Label>Photo of the Missing Person</Form.Label>
          <Form.Control type="file" name="photo" accept="image/*" required />
        </Form.Group>

        {/* Advanced Info - Button */}
        <div className="d-flex align-items-center gap-3 mt-3 flex-wrap">
          <button className="btn btn-secondary" type="button" data-bs-toggle="collapse" data-bs-target="#advancedInfo">
            More Info
          </button>
        </div>

        {/* Advanced Info - Collapsible Section */}
        <div className="collapse mt-3" id="advancedInfo">
          <div className="card card-body bg-dark text-white">
            <div className="mb-3">
              <label htmlFor="pydesc" className="form-label">Physical Description</label>
              <textarea name="pydesc" id="pydesc" className="form-control"></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="lstwear" className="form-label">Last Seen Wearing</label>
              <textarea name="lstwear" id="lstwear" className="form-control"></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="medcon" className="form-label">Medical Conditions</label>
              <textarea name="medcon" id="medcon" className="form-control"></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="emcont" className="form-label">Emergency Contacts</label>
              <textarea name="emcont" id="emcont" className="form-control"></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="posloc" className="form-label">Possible Locations</label>
              <textarea name="posloc" id="posloc" className="form-control"></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="circ" className="form-label">Circumstances</label>
              <textarea name="circ" id="circ" className="form-control"></textarea>
            </div>
          </div>
        </div>
        <button type="submit" className="btn btn-primary mt-3 mb-3" disabled={fetcher.state !== "idle"}>
          {fetcher.state === "submitting" ? "Submitting..." : "Submit Report"}
        </button>
        
        {/* Success/Error Message */}
        {fetcher.data?.success && <p className="text-success mt-3">Report submitted successfully!</p>}
        {fetcher.data?.error && <p className="text-danger mt-3">Error: {fetcher.data.error}</p>}
      </fetcher.Form>
    </div>
    </>
  );
}
