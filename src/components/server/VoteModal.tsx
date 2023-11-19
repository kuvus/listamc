import { Modal } from '@/components/shared/Modal'
import { Suspense } from 'react'

export const VoteModal = ({ token: string }) => {
    return (
        <Suspense>
            <Modal name={'vote'} title={'Zagłosuj na serwer'}>
                <form></form>
            </Modal>
        </Suspense>
    )
}
