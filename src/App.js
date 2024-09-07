import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Homeapage from "./Pages/Homeapage";
import { useEffect, useState } from "react";
import Loading from "./Pages/Loading";


function App() {
  const [isLoading,setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true); 
    const timer = setTimeout(() => {
      setIsLoading(false); 
    }, 2000);
    return () => clearTimeout(timer);
  }, []);
  if(isLoading){
    return (
    <><Loading/></>
    );
  }
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Homeapage/>}/>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;
