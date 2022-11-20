import { ColorModeContext, useMode} from './theme';
import { CssBaseline, ThemeProvider} from '@mui/material';
import Topbar from './scenes/global/Topbar';
import Sidebar from './scenes/global/Sidebar';
import Team from "./scenes/team";
import CovidInofrmation from "./scenes/covidInofrmation";
import Bar from "./scenes/bar";
import Form from "./scenes/form";
import Line from "./scenes/line";
import Pie from "./scenes/pie";
import FAQ from "./scenes/faq";
import Geography from "./scenes/geography";
import Calendar from './scenes/calendar/calendar';
import GlobalStatus from './scenes/global_status'
import { Routes, Route} from "react-router-dom"; 
import CountryStatus from './scenes/country_status';


function App() {
  const [theme, colorMode] = useMode();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline/>
        <div className='app'>
          <Sidebar/>
          <main className="content">
            <Topbar/>
            <Routes>
              <Route path="/" element={<GlobalStatus/>}/>
              <Route path="/country-status" element={<CountryStatus/>}/>
              <Route path="/team" element={<Team/>}/>
              <Route path="/covid-inofrmation" element={<CovidInofrmation/>}/>
              <Route path="/form" element={<Form/>}/>
              <Route path="/bar" element={<Bar/>}/>
              <Route path="/pie" element={<Pie/>}/>
              <Route path="/line" element={<Line/>}/>
              <Route path="/faq" element={<FAQ/>}/>
              <Route path="/geography" element={<Geography/>}/>
              <Route path="/calendar" element={<Calendar/>}/>
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
