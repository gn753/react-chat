import { CardContent, Grid, Paper, Typography } from "@mui/material";
import React from "react";

export default function ChatHeader() {
  return (
    <Grid container component={Paper} variant="outlined">
      <CardContent>
        <Typography variant="h5"></Typography>
        <Typography variant="body1">방 설명란입니다</Typography>
      </CardContent>
    </Grid>
  );
}
