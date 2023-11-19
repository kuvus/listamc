import { Modal } from '@/components/shared/Modal'
import { Suspense } from 'react'
import * as process from 'process'

export const WidgetsModal = ({ serverId }) => {
    return (
        <Suspense>
            <Modal name={'widget'} title={'Widgety'}>
                <span>Baner</span>
                <iframe
                    src={`${process.env.NEXT_PUBLIC_PAGE_URL}/widget/${serverId}?text=%23ffffff`}
                    width={'100%'}
                    height={'80px'}></iframe>
                <textarea
                    value={`<iframe src="${process.env.NEXT_PUBLIC_PAGE_URL}/widget/${serverId}" width="100%" height="80"></iframe>`}
                    readOnly={true}
                />
            </Modal>
        </Suspense>
    )
}
