import { useState } from "react";
import { supabase } from "~/utils/supabaseClient"; // Get the supabaseclient

export default function NewReportForm() {
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


  /*
   * Handles the form submission event by transforming the form data to match
   * the column names in the Supabase database, and then inserts the data into
   * the database.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const dataObject = Object.fromEntries(formData.entries());

    console.log("Submitted Data:", dataObject);

    // Transform form data to match Supabase column names
    const supabaseData = {
      legal_first_name: dataObject.firstname,
      legal_last_name: dataObject.lastname,
      date_of_birth: dataObject.dob,
      age: dataObject.age,
      gender: dataObject.gender,
      town_location: dataObject.location,
      date_of_last_contact: dataObject.dlc,
      reporter_name: dataObject.repname || null,
      reporter_contact: dataObject.repcontact || null,
      physical_description: dataObject.pydesc || null,
      last_seen_wearing: dataObject.lstwear || null,
      medical_conditions: dataObject.medcon || null,
      emergency_contacts: dataObject.emcont || null,
      possible_locations: dataObject.posloc || null,
      circumstances: dataObject.circ || null,
    };

    console.log("Data to be sent to Supabase:", supabaseData);
     // Insert into Supabase
    try {
      const { data, error } = await supabase
        .from("missing_persons") // Change to your actual table name
        .insert([supabaseData]);

      if (error) {
      console.error("Error inserting data:", error.message);
      alert("Failed to submit the report.");
      } else {
      console.log("Successfully submitted data:", data);
      alert("Report submitted successfully!");
      }
    } catch (error) {
      console.error("Error inserting data:", error);
      alert("An error occurred. Please try again.");
    }
  };



  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="container pt-5 mt-5">
      <h2 className="mb-4">New Missing Person Report</h2>
      <form onSubmit={handleSubmit}>
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

        {/* Reporter Info */}
        <div className="mb-3">
          <label htmlFor="repname" className="form-label">Reporter’s Name (Optional)</label>
          <input type="text" name="repname" id="repname" className="form-control" />
        </div>
        <div className="mb-3">
          <label htmlFor="repcontact" className="form-label">Reporter’s Contact (Optional)</label>
          <input type="text" name="repcontact" id="repcontact" className="form-control" />
        </div>

        {/* Advanced Info - Button */}
        <div className="d-flex align-items-center gap-3 mt-3 flex-wrap">
          <button className="btn btn-secondary" type="button" data-bs-toggle="collapse" data-bs-target="#advancedInfo">
            Advanced Info
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
        <button type="submit" className="btn btn-primary mt-3 mb-3">Submit Report</button>
      </form>
    </div>
  );
}
