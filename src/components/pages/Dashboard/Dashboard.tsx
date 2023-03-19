import * as React from "react";
import { DataGrid, GridColDef, GridRenderCellParams, GridToolbarExport, GridValueGetterParams } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { imageUrl } from "../../../Constants";
import * as stockActions from "../../../actions/stock.action";
import { useDispatch, useSelector } from "react-redux";
import { RootReducers } from "../../../reducers";
import {
  Typography,
  Stack,
  IconButton,
  Box,
  TextField,
  Fab,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
} from "@mui/material";
import NumberFormat from "react-number-format";
import Moment from "react-moment";
import { Add, AddShoppingCart, AssignmentReturn, Clear, NewReleases, Search, Star, GetApp } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useDebounce, useDebounceCallback } from "@react-hook/debounce";
import { Product } from "../../../types/product.type";
import StockCard from "../../layouts/StockCard";
import { useAppDispatch } from "../../..";
import { useState } from "react";
import jsPDF from "jspdf";
import 'jspdf-autotable';
import Papa from 'papaparse';



interface QuickSearchToolbarProps {
  clearSearch: () => void;
  onChange: () => void;
  value: string;
}

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

function QuickSearchToolbar(props: QuickSearchToolbarProps) {
  return (
    <Box
      sx={{
        p: 0.5,
        pb: 0,
      }}
    >
      <TextField
        variant="standard"
        value={props.value}
        onChange={props.onChange}
        placeholder="Search…"
        InputProps={{
          startAdornment: <Search fontSize="small" />,
          endAdornment: (
            <IconButton
              title="Clear"
              aria-label="Clear"
              size="small"
              style={{ visibility: props.value ? "visible" : "hidden" }}
              onClick={props.clearSearch}
            >
              <Clear fontSize="small" />
            </IconButton>
          ),
        }}
        sx={{
          width: {
            xs: 1,
            sm: "auto",
          },
          m: (theme) => theme.spacing(1, 0.5, 1.5),
          "& .MuiSvgIcon-root": {
            mr: 0.5,
          },
          "& .MuiInput-underline:before": {
            borderBottom: 1,
            borderColor: "divider",
          },
        }}
      />
      <GridToolbarExport />
      <Fab
        color="primary"
        aria-label="add"
        component={Link}
        to="/stock/sale"
        sx={{
          position: "absolute",
          top: 10,
          right: 10,
        }}
      >
        <Add />
      </Fab>
    </Box>
  );
}

