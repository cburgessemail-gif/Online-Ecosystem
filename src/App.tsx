import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const DEFAULT_PROGRAM_STATUS = {
  status: "FULL DAY",
  reason: "Normal Schedule",
  start_time: "08:00",
  dismissal_time: "14:00",
  message:
    "Bronson Family Farm Youth Workforce Program is operating on a full regular schedule today.",
};

const ATTENDANCE_DISCLAIMER =
  "This log is for Bronson Family Farm program operations, safety, transportation, and communication only. Official employment, payroll, and attendance records are maintained by Nesco Resource.";

function getTomorrowAt5AM() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(5, 0, 0, 0);
  return tomorrow.toISOString();
}

function App() {
  const [role, setRole] = useState("admin");
  const [activeBroadcast, setActiveBroadcast] = useState<any>(null);

  async function loadActiveBroadcast() {
    const now = new Date().toISOString();

    const { data } = await supabase
      .from("program_broadcasts")
      .select("*")
      .gt("expires_at", now)
      .order("created_at", { ascending: false })
      .limit(1);

    setActiveBroadcast(data && data.length > 0 ? data[0] : DEFAULT_PROGRAM_STATUS);
  }

  useEffect(() => {
    loadActiveBroadcast();
  }, []);

  return (
    <main className="min-h-screen bg-emerald-950 p-6 text-emerald-950">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="rounded-3xl bg-white/95 p-6 shadow-xl">
          <h1 className="text-3xl font-bold">
            Bronson Family Farm Online Ecosystem
          </h1>
          <p className="mt-2 text-gray-700">
            Youth Workforce Program Registration, Communication, Safety,
            Attendance, and Parent Support Operations
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            {["admin", "supervisor", "youth", "parent", "nesco", "guest"].map(
              (r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`rounded-2xl px-5 py-3 font-bold ${
                    role === r
                      ? "bg-amber-500 text-emerald-950"
                      : "bg-emerald-100 text-emerald-950"
                  }`}
                >
                  {r.toUpperCase()}
                </button>
              )
            )}
          </div>
        </section>

        <ProgramStatusBanner activeBroadcast={activeBroadcast} />

        <EcosystemRegistrationCenter />

        {(role === "admin" || role === "supervisor") && (
          <ProgramBroadcastCenter
            userRole={role}
            onBroadcastSaved={loadActiveBroadcast}
          />
        )}

        <CommunicationCenter userRole={role} />
      </div>
    </main>
  );
}

function ProgramStatusBanner({ activeBroadcast }: { activeBroadcast: any }) {
  const status = activeBroadcast || DEFAULT_PROGRAM_STATUS;

  return (
    <section className="rounded-3xl bg-amber-100 p-6 shadow-xl border border-amber-300">
      <h2 className="text-2xl font-bold">Today’s Program Status</h2>
      <p className="mt-2 text-xl font-black">{status.status}</p>
      <p className="mt-2">{status.message}</p>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
        <div className="rounded-2xl bg-white p-4">
          <strong>Reason:</strong> {status.reason}
        </div>
        <div className="rounded-2xl bg-white p-4">
          <strong>Start:</strong> {status.start_time || "Not applicable"}
        </div>
        <div className="rounded-2xl bg-white p-4">
          <strong>Dismissal:</strong> {status.dismissal_time || "Not applicable"}
        </div>
      </div>
    </section>
  );
}

