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

  const handleDobChange = (e) => {
    setDob(e.target.value);
    setAge(calculateAge(e.target.value));
  };

  return (
    <div className="container mt-4">
      <h2>New Missing Person Report</h2>
      <form>
        {/* Basic Info Section */}
        <div className="mb-3">
          <label className="form-label">Legal First Name</label>
          <input type="text" className="form-control" required />
        </div>
        <div className="mb-3">
          <label className="form-label">Legal Last Name</label>
          <input type="text" className="form-control" required />
        </div>
        <div className="mb-3">
          <label className="form-label">Date of Birth</label>
          <input type="date" className="form-control" value={dob} onChange={handleDobChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Age</label>
          <input type="text" className="form-control" value={age} readOnly />
        </div>
        <div className="mb-3">
          <label className="form-label">Gender</label>
          <select className="form-control" required>
            <option value="">Select...</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Town/Location</label>
          <input type="text" className="form-control" required />
        </div>
        <div className="mb-3">
          <label className="form-label">Date of Last Contact</label>
          <input type="date" className="form-control" required />
        </div>

        {/* Reporter Info */}
        <div className="mb-3">
          <label className="form-label">Reporter’s Name (Optional)</label>
          <input type="text" className="form-control" />
        </div>
        <div className="mb-3">
          <label className="form-label">Reporter’s Contact (Optional)</label>
          <input type="text" className="form-control" />
        </div>

        {/* Advanced Info - Collapsible Section */}
        <button className="btn btn-secondary mb-3" type="button" data-bs-toggle="collapse" data-bs-target="#advancedInfo">
          Advanced Info
        </button>
        <div className="collapse" id="advancedInfo">
          <div className="card card-body">
            <div className="mb-3">
              <label className="form-label">Physical Description</label>
              <textarea className="form-control"></textarea>
            </div>
            <div className="mb-3">
              <label className="form-label">Last Seen Wearing</label>
              <textarea className="form-control"></textarea>
            </div>
            <div className="mb-3">
              <label className="form-label">Medical Conditions</label>
              <textarea className="form-control"></textarea>
            </div>
            <div className="mb-3">
              <label className="form-label">Emergency Contacts</label>
              <textarea className="form-control"></textarea>
            </div>
            <div className="mb-3">
              <label className="form-label">Possible Locations</label>
              <textarea className="form-control"></textarea>
            </div>
            <div className="mb-3">
              <label className="form-label">Circumstances</label>
              <textarea className="form-control"></textarea>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn btn-primary mt-3">Submit Report</button>
      </form>
    </div>
  );
}
