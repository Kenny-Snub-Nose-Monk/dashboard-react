import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const Now = new Date().toJSON()

export const covidApi = createApi({
  reducerPath: 'covidApi',
  baseQuery: fetchBaseQuery({baseUrl: 'https://api.covid19api.com'}),
  endpoints: (builder) =>({

    // GET SUMMARY
    getSummary: builder.query({
      query: () => "/summary",
    }),

    // GET Countries
    getCountries: builder.query({
      query: () => "/countries",
    }),

    //By Country All Status
    // https://api.covid19api.com/country/south-africa?from=2020-03-01T00:00:00Z&to=2022-10-01T00:00:00Z
    getStatusByCountries: builder.query({
      query: (countryName, startDate="2020-03-01T00:00:00Z", endDate=Now) => {

        if(!countryName && startDate && endDate){
          // https://api.covid19api.com/world?from=2020-03-01T00:00:00Z&to=2020-04-01T00:00:00Z
          return `/world?from=${startDate}&to=${endDate}`
        }else if(countryName && (!startDate || !endDate)){
          // https://api.covid19api.com/total/country/south-africa
          return `total/country/${countryName}`
        }
        
        return `/country/${countryName}?from=${startDate}&to=${endDate}`
      },
    }),

  })
})


export const {
  useGetSummaryQuery,
  useGetCountriesQuery,
  useGetStatusByCountriesQuery
} = covidApi;