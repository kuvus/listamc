import { Modal } from '@/components/shared/Modal'
import { Suspense } from 'react'

export const WidgetsModal = () => {
    return (
        <Suspense>
            <Modal name={'widgets'} title={'Widgety'}>
                Test
            </Modal>
        </Suspense>
    )
}
