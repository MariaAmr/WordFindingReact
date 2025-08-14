// pages/DatamuseSearchPage.tsx
import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/store";
import { searchWords } from "../features/api/datamuseApiSlice";
import Loader from "../Loader/Loader";
import { useNavigate } from "react-router-dom";
import {
  Button,
  TextField,
  Select,
  MenuItem,
  Paper,
  Typography,
  Chip,
  Box,
} from "@mui/material";

const DatamuseSearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("ml");
  const dispatch = useAppDispatch();
  const { results, loading, error } = useAppSelector((state) => state.datamuse);
  const navigate = useNavigate();
  const { token } = useAppSelector((state) => state.auth);

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    dispatch(searchWords({ [searchType]: searchTerm }));
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
              {loading ? <Loader size={20} /> : "Search"}
            </Button>
          </Box>

          {error && (
            <Chip
              label={`Error: ${error}`}
              color="error"
              variant="outlined"
              sx={{ mb: 2 }}
            />
          )}
        </form>

        <Typography variant="h6" gutterBottom>
          Results
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <Loader />
          </Box>
        ) : results.length > 0 ? (
          <Box
            display="grid"
            gridTemplateColumns="repeat(auto-fill, minmax(200px, 1fr))"
            gap={2}
          >
            {results.map((word) => (
              <Paper key={word.word} sx={{ p: 2 }}>
                <Typography fontWeight="bold">{word.word}</Typography>
                <Typography variant="body2">Score: {word.score}</Typography>
                {word.tags && (
                  <Typography variant="caption" color="text.secondary">
                    {word.tags.join(", ")}
                  </Typography>
                )}
              </Paper>
            ))}
          </Box>
        ) : (
          <Typography color="text.secondary" textAlign="center" py={2}>
            No results found
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
