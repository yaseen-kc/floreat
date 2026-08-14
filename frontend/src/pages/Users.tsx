import { useState } from 'react'
import { RefreshCw, Search, ShieldCheck, UserPlus, UserX } from 'lucide-react'
import type { AppRole } from '@floreat/shared/schemas'
import { useAuthorization } from '@/auth/authorization'
import {
  useAssignUserRole,
  useDeactivateUser,
  useInviteUser,
  useReactivateUser,
  useResendInvitation,
  useRevokeInvitation,
  useUsers,
  type ManagedUser,
  type UserInvitation,
} from '@/api/users'
import { ApiError } from '@/lib/api'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const allRoles = ['SUPER_ADMIN', 'ADMIN', 'ESTIMATOR', 'SALES_COORDINATOR'] as const

const roleLabel = (role: string) => role.replace('_', ' ')

function ActionDialog({
  title,
  children,
  onClose,
}: {
  title: string
  children: React.ReactNode
  onClose: () => void
}) {
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-foreground/30 p-4"
      role="presentation"
      onMouseDown={onClose}
    >
      <div
        className="w-full max-w-md rounded-lg bg-background p-5 shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold">{title}</h2>
          <Button variant="ghost" size="icon" aria-label="Close dialog" onClick={onClose}>
            Ã—
          </Button>
        </div>
        {children}
      </div>
    </div>
  )
}

function ErrorMessage({ error }: { error: unknown }) {
  const message =
    error instanceof ApiError
      ? error.status === 403
        ? 'You do not have permission for this action.'
        : error.status === 409
          ? 'This change conflicts with the current account state.'
          : 'The request could not be completed.'
      : 'The request could not be completed.'

  return (
    <p className="text-sm text-destructive" role="alert">
      {message}
    </p>
  )
}

