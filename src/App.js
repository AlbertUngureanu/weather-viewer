import { useEffect, useState } from "react";
import Searchbar from "./components/Searchbar"
import Weather from "./components/Weather";
import "./styles/style.css"

function App() {
  const [cityToSearchFor, setCityToSearchFor] = useState(() => {});

  return (
    <div className = "informations">
      <Searchbar changeCity = {cityToSearchFor => setCityToSearchFor(cityToSearchFor)}/>
      <div hidden id="spinner"></div>
      {cityToSearchFor && <Weather props = {[cityToSearchFor.latitude, cityToSearchFor.longitude]}/>}
    </div>
  );
}

export default App;