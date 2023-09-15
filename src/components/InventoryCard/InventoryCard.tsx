import React from 'react';
import {StyleSheet} from 'react-native';
import {Card, IconButton, Text} from 'react-native-paper';
import {colorConfig} from '../../assets/colors/setup.color';

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

interface InventoryCardProps {
  item: Product;
  onEdit: (item: Product) => void;
  onRemove: (item: Product) => void;
  onApprove: (item: Product) => void;
}

const InventoryCard: React.FC<InventoryCardProps> = ({
  item,
  onEdit,
  onRemove,
  onApprove,
}) => {
  const showApproveRejectButtons = item.status === 'Pending';

  return (
    <Card style={styles.card}>
      <Card.Title title={item.productName} titleStyle={styles.cardText} />
      <Card.Content>
        <Text style={styles.cardText}>Quantity: {item.quantity}</Text>
        <Text style={styles.cardText}>Price: ₹{item.mrp}</Text>
        <Text style={styles.cardText}>Status: {item.status}</Text>
      </Card.Content>
      <Card.Actions style={styles.cardActions}>
        <IconButton icon="pencil" onPress={() => onEdit(item)} size={20} />
        <IconButton icon="delete" onPress={() => onRemove(item)} size={20} />
        {showApproveRejectButtons && (
          <>
            <IconButton
              icon="check-circle"
              onPress={() => onApprove(item)}
              size={20}
            />
          </>
        )}
      </Card.Actions>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 10,
    backgroundColor: colorConfig.container,
  },
  cardActions: {
    justifyContent: 'flex-end',
  },
  cardText: {
    color: colorConfig.black,
  },
});

export default InventoryCard;
