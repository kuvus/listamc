import { Modal } from '@/components/shared/Modal'
import { Suspense } from 'react'

export const VoteModal = () => {
    return (
        <Suspense>
            <Modal name={'vote'} title={'Zagłosuj na serwer'}>
                Test
            </Modal>
        </Suspense>
    )
}
