'use client'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L, { LatLng } from 'leaflet'; 
import {useState } from 'react';
import { useForm, UseFormRegister, FieldErrors } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Box, Typography, useTheme } from '@mui/material'

import {  updateStatusOrderByAdmin,} from '@/features/order/api/orderApi';
import { OrderStatusData } from '@/features/order/type/orderType';
import { Button } from '@/shared/components';
import { ControlledSelect } from '@/shared/components/ui/private/ControlledSelect';
import { OrderStatus,} from '@/shared/constant/common';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/useAppHook';
import { showModal } from '@/shared/store/appSlice';
import OrderStatusFormInput from '@/features/order/components/OrderStatusFormInput';

export const OrderManagementFormEditStatus = ({orderId, render}: {orderId: string;render: () => void}) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const {current} = useAppSelector(state => state.user);
  const [position, setPosition] = useState<LatLng | null>(null);
  const { register, handleSubmit, formState: { errors }, control, } = useForm<OrderStatusData>(); 

  const Icon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/854/854878.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  const LocationMarker = () => {
    useMapEvents({
      click: (e) => {
        setPosition(e.latlng);
      },
    });

    return position ? (
      <Marker position={position} icon={Icon}>
        <Popup>
          Đơn hàng đang được vận chuyển tới đây: <br />
          Vĩ độ: {position.lat.toFixed(4)}, Kinh độ: {position.lng.toFixed(4)}
        </Popup>
      </Marker>
    ) : null;
  };


  const handleUpdateStatus = async (data: OrderStatusData) => {
    try {
        const orderData: OrderStatusData = {
            status: data.status,
            staff: current?._id as string,
            location: {
                lng: position?.lng as number,
                lat: position?.lat as number
            }
        }
      dispatch(showModal({ isShowModal: true, modalType: 'loading' }));
      const response = await updateStatusOrderByAdmin(orderData, orderId);
      if (response.success) {
        dispatch(showModal({ isShowModal: false, modalType: null }));
        toast.success(response.message);
        render();
      }
    } catch (error: unknown) {
      dispatch(showModal({ isShowModal: false, modalType: null }));
      const errorMessage = (error as Error).message || 'Lỗi không xác định';
      toast.error(errorMessage);
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box
        sx={{
          backgroundColor: theme.palette.primary.light,
          py: 2,
          textAlign: 'center',
          color: theme.palette.text.secondary,
          fontWeight: theme.typography.fontWeightBold,
        }}
      >
        <Typography variant="body2">Cập nhật trạng thái đơn hàng</Typography>
      </Box>

      <form
        onSubmit={handleSubmit(handleUpdateStatus)}
        style={{
          padding: 10,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        <OrderStatusFormInput
          label="Mã đơn hàng"
          important
          placeholder="Mã đơn hàng"
          disabled
          register={register as UseFormRegister<OrderStatusData>}
          errors={errors as FieldErrors<OrderStatusData>}
          id="code"
        />
        <ControlledSelect
          label="Trạng thái đơn hàng"
          placeholder="Lựa chọn trạng thái đơn hàng"
          important
          sx={{ width: '100%' }}
          name="status"
          control={control}
          options={OrderStatus}
          rules={{ required: 'Vui lòng chọn trạng thái đơn hàng' }}
        />

        <Box>
          <MapContainer center={[10.0452, 105.7469]} zoom={6} style={{ height: '300px', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <LocationMarker />
          </MapContainer>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Button name="Cập nhật" />
        </Box>
      </form>
    </Box>
  );
};
