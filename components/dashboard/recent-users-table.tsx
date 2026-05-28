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
          <tr className="border-b border-[#1A3A5C] bg-[#0D2540]">
            <th className="text-left py-3 px-4 text-xs font-rajdhani font-semibold text-[#8BA4BE] uppercase tracking-widest">
              Usuario
            </th>
            <th className="text-left py-3 px-4 text-xs font-rajdhani font-semibold text-[#8BA4BE] uppercase tracking-widest">
              Actividad
            </th>
            <th className="text-left py-3 px-4 text-xs font-rajdhani font-semibold text-[#8BA4BE] uppercase tracking-widest">
              Estado
            </th>
            <th className="text-left py-3 px-4 text-xs font-rajdhani font-semibold text-[#8BA4BE] uppercase tracking-widest">
              Registro
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#1A3A5C]">
          {users.map((user) => (
            <tr key={user._id} className="bg-[#071A2F] hover:bg-[#0D2540] transition-colors">
              <td className="py-3 px-4">
                <Link href={`/users/${user._id}`} className="flex items-center gap-3 hover:text-[#FF5A1F] transition-colors">
                  {user.photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={user.photoUrl} alt="" className="h-8 w-8 rounded-full border border-[#1A3A5C]" />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-[#FF5A1F]/20 border border-[#FF5A1F]/40 flex items-center justify-center text-[#FF5A1F] text-xs font-bold font-bebas">
                      {user.displayName[0]}
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-white font-exo">{user.displayName}</p>
                    <p className="text-xs text-[#8BA4BE] font-exo">{user.email}</p>
                  </div>
                </Link>
              </td>
              <td className="py-3 px-4 text-[#8BA4BE] font-exo text-xs">
                {getActivityLabel(user.activityCategory)}
              </td>
              <td className="py-3 px-4">
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-rajdhani font-semibold tracking-wide ${getStatusColor(user.accountStatus)}`}>
                  {user.accountStatus}
                </span>
              </td>
              <td className="py-3 px-4 text-[#8BA4BE] font-exo text-xs">
                {formatRelative(user.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
