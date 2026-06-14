import { useEffect, useRef } from 'react'
import { useAuth } from '@clerk/react'
import { useQuotationStore } from '@/stores/quotation-store'

const BASE_KEY = 'strukt:draft'
const userKey = (userId: string) => `${BASE_KEY}:${userId}`

/**
 * Scopes the persisted quotation draft to the signed-in Clerk user.
 *
 * The store uses `skipHydration`, so nothing is loaded until this hook points
 * the persistence layer at a per-user storage key (`strukt:draft:<userId>`)
 * and hydrates it. This gives two properties at once:
 *   1. An in-progress job (including its server `jobId`) survives a refresh, so
 *      the next save re-uses PUT instead of creating a duplicate.
 *   2. Drafts never leak across users on a shared machine — each account reads
 *      and writes its own key.
 *
 * Must be rendered inside a signed-in subtree (e.g. the protected layout).
 */
export function useDraftPersistenceScope() {
  const { userId } = useAuth()
  const scopedUserId = useRef<string | null>(null)

  useEffect(() => {
    if (!userId || scopedUserId.current === userId) return
    scopedUserId.current = userId

    const key = userKey(userId)
    // Point persistence at this user's key *before* any read/write so we never
    // touch another user's stored draft.
    useQuotationStore.persist.setOptions({ name: key })

    if (localStorage.getItem(key)) {
      // Resume this user's saved draft (restores projectInfo, currentStep, jobId).
      void useQuotationStore.persist.rehydrate()
    } else {
      // No saved draft for this user — start clean (also clears any in-memory
      // state left over from a previously signed-in account).
      useQuotationStore.getState().resetQuotation()
    }
  }, [userId])

  useEffect(() => {
    // On sign-out / unmount, detach from the user key and clear the in-memory
    // draft so a different account signing in next doesn't briefly see this
    // user's data. Writes go to the throwaway base key, leaving the user's
    // namespaced draft intact for when they return.
    return () => {
      useQuotationStore.persist.setOptions({ name: BASE_KEY })
      useQuotationStore.getState().resetQuotation()
      scopedUserId.current = null
    }
  }, [])
}
