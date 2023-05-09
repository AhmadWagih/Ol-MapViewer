
import "./App.css";
import MapComponent from "./Components/MapComponent.jsx";
import MapContextProvider from "./Context/MapContext";
import { ToastContainer } from "react-toastify";
function App() {

  return (
    <MapContextProvider>
      <ToastContainer/>
      <MapComponent />
    </MapContextProvider>
  );
}

export default App;
