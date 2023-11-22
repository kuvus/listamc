import 'server-only'
import { sign } from 'jsonwebtoken'

export default function jwt(obj: any) {
    'use server-only'
    return sign(obj, process.env.JWT_SECRET, {
        expiresIn: '15 minutes',
    })
}
