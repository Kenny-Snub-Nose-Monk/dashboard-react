import { countryISO } from "../data/countryISO";

export const getCountryISO3 = (countryName, countrySlug) => {

  if(countrySlug.includes("korea-south")){
    return "KOR"
  }else if(countrySlug === "india"){
    return "IND"
  }

  // Using includes, if encounter EX : Venezuela (Bolivarian Republic), Venezuela
  const matchedCountry = countryISO.find( country => country.name.toLowerCase().includes(countryName.toLowerCase()) || country.name.toLowerCase().includes(countrySlug.toLowerCase()))
  return (matchedCountry && matchedCountry.hasOwnProperty("alpha-3")) ? matchedCountry["alpha-3"] : undefined
}