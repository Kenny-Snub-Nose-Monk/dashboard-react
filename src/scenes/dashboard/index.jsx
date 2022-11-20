import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { mockTransactions } from "../../data/mockData";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import CoronavirusSharpIcon from '@mui/icons-material/CoronavirusSharp';
import SentimentVeryDissatisfiedSharpIcon from '@mui/icons-material/SentimentVeryDissatisfiedSharp';
import SickSharpIcon from '@mui/icons-material/SickSharp';
import Header from "../../components/Header";
import GeographyChart from "../../components/GeographyChart";
import CircularProgress from '@mui/material/CircularProgress';
import { countryFlags } from "../../data/countryFlags";
import NumberCard from "../../components/NumberCard";
import { useGetSummaryQuery } from '../../services/covid19'
import { formatDate } from "../../utils/dateFormat";
import { getCountryFlag } from "../../utils/getCountryFlag.js"

function getTop20CountriesAndFlag(countries){
  const top20Countries =  [...countries].sort((a, b) => {
    return b.TotalDeaths - a.TotalDeaths}).slice(0, 20)

  return top20Countries.map(country =>  { return {...country, Flag: getCountryFlag(country.CountryCode)}})
}


const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const {data: summary, isFetching: isSummaryFetching, error} = useGetSummaryQuery();
  const refreshDAte = isSummaryFetching ? "" : formatDate(new Date(summary.Date))

  // console.log(summary?.Countries)
  const top20Countries = isSummaryFetching ? [] : getTop20CountriesAndFlag(summary.Countries)

  console.log(top20Countries)


  return (
    <Box m="15px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Global Covid19 Status" subtitle={`Refresh Date : ${refreshDAte}`} />

        <Box>
          <Button 
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <DownloadOutlinedIcon sx={{ mr: "10px" }} />
            Download Reports
          </Button>
        </Box>
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="15px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
        {
          isSummaryFetching ? <CircularProgress sx={{color: colors.greenAccent[600]}}/> : (<NumberCard
            title= {summary?.Global?.TotalConfirmed.toLocaleString()}
            subtitle="Total Cases"
            icon={
              <SickSharpIcon
                sx={{ color: colors.greenAccent[600], fontSize: "50px" }}
              />
            }
            
          /> )
        }
   
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {
            isSummaryFetching ? <CircularProgress  sx={{color: colors.greenAccent[600]}}/>: 
            <NumberCard
            title= {summary?.Global?.TotalDeaths.toLocaleString()}
            subtitle="Total Deaths"
            icon={
              <SentimentVeryDissatisfiedSharpIcon
                sx={{ color: colors.greenAccent[600], fontSize: "50px" }}
              />
            }
          />
          } 
        </Box>
        <Box
          gridColumn="span 2"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
           {
            isSummaryFetching ? <CircularProgress sx={{color: colors.greenAccent[600]}}/> :
              <NumberCard
              title= {summary?.Global?.NewConfirmed.toLocaleString()}
              subtitle="New Cases"
              icon={
                <SickSharpIcon
                  sx={{ color: colors.greenAccent[600], fontSize: "50px" }}
                />
              }
            />
           }
        </Box>
        <Box
          gridColumn="span 2"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {
            isSummaryFetching ? <CircularProgress sx={{color: colors.greenAccent[600]}}/> : 
            <NumberCard
              title= {summary?.Global?.NewDeaths.toLocaleString()}
              subtitle="New Deaths"
              icon={
                <SentimentVeryDissatisfiedSharpIcon
                  sx={{ color: colors.greenAccent[600], fontSize: "50px" }}
              />
            }
          />
          }
        </Box>
        <Box
          gridColumn="span 2"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {
            isSummaryFetching ? <CircularProgress sx={{color: colors.greenAccent[600]}}/> : 
            <NumberCard
              title= {(100 * summary.Global.TotalDeaths / summary.Global.TotalConfirmed).toFixed(2) + "%"}
              subtitle="Mortality"
              icon={
                <CoronavirusSharpIcon 
                  sx={{ color: colors.greenAccent[600], fontSize: "50px" }}
              />
            }
          />
          }
        </Box>

        {/* ROW 2 */}
        <Box
          gridColumn="span 8"
          gridRow="span 4"
          backgroundColor={colors.primary[400]}
          padding="20px"
        >
          <Typography
            variant="h4"
            fontWeight="600"
            sx={{ marginBottom: "15px" }}
          >
            Global Covid19 - Total Cases
          </Typography>
          <Box height="500px">
            <GeographyChart isDashboard={true}/>
          </Box>
        </Box>  
        <Box
          gridColumn="span 4"
          gridRow="span 4"
          backgroundColor={colors.primary[400]}
          overflow="auto"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[500]}`}
            colors={colors.grey[100]}
            p="15px"
          >
              <Typography color={colors.grey[100]} variant="h4" fontWeight="600">
              Cumulative Deaths - Top 20 Countries
              </Typography>
            </Box>
            <Box
              display="flex"
              justifyContent="space-around"
              alignItems="center"
              borderBottom={`4px solid ${colors.primary[700]}`}
              p="15px"
            >
              <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
                Country
              </Typography>
              <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              Total Deaths
              </Typography>
              <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              Total Cases
              </Typography>
            </Box>

          {isSummaryFetching ? <CircularProgress sx={{color: colors.greenAccent[600]}}/> 
            : top20Countries.map((country, i) => (
            <Box
              key={country.ID}
              display="grid"
              gridTemplateColumns="repeat(3, 1fr)"
              justifyItems="center"
              borderBottom={`4px solid ${colors.primary[500]}`}
              p="15px"
            >
              <Box>
                <Typography
                  color={colors.greenAccent[500]}
                  variant="h5"
                  fontWeight="600"
                >
                  {country.Slug.slice(0,1).toUpperCase() + country.Slug.slice(1) + " " + country.Flag}
                </Typography>
              </Box>
              <Box color={colors.grey[100]}>{country.TotalDeaths.toLocaleString()}</Box>
              <Box
                backgroundColor={colors.greenAccent[500]}
                p="5px 10px"
                borderRadius="4px"
              >
                {country.TotalConfirmed.toLocaleString()}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;