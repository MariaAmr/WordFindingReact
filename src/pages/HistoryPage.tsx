import React from "react";
import { useAppDispatch, useAppSelector } from "../app/store";
import { clearHistory } from "../features/api/datamuseApiSlice";
import { useNavigate } from "react-router-dom";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { Button, Paper, Typography, Chip, Box } from "@mui/material";
import Loader from "../Loader/Loader";

const HistoryPage = () => {
  const dispatch = useAppDispatch();
  const { history } = useAppSelector((state) => state.datamuse);
  const navigate = useNavigate();
  const { token } = useAppSelector((state) => state.auth);

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const columns: GridColDef[] = [
    {
      field: "timestamp",
      headerName: "Time",
      width: 150,
      valueFormatter: (params) => new Date(params.value).toLocaleTimeString(),
    },
    {
      field: "url",
      headerName: "Search URL",
      width: 300,
      renderCell: (params) => (
        <Box sx={{ overflow: "hidden", textOverflow: "ellipsis" }}>
          {params.value}
        </Box>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={
            params.value === "fulfilled"
              ? "success"
              : params.value === "rejected"
              ? "error"
              : "warning"
          }
          size="small"
        />
      ),
    },
    {
      field: "resultsCount",
      headerName: "Results",
      width: 100,
      valueGetter: (params) => {
        // Safely get the response length or default to 0
        return params.row.response?.length || 0;
      },
    },
  ];

  // Transform history data to ensure all required fields exist
  const processedHistory = history.map((item) => ({
    ...item,
    response: item.response || [], // Ensure response exists
    id: item.id || Date.now().toString(), // Ensure id exists
  }));

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
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4">Search History</Typography>
        <Box>
          <Button
            variant="contained"
            onClick={() => navigate("/dashboard/datamuse-search")}
            sx={{ mr: 2 }}
          >
            Back to Search
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => dispatch(clearHistory())}
            disabled={history.length === 0}
          >
            Clear History
          </Button>
        </Box>
      </Box>

      <Paper sx={{ p: 2, height: 400 }}>
        <DataGrid
          rows={processedHistory} // Use processed history
          columns={columns}
          getRowId={(row) => row.id}
          pageSizeOptions={[5, 10, 20]}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10 },
            },
          }}
          sx={{
            "& .MuiDataGrid-cell": {
              py: 1,
            },
          }}
        />
      </Paper>
    </Box>
  );
};

export default HistoryPage;
