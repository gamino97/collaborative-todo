import { useState } from "react";
import reactLogo from "./assets/react.svg";
import Layout from "./components/Layout";
import Home from "./components/Home";
// import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  return (
    <Layout>
      <Home />
    </Layout>
  );
}

export default App;
