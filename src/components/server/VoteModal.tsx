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
            <Modal name={'vote'} title={'Oddaj głos na serwer'}>
                <VoteForm token={token} serverId={serverId} />
                <div className={'mt-16 flex flex-col items-center'}>
                    <Image
                        src='/assets/noproxy.png'
                        alt='NoProxy'
                        width={80}
                        height={80}
                    />
                </div>
            </Modal>
        </Suspense>
    )
}
