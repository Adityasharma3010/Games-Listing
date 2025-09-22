import axios from "axios";

const key = "cf85994ac94c47c68be53b773486bd56";
const axiosCreate = axios.create({
  baseURL: "https://api.rawg.io/api",
});

const getGenreList = () => axiosCreate.get("/genres?key=" + key);

// Accept page & pageSize
const getAllGames = (page = 1, pageSize = 20) =>
  axiosCreate.get(`/games?key=${key}&page=${page}&page_size=${pageSize}`);

const getGameListByGenreId = (id, page = 1, pageSize = 20) =>
  axiosCreate.get(
    `/games?key=${key}&genres=${id}&page=${page}&page_size=${pageSize}`
  );

const searchGames = (query) =>
  axiosCreate.get(
    `/games?key=${key}&search=${query}&page_size=40&search_precise=true&exclude_additions=true`
  );

const getGameDetails = (id) => axiosCreate.get(`/games/${id}?key=${key}`);

export default {
  getGenreList,
  getAllGames,
  getGameListByGenreId,
  searchGames,
  getGameDetails,
};
