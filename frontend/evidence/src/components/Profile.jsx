import { useState, useEffect, useContext, useRef } from "react";
import {
  getProfile,
  updateProfile,
  changePassword,
  getSubscription,
  deleteAccount,
} from "../api/user";
import { AuthContext } from "../context/AuthContext";
import { showSuccess, showError } from "./SweetAlert";
import { FaUser } from "react-icons/fa";

function Profile() {
  const { token } = useContext(AuthContext);
  const [profile, setProfile] = useState({
    businessName: "",
    slogan: "",
    logo: "",
    phoneNumber: "",
    defaultFooterMsg: "",
  });
  const [user, setUser] = useState({ email: "" });
  const [sub, setSub] = useState({ status: "Free", renewal: "-" });
  const [pwForm, setPwForm] = useState({ current: "", new: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState("");
  const logoInput = useRef();

  useEffect(() => {
    if (token) {
      getProfile(token).then((data) => {
        setProfile({
          businessName: data.businessName || "",
          slogan: data.slogan || "",
          logo: data.logo || "",
          phoneNumber: data.phoneNumber || "",
          defaultFooterMsg: data.defaultFooterMsg || "",
        });
        setUser({
          email: data.email || "",
          name: data.name || "",
        });
      });
      getSubscription(token).then((data) => setSub(data));
    }
  }, [token]);

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prev) => ({ ...prev, logo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile(profile, token);
      showSuccess("Business details updated!");
      setModal("");
    } catch (err) {
      console.error(err);
      showError("Failed to update profile.");
    }
    setLoading(false);
  };

  const handlePwChange = (e) => {
    setPwForm({ ...pwForm, [e.target.name]: e.target.value });
  };

  const handlePwSubmit = async (e) => {
    e.preventDefault();
    if (!pwForm.new || pwForm.new !== pwForm.confirm) {
      showError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await changePassword({ current: pwForm.current, new: pwForm.new }, token);
      showSuccess("Password changed!");
      setPwForm({ current: "", new: "", confirm: "" });
      setModal("");
    } catch (err) {
      console.error(err);
      showError("Failed to change password.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-2 py-5">
      <h2 className="text-3xl font-bold mb-8 flex items-center text-center text-indigo-200">
        <span className="inline-block mr-2">
          <FaUser />
        </span>
        My Profile
      </h2>
      {/* User Details Section */}
      <div className="bg-white/10 rounded-xl p-6 shadow-lg mb-8">
        <h3 className="text-xl font-bold mb-4 text-center text-indigo-300">User Details</h3>
        <div className="mb-2 text-white">
          Name: <span className="font-bold text-indigo-200">{user.name}</span>
        </div>
        <div className="mb-2 text-white">
          Email: <span className="font-bold text-indigo-200">{user.email}</span>
        </div>
        <button
          className="w-full py-2 rounded bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-lg mb-2"
          onClick={() => setModal("password")}
        >
          Change Password
        </button>
        <button
          className="w-full py-2 rounded bg-red-700 text-white font-bold shadow-lg"
          onClick={async () => {
            const result = await window.Swal.fire({
              title: "Delete Account?",
              text: "This action cannot be undone!",
              icon: "warning",
              showCancelButton: true,
              confirmButtonColor: "#d33",
              cancelButtonColor: "#3085d6",
              confirmButtonText: "Yes, delete it!",
            });
            if (result.isConfirmed) {
              try {
                await window.Swal.fire({
                  title: "Deleting...",
                  allowOutsideClick: false,
                  didOpen: () => window.Swal.showLoading(),
                });
                await deleteAccount(token);
                window.Swal.close();
                window.Swal.fire(
                  "Deleted!",
                  "Your account has been deleted.",
                  "success"
                );
                window.location.href = "/";
              } catch (err) {
                console.error(err);
                window.Swal.fire("Error", "Failed to delete account.", "error");
              }
            }
          }}
        >
          Delete Account
        </button>
      </div>

      {/* Business Details Section */}
      <div className="bg-white/10 rounded-xl p-6 shadow-lg mb-8">
        <h3 className="text-xl text-center font-bold mb-4 text-indigo-300">
          Business Details
        </h3>
        <button
          className="w-full py-2 rounded bg-gradient-to-r from-green-600 to-blue-600 text-white font-bold shadow-lg mb-2"
          onClick={() => setModal("business")}
        >
          Edit Business Details
        </button>
        <div className="mb-2 text-white">
          Business Name:{" "}
          <span className="font-bold text-indigo-200">
            {profile.businessName}
          </span>
        </div>
        <div className="mb-2 text-white">
          Slogan:{" "}
          <span className="font-bold text-indigo-200">{profile.slogan}</span>
        </div>
        <div className="mb-2 text-white">
          Phone:{" "}
          <span className="font-bold text-indigo-200">
            {profile.phoneNumber}
          </span>
        </div>
        <div className="mb-2 text-white">
          Footer Msg:{" "}
          <span className="font-bold text-indigo-200">
            {profile.defaultFooterMsg}
          </span>
        </div>
        <div className="mb-2 text-white">
          Logo:
          <br />
          {profile.logo && (
            <img src={profile.logo} alt="Logo" className="h-16 mt-2 rounded" />
          )}
        </div>
      </div>

      {/* Subscription Section */}
      <div className="bg-white/10 rounded-xl p-6 shadow-lg mb-8">
        <h3 className="text-xl font-bold mb-4 text-center text-indigo-300">Subscription</h3>
        <div className="mb-2 text-white">
          Status: <span className="font-bold text-green-400">{sub.status}</span>
        </div>
        {/* <div className="mb-2 text-white">
          Renewal:{" "}
          <span className="font-bold text-indigo-300">{sub.renewal}</span>
        </div>
        <button
          className="w-full py-2 rounded bg-gradient-to-r from-green-600 to-blue-600 text-white font-bold shadow-lg"
          disabled
        >
          Manage Subscription (coming soon)
        </button> */}
      </div>

      {/* Modals */}
      {modal === "business" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white/10 rounded-xl p-6 shadow-lg w-full max-w-md relative border border-indigo-700">
            <button
              className="absolute top-2 right-3 text-indigo-200 text-xl font-bold hover:text-white"
              onClick={() => setModal("")}
            >
              ×
            </button>
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <input
                name="businessName"
                value={profile.businessName}
                onChange={handleProfileChange}
                placeholder="Business Name"
                className="w-full px-4 py-2 rounded bg-white/20 text-white border border-indigo-700 outline-none"
              />
              <input
                name="slogan"
                value={profile.slogan}
                onChange={handleProfileChange}
                placeholder="Slogan"
                className="w-full px-4 py-2 rounded bg-white/20 text-white border border-indigo-700 outline-none"
              />
              <input
                name="phoneNumber"
                value={profile.phoneNumber}
                onChange={handleProfileChange}
                placeholder="Phone Number"
                className="w-full px-4 py-2 rounded bg-white/20 text-white border border-indigo-700 outline-none"
              />
              <input
                name="defaultFooterMsg"
                value={profile.defaultFooterMsg}
                onChange={handleProfileChange}
                placeholder="Default Footer Message"
                className="w-full px-4 py-2 rounded bg-white/20 text-white border border-indigo-700 outline-none"
              />
              <div className="mb-3">
                <label className="block text-indigo-300 mb-1">
                  Logo Upload
                </label>
                <input
                  type="file"
                  accept="image/*"
                  ref={logoInput}
                  onChange={handleLogoUpload}
                  className="w-full px-4 py-2 rounded bg-white/20 text-white border border-indigo-700 outline-none"
                />
                {profile.logo && (
                  <img
                    src={profile.logo}
                    alt="Logo"
                    className="h-16 mt-2 rounded"
                  />
                )}
              </div>
              <button
                type="submit"
                className="w-full py-2 rounded bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-lg"
                disabled={loading}
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
      {modal === "password" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white/10 rounded-xl p-6 shadow-lg w-full max-w-md relative border border-indigo-700">
            <button
              className="absolute top-2 right-3 text-indigo-200 text-xl font-bold hover:text-white"
              onClick={() => setModal("")}
            >
              ×
            </button>
            <form onSubmit={handlePwSubmit} className="space-y-4">
              <input
                name="current"
                type="password"
                value={pwForm.current}
                onChange={handlePwChange}
                placeholder="Current Password"
                className="w-full px-4 py-2 rounded bg-white/20 text-white border border-indigo-700 outline-none"
              />
              <input
                name="new"
                type="password"
                value={pwForm.new}
                onChange={handlePwChange}
                placeholder="New Password"
                className="w-full px-4 py-2 rounded bg-white/20 text-white border border-indigo-700 outline-none"
              />
              <input
                name="confirm"
                type="password"
                value={pwForm.confirm}
                onChange={handlePwChange}
                placeholder="Confirm New Password"
                className="w-full px-4 py-2 rounded bg-white/20 text-white border border-indigo-700 outline-none"
              />
              <button
                type="submit"
                className="w-full py-2 rounded bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-lg"
                disabled={loading}
              >
                Change Password
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
