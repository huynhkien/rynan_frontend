'use client';
import { Box, Paper } from "@mui/material"
import { AdminManagementStatisticalInfo } from "./admin-management-statistical-info"
import { useEffect, useState } from "react"
import { ReceiptData } from "@/features/receipt/type/receiptType"
import { OrderData } from "@/features/order/type/orderType"
import { Product } from "@/features/product/type/productType"
import { UserData } from "@/features/user/type/userTypes"
import { getAllReceipt } from "@/features/receipt/api/receiptApi"
import { getAllOrder } from "@/features/order/api/orderApi"
import { getAllProduct } from "@/features/product/api/productApi"
import { getAllUser } from "@/features/user/api/userApis"
import { AdminManagementStatisticalOrder } from "./admin-management-statistical-order";
import theme from "@/shared/configs/theme";
import { AdminManagementStatisticalReceipt } from "./admin-management-statistical-receipt";
import { AdminManagementStatisticalProduct } from "./admin-management-statistical-product";
import { AdminManagementStatisticalReceiptStatus } from "./admin-management-statistical-receipt-status";
import { AdminManagementStatisticalInventory } from "./admin-management-statistical-inventory";
import { InventoryData } from "@/features/inventory/type/inventoryType";
import { getAllInventory } from "@/features/inventory/api/inventoryApi";
import { getAllMaterial } from "@/features/material/api/materialApi";
import { MaterialData } from "@/features/material/type/materialType";

export const AdminManagementStatistical = () => {
    const [receipts, setReceipts] = useState<ReceiptData[] | []>([]);
    const [orders, setOrders] = useState<OrderData[] | []>([]);
    const [products, setProducts] = useState<Product[] | []>([]); 
    const [users, setUsers] = useState<UserData[] | []>([]);
    const [inventory, setInventory] = useState<InventoryData[] | []>([]);
    const [materials, setMaterials] = useState<MaterialData[] | []>([]);
    // Hiển thị thông tin 
    const fetchReceipts = async() => {
        const response = await  getAllReceipt();
        if(response.success) setReceipts(response.data || []);
    }
    const fetchOrders = async() => {
        const response = await  getAllOrder();
        if(response.success) setOrders(response.data || []);
    }
    const fetchProducts = async() => {
        const response = await  getAllProduct();
        if(response.success) setProducts(response.data || []);
    }
    const fetchUsers = async() => {
        const response = await  getAllUser();
        if(response.success) setUsers(response.data || []);
    }
    const fetchInventory = async() => {
        const response = await getAllInventory();
        if(response.success) setInventory(response.data || []);
    }
    const fetchMaterials = async() => {
        const response = await getAllMaterial();
        if(response.success) setMaterials(response.data || []);
    }
    useEffect(() => {
        fetchReceipts();
        fetchOrders();
        fetchProducts();
        fetchUsers();
        fetchInventory();
        fetchMaterials();
    },[]);
    return (
        <Box>
            <AdminManagementStatisticalInfo products={products} users={users} receipts={receipts} orders={orders}/>
            <Box sx={{display: 'flex', justifyContent: 'space-between', gap: 3, my:3, width: '100%'}}>
                <Paper sx={{width: '40%', backgroundColor: theme.palette.primary.main, borderRadius: 0}}>
                    <AdminManagementStatisticalOrder orderData={orders}/>
                </Paper>
                <Paper sx={{width: '60%', backgroundColor: theme.palette.primary.main, borderRadius: 0}}>
                    <AdminManagementStatisticalReceipt receiptData={receipts}/>
                </Paper>
            </Box>
            <Box sx={{display: 'flex', justifyContent: 'space-between', gap: 3, my:3, width: '100%'}}>
                <Paper sx={{width: '50%', backgroundColor: theme.palette.primary.main, borderRadius: 0}}>
                    <AdminManagementStatisticalProduct products={products}/>
                </Paper>
                <Paper sx={{width: '50%', backgroundColor: theme.palette.primary.main, borderRadius: 0}}>
                    <AdminManagementStatisticalReceiptStatus receiptData={receipts}/>
                </Paper>
               
            </Box>
            <Paper sx={{backgroundColor: theme.palette.primary.main, borderRadius: 0, my:3}}>
                <AdminManagementStatisticalInventory inventory={inventory} products={products} materials={materials}/>
            </Paper>
                
        </Box>
    )
}