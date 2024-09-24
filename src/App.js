import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Homeapage from "./Pages/Homeapage";
import { useEffect, useState } from "react";
import Loading from "./Pages/Loading";
import Dashboard from "./Pages/Dashboard";
import Userprofile from "./Pages/Userprofile";
import Otherpage from "./Pages/Otherpage";
import Newstory from "./Pages/Newstory";

function App() {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setLoading();
  }, []);

  const setLoading = () => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  };
  if (isLoading) {
    return (
      <>
        <Loading />
      </>
    );
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route
          default
          path="/homepage"
          element={<Homeapage setLoading={setLoading} />}
        />
        <Route path="/" element={<Dashboard />}>
          <Route path=":searchparam" element={<Otherpage />} />
          <Route index element={<Otherpage />} />
          <Route
            path="/setuserprofile"
            element={<Userprofile setLoading={setLoading} />}
          />
          <Route
            path="/p/:blogId/edit"
            element={<Newstory setLoading={setLoading} />}
          />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
