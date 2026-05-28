import { IUser } from '@/types'
import { formatRelative, getActivityLabel, getStatusColor } from '@/lib/utils'
import Link from 'next/link'

interface RecentUsersTableProps {
  users: IUser[]
}

export function RecentUsersTable({ users }: RecentUsersTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Usuario
            </th>
            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actividad
            </th>
            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Registro
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {users.map((user) => (
            <tr key={user._id} className="hover:bg-gray-50 transition-colors">
              <td className="py-3 px-4">
                <Link href={`/users/${user._id}`} className="flex items-center gap-3 hover:text-green-600">
                  {user.photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={user.photoUrl} alt="" className="h-8 w-8 rounded-full" />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 text-xs font-medium">
                      {user.displayName[0]}
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-900">{user.displayName}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </Link>
              </td>
              <td className="py-3 px-4 text-gray-600">
                {getActivityLabel(user.activityCategory)}
              </td>
              <td className="py-3 px-4">
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(user.accountStatus)}`}>
                  {user.accountStatus}
                </span>
              </td>
              <td className="py-3 px-4 text-gray-500 text-xs">
                {formatRelative(user.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
