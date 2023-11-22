import { Modal } from '@/components/shared/Modal'
import { Suspense } from 'react'
import Image from 'next/image'
import { VoteForm } from '@/components/vote/VoteForm'

export const VoteModal = ({
    token,
    serverId,
}: {
    token: string
    serverId: number
}) => {
    return (
        <Suspense>
            <Modal name={'vote'} title={'Zagłosuj na serwer'}>
                <VoteForm token={token} serverId={serverId} />
                <div className={'mt-8 hidden flex-col items-center md:flex'}>
                    <Image
                        src='/assets/noproxy.png'
                        alt='NoProxy'
                        width={160}
                        height={160}
                    />
                    <span className={'text-xs'}>
                        Głosy weryfikowane przez NoProxy
                    </span>
                </div>
            </Modal>
        </Suspense>
    )
}
