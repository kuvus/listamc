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
                    height={'82px'}
                    className={'rounded-md border border-semi-border'}></iframe>
                <span>Kod</span>
                <textarea
                    value={`<iframe src='${process.env.NEXT_PUBLIC_PAGE_URL}/widget/${serverId}' width='100%' height='80'></iframe>`}
                    readOnly={true}
                    className={
                        'w-full rounded-md border border-semi-border bg-bg-800 p-2'
                    }
                />
            </Modal>
        </Suspense>
    )
}
