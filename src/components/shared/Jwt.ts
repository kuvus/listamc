import 'server-only'
import { sign } from 'jsonwebtoken'

export default function jwt(obj: any) {
    return sign(obj, process.env.JWT_SECRET, {
        expiresIn: '15 minutes',
    })
}
