import "./App.css";
import SignUp from "./component/SignUp";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./component/Login";
import { useState } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "./utils/firebase";
import StarWarsCharacters from "./component/StarWarsCharacters";
function App() {
  const [currentPage, SetcurrentPage] = useState(() => {
    const user = localStorage.getItem("user");
    if (user) return "page";
    else return "signup";
  });
  function googleLogin() {
    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
      .then(async (result) => {
        const user = result.user;
        if (user) {
          localStorage.setItem("user", JSON.stringify(user));
          toast.success("User logged in Successfully");
          SetcurrentPage("page");
        }
      })
      .catch((error) => {
        console.error("Google login error:", error.message);
        toast.error(`Google login failed: ${error.message}`);
      });
  }

  const cache = createCache({
    key: "css",
    prepend: true,
  });

  return (
    <div className="App">
      <CacheProvider value={cache}>
        <ToastContainer
          position="top-center"
          autoClose="3000"
          hideProgressBar
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          style={{ textAlign: "center" }}
        />
        {currentPage == "login" && (
          <Login SetcurrentPage={SetcurrentPage} googleLogin={googleLogin} />
        )}
        {currentPage == "signup" && (
          <SignUp SetcurrentPage={SetcurrentPage} googleLogin={googleLogin} />
        )}
        {currentPage == "page" && (
          <StarWarsCharacters SetcurrentPage={SetcurrentPage} />
        )}
      </CacheProvider>
    </div>
  );
}

export default App;
