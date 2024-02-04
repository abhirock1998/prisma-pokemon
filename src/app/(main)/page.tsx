"use client";

import React from "react";
import { AppBar, Avatar, Box, Grid, Paper } from "@mui/material";
import PokemonForm from "src/components/pokemon_form/PokemonForm";
import PokemonTable from "src/components/pokemon_table/PokemonTable";

const Page = () => {
  const tableRef = React.useRef<any>(null);

  const handleDone = () => {
    tableRef.current?.refresh();
  };

  return (
    <React.Fragment>
      <AppBar position="sticky" sx={{ mb: 2 }}>
        <Box sx={{ padding: "0.5em", display: "flex", gap: 2 }}>
          <Avatar
            alt="Pokemon"
            src="https://www.freepnglogos.com/uploads/pokeball-png/pokeball-the-poke-basic-league-accepting-challengers-9.png"
          />
          <h1>Pokemon App</h1>
        </Box>
      </AppBar>
      <div className="main-container">
        <Grid container spacing={2} sx={{ height: "100%" }}>
          <Grid item xs={12} md={12} lg={4}>
            <Paper elevation={5} sx={{ padding: "1.5em", height: "100%" }}>
              <PokemonForm onDone={handleDone} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={12} lg={8}>
            <Paper elevation={5} sx={{ height: "100%", overflow: "hidden" }}>
              <PokemonTable ref={tableRef} />
            </Paper>
          </Grid>
        </Grid>
      </div>
    </React.Fragment>
  );
};

export default Page;
