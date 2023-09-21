import { Modal } from '@/components/shared/Modal'
import { Suspense } from 'react'

export const ClaimModal = () => {
    return (
        <Suspense>
            <Modal name={'claim'} title={'Przypisanie serwera do konta'}>
                test
            </Modal>
        </Suspense>
    )
}
