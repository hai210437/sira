import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage/LandingPage";
import RealEstate from "./pages/RealEstate/RealEstate";
import Finance from "./pages/Finance/Finance";
import Services from "./pages/Services/Services";
import Team from "./pages/Team/Team";
import Kontakt from "./pages/Kontakt/Kontakt";
import Impressum from "./pages/Impressum/Impressum";
import Datenschutz from "./pages/Datenschutz/Datenschutz";
import Immobilien from "./pages/Immobilien/Immobilien";
import ImmobilienDetails from "./pages/Immo-Details/ImmobilienDetails";

function WebRoutes() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/real-estate" element={<RealEstate />} />
                <Route path="/finance" element={<Finance />} />
                <Route path="/services" element={<Services />} />
                <Route path="/team" element={<Team />} />
                <Route path="/kontakt" element={<Kontakt />} />
                <Route path="/impressum" element={<Impressum />} />
                <Route path="/datenschutz" element={<Datenschutz />} />
                <Route path="/immobilien" element={<Immobilien />} />
                <Route path="/immobilien/:id" element={<ImmobilienDetails />} />
            </Routes>
        </Router>
    );
}

export default WebRoutes;