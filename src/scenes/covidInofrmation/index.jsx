import { Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataContacts } from "../../data/mockData";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import { useGetSummaryQuery } from "../../services/covid19";
import { getCountryFlag } from "../../utils/getCountryFlag";
import CircularProgress from '@mui/material/CircularProgress';

function sortCountriesbyTotalDeathAndAddFlag(countries){
  if (!Array.isArray(countries)) return []

  const Countries =  [...countries].sort((a, b) => {
    return b.TotalDeaths - a.TotalDeaths})

  return Countries.map(country =>  { return {id: country.ID,Country: country.Country ,CountryCode: country.CountryCode, 
    NewConfirmed: country.NewConfirmed, NewDeaths: country.NewDeaths,
    TotalConfirmed: country.TotalConfirmed,  TotalDeaths: country.TotalDeaths,Flag: getCountryFlag(country.CountryCode)}})
}

const CovidInofrmation = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const {data: summary, isFetching: isSummaryFetching, error: summryFetchingError} = useGetSummaryQuery();


  const countriesCovidStatistics = isSummaryFetching ? [] : sortCountriesbyTotalDeathAndAddFlag(summary.Countries)

  console.log(countriesCovidStatistics)

  if(summryFetchingError) return <Box>{`Summry Fetching Error ${summryFetchingError}`}</Box>


  const columns = [
    { field: "id", headerName: "ID", flex: 1 },
    {
      field: "Country",
      headerName: "Country",
      flex: 1,
      cellClassName: "country-column--cell",
    },
    {
      field: "CountryCode",
      headerName: "CountryCode",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "Flag",
      headerName: "Flag",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "NewConfirmed",
      headerName: "New Confirmed",
      flex: 0.5,
    },
    {
      field: "NewDeaths",
      headerName: "New Deaths",
      flex: 1,
    },
    {
      field: "TotalConfirmed",
      headerName: "Total Confirmed",
      flex: 1,
    },
    {
      field: "TotalDeaths",
      headerName: "Total Deaths",
      flex: 1,
    },
  ];

  return (
    <Box m="20px">
      <Header
        title="Covid Statistics"
        subtitle="Daily updated statistics from a leading university."
      />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .country-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        {isSummaryFetching ? <CircularProgress sx={{color: colors.greenAccent[600]}}/> :
        <DataGrid
          rows={countriesCovidStatistics}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
        />}
      </Box>
    </Box>
  );
};

export default CovidInofrmation;