import Box from "@mui/material/Box";
import { trpc } from "src/app/_trpc/client";
import TextField from "@mui/material/TextField";
import React, { useState, ChangeEvent } from "react";
import { Alert, Button, Typography } from "@mui/material";

export interface IPokemonFormData {
  name: string;
  types: string;
  sprite: string;
}

type MutateError = {
  code: string;
  message: string;
};

interface PokemonFormProps {
  onDone: () => void;
}

const PokemonForm = ({ onDone }: PokemonFormProps) => {
  const [isDone, setIsDone] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const [errors, setErrors] = useState<MutateError[]>([]);
  const { mutateAsync, isLoading, error } = trpc.createPokemon.useMutation();

  const [pokemonData, setPokemonData] = useState<IPokemonFormData>({
    name: "",
    types: "",
    sprite: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPokemonData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const clearForm = () => {
    setPokemonData({
      name: "",
      types: "",
      sprite: "",
    });
  };

  const autoHideAlert = (ts: number) => {
    setTimeout(() => {
      setIsDone(false);
      setIsFailed(false);
    }, ts);
  };

  const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload = { ...pokemonData, types: pokemonData.types?.split(",") };
    mutateAsync(payload, {
      onSuccess() {
        clearForm();
        setIsDone(true);
        autoHideAlert(3000);
        onDone();
      },
      onError(error) {
        setErrors(JSON.parse(error.message) || []);
        clearForm();
        setIsFailed(true);
        autoHideAlert(10000);
      },
    });
  };

  return (
    <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit}>
      <div style={{ marginBottom: "20px" }}>
        <Typography component="h1" variant="body1" gutterBottom>
          Create a new Pokemon character
        </Typography>
        <TextField
          required
          id="outlined-required"
          label="Enter Pokemon Name"
          name="name"
          value={pokemonData.name}
          onChange={handleChange}
          fullWidth
          margin="dense"
        />
        <TextField
          required
          id="outlined-required"
          label="Enter Pokemon Type"
          name="types"
          value={pokemonData.types}
          onChange={handleChange}
          fullWidth
          margin="dense"
          helperText="Enter multiple types separated by comma"
        />
        <TextField
          required
          id="outlined-required"
          label="Enter Pokemon Image URL"
          name="sprite"
          value={pokemonData.sprite}
          onChange={handleChange}
          fullWidth
          margin="dense"
          helperText="Enter a valid image URL must be https://... or http://..."
        />
        <Button
          fullWidth
          disabled={isLoading}
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: "10px", padding: "10px" }}
        >
          Submit
        </Button>
      </div>
      {isFailed &&
        errors.map((error, i) => (
          <Alert severity="error" key={`${error.code}-${i}`}>
            - {error.message}
          </Alert>
        ))}
      <div style={{ height: "10px" }} />
      {isDone && <Alert severity="success">Pokemon created successfully</Alert>}
    </Box>
  );
};

export default PokemonForm;
