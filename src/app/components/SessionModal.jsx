"use client";
import { useEffect, useState } from "react";

const timeOptions = Array.from({ length: 10 }, (_, i) => {
  const hour = i + 9;
  return `${hour.toString().padStart(2, "0")}:00`;
});

export default function SessionModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  sessionData,
  currentUser,
  sessions,
  readOnly = false,
}) {
  const [formData, setFormData] = useState({
    caseNumber: "",
    date: "",
    startTime: "09:00",
    endTime: "10:00",
    arbitrator: currentUser,
    claimantEmail: "",
    respondentEmail: "",
  });

  const [errors, setErrors] = useState({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted || !sessionData) return;
    const dateObj = new Date(sessionData.datetime);
    setFormData({
      caseNumber: sessionData.caseNumber || "",
      date: dateObj.toISOString().split("T")[0],
      startTime: sessionData.startTime || "09:00",
      endTime: sessionData.endTime || "10:00",
      arbitrator: sessionData.arbitrator || currentUser,
      claimantEmail: sessionData.claimantEmail || "",
      respondentEmail: sessionData.respondentEmail || "",
    });
  }, [sessionData, currentUser, mounted]);

  if (!isOpen || !mounted) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const start = new Date(`${formData.date}T${formData.startTime}`);
    const end = new Date(`${formData.date}T${formData.endTime}`);

    if (end <= start) {
      newErrors.endTime = "End time must be after start time";
    }

    if (!emailRegex.test(formData.claimantEmail)) {
      newErrors.claimantEmail = "Invalid Claimant Email";
    }

    if (!emailRegex.test(formData.respondentEmail)) {
      newErrors.respondentEmail = "Invalid Respondent Email";
    }

    const isOverlapping = sessions.some((s) => {
      if (sessionData?.id === s.id) return false;
      const sDate = new Date(s.datetime);
      const sessionStart = new Date(`${sDate.toDateString()} ${s.startTime}`);
      const sessionEnd = new Date(`${sDate.toDateString()} ${s.endTime}`);
      return start < sessionEnd && end > sessionStart;
    });

    if (isOverlapping) {
      newErrors.startTime = "Time slot overlaps with another session";
      newErrors.endTime = "Time slot overlaps with another session";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    onSave({
      id: sessionData?.id || Date.now(),
      caseNumber: formData.caseNumber,
      datetime: start.toString(),
      startTime: formData.startTime,
      endTime: formData.endTime,
      arbitrator: formData.arbitrator,
      claimantEmail: formData.claimantEmail,
      respondentEmail: formData.respondentEmail,
    });

    onClose();
  };

  const inputClass = (hasError) =>
    `w-full border p-2 rounded text-[#495057] focus:outline-none ${
      hasError ? "border-red-500" : "border-[#ced4da]"
    }`;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-md border border-gray-300">
        <h2 className="text-xl font-bold mb-4 text-[#005186]">
          {sessionData?.id
            ? readOnly
              ? "Session Details"
              : "Update Session"
            : "Create Session"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6 text-black">
          {/* Case ID */}
          <div>
            <label className="block mb-1 text-sm font-medium">Case Id</label>
            <input
              className={inputClass(errors.caseNumber)}
              placeholder="Case Id"
              value={formData.caseNumber}
              onChange={(e) => {
                setFormData({ ...formData, caseNumber: e.target.value });
                setErrors((prev) => ({ ...prev, caseNumber: "" }));
              }}
              readOnly={readOnly}
              required
            />
            {errors.caseNumber && (
              <p className="text-sm text-red-600 mt-1">{errors.caseNumber}</p>
            )}
          </div>

          {/* Date */}
          <div>
            <label className="block mb-1 text-sm font-medium">Date</label>
            <input
              type="date"
              className={inputClass(errors.date)}
              value={formData.date}
              onChange={(e) => {
                setFormData({ ...formData, date: e.target.value });
                setErrors((prev) => ({ ...prev, date: "" }));
              }}
              readOnly={readOnly}
              required
            />
            {errors.date && (
              <p className="text-sm text-red-600 mt-1">{errors.date}</p>
            )}
          </div>

          {/* Time Slots */}
          <div>
            <label className="block mb-1 text-sm font-medium">Time Slot</label>
            <div className="flex gap-4">
              <select
                className={inputClass(errors.startTime)}
                value={formData.startTime}
                onChange={(e) => {
                  setFormData({ ...formData, startTime: e.target.value });
                  setErrors((prev) => ({ ...prev, startTime: "" }));
                }}
                disabled={readOnly}
                required
              >
                {timeOptions.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <select
                className={inputClass(errors.endTime)}
                value={formData.endTime}
                onChange={(e) => {
                  setFormData({ ...formData, endTime: e.target.value });
                  setErrors((prev) => ({ ...prev, endTime: "" }));
                }}
                disabled={readOnly}
                required
              >
                {timeOptions.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            {(errors.startTime || errors.endTime) && (
              <p className="text-sm text-red-600 mt-1">
                {errors.startTime || errors.endTime}
              </p>
            )}
          </div>

          {/* Arbitrator (read-only) */}
          <div>
            <label className="block mb-1 text-sm font-medium">
              Arbitrator Email
            </label>
            <input
              className="w-full border border-[#ced4da] p-2 rounded bg-gray-100 text-gray-600"
              value={formData.arbitrator}
              readOnly
            />
          </div>

          {/* Claimant Email */}
          <div>
            <label className="block mb-1 text-sm font-medium">
              Claimant Email
            </label>
            <input
              className={inputClass(errors.claimantEmail)}
              placeholder="Claimant Email"
              value={formData.claimantEmail}
              onChange={(e) => {
                setFormData({ ...formData, claimantEmail: e.target.value });
                setErrors((prev) => ({ ...prev, claimantEmail: "" }));
              }}
              readOnly={readOnly}
            />
            {errors.claimantEmail && (
              <p className="text-sm text-red-600 mt-1">
                {errors.claimantEmail}
              </p>
            )}
          </div>

          {/* Respondent Email */}
          <div>
            <label className="block mb-1 text-sm font-medium">
              Respondent Email
            </label>
            <input
              className={inputClass(errors.respondentEmail)}
              placeholder="Respondent Email"
              value={formData.respondentEmail}
              onChange={(e) => {
                setFormData({ ...formData, respondentEmail: e.target.value });
                setErrors((prev) => ({ ...prev, respondentEmail: "" }));
              }}
              readOnly={readOnly}
            />
            {errors.respondentEmail && (
              <p className="text-sm text-red-600 mt-1">
                {errors.respondentEmail}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded text-white"
              style={{ backgroundColor: "#fbb04c" }}
            >
              {readOnly ? "Close" : "Cancel"}
            </button>

            <div className="flex gap-2">
              {!readOnly && sessionData?.id && (
                <button
                  type="button"
                  onClick={() => onDelete(sessionData.id)}
                  className="px-4 py-2 rounded text-white"
                  style={{ backgroundColor: "#f44336" }}
                >
                  Delete
                </button>
              )}

              {!readOnly && (
                <button
                  type="submit"
                  className="px-4 py-2 rounded text-white"
                  style={{ backgroundColor: "#005186" }}
                >
                  Save
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
