import { useAppSelector, useAppDispatch } from "../app/store";
import {
  // Paper,
  Typography,
  Box,
  ListItemText,
  Chip,
  // styled,
  // Button,
  IconButton,
  Card,
  CardContent,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Error, Schedule, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { removeFromHistory } from "../features/api/datamuseApiSlice";

// const StyledPaper = styled(Paper)(({ theme }) => ({
//   borderRadius: "16px",
//   overflow: "hidden",
//   transition: "all 0.3s ease",
//   "&:hover": {
//     transform: "translateY(-2px)",
//     boxShadow: theme.shadows[4],
//   },
// }));

const StatusIcon = ({ status }: { status: string }) => {
  switch (status) {
    case "fulfilled":
      return <CheckCircle color="success" fontSize="small" />;
    case "rejected":
      return <Error color="error" fontSize="small" />;
    default:
      return <Schedule color="warning" fontSize="small" />;
  }
};

const DatamuseHistoryPage = () => {
  const { history, requestCount } = useAppSelector((state) => state.datamuse);
  const { token } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  if (!token) {
    return (
      <Box p={3}>
        <Typography>Please login to view history</Typography>
      </Box>
    );
  }

  // Handle search from history item
 const handleSearchFromHistory = (item: ApiRequest) => {
   navigate("/dashboard/datamuse-search", {
     state: {
       searchType: item.searchType,
       searchTerm: item.searchTerm,
       fromHistory: true,
       existingResults: item.response || [], // Pass the existing results
       shouldSearch: false, // Don't make new request
     },
   });
 };

  // Handle delete history item
  const handleDeleteHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the search navigation
    dispatch(removeFromHistory(id));
  };

  const successfulRequests = history.filter(
    (h) => h.status === "fulfilled"
  ).length;
  const failedRequests = history.filter((h) => h.status === "rejected").length;
  const successRate =
    requestCount > 0
      ? Math.round((successfulRequests / requestCount) * 100)
      : 0;

  return (
    <Box sx={{ p: 3 }}>
      {/* Title with animation matching search page */}
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontWeight: 600 }}
        className="dark:text-gray-200"
        component={motion.div}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        Search History Analytics
      </Typography>

      {/* Stats chips with animation */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          mb: 3,
          flexWrap: "wrap",
        }}
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, staggerChildren: 0.1 }}
      >
        {[
          { label: `Total Requests: ${requestCount}`, color: "primary" },
          {
            label: `Successful: ${successfulRequests}`,
            color: "success",
            variant: "outlined",
          },
          {
            label: `Failed: ${failedRequests}`,
            color: "error",
            variant: "outlined",
          },
          {
            label: `Success Rate: ${successRate}%`,
            color:
              successRate > 80
                ? "success"
                : successRate > 50
                ? "warning"
                : "error",
          },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Chip
              label={stat.label}
              color={stat.color}
              variant={stat.variant as any}
              sx={{
                borderRadius: "12px",
                fontSize: index === 0 ? "1rem" : "0.875rem",
                padding: index === 0 ? "8px 12px" : "6px 10px",
                "& .MuiChip-label": { padding: "0 8px" },
              }}
            />
          </motion.div>
        ))}
      </Box>

      {history.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="body1" className="dark:text-gray-200">
            No search history yet
          </Typography>
        </motion.div>
      ) : (
        <Box
          sx={{
            maxHeight: "60vh",
            overflowY: "auto",
            overflowX: "hidden",

            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "grey.100",
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "grey.400",
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              backgroundColor: "grey.600",
            },
            mb: 2,
          }}
        >
          <AnimatePresence>
            {history.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.05,
                }}
                layout
                whileHover={{ scale: 1.01 }}
              >
                <Card
                  sx={{
                    mb: 2,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: "grey.50",
                      transform: "translateX(4px)",
                    },
                  }}
                  onClick={() => handleSearchFromHistory(item)}
                >
                  <CardContent
                    sx={{
                      py: 1,
                      "&:last-child": { pb: 1 },
                      position: "relative",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", flex: 1 }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            mr: 2,
                          }}
                          component={motion.div}
                          whileHover={{ scale: 1.1 }}
                        >
                          <StatusIcon status={item.status} />
                        </Box>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle1" fontWeight={500}>
                              {item.searchType.toUpperCase()}: {item.searchTerm}
                            </Typography>
                          }
                          secondary={
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.2 }}
                            >
                              <Box
                                component="span"
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                  mt: 0.5,
                                }}
                              >
                                <Typography
                                  component="span"
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  {new Date(item.timestamp).toLocaleString()}
                                </Typography>
                                {item.response && (
                                  <motion.div whileHover={{ scale: 1.05 }}>
                                    <Chip
                                      label={`${item.response.length} results`}
                                      size="small"
                                      sx={{
                                        borderRadius: "8px",
                                        fontSize: "0.75rem",
                                      }}
                                    />
                                  </motion.div>
                                )}
                              </Box>
                            </motion.div>
                          }
                          sx={{ my: 0 }}
                        />
                      </Box>
                      <IconButton
                        size="small"
                        onClick={(e) => handleDeleteHistoryItem(item.id, e)}
                        sx={{
                          color: "error.main",
                          "&:hover": {
                            backgroundColor: "error.light",
                            color: "white",
                          },
                        }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </Box>
      )}
      {/* <Button
        variant="outlined"
        onClick={() => navigate("/dashboard/datamuse-search")}
        fullWidth
        sx={{ borderRadius: 2 }}
      >
        View Full Word Search
      </Button> */}
    </Box>
  );
};
export default DatamuseHistoryPage;