function EcosystemRegistrationCenter() {
  const [role, setRole] = useState("youth");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [organization, setOrganization] = useState("");
  const [emergencyContactName, setEmergencyContactName] = useState("");
  const [emergencyContactPhone, setEmergencyContactPhone] = useState("");

  const [youthAge, setYouthAge] = useState("");
  const [youthGrade, setYouthGrade] = useState("");
  const [school, setSchool] = useState("");

  const [parentName, setParentName] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [pickupAuthorized, setPickupAuthorized] = useState(false);

  const [interests, setInterests] = useState("");
  const [reasonForJoining, setReasonForJoining] = useState("");
  const [saving, setSaving] = useState(false);

  async function submitRegistration() {
    if (!firstName || !lastName || !role) {
      alert("Please enter first name, last name, and role.");
      return;
    }

    setSaving(true);

    const { error } = await supabase.from("ecosystem_registrations").insert([
      {
        role,
        registration_type: "online_ecosystem",
        full_name: `${firstName} ${lastName}`,
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        organization,
        emergency_contact_name: emergencyContactName,
        emergency_contact_phone: emergencyContactPhone,
        youth_age: youthAge ? Number(youthAge) : null,
        youth_grade: youthGrade,
        school,
        parent_name: parentName,
        parent_email: parentEmail,
        parent_phone: parentPhone,
        pickup_authorized: pickupAuthorized,
        interests,
        reason_for_joining: reasonForJoining,
        status: "pending",
        onboarding_complete: false,
      },
    ]);

    setSaving(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Registration saved successfully.");

    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setOrganization("");
    setEmergencyContactName("");
    setEmergencyContactPhone("");
    setYouthAge("");
    setYouthGrade("");
    setSchool("");
    setParentName("");
    setParentEmail("");
    setParentPhone("");
    setPickupAuthorized(false);
    setInterests("");
    setReasonForJoining("");
  }

  return (
    <section className="rounded-3xl bg-white/95 p-6 shadow-xl border border-emerald-200">
      <h2 className="text-2xl font-bold">Ecosystem Registration Center</h2>
      <p className="mt-2 text-gray-700">
        Register youth, parents, supervisors, growers, marketplace vendors,
        partners, value-added producers, volunteers, guests, and customers.
      </p>

      <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
        <select
          className="rounded-xl border p-3"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="youth">Youth</option>
          <option value="parent">Parent / Guardian</option>
          <option value="supervisor">Supervisor</option>
          <option value="grower">Grower</option>
          <option value="marketplace">Marketplace Vendor</option>
          <option value="partner">Partner</option>
          <option value="value_added">Value-Added Producer</option>
          <option value="volunteer">Volunteer</option>
          <option value="guest">Guest</option>
          <option value="customer">Customer</option>
        </select>

        <input
          className="rounded-xl border p-3"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />

        <input
          className="rounded-xl border p-3"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />

        <input
          className="rounded-xl border p-3"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="rounded-xl border p-3"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <input
          className="rounded-xl border p-3"
          placeholder="Organization / Business / Farm"
          value={organization}
          onChange={(e) => setOrganization(e.target.value)}
        />
      </div>

      {role === "youth" && (
        <div className="mt-5 rounded-2xl bg-emerald-50 p-4 border border-emerald-200">
          <h3 className="font-bold">Youth Workforce Information</h3>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              className="rounded-xl border p-3"
              placeholder="Youth Age"
              value={youthAge}
              onChange={(e) => setYouthAge(e.target.value)}
            />

            <input
              className="rounded-xl border p-3"
              placeholder="Grade"
              value={youthGrade}
              onChange={(e) => setYouthGrade(e.target.value)}
            />

            <input
              className="rounded-xl border p-3"
              placeholder="School"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
            />

            <input
              className="rounded-xl border p-3"
              placeholder="Parent / Guardian Name"
              value={parentName}
              onChange={(e) => setParentName(e.target.value)}
            />

            <input
              className="rounded-xl border p-3"
              placeholder="Parent / Guardian Email"
              value={parentEmail}
              onChange={(e) => setParentEmail(e.target.value)}
            />

            <input
              className="rounded-xl border p-3"
              placeholder="Parent / Guardian Phone"
              value={parentPhone}
              onChange={(e) => setParentPhone(e.target.value)}
            />

            <input
              className="rounded-xl border p-3"
              placeholder="Emergency Contact Name"
              value={emergencyContactName}
              onChange={(e) => setEmergencyContactName(e.target.value)}
            />

            <input
              className="rounded-xl border p-3"
              placeholder="Emergency Contact Phone"
              value={emergencyContactPhone}
              onChange={(e) => setEmergencyContactPhone(e.target.value)}
            />
          </div>
        </div>
      )}

      {role === "parent" && (
        <div className="mt-5 rounded-2xl bg-amber-50 p-4 border border-amber-200">
          <h3 className="font-bold">Parent / Guardian Access</h3>

          <label className="mt-4 flex items-center gap-3">
            <input
              type="checkbox"
              checked={pickupAuthorized}
              onChange={(e) => setPickupAuthorized(e.target.checked)}
            />
            Authorized for pickup or emergency communication
          </label>
        </div>
      )}

      <textarea
        className="mt-5 w-full rounded-xl border p-3"
        rows={3}
        placeholder="Interests, skills, products, services, or pathway interest"
        value={interests}
        onChange={(e) => setInterests(e.target.value)}
      />

      <textarea
        className="mt-4 w-full rounded-xl border p-3"
        rows={3}
        placeholder="Reason for joining the Bronson Family Farm ecosystem"
        value={reasonForJoining}
        onChange={(e) => setReasonForJoining(e.target.value)}
      />

      <button
        onClick={submitRegistration}
        disabled={saving}
        className="mt-5 rounded-2xl bg-amber-500 px-6 py-3 font-bold shadow disabled:opacity-60"
      >
        {saving ? "Saving Registration..." : "Create Registration"}
      </button>
    </section>
  );
}

function ProgramBroadcastCenter({
  userRole,
  onBroadcastSaved,
}: {
  userRole: string;
  onBroadcastSaved: () => void;
}) {
  const [status, setStatus] = useState("FULL DAY");
  const [reason, setReason] = useState("Normal Schedule");
  const [message, setMessage] = useState(DEFAULT_PROGRAM_STATUS.message);
  const [startTime, setStartTime] = useState("08:00");
  const [dismissalTime, setDismissalTime] = useState("14:00");

  function chooseStatus(nextStatus: string) {
    setStatus(nextStatus);

    if (nextStatus === "FULL DAY") {
      setReason("Normal Schedule");
      setMessage(DEFAULT_PROGRAM_STATUS.message);
      setStartTime("08:00");
      setDismissalTime("14:00");
    }

    if (nextStatus === "WORK DELAYED") {
      setReason("Weather / Delayed Start");
      setMessage(
        "Work is delayed today at Bronson Family Farm. Please wait for the updated start time before reporting."
      );
      setStartTime("10:00");
      setDismissalTime("14:00");
    }

    if (nextStatus === "EARLY DAY") {
      setReason("Heat / Weather Safety");
      setMessage(
        "Today will be an early day at Bronson Family Farm due to heat or weather safety. Youth will be dismissed early. Please check transportation arrangements."
      );
      setStartTime("08:00");
      setDismissalTime("11:30");
    }

    if (nextStatus === "NO WORK") {
      setReason("Weather / Site Safety");
      setMessage(
        "No work today at Bronson Family Farm due to weather or unsafe site conditions. Youth should not report today."
      );
      setStartTime("");
      setDismissalTime("");
    }
  }

  async function sendBroadcast() {
    const { error } = await supabase.from("program_broadcasts").insert([
      {
        broadcast_date: new Date().toISOString().slice(0, 10),
        status,
        reason,
        message,
        start_time: startTime || null,
        dismissal_time: dismissalTime || null,
        sent_by: userRole,
        active: true,
        expires_at: getTomorrowAt5AM(),
      },
    ]);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Program broadcast saved.");
    onBroadcastSaved();
  }

  return (
    <section className="rounded-3xl bg-white/95 p-6 shadow-xl border border-emerald-200">
      <h2 className="text-2xl font-bold">
        Weather & Work Status Broadcast Center
      </h2>

      <p className="mt-2 text-gray-700">
        Default is FULL DAY every morning at 5:00 AM. Use this only when the day
        changes because of heat, rain, storms, unsafe ground, or emergency
        conditions.
      </p>

      <div className="mt-5 grid grid-cols-1 md:grid-cols-4 gap-3">
        {["FULL DAY", "WORK DELAYED", "EARLY DAY", "NO WORK"].map((option) => (
          <button
            key={option}
            onClick={() => chooseStatus(option)}
            className={`rounded-2xl p-4 font-bold ${
              status === option
                ? "bg-emerald-900 text-white"
                : "bg-emerald-100 text-emerald-950"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          className="rounded-xl border p-3"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Reason"
        />

        <input
          type="time"
          className="rounded-xl border p-3"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />

        <input
          type="time"
          className="rounded-xl border p-3"
          value={dismissalTime}
          onChange={(e) => setDismissalTime(e.target.value)}
        />
      </div>

      <textarea
        className="mt-4 w-full rounded-xl border p-3"
        rows={5}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button
        onClick={sendBroadcast}
        className="mt-5 rounded-2xl bg-amber-500 px-6 py-3 font-bold shadow"
      >
        Send Program Broadcast
      </button>
    </section>
  );
}

function CommunicationCenter({ userRole }: { userRole: string }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [youthName, setYouthName] = useState("");
  const [submittedBy, setSubmittedBy] = useState(
    userRole === "parent" ? "PARENT/CAREGIVER" : "YOUTH"
  );
  const [parentName, setParentName] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [messageType, setMessageType] = useState("LATE");
  const [expectedArrivalTime, setExpectedArrivalTime] = useState("");
  const [message, setMessage] = useState("");

  const canReview =
    userRole === "admin" || userRole === "supervisor" || userRole === "nesco";

  async function loadMessages() {
    const { data } = await supabase
      .from("attendance_communications")
      .select("*")
      .order("created_at", { ascending: false });

    setMessages(data || []);
  }

  useEffect(() => {
    loadMessages();
  }, []);

  async function submitCommunication() {
    if (!youthName || !message) {
      alert("Please enter youth name and message.");
      return;
    }

    const { error } = await supabase.from("attendance_communications").insert([
      {
        youth_name: youthName,
        submitted_by: submittedBy,
        parent_name: parentName,
        parent_phone: parentPhone,
        parent_email: parentEmail,
        message_type: messageType,
        message,
        expected_arrival_time: expectedArrivalTime || null,
        communication_date: new Date().toISOString().slice(0, 10),
        copy_parent: submittedBy === "YOUTH",
        nesco_awareness: true,
        verification_status: "UNVERIFIED",
      },
    ]);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Communication saved.");
    setYouthName("");
    setParentName("");
    setParentPhone("");
    setParentEmail("");
    setMessage("");
    setExpectedArrivalTime("");
    loadMessages();
  }

  async function updateVerification(id: string, status: string) {
    const { error } = await supabase
      .from("attendance_communications")
      .update({
        verification_status: status,
        reviewed: true,
        reviewed_by: userRole,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    loadMessages();
  }

  return (
    <section className="rounded-3xl bg-white/95 p-6 shadow-xl border border-emerald-200">
      <h2 className="text-2xl font-bold">Communication Center</h2>

      <p className="mt-2 text-gray-700">
        Attendance, lateness, absence, early pickup, transportation, parent
        communication, supervisor review, and Nesco awareness.
      </p>

      <p className="mt-4 rounded-2xl bg-amber-50 p-4 text-sm text-amber-900 border border-amber-200">
        {ATTENDANCE_DISCLAIMER}
      </p>

      {!canReview && (
        <>
          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              className="rounded-xl border p-3"
              placeholder="Youth Name"
              value={youthName}
              onChange={(e) => setYouthName(e.target.value)}
            />

            <select
              className="rounded-xl border p-3"
              value={submittedBy}
              onChange={(e) => setSubmittedBy(e.target.value)}
            >
              <option>YOUTH</option>
              <option>PARENT/CAREGIVER</option>
            </select>

            <input
              className="rounded-xl border p-3"
              placeholder="Parent/Caregiver Name"
              value={parentName}
              onChange={(e) => setParentName(e.target.value)}
            />

            <input
              className="rounded-xl border p-3"
              placeholder="Parent/Caregiver Phone"
              value={parentPhone}
              onChange={(e) => setParentPhone(e.target.value)}
            />

            <input
              className="rounded-xl border p-3"
              placeholder="Parent/Caregiver Email"
              value={parentEmail}
              onChange={(e) => setParentEmail(e.target.value)}
            />

            <select
              className="rounded-xl border p-3"
              value={messageType}
              onChange={(e) => setMessageType(e.target.value)}
            >
              <option>LATE</option>
              <option>ABSENT</option>
              <option>EARLY PICKUP</option>
              <option>OTHER</option>
            </select>

            <input
              type="time"
              className="rounded-xl border p-3"
              value={expectedArrivalTime}
              onChange={(e) => setExpectedArrivalTime(e.target.value)}
            />
          </div>

          <textarea
            className="mt-4 w-full rounded-xl border p-3"
            rows={5}
            placeholder="Message to staff or supervisor"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <button
            onClick={submitCommunication}
            className="mt-5 rounded-2xl bg-amber-500 px-6 py-3 font-bold shadow"
          >
            Send Message
          </button>
        </>
      )}

      {canReview && (
        <div className="mt-6 space-y-4">
          <h3 className="text-xl font-bold">Review Queue</h3>

          {messages.length === 0 && (
            <p className="text-gray-600">No messages submitted yet.</p>
          )}

          {messages.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4"
            >
              <p className="font-bold">{item.youth_name}</p>
              <p className="text-sm text-gray-700">
                Submitted by: {item.submitted_by}
              </p>
              <p className="text-sm text-gray-700">
                Type: {item.message_type}
              </p>
              <p className="mt-2">{item.message}</p>
              <p className="mt-2 text-sm font-semibold">
                Verification: {item.verification_status}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {[
                  "PARENT CONFIRMED",
                  "SUPERVISOR CONFIRMED",
                  "NOT CONFIRMED",
                  "EXCUSED",
                  "UNEXCUSED",
                  "NESCO REVIEW",
                ].map((status) => (
                  <button
                    key={status}
                    onClick={() => updateVerification(item.id, status)}
                    className="rounded-xl bg-white px-3 py-2 text-sm font-bold border"
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default App;
