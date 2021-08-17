import React from 'react';
import { Modal } from '@material-ui/core';

export default function CSVAddModal({ showModal, _onClose }) {
  return (
    <Modal
      open={showModal}
      onClose={_onClose}
    >
      <div></div>
    </Modal>
  );
}
