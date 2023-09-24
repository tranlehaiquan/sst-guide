import React, { useEffect } from "react";

interface Props {
  className?: string;
}

const Home: React.FC<Props> = () => {
  useEffect(() => {
    console.log("Home");
  });

  // simple Home page
  return (
    <div>
      <h1>Home</h1>
    </div>
  );
};

export default Home;
