import React from 'react';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, Image as ImagePDF, Font } from '@react-pdf/renderer';
import { Product } from '@/features/product/type/productType';
import { Specification} from '@/features/specification/type/specificationType';
import { Error, PictureAsPdf, RestartAlt } from '@mui/icons-material';
import theme from '@/shared/configs/theme';

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
    width: '4%',
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
    width: '8%',
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
    width: '8%',
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
    width: '8%',
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
    width: '8%',
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
    width: '8%',
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
    width: '8%',
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
  tableColHeader8: {
    width: '16%',
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
  tableColHeader9: {
    width: '8%',
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
  tableColHeader10: {
    width: '8%',
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
  tableColHeader11: {
    width: '8%',
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
  tableColHeader12: {
    width: '8%',
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
    width: '4%',
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
    width: '8%',
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
    width: '8%',
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
    width: '8%',
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
    width: '8%',
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
    width: '8%',
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
    width: '8%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#cccccc',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableCol8: {
    width: '16%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#cccccc',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableCol9: {
    width: '8%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#cccccc',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableCol10: {
    width: '8%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#cccccc',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableCol11: {
    width: '8%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#cccccc',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableCol12: {
    width: '8%',
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
});

const ProductPDFDocument = ({ 
  products,
  specifications
}: {
  products: Product[];
  specifications: Specification[];
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
      <Text style={styles.title}>DANH SÁCH SẢN PHẨM</Text>
      <View style={styles.table}>
        {/* Header */}
        <View style={styles.tableRow}>
          <View style={styles.tableColHeader1}>
            <Text style={styles.tableCellHeader}>STT</Text>
          </View>
          <View style={styles.tableColHeader2}>
            <Text style={styles.tableCellHeader}>Mã sản phẩm</Text>
          </View>
          <View style={styles.tableColHeader3}>
            <Text style={styles.tableCellHeader}>Mô tả hàng hóa/dịch vụ</Text>
          </View>
          <View style={styles.tableColHeader4}>
            <Text style={styles.tableCellHeader}>Cung cấp dinh dưỡng</Text>
          </View>
          <View style={styles.tableColHeader5}>
            <Text style={styles.tableCellHeader}>Cây trồng/Giai đoạn</Text>
          </View>
          <View style={styles.tableColHeader6}>
            <Text style={styles.tableCellHeader}>Quy cách/thùng</Text>
          </View>
          <View style={styles.tableColHeader7}>
            <Text style={styles.tableCellHeader}>ĐVT</Text>
          </View>
          <View style={styles.tableColHeader8}>
            <Text style={styles.tableCellHeader}>Hình ảnh sản phẩm</Text>
          </View>
          <View style={styles.tableColHeader9}>
            <Text style={styles.tableCellHeader}>Giá bán lẻ (VNĐ/ĐVT)</Text>
          </View>
          <View style={styles.tableColHeader10}>
            <Text style={styles.tableCellHeader}>Giá đại lý (VNĐ/ĐVT)</Text>
          </View>
          <View style={styles.tableColHeader11}>
            <Text style={styles.tableCellHeader}>Giá cửa hàng (VNĐ/ĐVT)</Text>
          </View>
          <View style={styles.tableColHeader12}>
            <Text style={styles.tableCellHeader}>Giá lẽ tham khảo (VNĐ/ĐVT)</Text>
          </View>
        </View>
        {/* Data rows */}
        {products.map((product, index) => (
          <View style={styles.tableRow} key={product._id}>
            <View style={styles.tableCol1}>
              <Text style={styles.tableCell}>{index + 1}</Text>
            </View>
            <View style={styles.tableCol2}>
              <Text style={styles.tableCell}>{product.code || ''}</Text>
            </View>
            <View style={styles.tableCol3}>
              <Text style={styles.tableCellLeft}>{product.name_vn || ''}</Text>
            </View>
            <View style={styles.tableCol4}>
              <Text style={styles.tableCellLeft}>{product.provide_nutrition || 'Chưa thêm'}</Text>
            </View>
            <View style={styles.tableCol5}>
              <Text style={styles.tableCellLeft}>{`${product.crop || 'Chưa có'}/${product.stage || 'Chưa có'}`}</Text>
            </View>
            <View style={styles.tableCol6}>
              <Text style={styles.tableCell}>
                {specifications?.find(el => el._id === product.specification)?.name || 'Chưa thêm'}
              </Text>
            </View>
            <View style={styles.tableCol7}>
              <Text style={styles.tableCell}>
                {specifications?.find(el => el._id === product.specification)?.name || 'Chưa thêm'}
              </Text>
            </View>
            <View style={styles.tableCol8}>
              {product.thumb?.url ? (
                <ImagePDF style={styles.productImage} src={product.thumb.url} />
              ) : (
                <Text style={styles.tableCell}>Không có ảnh</Text>
              )}
            </View>
            <View style={styles.tableCol9}>
              <Text style={styles.tableCellRight}>
                {product.prices?.find(el => el.priceType === 'offeringPrice')?.price?.toLocaleString() || 'Chưa thêm'}
              </Text>
            </View>
            <View style={styles.tableCol10}>
              <Text style={styles.tableCellRight}>
                {product.prices?.find(el => el.priceType === 'dealerPrice')?.price?.toLocaleString() || 'Chưa thêm'}
              </Text>
            </View>
            <View style={styles.tableCol11}>
              <Text style={styles.tableCellRight}>
                {product.prices?.find(el => el.priceType === 'storePrice')?.price?.toLocaleString() || 'Chưa thêm'}
              </Text>
            </View>
            <View style={styles.tableCol12}>
              <Text style={styles.tableCellRight}>
                {product.prices?.find(el => el.priceType === 'referencePrice')?.price?.toLocaleString() || 'Chưa thêm'}
              </Text>
            </View>
          </View>
        ))}
      </View>
      {/* Footer */}
      <Text style={styles.footer} render={({ pageNumber, totalPages }) => (
        `Trang ${pageNumber} / ${totalPages}`
      )} fixed />
    </Page>
  </Document>
);

// Component sử dụng - Fixed version
export const ProductManagementFormExport = ({ 
  products, 
  specifications 
}: { 
  products: Product[]; 
  specifications: Specification[] 
}) => {
  
  // Kiểm tra dữ liệu hợp lệ
  const isDataReady = products && products.length > 0 && specifications && specifications.length > 0;

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
        <ProductPDFDocument
          products={products}
          specifications={specifications}
        />
      }
      fileName={`danh_sach_san_pham_${new Date().toISOString().split('T')[0]}.pdf`}
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