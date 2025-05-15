import { useServiceStore } from '@/Stores/ServicesStore'
import { UserActionLog } from '@/Types/UserActionLog';
import React from 'react'

const SingleAuditComponent = () => {



    return (

        <tr>
            <td>
                User
            </td>

            <td>
                Action
            </td>

            <td>
                Details
            </td>

            <td>
                Timestamp
            </td>

        </tr>
    )
}

export default SingleAuditComponent
