import React, { useState, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../app/store";
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
  Collapse,
  Chip,
  IconButton,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { Search, History, Close } from "@mui/icons-material";

const DatamuseSearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("ml");
  const [showHistoryBox, setShowHistoryBox] = useState(false);
  const [recentSearches, setRecentSearches] = useState<
    Array<{ type: string; term: string }>
  >([]);
  const dispatch = useAppDispatch();
  const { results, loading, error } = useAppSelector((state) => state.datamuse);
  const navigate = useNavigate();
  const { token } = useAppSelector((state) => state.auth);
  const searchTimeout = useRef<NodeJS.Timeout>();

  // Real-time search with debounce
  useEffect(() => {
    if (searchTerm.trim() === "") return;

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      handleSearch();
    }, 500);

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [searchTerm, searchType]);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!searchTerm.trim()) return;

    try {
      const result = await dispatch(searchWords({ [searchType]: searchTerm }));
      if (searchWords.fulfilled.match(result)) {
        // Add to recent searches
        setRecentSearches((prev) => [
          { type: searchType, term: searchTerm },
          ...prev.slice(0, 4),
        ]);
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
      ></Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h4"
        gutterBottom
        component={motion.div}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="dark:text-gray-200"
      >
        Word Search
      </Typography>

      <Paper
        sx={{ p: 3, mb: 3, borderRadius: 3 }}
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="dark:bg-gray-800"
      >
        <form onSubmit={handleSearch}>
          <Box
            display="flex"
            gap={2}
            alignItems="center"
            mb={2}
            sx={{
              flexDirection: { xs: "column", sm: "row" }, // Stack vertically on mobile
            }}
          >
            <Box
              display="flex"
              gap={2}
              width="100%"
              sx={{
                flexDirection: { xs: "column", sm: "row" }, // Stack vertically on mobile
              }}
            >
              <Select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                size="small"
                sx={{
                  minWidth: 120,
                  borderRadius: 2,
                  width: { xs: "100%", sm: "auto" }, // Full width on mobile
                }}
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
                InputProps={{
                  startAdornment: <Search color="action" sx={{ mr: 1 }} />,
                  sx: {
                    borderRadius: 2,
                    "& input": {
                      cursor: "pointer",
                    },
                  },
                }}
                onClick={handleSearch}
                className="rounded-lg"
              />
            </Box>

            <Box
              display="flex"
              gap={2}
              width={{ xs: "100%", sm: "auto" }} 
              sx={{
                flexDirection: { xs: "row", sm: "row" },
              }}
            >
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{
                  minWidth: { xs: "50%", sm: 100 }, // Half width on mobile
                  borderRadius: 2,
                  height: "40px",
                  flexGrow: 1,
                }}
                startIcon={<Search />}
              >
                <Box
                  component="span"
                  sx={{ display: { xs: "none", sm: "inline" } }}
                >
                  Search
                </Box>
              </Button>

              <IconButton
                onClick={() => setShowHistoryBox(!showHistoryBox)}
                sx={{
                  borderRadius: 2,
                  bgcolor: showHistoryBox ? "action.selected" : "transparent",
                  flexShrink: 0,
                }}
              >
                <History color={showHistoryBox ? "primary" : "action"} />
              </IconButton>
            </Box>
          </Box>

          <Collapse in={showHistoryBox}>
            <Paper
              sx={{
                p: 2,
                mb: 2,
                borderRadius: 2,
                bgcolor: "background.default",
              }}
            >
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="subtitle2" component="div">
                  Recent Searches
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => setShowHistoryBox(false)}
                >
                  <Close fontSize="small" />
                </IconButton>
              </Box>
              {recentSearches.length > 0 ? (
                <Box sx={{ mt: 1, display: "flex", gap: 1, flexWrap: "wrap" }}>
                  {recentSearches.map((search, i) => (
                    <Chip
                      key={i}
                      label={`${search.type}: ${search.term}`}
                      onClick={() => {
                        setSearchType(search.type);
                        setSearchTerm(search.term);
                      }}
                      sx={{ borderRadius: 1 }}
                    />
                  ))}
                </Box>
              ) : (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  component="div"
                  sx={{ mt: 1 }}
                >
                  No recent searches
                </Typography>
              )}
            </Paper>
          </Collapse>

          {error && (
            <Typography color="error" component="div" sx={{ mb: 2 }}>
              Error: {error}
            </Typography>
          )}
        </form>

        <Typography variant="h6" gutterBottom component="div">
          Results
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" py={4}></Box>
        ) : error ? (
          <Typography color="error" component="div">
            Search failed: {error}
          </Typography>
        ) : results && results.length > 0 ? (
          <Box
            display="grid"
            gridTemplateColumns="repeat(auto-fill, minmax(200px, 1fr))"
            gap={2}
            sx={{ maxHeight: "60vh", overflow: "auto" }}
          >
            <AnimatePresence>
              {results.map((word, index) => (
                <motion.div
                  key={`${word.word}-${index}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Paper
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      transition: "transform 0.2s",
                      "&:hover": {
                        transform: "translateY(-2px)",
                      },
                    }}
                    className=" dark:bg-gray-400 dark:text-gray-900"
                  >
                    <Typography component="div" fontWeight="bold">
                      {word.word}
                    </Typography>
                    <Typography component="div" variant="body2">
                      Score: {word.score}
                    </Typography>
                    {word.tags && (
                      <Typography
                        component="div"
                        variant="caption"
                        color="text.secondary"
                      >
                        Tags: {word.tags.join(", ")}
                      </Typography>
                    )}
                  </Paper>
                </motion.div>
              ))}
            </AnimatePresence>
          </Box>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Typography
              color="text.secondary"
              textAlign="center"
              py={2}
              component="div"
            >
              {searchTerm
                ? `No results found for "${searchTerm}"`
                : "Enter a search term above"}
            </Typography>
          </motion.div>
        )}
      </Paper>

      <Button
        variant="outlined"
        onClick={() => navigate("/dashboard/datamuse-history")}
        fullWidth
        sx={{ borderRadius: 2 }}
      >
        View Full Search History
      </Button>
    </Box>
  );
};

export default DatamuseSearchPage;
