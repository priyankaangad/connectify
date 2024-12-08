import { useEffect, useState } from "react";

function Profile() {
  const [profileData, setProfileData] = useState([]);
  const email = localStorage.getItem("email");
  useEffect(() => {
    if (!email) return; // Ensure email exists before making the API call

    const fetchProfileData = async () => {
      try {
        const response = await fetch("http://localhost:3000/profile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        setProfileData(data[0]);
      } catch (err) {
        console.log(err.message);
      }
    };

    fetchProfileData();
  }, [email]); // Runs when the `email` changes

  return (
    <div className="signUp textAlignCenter center-block profileBox">
      <h1 className="profileCs">Profile Details</h1>
      <div id="profile">
        <br />
        {/* <label>Name: {profileData.name === null ? " " : ""}</label> */}
        <label>
          <strong>Email:</strong> {profileData?.email}
        </label>
        <label>
          <strong>Skills:</strong> {profileData?.skills}
        </label>
        <label>
          <strong>Created At:</strong> {profileData?.created_at}
        </label>
        <label>
          <strong>Education Level:</strong> {profileData?.educationLevel}
        </label>
        <label>
          <strong>Graduation End Date:</strong> {profileData?.graduationEndDate}
        </label>
        <label>
          <strong>Graduation Start Date:</strong>{" "}
          {profileData?.graduationStartDate}
        </label>
      </div>
    </div>
  );
}

export default Profile;
