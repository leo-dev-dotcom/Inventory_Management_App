import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {Alert, FlatList, StyleSheet, View} from 'react-native';
import {
  Button,
  FAB,
  Modal,
  PaperProvider,
  Portal,
  Text,
  TextInput,
} from 'react-native-paper';
import {colorConfig} from '../../../../assets/colors/setup.color';
import Header from '../../../../components/Header/Header';
import InventoryCard from '../../../../components/InventoryCard/InventoryCard';

// Define user roles
enum UserRole {
  DepartmentManager = 'DEPARTMENT_MANAGER',
  StoreManager = 'STORE_MANAGER',
}

interface Product {
  productId: string;
  productName: string;
  vendor: string;
  mrp: string;
  batchNum: string;
  batchDate: string;
  quantity: string;
  status: string;
}

export default function Inventory() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [newInventoryData, setNewInventoryData] = useState({
    productName: '',
    vendor: '',
    mrp: '',
    batchNum: '',
    batchDate: '',
    quantity: '',
    status: 'Pending',
  });
  const [isFormValidState, setIsFormValid] = useState(false);

  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [products, setProducts] = useState<Product[]>([]);
  const [role, setRole] = useState<UserRole | string>('');

  const [pendingInventory, setPendingInventory] = useState<Product[]>([]);

  useEffect(() => {
    const getUserRole = async () => {
      try {
        const userData = await AsyncStorage.getItem('isLoggedIn');
        if (userData) {
          const parsedUserData = JSON.parse(userData);
          setRole(parsedUserData.role || null);
        }
        return null;
      } catch (error) {
        console.error('Error retrieving user role from AsyncStorage:', error);
        throw error;
      }
    };

    getUserRole();
  }, []);

  useEffect(() => {
    const loadInventoryData = async () => {
      try {
        const savedInventoryData = await AsyncStorage.getItem('inventoryData');
        if (savedInventoryData !== null) {
          setProducts(JSON.parse(savedInventoryData));
        }
      } catch (error) {
        console.error('Error loading inventory data:', error);
      }
    };

    loadInventoryData();
  }, []);

  const handleEdit = (item: Product) => {
    setModalMode('edit');
    setSelectedProductId(item.productId);
    setNewInventoryData({
      productName: item.productName,
      vendor: item.vendor,
      mrp: item.mrp.toString(),
      batchNum: item.batchNum,
      batchDate: item.batchDate,
      quantity: item.quantity.toString(),
      status: item.status,
    });
    setModalVisible(true);
  };

  const handleRemove = (productId: string) => {
    if (UserRole.StoreManager === role) {
      console.log('Remove item with productId:', productId);
      setProducts(prevProducts =>
        prevProducts.filter(product => product.productId !== productId),
      );
      saveInventoryDataToStorage(
        products.filter(product => product.productId !== productId),
      );
    } else {
      Alert.alert('Department Managers cannot delete items.');
    }
  };

  const handleAddInventory = () => {
    setModalMode('add');
    const newProductId = (products.length + 1).toString();
    const newStatus = role === UserRole.StoreManager ? 'Approved' : 'Pending';

    const newProduct: Product = {
      productId: newProductId,
      ...newInventoryData,
      status: newStatus,
    };

    if (role === UserRole.StoreManager) {
      setProducts(prevProducts => [...prevProducts, newProduct]);
      saveInventoryDataToStorage([...products, newProduct]);
    } else {
      newProduct.status = 'Pending';
      setProducts(prevProducts => [...prevProducts, newProduct]);
      saveInventoryDataToStorage([...products, newProduct]);
    }

    setNewInventoryData({
      productName: '',
      vendor: '',
      mrp: '',
      batchNum: '',
      batchDate: '',
      quantity: '',
      status: 'Pending',
    });
    setModalVisible(false);
  };

  const onSubmitEdit = () => {
    const editedProduct: Product = {
      productId: selectedProductId,
      productName: newInventoryData.productName,
      vendor: newInventoryData.vendor,
      mrp: newInventoryData.mrp,
      batchNum: newInventoryData.batchNum,
      batchDate: newInventoryData.batchDate,
      quantity: newInventoryData.quantity,
      status:
        role === UserRole.DepartmentManager
          ? 'Pending'
          : newInventoryData.status,
    };

    const editedIndex = products.findIndex(
      product => product.productId === editedProduct.productId,
    );

    if (editedIndex !== -1) {
      const updatedProducts = [...products];
      updatedProducts[editedIndex] = editedProduct;
      setProducts(updatedProducts);
      saveInventoryDataToStorage(updatedProducts);
      setModalVisible(false);
      setNewInventoryData({
        productName: '',
        vendor: '',
        mrp: '',
        batchNum: '',
        batchDate: '',
        quantity: '',
        status: 'Pending',
      });
    }
  };

  const handleApprove = (productId: string) => {
    if (role === UserRole.StoreManager) {
      const productToApprove = products.find(
        product => product.productId === productId,
      );

      if (productToApprove) {
        const updatedProduct = {...productToApprove, status: 'Approved'};
        const productIndex = products.findIndex(
          product => product.productId === productId,
        );
        if (productIndex !== -1) {
          const updatedProducts = [...products];
          updatedProducts[productIndex] = updatedProduct;
          setProducts(updatedProducts);
          saveInventoryDataToStorage(updatedProducts);
        }
      }
    } else {
      Alert.alert('Only Store Managers can approve inventory items.');
    }
  };

  const saveInventoryDataToStorage = async (data: Product[]) => {
    try {
      await AsyncStorage.setItem('inventoryData', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving inventory data:', error);
    }
  };
  const isFormValid = () => {
    return (
      newInventoryData.productName.trim() !== '' &&
      newInventoryData.vendor.trim() !== '' &&
      newInventoryData.mrp.trim() !== '' &&
      newInventoryData.batchNum.trim() !== '' &&
      newInventoryData.batchDate.trim() !== '' &&
      newInventoryData.quantity.trim() !== ''
    );
  };
  return (
    <View style={styles.root}>
      <PaperProvider>
        <Header title="Inventory" />
        <FlatList
          data={products}
          keyExtractor={item => item.productId}
          renderItem={({item}) => (
            <InventoryCard
              item={item}
              onEdit={handleEdit}
              onRemove={() => handleRemove(item.productId)}
              onApprove={() => handleApprove(item.productId)}
            />
          )}
          ListFooterComponent={<View style={{height: 100}} />}
        />

        <FAB
          style={styles.fab}
          icon="plus"
          label="Add Inventory"
          onPress={() => {
            setModalVisible(true);
            setNewInventoryData({
              productName: '',
              vendor: '',
              mrp: '',
              batchNum: '',
              batchDate: '',
              quantity: '',
              status: 'Pending',
            });
            setModalMode('add');
          }}
        />
        <Portal>
          <Modal
            visible={isModalVisible}
            onDismiss={() => setModalVisible(false)}
            contentContainerStyle={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {modalMode === 'add' ? 'Add' : 'Edit'} Inventory
            </Text>
            <TextInput
              label="Product Name"
              value={newInventoryData.productName}
              onChangeText={text => {
                setNewInventoryData({...newInventoryData, productName: text});
                setIsFormValid(isFormValid());
              }}
              style={styles.input}
            />
            <TextInput
              label="Vendor"
              value={newInventoryData.vendor}
              onChangeText={text => {
                setNewInventoryData({
                  ...newInventoryData,
                  vendor: text,
                });
                setIsFormValid(isFormValid());
              }}
              style={styles.input}
            />
            <TextInput
              label="MRP"
              value={newInventoryData.mrp}
              onChangeText={text => {
                setNewInventoryData({
                  ...newInventoryData,
                  mrp: text,
                });
                setIsFormValid(isFormValid());
              }}
              style={styles.input}
              keyboardType="numeric"
            />
            <TextInput
              label="Batch Number"
              value={newInventoryData.batchNum}
              onChangeText={text => {
                setNewInventoryData({
                  ...newInventoryData,
                  batchNum: text,
                });
                setIsFormValid(isFormValid());
              }}
              style={styles.input}
              keyboardType="numeric"
            />
            <TextInput
              label="Batch Date"
              value={newInventoryData.batchDate}
              onChangeText={text => {
                setNewInventoryData({
                  ...newInventoryData,
                  batchDate: text,
                });
                setIsFormValid(isFormValid());
              }}
              style={styles.input}
              keyboardType="default"
            />
            <TextInput
              label="Quantity"
              value={newInventoryData.quantity}
              onChangeText={text => {
                setNewInventoryData({
                  ...newInventoryData,
                  quantity: text,
                });
                setIsFormValid(isFormValid());
              }}
              style={styles.input}
              keyboardType="numeric"
            />
            <Button
              mode="contained"
              onPress={modalMode === 'add' ? handleAddInventory : onSubmitEdit}
              style={styles.button}
              disabled={!isFormValidState}>
              {modalMode === 'add' ? 'Add' : 'Edit'}
            </Button>
          </Modal>
        </Portal>
      </PaperProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: colorConfig.container},
  fab: {
    bottom: 5,
  },
  modalContainer: {
    padding: 16,
    backgroundColor: colorConfig.container,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 16,
    fontWeight: 'bold',
    color: colorConfig.black,
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginTop: 12,
  },
});
