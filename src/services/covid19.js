import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

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
      query: () => "/country",
    }),

    //Premium SUMMARY
    getPremiumSummary: builder.query({
      query: () => "/summary",
    }),
  })
})


export const {
  useGetSummaryQuery,
  useGetCountriesQuery,
  useGetPremiumSummaryQuery,
} = covidApi;