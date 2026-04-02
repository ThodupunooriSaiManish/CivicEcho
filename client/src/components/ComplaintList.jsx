const ComplaintList = ({ complaint }) => {
  if (!complaint) return <div>Select a complaint</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Complaint Details</h2>

      <p><b>ID:</b> {complaint._id}</p>
      <p><b>Issue:</b> {complaint.issueType}</p>
      <p><b>Transport:</b> {complaint.transportType}</p>
      <p><b>Priority:</b> {complaint.priority}</p>
      <p><b>Status:</b> {complaint.status}</p>
      <p><b>Description:</b> {complaint.description}</p>
    </div>
  );
};

export default ComplaintList;