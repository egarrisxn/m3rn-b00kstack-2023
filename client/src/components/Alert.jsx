const Alert = ({ message, type }) => (
  <div
    className={`border px-4 py-3 rounded relative ${
      type === "error"
        ? "bg-red-100 border-red-400 text-red-700"
        : "bg-green-100 border-green-400 text-green-700"
    }`}
    role="alert"
  >
    <strong className="font-bold">
      {type === "error" ? "Error:" : "Success:"}
    </strong>
    <span className="block sm:inline">{message}</span>
  </div>
);

export default Alert;
