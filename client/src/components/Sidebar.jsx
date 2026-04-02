import React, { useState } from "react";

const Sidebar = ({ data, onSelect }) => {
  const [openCategory, setOpenCategory] = useState(null);
  const [openTransport, setOpenTransport] = useState(null);

  return (
    <div className="w-64 bg-gray-100 h-screen p-4 overflow-y-auto">
      {Object.keys(data).map((category) => (
        <div key={category}>
          
          {/* CATEGORY */}
          <div
            className="cursor-pointer font-bold p-2"
            onClick={() =>
              setOpenCategory(openCategory === category ? null : category)
            }
          >
            {openCategory === category ? "▼" : "▶"} {category}
          </div>

          {/* TRANSPORT */}
          {openCategory === category &&
            Object.keys(data[category]).map((transport) => (
              <div key={transport} className="ml-4">

                <div
                  className="cursor-pointer p-2"
                  onClick={() =>
                    setOpenTransport(
                      openTransport === transport ? null : transport
                    )
                  }
                >
                  {openTransport === transport ? "▼" : "▶"} {transport}
                </div>

                {/* COMPLAINTS */}
                {openTransport === transport &&
                  data[category][transport].map((c) => (
                    <div
                      key={c._id}
                      className="ml-6 p-1 cursor-pointer"
                      onClick={() => onSelect(c)}
                    >
                      - #{c._id.slice(-4)} ({c.priority})
                    </div>
                  ))}
              </div>
            ))}
        </div>
      ))}
    </div>
  );
};

export default Sidebar;