export default function Users() {
  const { can, hasRole } = useAuthorization()
  const canInvite = can('user:invite')
  const canAssign = can('user:role:assign')
  const [search, setSearch] = useState('')
  const [role, setRole] = useState<string>('ALL')
  const [status, setStatus] = useState<string>('ALL')
  const [dialog, setDialog] = useState<
    'invite' | 'deactivate' | 'reactivate' | null
  >(null)
  const [selected, setSelected] = useState<ManagedUser | null>(null)
  const query = useUsers({
    page: 1,
    pageSize: 50,
    search,
    ...(role !== 'ALL' ? { role: role as ManagedUser['role'] } : {}),
    ...(status !== 'ALL' ? { status: status as ManagedUser['status'] } : {}),
  })
  const invite = useInviteUser()
  const deactivate = useDeactivateUser()
  const reactivate = useReactivateUser()
  const assign = useAssignUserRole()
  const resend = useResendInvitation()
  const revoke = useRevokeInvitation()
  const roles = hasRole('ADMIN') && !hasRole('SUPER_ADMIN') ? allRoles.slice(2) : allRoles

  const close = () => {
    setDialog(null)
    setSelected(null)
  }

  const actionError =
    invite.error ?? deactivate.error ?? reactivate.error ?? assign.error ?? resend.error ?? revoke.error

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 p-5 md:p-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Administration
          </p>
          <h1 className="font-heading text-2xl font-semibold tracking-tight">Users</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage access, roles, and account status.
          </p>
        </div>
        {canInvite && (
          <Button onClick={() => setDialog('invite')}>
            <UserPlus className="size-4" />
            Invite user
          </Button>
        )}
      </header>

      <div className="flex flex-wrap gap-2">
        <div className="relative min-w-56 flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-2 size-4 text-muted-foreground" />
          <Input
            className="pl-8"
            aria-label="Search users"
            placeholder="Search by name or email"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger aria-label="Filter by role">
            <SelectValue placeholder="All roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All roles</SelectItem>
            {allRoles.map((item) => (
              <SelectItem key={item} value={item}>
                {roleLabel(item)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger aria-label="Filter by status">
            <SelectValue placeholder="All status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All status</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="DEACTIVATED">Deactivated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {query.isLoading ? (
        <div className="py-16 text-center text-sm text-muted-foreground" role="status">
          Loading users...
        </div>
      ) : query.isError ? (
        <div className="space-y-3 py-16 text-center">
          <ErrorMessage error={query.error} />
          <Button variant="outline" onClick={() => query.refetch()}>
            <RefreshCw className="size-4" />
            Retry
          </Button>
        </div>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>
                People{' '}
                <span className="font-mono text-xs font-normal text-muted-foreground">
                  {query.data?.pagination.total ?? 0}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[680px] text-sm">
                  <thead className="border-y bg-muted/40 text-left text-xs text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3 font-medium">User</th>
                      <th className="px-4 py-3 font-medium">Role</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 text-right font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(query.data?.users ?? []).map((user: ManagedUser) => (
                      <UserRow
                        key={user.clerkId}
                        user={user}
                        roles={roles}
                        canAssign={canAssign}
                        onRole={(next) => assign.mutate({ clerkId: user.clerkId, role: next })}
                        onStatus={() => {
                          setSelected(user)
                          setDialog(user.status === 'ACTIVE' ? 'deactivate' : 'reactivate')
                        }}
                      />
                    ))}
                  </tbody>
                </table>
                {query.data?.users.length === 0 && (
                  <p className="px-4 py-12 text-center text-sm text-muted-foreground">
                    No users match these filters.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pending invitations</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[620px] text-sm">
                  <thead className="border-y bg-muted/40 text-left text-xs text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3 font-medium">Email</th>
                      <th className="px-4 py-3 font-medium">Role</th>
                      <th className="px-4 py-3 font-medium">Sent</th>
                      <th className="px-4 py-3 text-right font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(query.data?.invitations.filter(
                      (item: UserInvitation) => item.status === 'PENDING',
                    ) ?? []).map((item: UserInvitation) => (
                      <InvitationRow
                        key={item.id}
                        invitation={item}
                        onResend={() => resend.mutate(item.id)}
                        onRevoke={() => revoke.mutate(item.id)}
                      />
                    ))}
                  </tbody>
                </table>
                {(query.data?.invitations.filter(
                  (item: UserInvitation) => item.status === 'PENDING',
                ).length ?? 0) === 0 && (
                  <p className="px-4 py-10 text-center text-sm text-muted-foreground">
                    No pending invitations.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {actionError && <ErrorMessage error={actionError} />}
      {dialog === 'invite' && (
        <ActionDialog title="Invite a user" onClose={close}>
          <InviteForm
            roles={roles}
            busy={invite.isPending}
            onSubmit={(value) => invite.mutate(value, { onSuccess: close })}
            error={invite.error}
          />
        </ActionDialog>
      )}
      {selected && (dialog === 'deactivate' || dialog === 'reactivate') && (
        <ActionDialog
          title={`${dialog === 'deactivate' ? 'Deactivate' : 'Reactivate'} account`}
          onClose={close}
        >
          <p className="text-sm text-muted-foreground">
            {dialog === 'deactivate'
              ? 'This user will lose access immediately.'
              : 'This user will be able to sign in again.'}
          </p>
          <div className="mt-5 flex justify-end gap-2">
            <Button variant="outline" onClick={close}>
              Cancel
            </Button>
            <Button
              variant={dialog === 'deactivate' ? 'destructive' : 'default'}
              onClick={() =>
                (dialog === 'deactivate' ? deactivate : reactivate).mutate(selected.clerkId, {
                  onSuccess: close,
                })
              }
            >
              {dialog === 'deactivate' ? 'Deactivate' : 'Reactivate'}
            </Button>
          </div>
        </ActionDialog>
      )}
    </div>
  )
}

function UserRow({
  user,
  roles,
  canAssign,
  onRole,
  onStatus,
}: {
  user: ManagedUser
  roles: readonly string[]
  canAssign: boolean
  onRole: (role: ManagedUser['role']) => void
  onStatus: () => void
}) {
  return (
    <tr className="border-b">
      <td className="px-4 py-3">
        <div className="font-medium">
          {[user.firstName, user.lastName].filter(Boolean).join(' ') || 'Unnamed user'}
        </div>
        <div className="text-xs text-muted-foreground">{user.email}</div>
      </td>
      <td className="px-4 py-3">
        {canAssign ? (
          <Select
            value={user.role}
            onValueChange={(value) => onRole(value as ManagedUser['role'])}
          >
            <SelectTrigger size="sm" aria-label={`Role for ${user.email}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {roles.map((item) => (
                <SelectItem key={item} value={item}>
                  {roleLabel(item)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <Badge variant="outline">{roleLabel(user.role)}</Badge>
        )}
      </td>
      <td className="px-4 py-3">
        <Badge variant={user.status === 'ACTIVE' ? 'secondary' : 'destructive'}>
          {user.status === 'ACTIVE' ? 'Active' : 'Deactivated'}
        </Badge>
      </td>
      <td className="px-4 py-3 text-right">
        <Button
          variant="ghost"
          size="icon"
          aria-label={`${user.status === 'ACTIVE' ? 'Deactivate' : 'Reactivate'} ${user.email}`}
          onClick={onStatus}
        >
          <UserX className="size-4" />
        </Button>
      </td>
    </tr>
  )
}

function InvitationRow({
  invitation,
  onResend,
  onRevoke,
}: {
  invitation: UserInvitation
  onResend: () => void
  onRevoke: () => void
}) {
  return (
    <tr className="border-b">
      <td className="px-4 py-3 font-medium">{invitation.email}</td>
      <td className="px-4 py-3">
        <Badge variant="outline">{roleLabel(invitation.role)}</Badge>
      </td>
      <td className="px-4 py-3 text-muted-foreground">
        {new Date(invitation.createdAt).toLocaleDateString()}
      </td>
      <td className="px-4 py-3 text-right">
        <div className="inline-flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Resend invitation to ${invitation.email}`}
            onClick={onResend}
          >
            <RefreshCw className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Revoke invitation to ${invitation.email}`}
            onClick={onRevoke}
          >
            <UserX className="size-4" />
          </Button>
        </div>
      </td>
    </tr>
  )
}

function InviteForm({
  roles,
  busy,
  onSubmit,
  error,
}: {
  roles: readonly string[]
  busy: boolean
  onSubmit: (value: { email: string; role: AppRole }) => void
  error: unknown
}) {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState(roles[0] ?? 'ESTIMATOR')

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit({ email, role: role as AppRole })
      }}
    >
      <label className="block space-y-1 text-sm font-medium">
        Email
        <Input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="name@company.com"
        />
      </label>
      <label className="block space-y-1 text-sm font-medium">
        Role
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {roles.map((item) => (
              <SelectItem key={item} value={item}>
                {roleLabel(item)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </label>
      {Boolean(error) && <ErrorMessage error={error} />}
      <div className="flex justify-end">
        <Button type="submit" disabled={busy}>
          <ShieldCheck className="size-4" />
          {busy ? 'Sending...' : 'Send invitation'}
        </Button>
      </div>
    </form>
  )
}
