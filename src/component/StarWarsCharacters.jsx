import React, { useState, useEffect } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Container,
  Box,
  Button,
  Modal,
  ThemeProvider,
  createTheme,
  Skeleton,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  IconButton,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#121212",
      paper: "#1f1f1f",
    },
    text: {
      primary: "#ffffff",
      secondary: "#bbbbbb",
    },
    primary: {
      main: "#ff9800",
    },
  },
});

const StarWarsCharacters = ({ SetcurrentPage }) => {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [homeworld, setHomeworld] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCharacters, setFilteredCharacters] = useState([]);
  const [species, setSpecies] = useState("");
  const [homeworldFilter, setHomeworldFilter] = useState("");
  const [speciesList, setSpeciesList] = useState([]);

  useEffect(() => {
    fetchCharacters();
  }, [page]);

  useEffect(() => {
    fetchSpecies();
  }, []);

  useEffect(() => {
    filterCharacters();
  }, [characters, searchQuery, species, homeworldFilter]);

  const fetchCharacters = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://swapi.dev/api/people/?page=${page}`
      );
      const data = await response.json();
      setCharacters(data.results);
    } catch (error) {
      console.error("Error fetching characters:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSpecies = async () => {
    try {
      const response = await fetch(`https://swapi.dev/api/species/`);
      const data = await response.json();
      setSpeciesList(data.results);
    } catch (error) {
      console.error("Error fetching species:", error);
    }
  };

  const fetchHomeworld = async (url) => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      setHomeworld(data);
    } catch (error) {
      console.error("Error fetching homeworld:", error);
    }
  };

  const handleCardClick = (character) => {
    setSelectedCharacter(character);
    fetchHomeworld(character.homeworld);
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setSelectedCharacter(null);
    setHomeworld(null);
  };

  const filterCharacters = () => {
    let filtered = characters;

    if (searchQuery) {
      filtered = filtered.filter((character) =>
        character.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (species) {
      filtered = filtered.filter((character) =>
        character.species.includes(species)
      );
    }

    if (homeworldFilter) {
      filtered = filtered.filter(
        (character) => character.homeworld === homeworldFilter
      );
    }

    setFilteredCharacters(filtered);
  };

  const handleLogout = () => {
    localStorage.clear();
    toast.success("You have been logged out.");
    SetcurrentPage("login");
  };

  const getBackgroundColor = (species) => {
    if (species.length === 0) return "#424242";
    if (species[0] === "https://swapi.dev/api/species/3/") return "#8d99ae";
    if (species[0] === "https://swapi.dev/api/species/4/") return "#ef476f";
    if (species[0] === "https://swapi.dev/api/species/5/") return "#118ab2";
    if (species[0] === "https://swapi.dev/api/species/6/") return "#06d6a0";
    return "#ffd166";
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Container>
        <Box sx={{ p: 4, mb: 4 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={8} md={9}>
              <Box
                display="flex"
                gap={2}
                flexDirection={{ xs: "column", sm: "row" }}
              >
                <TextField
                  label="Search by Name"
                  variant="outlined"
                  fullWidth
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Species</InputLabel>
                  <Select
                    value={species}
                    onChange={(e) => setSpecies(e.target.value)}
                    label="Species"
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {speciesList.map((speciesItem) => (
                      <MenuItem key={speciesItem.url} value={speciesItem.url}>
                        {speciesItem.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth variant="outlined">
                  <InputLabel>Homeworld</InputLabel>
                  <Select
                    value={homeworldFilter}
                    onChange={(e) => setHomeworldFilter(e.target.value)}
                    label="Homeworld"
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value="https://swapi.dev/api/planets/1/">
                      Tatooine
                    </MenuItem>
                    <MenuItem value="https://swapi.dev/api/planets/2/">
                      Alderaan
                    </MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Grid>
            <Grid
              item
              xs={12}
              sm={4}
              md={3}
              display="flex"
              justifyContent="flex-end"
            >
              <Button
                variant="contained"
                color="secondary"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Grid>
          </Grid>
        </Box>
        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: {
              xs: "repeat(1, 1fr)",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
          }}
        >
          {loading
            ? [...Array(12)].map((_, index) => (
                <Card key={index} className="character-card">
                  <Skeleton variant="rectangular" height={140} />
                  <CardContent>
                    <Skeleton variant="text" />
                  </CardContent>
                </Card>
              ))
            : filteredCharacters?.map((char, index) => (
                <Card
                  key={index}
                  onClick={() => handleCardClick(char)}
                  className="character-card"
                  style={{
                    backgroundColor: getBackgroundColor(char.species),
                  }}
                >
                  <CardMedia
                    component="img"
                    height="140"
                    image={`https://picsum.photos/200?random=${index * page}`}
                    alt={char.name}
                  />
                  <CardContent>
                    <Typography
                      variant="h6"
                      component="div"
                      color="textPrimary"
                    >
                      {char.name}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
        </Box>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          gap={2}
          p={4}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <Typography color="textPrimary">{`Page ${page}`}</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setPage((prev) => prev + 1)}
          >
            Next
          </Button>
        </Box>
        <Modal open={openModal} onClose={handleModalClose}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
            }}
          >
            <IconButton
              onClick={handleModalClose}
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                color: "text.primary",
              }}
            >
              <CloseIcon />
            </IconButton>

            {selectedCharacter && (
              <>
                <Typography variant="h5" color="textPrimary" sx={{ mt: 2 }}>
                  {selectedCharacter.name}
                </Typography>
                <Typography color="textSecondary">
                  Species:{" "}
                  {selectedCharacter.species.length > 0
                    ? selectedCharacter.species
                        .map((s) => s.split("/").pop())
                        .join(", ")
                    : "Unknown"}
                </Typography>
                <Typography color="textSecondary">
                  Homeworld: {homeworld?.name}
                </Typography>
              </>
            )}
          </Box>
        </Modal>
      </Container>
    </ThemeProvider>
  );
};

export default StarWarsCharacters;
