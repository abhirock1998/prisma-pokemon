import {
  Box,
  CircularProgress,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { ChangeEvent, useImperativeHandle } from "react";
import { type IPokemonFormData } from "../pokemon_form/PokemonForm";
import { trpc } from "src/app/_trpc/client";
import PokemonTableRow from "./Pokemon_Row";
import SearchFilterDialog from "../search_dialog/SearchDialog";
import { IoFilter } from "react-icons/io5";

interface RowData extends IPokemonFormData {
  id: number;
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof RowData;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: "id",
    numeric: false,
    disablePadding: false,
    label: "Id",
  },
  {
    id: "sprite",
    numeric: false,
    disablePadding: false,
    label: "Sprite",
  },
  {
    id: "name",
    numeric: false,
    disablePadding: false,
    label: "Name",
  },
  {
    id: "types",
    numeric: false,
    disablePadding: false,
    label: "Types",
  },
];

const PokemonTable = React.forwardRef((props, ref) => {
  const [currentPage, setCurrentPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [searchedQuery, setSearchedQuery] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const { data, isLoading, refetch } = trpc.getPokemonBasedOnPage.useQuery({
    page: currentPage + 1,
    pageSize: rowsPerPage,
    query: searchedQuery,
  });

  /**
   * This hook is used to expose a function to the parent component
   * to refresh the table
   * @param ref - the ref to the parent component
   */
  useImperativeHandle(
    ref,
    () => ({
      refresh: () => {
        console.log(`Refreshing the table from the parent component`);
        refetch();
      },
    }),
    []
  );

  /**
   * function to toggle the modal open and close
   */
  const toggleModal = (v: boolean) => setOpen(v);

  /**
   * function to handle the change of page in the table
   */
  const handleChangePage = (_: unknown, newPage: number) => {
    setCurrentPage(newPage);
  };

  /**
   * function to handle the change of rows per page in the table
   */
  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    const pageSize = parseInt(event.target.value, 10);
    setRowsPerPage(pageSize);
    setCurrentPage(0);
  };

  /**
   * function to handle the search of pokemon
   * @param query - the query to search for
   * @returns void
   */
  const handleSearch = (query: string) => {
    toggleModal(false);
    setSearchedQuery(query);
    setCurrentPage(0);
  };

  if (isLoading) {
    return (
      <DataLoadingLayout>
        <CircularProgress color="inherit" />
      </DataLoadingLayout>
    );
  }
  if (!data || data.data.length === 0) {
    return (
      <DataLoadingLayout>
        <Typography variant="h6">No data</Typography>
      </DataLoadingLayout>
    );
  }

  return (
    <React.Fragment>
      <TableContainer
        sx={{
          maxHeight: "calc(100% - 55px)",
          height: "100%",
        }}
      >
        <Table stickyHeader aria-labelledby="pokemonTable">
          <TableHead>
            <TableRow>
              {headCells.map((headCell) => (
                <TableCell
                  key={headCell.id}
                  align={headCell.numeric ? "right" : "left"}
                  padding={headCell.disablePadding ? "none" : "normal"}
                >
                  {headCell.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.data.map((row, index) => {
              const labelId = `pokemon-row-${index}`;
              return (
                <PokemonTableRow index={index + 1} key={labelId} row={row} />
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingLeft: "10px",
        }}
      >
        <Tooltip title="Filter list">
          <IconButton onClick={() => toggleModal(true)} sx={{ height: "40px" }}>
            <IoFilter />
          </IconButton>
        </Tooltip>
        <TablePagination
          rowsPerPageOptions={[5, 10]}
          component="div"
          count={data.total}
          rowsPerPage={rowsPerPage}
          page={currentPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
      <SearchFilterDialog
        onSubmit={handleSearch}
        open={open}
        onClose={() => toggleModal(false)}
      />
    </React.Fragment>
  );
});

export default PokemonTable;

const DataLoadingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box
      sx={{
        justifyContent: "center",
        display: "flex",
        alignItems: "center",
        height: "100%",
        width: "100%",
      }}
    >
      {children}
    </Box>
  );
};
