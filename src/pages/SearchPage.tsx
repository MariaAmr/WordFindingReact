// pages/DatamuseSearchPage.tsx
import React, { useState, useEffect } from "react";
import { store, useAppDispatch, useAppSelector } from "../app/store";
import { searchWords } from "../features/api/datamuseApiSlice";
import { useNavigate } from "react-router-dom";
import {
  Button,
  TextField,
  Select,
  MenuItem,
  Paper,
  Typography,
  Box,
} from "@mui/material";
import Loader from "../Loader/Loader";

const DatamuseSearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("ml");
  const dispatch = useAppDispatch();
  const { results, loading, error } = useAppSelector((state) => state.datamuse);
  const navigate = useNavigate();
  const { token } = useAppSelector((state) => state.auth);

  // Debugging
  useEffect(() => {
    console.log("Current results:", results);
  }, [results]);

 const handleSearch = async (e: React.FormEvent) => {
   e.preventDefault();
   if (!searchTerm.trim()) return;

   console.log("Searching for:", { [searchType]: searchTerm });
   try {
     const result = await dispatch(searchWords({ [searchType]: searchTerm }));
     console.log("Dispatch result:", result);
     if (searchWords.fulfilled.match(result)) {
       console.log("Search successful - payload:", result.payload);
       console.log("Current Redux state:", store.getState().datamuse);
     } else if (searchWords.rejected.match(result)) {
       console.error("Search rejected:", result.error);
     }
   } catch (err) {
     console.error("Search failed:", err);
   }
 };

  if (!token) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Loader />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Word Search
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <form onSubmit={handleSearch}>
          <Box display="flex" gap={2} alignItems="center" mb={2}>
            <Select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              size="small"
              sx={{ minWidth: 120 }}
            >
              <MenuItem value="ml">Means like</MenuItem>
              <MenuItem value="sl">Sounds like</MenuItem>
              <MenuItem value="sp">Spelled like</MenuItem>
              <MenuItem value="rel_jjb">Adjectives for</MenuItem>
              <MenuItem value="rel_nry">Nouns for</MenuItem>
            </Select>

            <TextField
              fullWidth
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Enter a word..."
            />

            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{ minWidth: 100 }}
            >
              {loading ? <Loader /> : "Search"}
            </Button>
          </Box>

          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              Error: {error}
            </Typography>
          )}
        </form>

        <Typography variant="h6" gutterBottom>
          Results
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <Loader />
          </Box>
        ) : error ? (
          <Typography color="error">Search failed: {error}</Typography>
        ) : results.length > 0 ? (
          <Box
            display="grid"
            gridTemplateColumns="repeat(auto-fill, minmax(200px, 1fr))"
            gap={2}
            sx={{ maxHeight: "60vh", overflow: "auto" }}
          >
            {results.map((word, index) => (
              <Paper key={`${word.word}-${index}`} sx={{ p: 2 }}>
                <Typography fontWeight="bold">{word.word}</Typography>
                <Typography variant="body2">Score: {word.score}</Typography>
                {word.tags && (
                  <Typography variant="caption" color="text.secondary">
                    Tags: {word.tags.join(", ")}
                  </Typography>
                )}
              </Paper>
            ))}
          </Box>
        ) : (
          <Typography color="text.secondary" textAlign="center" py={2}>
            {searchTerm
              ? `No results found for "${searchTerm}"`
              : "Enter a search term above"}
          </Typography>
        )}
      </Paper>

      <Button
        variant="outlined"
        onClick={() => navigate("/datamuse-history")}
        fullWidth
      >
        View Search History
      </Button>
    </Box>
  );
};

export default DatamuseSearchPage;
