import React from "react";

function Greeting({ render }) {
  const name = "Reader";
  return render(name);
}

export default Greeting;