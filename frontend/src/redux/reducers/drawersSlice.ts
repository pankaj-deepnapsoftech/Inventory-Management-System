import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // Product Drawer
  isAddProductDrawerOpened: false,
  isUpdateProductDrawerOpened: false,
  isProductDetailsDrawerOpened: false,

  // Store Drawer
  isAddStoreDrawerOpened: false,
  isUpdateStoreDrawerOpened: false,
  isStoreDetailsDrawerOpened: false,

  // Buyer Drawer
  isAddBuyerDrawerOpened: false,
  isUpdateBuyerDrawerOpened: false,
  isBuyerDetailsDrawerOpened: false,

  // Seller Drawer
  isAddSellerDrawerOpened: false,
  isUpdateSellerDrawerOpened: false,
  isSellerDetailsDrawerOpened: false,

  // BOM Drawer
  isAddBomDrawerOpened: false,
  isUpdateBomDrawerOpened: false,
  isBomDetailsDrawerOpened: false,

  // User Role Drawer
  isAddRoleDrawerOpened: false,
  isUpdateRoleDrawerOpened: false,
  isRoleDetailsDrawerOpened: false,

  // Employee Drawer
  isAddEmployeeDrawerOpened: false,
  isUpdateEmployeeDrawerOpened: false,
  isEmployeeDetailsDrawerOpened: false,

  // Proforma Invoice Drawer
  isAddProformaInvoiceDrawerOpened: false,
  isUpdateProformaInvoiceDrawerOpened: false,
  isProformaInvoiceDetailsDrawerOpened: false
};

const drawersSlice = createSlice({
  name: "drawers",
  initialState,
  reducers: {
    // Add Product Drawer
    openAddProductDrawer: (state) => {
      state.isAddProductDrawerOpened = true;
    },
    closeAddProductDrawer: (state) => {
      state.isAddProductDrawerOpened = false;
    },
    // Update Product Drawer
    openUpdateProductDrawer: (state) => {
      state.isUpdateProductDrawerOpened = true;
    },
    closeUpdateProductDrawer: (state) => {
      state.isUpdateProductDrawerOpened = false;
    },
    // Product Details Drawer
    openProductDetailsDrawer: (state) => {
      state.isProductDetailsDrawerOpened = true;
    },
    closeProductDetailsDrawer: (state) => {
      state.isProductDetailsDrawerOpened = false;
    },
    // Add Store Drawer
    openAddStoreDrawer: (state)=>{
      state.isAddStoreDrawerOpened = true;
    },
    closeAddStoreDrawer: (state)=>{
      state.isAddStoreDrawerOpened = false;
    },
    // Update Store Drawer
    openUpdateStoreDrawer: (state)=>{
      state.isUpdateStoreDrawerOpened = true;
    },
    closeUpdateStoreDrawer: (state)=>{
      state.isUpdateStoreDrawerOpened = false;
    },
    // Store Details Drawer
    openStoreDetailsDrawer: (state)=>{
      state.isStoreDetailsDrawerOpened = true;
    },
    closeStoreDetailsDrawer: (state)=>{
      state.isStoreDetailsDrawerOpened = false;
    },
    // Add Buyer Drawer
    openAddBuyerDrawer: (state)=>{
      state.isAddBuyerDrawerOpened = true;
    },
    closeAddBuyerDrawer: (state)=>{
      state.isAddBuyerDrawerOpened = false;
    },
    // Update Buyer Drawer
    openUpdateBuyerDrawer: (state)=>{
      state.isUpdateBuyerDrawerOpened = true;
    },
    closeUpdateBuyerDrawer: (state)=>{
      state.isUpdateBuyerDrawerOpened = false;
    },
    // Buyer Details Drawer
    openBuyerDetailsDrawer: (state)=>{
      state.isBuyerDetailsDrawerOpened = true;
    },
    closeBuyerDetailsDrawer: (state)=>{
      state.isBuyerDetailsDrawerOpened = false;
    },
    // Add Seller Drawer
    openAddSellerDrawer: (state)=>{
      state.isAddSellerDrawerOpened = true;
    },
    closeAddSellerDrawer: (state)=>{
      state.isAddSellerDrawerOpened = false;
    },
    // Update Seller Drawer
    openUpdateSellerDrawer: (state)=>{
      state.isUpdateSellerDrawerOpened = true;
    },
    closeUpdateSellerDrawer: (state)=>{
      state.isUpdateSellerDrawerOpened = false;
    },
    // Buyer Seller Drawer
    openSellerDetailsDrawer: (state)=>{
      state.isSellerDetailsDrawerOpened = true;
    },
    closeSellerDetailsDrawer: (state)=>{
      state.isSellerDetailsDrawerOpened = false;
    },
    // Add BOM Drawer
    openAddBomDrawer: (state)=>{
      state.isAddBomDrawerOpened = true;
    },
    closeAddBomDrawer: (state)=>{
      state.isAddBomDrawerOpened = false;
    },
    // Update BOM Drawer
    openUpdateBomDrawer: (state)=>{
      state.isUpdateBomDrawerOpened = true;
    },
    closeUpdateBomDrawer: (state)=>{
      state.isUpdateBomDrawerOpened = false;
    },
    // BOM Details Drawer
    openBomDetailsDrawer: (state)=>{
      state.isBomDetailsDrawerOpened = true;
    },
    closeBomDetailsDrawer: (state)=>{
      state.isBomDetailsDrawerOpened = false;
    },
    // Add User Role Drawer
    openAddRoleDrawer: (state)=>{
      state.isAddRoleDrawerOpened = true;
    },
    closeAddRoleDrawer: (state)=>{
      state.isAddRoleDrawerOpened = false;
    },
    // Update User Role Drawer
    openUpdateRoleDrawer: (state)=>{
      state.isUpdateRoleDrawerOpened = true;
    },
    closeUpdateRoleDrawer: (state)=>{
      state.isUpdateRoleDrawerOpened = false;
    },
    // User Role Details Drawer
    openRoleDetailsDrawer: (state)=>{
      state.isRoleDetailsDrawerOpened = true;
    },
    closeRoleDetailsDrawer: (state)=>{
      state.isRoleDetailsDrawerOpened = false;
    },
    // Add User Role Drawer
    openAddEmployeeDrawer: (state)=>{
      state.isAddEmployeeDrawerOpened = true;
    },
    closeAddEmployeeDrawer: (state)=>{
      state.isAddEmployeeDrawerOpened = false;
    },
    // Update User Role Drawer
    openUpdateEmployeeDrawer: (state)=>{
      state.isUpdateEmployeeDrawerOpened = true;
    },
    closeUpdateEmployeeDrawer: (state)=>{
      state.isUpdateEmployeeDrawerOpened = false;
    },
    // User Role Details Drawer
    openEmployeeDetailsDrawer: (state)=>{
      state.isEmployeeDetailsDrawerOpened = true;
    },
    closeEmployeeDetailsDrawer: (state)=>{
      state.isEmployeeDetailsDrawerOpened = false;
    },
    // Add Proforma Invoice Drawer
    openAddProformaInvoiceDrawer: (state)=>{
      state.isAddProformaInvoiceDrawerOpened = true;
    },
    closeAddProformaInvoiceDrawer: (state)=>{
      state.isAddProformaInvoiceDrawerOpened = false;
    },
    // Update Proforma Invoice Drawer
    openUpdateProformaInvoiceDrawer: (state)=>{
      state.isUpdateProformaInvoiceDrawerOpened = true;
    },
    closeUpdateProformaInvoiceDrawer: (state)=>{
      state.isUpdateProformaInvoiceDrawerOpened = false;
    },
    // User Proforma Invoice Drawer
    openProformaInvoiceDetailsDrawer: (state)=>{
      state.isProformaInvoiceDetailsDrawerOpened = true;
    },
    closeProformaInvoiceDetailsDrawer: (state)=>{
      state.isProformaInvoiceDetailsDrawerOpened = false;
    }
  },
});

