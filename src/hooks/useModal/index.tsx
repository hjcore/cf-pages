import { ReactNode, useCallback, useMemo, useState } from 'react';
import { Modal, ModalProps } from '@mantine/core';
import { omit } from 'lodash';

interface UseModalProps {
  modalContentGetter: (closeModal: VoidFunction) => ReactNode;
  modalProps?: Partial<Omit<ModalProps, 'opened'>>;
}

export default function useModal({ modalContentGetter = () => null, modalProps = {} }: UseModalProps) {
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const onModalClose = useCallback(() => {
    setModalOpen(false);
    modalProps.onClose?.();
  }, [modalProps]);

  const openModal = useCallback(() => {
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  const ModalElement = useMemo<ReactNode>(
    () => (
      <Modal opened={modalOpen} onClose={onModalClose} {...omit(modalProps, 'onClose')}>
        {/* Modal content */}
        {modalContentGetter(closeModal)}
      </Modal>
    ),
    [closeModal, modalContentGetter, modalOpen, modalProps, onModalClose]
  );

  return {
    ModalElement,
    closeModal,
    openModal,
  };
}
