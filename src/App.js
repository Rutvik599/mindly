import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Homeapage from "./Pages/Homeapage";
import { useEffect, useState } from "react";
import Loading from "./Pages/Loading";
import Dashboard from "./Pages/Dashboard";
import Userprofile from "./Pages/Userprofile";


function App() {
  const [isLoading,setIsLoading] = useState(false);

  useEffect(() => {
    setLoading();
  }, []);

  const setLoading = () =>{
    setIsLoading(true); 
    const timer = setTimeout(() => {
      setIsLoading(false); 
    }, 3000);
    return () => clearTimeout(timer);
  }
  if(isLoading){
    return (
    <><Loading/></>
    );
  }
  return (
    <BrowserRouter>
    <Routes>
      <Route default path="/homepage" element={<Homeapage setLoading = {setLoading}/>}/>
      <Route path="/" element={<Dashboard/>}>
      <Route path="/setuserprofile" element={<Userprofile/>} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;
