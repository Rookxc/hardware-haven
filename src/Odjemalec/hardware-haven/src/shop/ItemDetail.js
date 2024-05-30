import React from 'react';
import { useParams } from 'react-router-dom';

function ItemDetail() {
  const { id } = useParams();

  return (
    <div>
      <h1>Item Detail for Item ID: {id}</h1>
    </div>
  );
}

export default ItemDetail;
