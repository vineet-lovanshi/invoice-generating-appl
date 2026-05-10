import { useState } from "react";
import AppComponent from "./component/AppComponent";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <AppComponent></AppComponent>
    </>
  );
}

export default App;
