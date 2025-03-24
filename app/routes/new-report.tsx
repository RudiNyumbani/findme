import { useState } from "react";

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

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="container pt-5 mt-5">
      <h2 className="mb-4">New Missing Person Report</h2>
      <form>
        {/* Basic Info Section */}
        <div className="mb-3">
          <label htmlFor="firstname" className="form-label">Legal First Name</label>
          <input type="text" id="firstname" className="form-control" required />
        </div>
        <div className="mb-3">
          <label htmlFor="lastname" className="form-label">Legal Last Name</label>
          <input type="text" id="lastname" className="form-control" required />
        </div>
        <div className="mb-3">
          <label htmlFor="dob" className="form-label">Date of Birth</label>
          <input
            type="date"
            id="dob"
            className="form-control"
            value={dob}
            onChange={handleDobChange}
            style={{ cursor: "pointer" }} // Make the entire input field clickable
            onClick={(e) => (e.target as HTMLInputElement).showPicker()} // This triggers the date picker
            max={today} // Prevent future dates
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="age" className="form-label">Age</label>
          <input type="text" id="age" className="form-control" value={age} readOnly placeholder="Age should appear here"/>
        </div>
        <div className="mb-3">
          <label htmlFor="gender" className="form-label">Gender</label>
          <select id="gender" className="form-control" required>
            <option value="">Select...</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="location" className="form-label">Town/Location</label>
          <input type="text" id="location" className="form-control" required placeholder="Last seen location" />
        </div>
        <div className="mb-3">
          <label htmlFor="dlc" className="form-label">Date of Last Contact</label>
          <input
            type="date"
            id="dlc"
            className="form-control"
            style={{ cursor: "pointer" }} // Make the entire input field clickable
            onClick={(e) => (e.target as HTMLInputElement).showPicker()} // This triggers the date picker
            max={today} // Prevent future dates
            required
          />
        </div>

        {/* Reporter Info */}
        <div className="mb-3">
          <label htmlFor="repname" className="form-label">Reporter’s Name (Optional)</label>
          <input type="text" id="repname" className="form-control" />
        </div>
        <div className="mb-3">
          <label htmlFor="repcontact" className="form-label">Reporter’s Contact (Optional)</label>
          <input type="text" id="repcontact" className="form-control" />
        </div>

        {/* Advanced Info - Button*/}
        <div className="d-flex align-items-center gap-3 mt-3 flex-wrap">
          <button className="btn btn-secondary" type="button" data-bs-toggle="collapse" data-bs-target="#advancedInfo">
            Advanced Info
          </button>
        </div>

        {/* Advanced Info - Collapsible Section */}
        <div className="collapse mt-3" id="advancedInfo">
          <div className="card card-body bg-dark text-white" style={{ border: "none", backgroundColor: "#343a40" }}>
            <div className="mb-3">
              <label htmlFor="pydesc" className="form-label">Physical Description</label>
              <textarea id="pydesc" className="form-control"></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="lstwear" className="form-label">Last Seen Wearing</label>
              <textarea id="lstwear" className="form-control"></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="medcon" className="form-label">Medical Conditions</label>
              <textarea id="medcon" className="form-control"></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="emcont" className="form-label">Emergency Contacts</label>
              <textarea id="emcont" className="form-control"></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="posloc" className="form-label">Possible Locations</label>
              <textarea id="posloc" className="form-control"></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="circ" className="form-label">Circumstances</label>
              <textarea id="circ" className="form-control"></textarea>
            </div>
          </div>
        </div>
        <button type="submit" className="btn btn-primary mt-3 mb-3">Submit Report</button>
      </form>
    </div>
  );
}
