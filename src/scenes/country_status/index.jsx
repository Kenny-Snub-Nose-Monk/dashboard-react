import { Box, Button, Typography, useTheme, IconButton, Autocomplete, TextField } from "@mui/material";
import { tokens } from "../../theme";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import CoronavirusSharpIcon from '@mui/icons-material/CoronavirusSharp';
import SentimentVeryDissatisfiedSharpIcon from '@mui/icons-material/SentimentVeryDissatisfiedSharp';
import SickSharpIcon from '@mui/icons-material/SickSharp';
import Header from "../../components/Header";
import GeographyChart from "../../components/GeographyChart";
import CircularProgress from '@mui/material/CircularProgress';
import NumberCard from "../../components/NumberCard";
import { useGetSummaryQuery } from '../../services/covid19'
import { useGetStatusByCountriesQuery } from "../../services/covid19";
import { useGetCountriesQuery } from "../../services/covid19";
import { formatDate } from "../../utils/dateFormat";
import { getCountryFlag } from "../../utils/getCountryFlag.js"
import LineChart from "../../components/LineChart";
import { color } from "@mui/system";


{/* <Autocomplete
  disablePortal
  id="combo-box-demo"
  options={top100Films}
  sx={{ width: 300 }}
  renderInput={(params) => <TextField {...params} label="Country" />}
/> */}


const dataTransformLineChart = (countryData) => {
  const result = [{
      id: "NewConfirmed",
      color: "hsl(115, 70%, 50%)",
      data: []
    }, 
    {
      id: "NewDeaths",
      color: "hsl(335, 70%, 50%)",
      data: []
    }, 
    {
      id: "TotalConfirmed",
      color: "hsl(122, 70%, 50%)",
      data: []
    }, 
    {
      id: "TotalDeaths",
      color: "hsl(29, 70%, 50%)",
      data: []
    }, 
  ]

  countryData.forEach(oneData => {
    result[0].data.push({x: oneData.Date.slice(0,7), y: oneData.NewConfirmed})
    result[1].data.push({x: oneData.Date.slice(0,7), y: oneData.NewDeaths})
    result[2].data.push({x: oneData.Date.slice(0,7), y: oneData.TotalConfirmed})
    result[3].data.push({x: oneData.Date.slice(0,7), y: oneData.TotalDeaths})
  })

  // Sum by month
  result.forEach((oneData,i) => {

  //TotalConfirmed and  TotalDeaths no need to sum by Month, just get last one
  if(i < 2){
    result[i].data = Array.from(oneData.data.reduce(
      (m, {x, y}) => m.set(x, (m.get(x) || 0) + y), new Map()
    ), ([x, y]) => ({x, y}));
  }else {
    result[i].data = Array.from(oneData.data.reduce(
      (m, {x, y}) => m.set(x, y), new Map()
    ), ([x, y]) => ({x, y}));
  }
  })

  // Sort by Date
  const resultSort = result.map(el => {return {...el, data: el.data.sort((a, b)=> {
      if(a.x > b.x){
          return 1
      }
      if(a.x < b.x){
          return -1
      }
      return 0})}})

  return resultSort
}

const filterByYear = (data, year="") => {
  const dataFilterByYear =  [{...data[0], data: data[0].data.filter(el => el.x.includes(year))}]

  // const modifedData =  [{...dataFilterByYear[0], data: dataFilterByYear[0].data.map(el => {return {...el, x: el.x.slice(2)}})}]

  return dataFilterByYear
}




const CountryStatus = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const {data: countryData, isFetching: isCountryDataFetching, error: countryDataFetchingError} = useGetStatusByCountriesQuery();
  const {data: countries, isFetching: isCountriesFetching, error: countriesFetchingError} = useGetCountriesQuery()

  const lineChartInputData = isCountryDataFetching ? {} : dataTransformLineChart(countryData)
  const NewConfirmed =  isCountryDataFetching ? undefined : lineChartInputData[0].data.slice(-1)[0].y
  const NewDeaths = isCountryDataFetching ? undefined : lineChartInputData[1].data.slice(-1)[0].y
  const TotalDeaths =  isCountryDataFetching ? undefined : lineChartInputData[3].data.slice(-1)[0].y
  const TotalConfirmed = isCountryDataFetching ? undefined : lineChartInputData[2].data.slice(-1)[0].y
  const Mortality = isCountryDataFetching ? undefined : (TotalDeaths * 100 / TotalConfirmed).toFixed(2) + "%"


  const countriesWithFlag = isCountriesFetching ? [] : countries.map(country =>  { 
    return {...country, label: `${country.Country} ${country.ISO2} ${getCountryFlag(country.ISO2)}`}})


  console.log(countriesWithFlag)

  const countriesWithFlagSorted = countriesWithFlag.sort((a, b)=> {
    if(a.label > b.label){
        return 1
    }
    if(a.label < b.label){
        return -1
    }
    return 0})

  //Fetch Error
  if(countryDataFetchingError) return <Box>{`CountryData Fetching Error ${countryDataFetchingError}`}</Box>

  return (

    <Box m="15px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Country Covid19 Status" />
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={countriesWithFlagSorted}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="Country" />}
        />

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
          isCountryDataFetching ? <CircularProgress sx={{color: colors.greenAccent[600]}}/> : (<NumberCard
            title= {TotalConfirmed.toLocaleString()}
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
            isCountryDataFetching ? <CircularProgress  sx={{color: colors.greenAccent[600]}}/>: 
            <NumberCard
            title= {TotalDeaths.toLocaleString()}
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
            isCountryDataFetching ? <CircularProgress sx={{color: colors.greenAccent[600]}}/> :
              <NumberCard
              title= {NewConfirmed.toLocaleString()}
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
            isCountryDataFetching ? <CircularProgress sx={{color: colors.greenAccent[600]}}/> : 
            <NumberCard
              title= {NewDeaths.toLocaleString()}
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
            isCountryDataFetching ? <CircularProgress sx={{color: colors.greenAccent[600]}}/> : 
            <NumberCard
              title= {Mortality}
              subtitle="Mortality"
              icon={
                <CoronavirusSharpIcon 
                  sx={{ color: colors.greenAccent[600], fontSize: "50px" }}
              />
            }
          />
          }
        </Box>

      {/* ROW 2*/}
        <Box
          gridColumn="span 12"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h3"
                fontWeight="bold"
                color={colors.greenAccent[500]}
              >
                Infection Trend
              </Typography>
            </Box>
          </Box>
          <Box height="250px" m="-20px 0 0 0">
            {isCountryDataFetching ? <CircularProgress sx={{color: colors.greenAccent[600]}}/> : <LineChart isDashboard={true} data={filterByYear(lineChartInputData.slice(0, 1))}/>}
          </Box>
        </Box>

        <Box
          gridColumn="span 12"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h3"
                fontWeight="bold"
                color={colors.greenAccent[500]}
              >
              Death Trend
              </Typography>
            </Box>
          </Box>
          <Box height="250px" m="-20px 0 0 0">
            {isCountryDataFetching ? <CircularProgress sx={{color: colors.greenAccent[600]}}/> : <LineChart isDashboard={true} data={filterByYear(lineChartInputData.slice(1,2))}/>}
          </Box>
        </Box>

        

      </Box>
    </Box>
  );
};

export default CountryStatus;