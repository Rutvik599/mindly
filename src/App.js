import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Homeapage from "./Pages/Homeapage";
import { useEffect, useState } from "react";
import Loading from "./Pages/Loading";
import Dashboard from "./Pages/Dashboard";
import Userprofile from "./Pages/Userprofile";
import Otherpage from "./Pages/Otherpage";
import Newstory from "./Pages/Newstory";
import Yourpost from "./Pages/Yourpost";
import Readblog from "./Pages/Readblog";
import BlogContextProvider from "./Utils/Contenxtprovider";
import Teammindly from "./Pages/Teammindly";
import Searchpage from "./Pages/Searchpage";
import Publicprofile from "./Pages/Publicprofile";

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
    <BlogContextProvider>
      <BrowserRouter>
        <Routes>
          <Route
            default
            path="/homepage"
            element={<Homeapage setLoading={setLoading} />}
          />
          <Route
            default
            path="/teammindly"
            element={<Teammindly setLoading={setLoading} />}
          />
          <Route path="/" element={<Dashboard />}>
            <Route
              path=":searchparam"
              element={<Otherpage setLoading={setLoading} />}
            />
            <Route index element={<Otherpage setLoading={setLoading} />} />
            <Route
              path="/setuserprofile"
              element={<Userprofile setLoading={setLoading} />}
            />
            <Route
              path="/p/:blogId/edit"
              element={<Newstory setLoading={setLoading} />}
            />
            <Route
              path="/post/:status"
              element={<Yourpost setLoading={setLoading} />}
            />
            <Route
              path="/r/:username/:blogcontent"
              element={<Readblog setLoading={setLoading} />}
            />
            <Route
              path="/searchresult/:searchparam"
              element={<Searchpage/>}
            />
            <Route
              path="/search/profile/:username"
              element={<Publicprofile/>}
            />
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </BlogContextProvider>
  );
}

export default App;
