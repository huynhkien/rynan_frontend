import React from 'react';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, Image as ImagePDF, Font } from '@react-pdf/renderer';
import { Error, PictureAsPdf, RestartAlt } from '@mui/icons-material';
import theme from '@/shared/configs/theme';
import { UserData } from '@/features/user/type/userTypes';
import { OrderData } from '@/features/order/type/orderType';
import moment from 'moment';
import { PaymentMethods, PaymentStatuses, PriceType } from '@/shared/constant/common';

// Đăng ký font UTM AVO với file bold riêng
Font.register({
  family: 'UTM-Avo',
  fonts: [{ src: '/fonts/UTM Avo.ttf', fontWeight: 'normal' }],
});

Font.register({
  family: 'UTM-Avo-Bold',
  fonts: [{ src: '/fonts/UTM AvoBold.ttf', fontWeight: 'bold' }],
});

const styles = StyleSheet.create({
  page: {
    fontFamily: 'UTM-Avo',
    fontSize: 10,
    paddingTop: 80,
    paddingLeft: 40,
    paddingRight: 40,
    paddingBottom: 40,
  },
  header: {
    position: 'absolute',
    top: 15,
    left: 135,
    right: 0,
  },
  logo: {
    width: 350,
    height: 'auto',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'UTM-Avo-Bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  infoSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
    width: '100%'
  },
  infoLeft: {
    width: '70%'
  },
  infoRight: {
    width: '30%',
    textAlign: 'right',
    marginLeft: 100
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 3,
    paddingLeft: 15
  },
  // Label thường
  label: {
    width: 80,
    fontSize: 6,
    fontFamily: 'UTM-Avo',
    fontWeight: 'normal',
  },
  value: {
    fontSize: 6,
    fontWeight: 'bold',
    fontFamily: 'UTM-Avo',
    flex: 1,
  },
  value1: {
    fontSize: 6,
    fontWeight: 'bold',
    fontFamily: 'UTM-Avo-Bold',
    flex: 1,
  },
  boldText: {
    fontWeight: 'bold',
    fontFamily: 'UTM-Avo',
  },
  normalText: {
    fontWeight: 'normal',
    fontFamily: 'UTM-Avo',
  },
  description: {
    fontSize: 6,
    fontFamily: 'UTM-Avo',
  },
  sectionTitle: {
    fontSize: 6,
    fontWeight: 'bold',
    fontFamily: 'UTM-Avo-Bold',
    marginBottom: 3,
    marginTop: 3,
  },
  table: {
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderColor: '#cccccc',
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
    textAlign: 'center',
  },
  // Header columns với background và text bold
  tableColHeader1: {
    width: '5%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'UTM-Avo-Bold',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#cccccc',
    backgroundColor: '#e0e0e0',
  },
  tableColHeader2: {
    width: '20%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'UTM-Avo-Bold',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#cccccc',
    backgroundColor: '#e0e0e0',
  },
  tableColHeader3: {
    width: '35%',
    display: 'flex',
    justifyContent: 'center',
    fontFamily: 'UTM-Avo-Bold',
    alignItems: 'center',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#cccccc',
    backgroundColor: '#e0e0e0',
  },
  tableColHeader4: {
    width: '10%',
    display: 'flex',
    justifyContent: 'center',
    fontFamily: 'UTM-Avo-Bold',
    alignItems: 'center',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#cccccc',
    backgroundColor: '#e0e0e0',
  },
  tableColHeader5: {
    width: '10%',
    display: 'flex',
    justifyContent: 'center',
    fontFamily: 'UTM-Avo-Bold',
    alignItems: 'center',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#cccccc',
    backgroundColor: '#e0e0e0',
  },
  tableColHeader6: {
    width: '10%',
    display: 'flex',
    justifyContent: 'center',
    fontFamily: 'UTM-Avo-Bold',
    alignItems: 'center',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#cccccc',
    backgroundColor: '#e0e0e0',
  },
  tableColHeader7: {
    width: '10%',
    display: 'flex',
    justifyContent: 'center',
    fontFamily: 'UTM-Avo-Bold',
    alignItems: 'center',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#cccccc',
    backgroundColor: '#e0e0e0',
  },
  // Data columns
  tableCol1: {
    width: '5%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#cccccc',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableCol2: {
    width: '20%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#cccccc',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableCol3: {
    width: '35%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#cccccc',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableCol4: {
    width: '10%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#cccccc',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableCol5: {
    width: '10%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#cccccc',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableCol6: {
    width: '10%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#cccccc',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableCol7: {
    width: '10%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#cccccc',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Table cell header - bold và đen
  tableCellHeader: {
    margin: 'auto',
    marginTop: 3,
    marginBottom: 3,
    fontSize: 6,
    fontWeight: 'bold',
    fontFamily: 'UTM-Avo-Bold',
    textAlign: 'center',
  },
  // Table cell thường
  tableCell: {
    margin: 'auto',
    marginTop: 5,
    marginBottom: 5,
    fontSize: 6,
    fontFamily: 'UTM-Avo',
    textAlign: 'center',
  },
  tableCellLeft: {
    margin: 5,
    fontSize: 6,
    fontFamily: 'UTM-Avo',
    textAlign: 'left',
  },
  tableCellRight: {
    margin: 5,
    fontSize: 6,
    fontFamily: 'UTM-Avo',
    textAlign: 'right',
  },
  productImage: {
    width: 30,
    height: 30,
    margin: 5,
  },
  noteItem: {
    fontSize: 6,
    marginBottom: 3,
    flexDirection: 'row',
    fontFamily: 'UTM-Avo',
  },
  noteItemMargin: {
    fontSize: 6,
    marginBottom: 3,
    marginLeft: 40,
    fontFamily: 'UTM-Avo',
  },
  noteItemMargin1: {
    fontSize: 6,
    marginBottom: 3,
    marginLeft: 40,
    fontFamily: 'UTM-Avo-Bold',
  },
  // Note item bold
  noteItemBold: {
    fontSize: 8,
    marginBottom: 3,
    fontWeight: 'bold',
    fontFamily: 'UTM-Avo',
  },
  // Text highlight với màu đỏ và bold
  highlight: {
    color: '#FF0000',
    fontWeight: 'bold',
    fontFamily: 'UTM-Avo-Bold',
  },
  // Chữ ký - bold và đen
  signature: {
    textAlign: 'right',
    fontSize: 6,
    fontWeight: 'bold',
    fontFamily: 'UTM-Avo-Bold',
    marginTop: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 6,
    fontFamily: 'UTM-Avo',
  },
  // Style cho số báo giá và ngày
  quotationInfo: {
    fontSize: 6,
    fontWeight: 'bold',
    fontFamily: 'UTM-Avo',
  },
  quotationInfoText: {
    fontSize: 6,
    fontWeight: 'bold',
    fontFamily: 'UTM-Avo-Bold',
  },
});

const OrderPDFDocument = ({ 
  users,
  order,
}: {
  users: UserData[];
  order: OrderData
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header với logo */}
      <View style={styles.header}>
        <ImagePDF 
          style={styles.logo} 
          src='/logo/letterhead_2024-RYNAN AGRICULTURE- dung.png' 
        />
      </View>

      {/* Tiêu đề chính - tô đen */}
      <Text style={styles.title}>HÓA ĐƠN THANH TOÁN</Text>
      {/* Thông tin khách hàng */}
        <View style={styles.infoSection}>
          <View style={styles.infoLeft}>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Tên khách hàng:</Text>
              <Text style={styles.value1}>{users.find(el => el._id === order.orderBy)?.name || ''} </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Địa chỉ:</Text>
              <Text style={styles.value}>{users.find(el => el._id === order.orderBy)?.address?.detail || ''}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Số điện thoại:</Text>
              <Text style={styles.value}>{users.find(el => el._id === order.orderBy)?.phone || ''}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Email:</Text>
              <Text style={styles.value}>{users.find(el => el._id === order.orderBy)?.email || ''}</Text>
            </View>
          </View>
          <View style={styles.infoRight}>
            <View style={styles.infoRow}>
              <Text style={styles.quotationInfo}>Mã đơn hàng: <Text style={styles.quotationInfoText}>{order.code || ''}</Text></Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.quotationInfo}>Ngày: <Text style={styles.quotationInfoText}>{new Date(order.createdAt as Date).toLocaleDateString('vi-VN') || ''}</Text></Text>
            </View>
          </View>
        </View>
      <View style={styles.table}>
        {/* Header */}
        <View style={styles.tableRow}>
          <View style={styles.tableColHeader1}>
            <Text style={styles.tableCellHeader}>STT</Text>
          </View>
          <View style={styles.tableColHeader2}>
            <Text style={styles.tableCellHeader}>Tên sản phẩm</Text>
          </View>
          <View style={styles.tableColHeader3}>
            <Text style={styles.tableCellHeader}>Hình ảnh sản phẩm</Text>
          </View>
          <View style={styles.tableColHeader4}>
            <Text style={styles.tableCellHeader}>Giá bán</Text>
          </View>
          <View style={styles.tableColHeader5}>
            <Text style={styles.tableCellHeader}>Loại giá</Text>
          </View>
          <View style={styles.tableColHeader6}>
            <Text style={styles.tableCellHeader}>Số lượng</Text>
          </View>
          <View style={styles.tableColHeader7}>
            <Text style={styles.tableCellHeader}>Tổng tiền</Text>
          </View>
        </View>
        {/* Data rows */}
        {order?.products.map((product, index) => (
          <View style={styles.tableRow} key={product.pid}>
            <View style={styles.tableCol1}>
              <Text style={styles.tableCell}>{index + 1}</Text>
            </View>
            <View style={styles.tableCol2}>
              <Text style={styles.tableCell}>{product?.name || ''}</Text>
            </View>
            <View style={styles.tableCol3}>
              {product?.thumb ? (
                <ImagePDF style={styles.productImage} src={product?.thumb} />
              ) : (
                <Text style={styles.tableCell}>Không có ảnh</Text>
              )}
            </View>
            <View style={styles.tableCol4}>
              <Text style={styles.tableCellLeft}>{product?.price.toLocaleString() || ''}</Text>
            </View>
            <View style={styles.tableCol5}>
              <Text style={styles.tableCellLeft}>{PriceType.find(el => el._id === product.priceType)?.name || 'Giá niêm yết'}</Text>
            </View>
            <View style={styles.tableCol6}>
              <Text style={styles.tableCellLeft}>{product?.quantity || 0}</Text>
            </View>
            <View style={styles.tableCol7}>
              <Text style={styles.tableCellLeft}>{(product?.quantity * product?.price).toLocaleString() || 0}</Text>
            </View>
          </View>
        ))}
      </View>
      {/* Tóm tắt đơn hàng */}
        <View>
          <Text style={styles.sectionTitle}>2. Tóm tắt đơn hàng</Text>
          <Text style={styles.noteItem}>
            <Text style={{paddingRight: 40}}>Địa điểm giao, nhận hàng:</Text> 
            <Text style={styles.boldText}>          {users.find(el => el._id === order.orderBy)?.address?.detail}</Text>
          </Text>
          <Text style={styles.noteItem}>
            <Text style={{paddingRight: 40}}>Nhân viên thực hiện:</Text> 
            <Text style={styles.boldText}>                     {users.find(el => el._id === order.staff)?.name || 'Khách tạo đơn mới'}</Text>
          </Text>
          <Text style={styles.noteItem}>
            <Text style={{paddingRight: 40}}>Tổng đơn hàng:</Text> 
            <Text style={styles.boldText}>                             {order.total.toLocaleString()} VNĐ</Text>
          </Text>
          <Text style={styles.noteItem}>
            <Text style={{paddingRight: 65}}>Thời gian giao hàng:</Text> <Text style={styles.boldText}>                    {moment(order.expectedDeliveryDate).format('DD/MM/YYYY')}</Text>
          </Text>
          <Text style={styles.noteItem}>
            <Text style={{paddingRight: 45}}>Phương thức thanh toán: </Text> <Text style={styles.boldText}>           {PaymentMethods.find(el => el._id === order.paymentMethod)?.name}</Text>
          </Text>
          <Text style={styles.noteItem}>
            <Text style={{paddingRight: 45}}>Trạng thái thanh toán: </Text> <Text style={styles.boldText}>                {PaymentStatuses.find(el => el._id === order.paymentStatus)?.name}</Text>
          </Text>
          <Text style={styles.noteItem}>
            <Text style={{paddingRight: 65}}>Thời hạn thanh toán:</Text> <Text style={styles.boldText}>                    {moment(order.paymentDueDate).format('DD/MM/YYYY')}</Text>
          </Text>
          <Text style={styles.noteItem}>
            Cảm ơn quý khách hàng đã đặt hàng tại Công ty chúng tôi.
          </Text>
          <Text style={styles.noteItem}>
            Kính chúc Quý Khách thành công và nhiều sức khỏe. Trân trọng!!!
          </Text>
          <Text style={styles.signature}>BỘ PHẬN KINH DOANH</Text>
        </View>
      {/* Footer */}
      <Text style={styles.footer} render={({ pageNumber, totalPages }) => (
        `Trang ${pageNumber} / ${totalPages}`
      )} fixed />
    </Page>
  </Document>
);

// Component sử dụng - Fixed version
export const OrderManagementFormExport = ({ 
  users,
  order,
}: { 
  users: UserData[];
  order: OrderData;
}) => {
  // Kiểm tra dữ liệu hợp lệ
  const isDataReady = order && order.products.length > 0 ;

  if (!isDataReady) {
    return (
      <span style={{ display: 'flex', alignItems: 'center', cursor: 'not-allowed' }}>
        <RestartAlt style={{fontSize: theme.typography.body1.fontSize}}/>
        <span style={{ marginLeft: 8 }}>Xuất dữ liệu</span>
      </span>
    );
  }

  return (
    <PDFDownloadLink
      document={
        <OrderPDFDocument
          users={users}
          order={order}
        />
      }
      fileName={`hoa_don_${new Date().toISOString().split('T')[0]}.pdf`}
      style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}
    >
      {({ loading, error }) => {
        if (loading) {
          return (
            <>
              <RestartAlt style={{color: theme.palette.warning.main, fontSize: theme.typography.body1.fontSize}}/>
              <span style={{ marginLeft: 8, color: theme.palette.warning.main }}>Đang tạo PDF...</span>
            </>
          );
        }
        
        if (error) {
          return (
            <>
              <Error style={{color: theme.palette.error.main, fontSize: theme.typography.body1.fontSize}}/>
              <span style={{ marginLeft: 8, color: theme.palette.error.main }}>Lỗi tạo PDF</span>
            </>
          );
        }
        
        return (
          <>
            <PictureAsPdf style={{color: theme.palette.primary.main, fontSize: theme.typography.body1.fontSize}}/>
            <span style={{ marginLeft: 8 }}>Xuất dữ liệu</span>
          </>
        );
      }}
    </PDFDownloadLink>
  );
};