import { Avatar, Chip, Stack, TableCell, TableRow } from "@mui/material";
import React from "react";
import { isHttp } from "src/utils";

interface PokemonRowProps {
  row: {
    id: number;
    name: string;
    types: string[];
    sprite: string | null;
  };
  index: number;
}

const PokemonRow: React.FC<PokemonRowProps> = ({ row, index }) => {
  const renderPokemonAvatar = (avatar: string, name: string) => {
    const is_valid = isHttp(avatar);
    return is_valid ? (
      <Avatar alt={name} src={avatar} />
    ) : (
      <Avatar>{name.charAt(0)}</Avatar>
    );
  };

  return (
    <TableRow
      hover
      role="checkbox"
      tabIndex={-1}
      key={row.id}
      sx={{ cursor: "pointer" }}
    >
      <TableCell
        align="left"
        scope="row"
        // padding="none"
      >
        {index}
      </TableCell>
      <TableCell align="right">
        {renderPokemonAvatar(row.sprite || "", row.name)}
      </TableCell>
      <TableCell sx={{ textTransform: "capitalize" }} align="left">
        {row.name}
      </TableCell>
      <TableCell align="right">
        <Stack
          direction="row"
          spacing={1}
          sx={{ maxWidth: "50%", overflow: "auto" }}
        >
          {row.types.map((type, i) => {
            return (
              <Chip
                size="small"
                key={`${type};${i}`}
                label={type}
                variant="outlined"
              />
            );
          })}
        </Stack>
      </TableCell>
    </TableRow>
  );
};

export default PokemonRow;
