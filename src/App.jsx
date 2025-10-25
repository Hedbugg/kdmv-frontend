import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Page/Login";

import Sell from "./components/Sell";
function App() {

        return(
          <Router>
            <Routes >
                <Route path = "/" element = {<Login />} />
                  <Route path="/sell" element={<Sell />} />
          
            </Routes >


          </Router>

        

        );

}
export default App;