export default drawersSlice;
export const { openAddProductDrawer, closeAddProductDrawer, openUpdateProductDrawer, closeUpdateProductDrawer, openProductDetailsDrawer, closeProductDetailsDrawer, openAddStoreDrawer, closeAddStoreDrawer, openUpdateStoreDrawer, closeUpdateStoreDrawer, openStoreDetailsDrawer, closeStoreDetailsDrawer, openAddBuyerDrawer, closeAddBuyerDrawer, openUpdateBuyerDrawer, closeUpdateBuyerDrawer, openBuyerDetailsDrawer, closeBuyerDetailsDrawer, openAddSellerDrawer, closeAddSellerDrawer, openUpdateSellerDrawer, closeUpdateSellerDrawer, openSellerDetailsDrawer, closeSellerDetailsDrawer, openAddBomDrawer, closeAddBomDrawer, openUpdateBomDrawer, closeUpdateBomDrawer, openBomDetailsDrawer, closeBomDetailsDrawer, openAddRoleDrawer, closeAddRoleDrawer, openUpdateRoleDrawer, closeUpdateRoleDrawer, openRoleDetailsDrawer, closeRoleDetailsDrawer, openAddEmployeeDrawer, closeAddEmployeeDrawer, openEmployeeDetailsDrawer, closeEmployeeDetailsDrawer, openUpdateEmployeeDrawer, closeUpdateEmployeeDrawer, openAddProformaInvoiceDrawer, closeAddProformaInvoiceDrawer, openUpdateProformaInvoiceDrawer, closeUpdateProformaInvoiceDrawer, openProformaInvoiceDetailsDrawer, closeProformaInvoiceDetailsDrawer } = drawersSlice.actions;