export default function StockPage() {
  const stockReducer = useSelector((state: RootReducers) => state.stockReducer);
  const dispatch = useAppDispatch();
  const [keywordSearch, setKeywordSearch] = useDebounce<string>("", 1000);
  const [keywordSearchNoDelay, setKeywordSearchNoDelay] = React.useState<string>("");
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
  const [openDialog, setOpenDialog] = React.useState<boolean>(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    dispatch(stockActions.loadSaleByKeyword(keywordSearch));
  }, [keywordSearch]);

  React.useEffect(() => {
    dispatch(stockActions.loadSale());
    calculateTotal();
  }, []);

  const stockColumns: GridColDef[] = [
    {
      headerName: "ID",
      field: "id",
      width: 50,
    },
    {
      headerName: "IMG",
      field: "image",
      width: 80,
      renderCell: ({ value }: GridRenderCellParams<string>) => (
        <img
          src={`${imageUrl}/images/${value}?dummy=${Math.random()}`}
          style={{ width: 70, height: 70, borderRadius: "5%" }}
        />
      ),
    },
    {
      headerName: "NAME",
      field: "name",
      width: 400,
    },
    {
      headerName: "AMOUNT",
      width: 120,
      field: "amount",
      renderCell: ({ value }: GridRenderCellParams<string>) => (
        <Typography variant="body1">
          <NumberFormat
            value={value}
            displayType={"text"}
            thousandSeparator={true}
            decimalScale={0}
            fixedDecimalScale={true}
          />
        </Typography>
      ),
    },
    {
      headerName: "PRICE",
      field: "price",
      width: 120,
      renderCell: ({ value }: GridRenderCellParams<string>) => (
        <Typography variant="body1">
          <NumberFormat
            value={value}
            displayType={"text"}
            thousandSeparator={true}
            decimalScale={2}
            fixedDecimalScale={true}
            prefix={"฿"}
          />
        </Typography>
      ),
    },
    {
      headerName: "TIME",
      field: "createdAt",
      width: 220,
      renderCell: ({ value }: GridRenderCellParams<string>) => (
        <Typography variant="body1">
          <Moment format="DD/MM/YYYY HH:mm">{value}</Moment>
        </Typography>
      ),
    },
    {
      headerName: "ACTION",
      field: ".",
      width: 120,
      renderCell: ({ row }: GridRenderCellParams<string>) => (
        <Stack direction="row">

          <IconButton
            aria-label="delete"
            size="large"
            onClick={() => {
              setSelectedProduct(row);
              setOpenDialog(true);
            }}
          >
            <DeleteIcon fontSize="inherit" />
          </IconButton>
        </Stack>
      ),
    },
  ];

  const handleDeleteConfirm = () => {
    dispatch(stockActions.deleteSale(String(selectedProduct!.id!)));
    setOpenDialog(false);
  };

  const showDialog = () => {
    if (selectedProduct === null) {
      return "";
    }

    return (
      <Dialog
        open={openDialog}
        keepMounted
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">
          <img
            src={`${imageUrl}/images/${selectedProduct.image}?dummy=${Math.random()}`}
            style={{ width: 100, borderRadius: "5%" }}
          />
          <br />
          Confirm to delete the product? : {selectedProduct.name}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">You cannot restore deleted product.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="info">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const [totalAmount, setTotalAmount] = useState<number>(0);


  const calculateTotal = () => {
    let result = 0;

    stockReducer.result.forEach((element: { amount: number }) => {
      result += element.amount;
    });

    setTotalAmount(result);
  };

  function exportCSV(columns: any, rows: any) {
    const headers = columns.map((column: any) => column.headerName);
    const data = rows.map((row: any) => columns.map((column: any) => row[column.field] || ''));
    data.unshift(headers);

    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'data_export.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const ExportButtons = ({ columns, rows }: any) => (
    <div>
      <IconButton onClick={() => exportCSV(columns, rows)}>
        <GetApp />
      </IconButton>
      {/* <IconButton onClick={() => exportPDF(columns, rows)}>
        <GetApp />
      </IconButton> */}
    </div>
  );

  return (
    <Box>
      {/* Summary Icons */}
      <Grid container style={{ marginBottom: 16 }} spacing={7}>
        <Grid item lg={3} md={6}>
          <StockCard icon={AddShoppingCart} title="TOTAL" subtitle={totalAmount ? totalAmount.toString() : ''} color="#00a65a" />
        </Grid>

        <Grid item lg={3} md={6}>
          <StockCard icon={NewReleases} title="EMPTY" subtitle="9 PCS." color="#f39c12" />
        </Grid>

        <Grid item lg={3} md={6}>
          <StockCard icon={AssignmentReturn} title="RETURN" subtitle="1 PCS." color="#dd4b39" />
        </Grid>

        <Grid item lg={3} md={6}>
          <StockCard icon={Star} title="LOSS" subtitle="5 PCS." color="#00c0ef" />
        </Grid>
      </Grid>

      {/* <DataGrid
        components={{ Toolbar: QuickSearchToolbar }}
        componentsProps={{
          toolbar: {
            value: keywordSearchNoDelay,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
              setKeywordSearch(e.target.value);
              setKeywordSearchNoDelay(e.target.value);
            },
            clearSearch: () => {
              setKeywordSearch("");
              setKeywordSearchNoDelay("");
            },
          },
        }}
        sx={{ backgroundColor: "white", height: "70vh" }}
        rows={stockReducer.result}
        columns={stockColumns}
        pageSize={15}
        rowsPerPageOptions={[15]}
      /> */}

      <DataGrid
        components={{ Toolbar: QuickSearchToolbar }}
        componentsProps={{
          toolbar: {
            value: keywordSearchNoDelay,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
              setKeywordSearch(e.target.value);
              setKeywordSearchNoDelay(e.target.value);
            },
            clearSearch: () => {
              setKeywordSearch('');
              setKeywordSearchNoDelay('');
            },

            exportButtons: <ExportButtons columns={stockColumns} rows={stockReducer.result} />,
          },
        }}
        sx={{ backgroundColor: 'white', height: '70vh' }}
        rows={stockReducer.result}
        columns={stockColumns}
        pageSize={15}
        rowsPerPageOptions={[15]}
      />

      {showDialog()}
    </Box>
  );
}
