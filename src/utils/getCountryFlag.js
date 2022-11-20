import { countryFlags } from "../data/countryFlags"

export const getCountryFlag = (countryIS2) => {
  return countryFlags[countryIS2]?.emoji || "No Flag"
}