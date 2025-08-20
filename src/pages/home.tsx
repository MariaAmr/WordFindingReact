import { useAppSelector } from "../app/store";
import {
  Paper,
  Typography,
  Box,
  Chip,
  styled,
  Grid,
  Card,
  CardContent,
  IconButton,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import {
  CheckCircle,
  Error,
  Schedule,
  Delete,
  Search,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../app/store";
import { removeFromHistory } from "../features/api/datamuseApiSlice";

const StyledPaper = styled(Paper)(({ theme }) => ({
  borderRadius: "16px",
  padding: theme.spacing(3),
  overflow: "hidden",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: theme.shadows[4],
  },
}));

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

// Colors for the pie charts
const COLORS = ["#00C49F", "#FFBB28", "#FF8042", "#0088FE", "#9c27b0"];

const Home = () => {
  const { history, requestCount } = useAppSelector((state) => state.datamuse);
  const { token, username } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  if (!token) {
    return (
      <Box p={3}>
        <Typography>Please login to view analytics</Typography>
      </Box>
    );
  }

  // Calculate statistics
  const successfulRequests = history.filter(
    (h) => h.status === "fulfilled"
  ).length;
  const failedRequests = history.filter((h) => h.status === "rejected").length;
  const pendingRequests = history.filter((h) => h.status === "pending").length;
  const successRate =
    requestCount > 0
      ? Math.round((successfulRequests / requestCount) * 100)
      : 0;

  // Data for request status pie chart
const requestStatusData = [
  { name: "Successful", value: successfulRequests, color: "#00C49F" },
  { name: "Pending", value: pendingRequests, color: "#FFBB28" },
  { name: "Failed", value: failedRequests, color: "#FF8042" },
];

  // Data for success rate pie chart
  const successRateData = [
    { name: "Success", value: successRate, color: "#00C49F" },
    { name: "Failure", value: (100 - successRate), color: "#FF8042" },
  ];

  // Calculate requests by type
  const requestsByType = history.reduce((acc, item) => {
    const type = item.searchType || "unknown";
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Data for request type pie chart
  const requestTypeData = Object.entries(requestsByType).map(
    ([name, value], index) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
      color: COLORS[index % COLORS.length],
    })
  );

  // Custom tooltip for pie charts
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <Paper sx={{ p: 1, opacity: 0.9 }}>
          <Typography variant="body2">{`${payload[0].name}: ${payload[0].value}`}</Typography>
        </Paper>
      );
    }
    return null;
  };

  // Custom label for pie charts
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
    name,
  }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize="12"
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Handle search from history item
  const handleSearchFromHistory = (searchType: string, searchTerm: string) => {
    navigate("/dashboard/datamuse-search", {
      state: {
        searchType,
        searchTerm,
        fromHistory: true,
      },
    });
  };

  // Handle delete history item
  const handleDeleteHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the search navigation
    dispatch(removeFromHistory(id));
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Welcome message with username */}
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
        Welcome back, {username}!
      </Typography>

      <Typography
        variant="h6"
        gutterBottom
        sx={{ mb: 3 }}
        className="dark:text-gray-400"
      >
        Here's your search analytics dashboard
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

      {/* First row with 3 charts side by side */}
      <Grid item xs={12}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 3,
            justifyContent: "space-between",
            alignItems: "stretch",
          }}
        >
          {/* Request Status Pie Chart */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <StyledPaper sx={{ height: "100%" }}>
              <Typography variant="h6" gutterBottom align="center">
                Request Status
              </Typography>
              {requestCount > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={requestStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {requestStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      payload={requestStatusData.map((item, index) => ({
                        value: `${item.name}: ${item.value}`,
                        type: "square",
                        color: item.color,
                        id: item.name,
                      }))}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Box
                  sx={{
                    height: 300,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="body2" color="textSecondary">
                    No request data available
                  </Typography>
                </Box>
              )}
            </StyledPaper>
          </Box>

          {/* Success Rate Pie Chart */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <StyledPaper sx={{ height: "100%" }}>
              <Typography variant="h6" gutterBottom align="center">
                Success Rate
              </Typography>
              {requestCount > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={successRateData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {successRateData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      payload={successRateData.map((item, index) => ({
                        value: `${item.name}: ${item.value}%`,
                        type: "square",
                        color: item.color,
                        id: item.name,
                      }))}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Box
                  sx={{
                    height: 300,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="body2" color="textSecondary">
                    No request data available
                  </Typography>
                </Box>
              )}
            </StyledPaper>
          </Box>

          {/* Request Types Pie Chart */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <StyledPaper sx={{ height: "100%" }}>
              <Typography variant="h6" gutterBottom align="center">
                Request Types
              </Typography>
              {requestTypeData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={requestTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {requestTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      payload={requestTypeData.map((item, index) => ({
                        value: `${item.name}: ${item.value}`,
                        type: "square",
                        color: item.color,
                        id: item.name,
                      }))}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Box
                  sx={{
                    height: 300,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="body2" color="textSecondary">
                    No request type data available
                  </Typography>
                </Box>
              )}
            </StyledPaper>
          </Box>
        </Box>
      </Grid>
      {/* Recent Activity Card - Full width on next row */}

      <Grid item xs={12} sx={{ mt: 4 }}>
        <StyledPaper >
          <Typography variant="h6" gutterBottom>
            Recent Activity
          </Typography>
          {history.length > 0 ? (
            <Box
              sx={{
                maxHeight: 400, // Increased height for better scrolling
                overflowY: "auto", // Only vertical scrolling
                overflowX: "hidden", // Hide horizontal scrolling
                // Custom scrollbar styling
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
              }}
            >
              {history.map(
                (
                  item // Removed slice(0, 5) to show all history
                ) => (
                  <Card
                    key={item.id}
                    sx={{
                      mb: 1,
                      backgroundColor: "grey.50",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        backgroundColor: "grey.100",
                        transform: "translateX(4px)",
                      },
                    }}
                    onClick={() =>
                      handleSearchFromHistory(item.searchType, item.searchTerm)
                    }
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
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            flex: 1,
                          }}
                        >
                          <StatusIcon status={item.status} />
                          <Typography variant="body2" sx={{ ml: 1 }}>
                            {item.searchType.toUpperCase()}: {item.searchTerm}
                          </Typography>
                          {item.response && (
                            <Chip
                              label={`${item.response.length} results`}
                              size="small"
                              sx={{ ml: 1, borderRadius: 1 }}
                            />
                          )}
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Typography
                            variant="caption"
                            color="textSecondary"
                            sx={{ mr: 1 }}
                          >
                            {new Date(item.timestamp).toLocaleString()}
                          </Typography>
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
                      </Box>
                    </CardContent>
                  </Card>
                )
              )}
            </Box>
          ) : (
            <Typography variant="body2" color="textSecondary">
              No recent activity
            </Typography>
          )}
        </StyledPaper>
      </Grid>
    </Box>
  );
};

export default Home;
