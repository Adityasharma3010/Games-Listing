import axios from "axios";

const key = "cf85994ac94c47c68be53b773486bd56";
const axiosCreate = axios.create({
  baseURL: "https://api.rawg.io/api",
});

const getGenreList = () => axiosCreate.get("/genres?key=" + key);
const getAllGames = () => axiosCreate.get("/games?key=" + key);
const getGameListByGenreId = (id) =>
  axiosCreate.get(`/games?key=${key}&genres=${id}`);

export default {
  getGenreList,
  getAllGames,
  getGameListByGenreId,
};
