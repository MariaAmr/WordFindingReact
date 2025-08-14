// pages/DatamuseHistoryPage.tsx
import React from "react";
import { useAppSelector } from "../app/store";
import {
  Paper,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

const DatamuseHistoryPage = () => {
  const { history, requestCount } = useAppSelector((state) => state.datamuse);
  const { token } = useAppSelector((state) => state.auth);

  if (!token) {
    return (
      <Box p={3}>
        <Typography>Please login to view history</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Search History
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Total Requests: {requestCount}
      </Typography>

      {history.length === 0 ? (
        <Typography>No search history yet</Typography>
      ) : (
        <List>
          {history.map((item) => (
            <Paper key={item.id} sx={{ mb: 2, p: 2 }}>
              <ListItem>
                <ListItemText
                  primary={`${item.searchType}: ${item.searchTerm}`}
                  secondary={
                    <>
                      <Typography component="span" display="block">
                        Status: {item.status}
                      </Typography>
                      <Typography component="span" display="block">
                        Date: {new Date(item.timestamp).toLocaleString()}
                      </Typography>
                      {item.response && (
                        <Typography component="span" display="block">
                          Results: {item.response.length}
                        </Typography>
                      )}
                    </>
                  }
                />
              </ListItem>
            </Paper>
          ))}
        </List>
      )}
    </Box>
  );
};

export default DatamuseHistoryPage;
