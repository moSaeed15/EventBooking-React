/**
 * @author @moSaeed15
 * @description This file contains the App component and its logic
 * @exports App
 */

import SignupTwo from "./pages/SignUp/SignupTwo";
import SignUpOne from "./pages/SignUp/SignupOne";

import GlobalStyles from "./components/styles/Global";
import Landing from "./pages/LandingPage/Landing";
import Organize from "./pages/Organize/Organize";
import { Route, Routes } from "react-router-dom";


import { useEffect, useState } from 'react';
import Maincontainer from './pages/LogIn/MainContainer';
import ResetPassword from './pages/ResetPassword/ResetPassword';
import Reset from './pages/ResetPassword/Reset';
import CheckoutForm from './pages/BookingPopUP/CheckoutForm';
import Events from './pages/EventPage/EventPage';
import BasicInfo from './pages/BasicInfo/BasicInfo';

// import FacebookLoginButton from './components/LoginFacebook';
/**
 * Function component that renders the main application
 * @function
 * @returns {JSX.Element} The main application component
 */

function App() {
  const [email, setEmail] = useState("");

  return (
    <>
      <GlobalStyles />
      <Routes>
        {/* <Route path="/" element={<Landing />} />
        <Route path="signup" element={<SignUpOne setEmail={setEmail} />} />
        <Route path="Signuptwo" element={<SignupTwo email={email} />} />
        <Route path="login" element={<Maincontainer />} />
        <Route path="Organize" element={<Organize />} />
        <Route path="forgetPassword" element={<Reset />} />
        <Route path="forgetPassword/:token" element={<ResetPassword />} />
        <Route path="checkout" element={<CheckoutForm />} />
        <Route path="/:eventID" element={<Events />} /> */}
        <Route path="/" element={<BasicInfo />} />
      </Routes>
      {/* <BookingPopUp /> */}
    </>
  );
}

export default App;
