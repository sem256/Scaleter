import { observer } from 'mobx-react-lite';
import { useContext } from 'react'
import { Modal } from 'semantic-ui-react'
import { RootStoreContext } from '../../stores/rootStore';

const ModalContainer = () => {
    const rootStore = useContext(RootStoreContext);
    const {modal: {open, body}, closeModal} = rootStore.modalStore;

    return (
        <Modal
           onClose={closeModal}
           open={open}
           size='mini'
        >
            <Modal.Content image>
                {body}
            </Modal.Content>
        </Modal>
    )
}

export default observer(ModalContainer);
